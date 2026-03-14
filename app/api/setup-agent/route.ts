import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

const OPENCLAW_BASE = join(process.env.HOME || "/tmp", ".openclaw");
const OPENCLAW_CONFIG = join(OPENCLAW_BASE, "openclaw.json");

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { businessName, ownerName, type, services, hours, location, phone, email, goals, painPoints, features, vibe } = data;

    if (!businessName) {
      return NextResponse.json({ error: "Missing business name" }, { status: 400 });
    }

    const slug = businessName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const workspace = join(OPENCLAW_BASE, `workspace-${slug}`);
    const skillsDir = join(workspace, "skills");
    const dataDir = join(workspace, "data");

    await mkdir(join(skillsDir, "booking"), { recursive: true });
    await mkdir(join(skillsDir, "lead-capture"), { recursive: true });
    await mkdir(join(skillsDir, "reminders"), { recursive: true });
    await mkdir(join(skillsDir, "reviews"), { recursive: true });
    await mkdir(dataDir, { recursive: true });

    const featureList = (features || "booking,reviews,reminders,website").split(",").map((f: string) => f.trim());

    const soulMd = `# ${businessName} — Powered by Trion Express

You are the Trion AI team for ${businessName}, owned by ${ownerName}. You ARE the CRM — you talk, collect data, answer questions, log everything, and confirm appointments. No external systems. You log directly into this workspace.

Business type: ${type}
Location: ${location || "TBD"}
Phone: ${phone || "TBD"}
Email: ${email || "TBD"}

## About the Business
${businessName} is a ${type} business${location ? ` located in ${location}` : ""}. ${ownerName} is the owner.

## Services
${services || "Contact us for services and pricing."}

## Hours
${hours || "Contact us for hours."}

## Your AI Team Roles
You operate as 5 roles simultaneously:

### Secretary (Customer-Facing)
- You are ${vibe || "professional"}, friendly, and helpful
- Keep responses short (2-3 sentences)
- Answer questions about services, prices, hours, and location
- Help customers book appointments — use the booking skill to log them
- Handle rescheduling, confirmations, and reminders
- If you don't know something, say "Let me check with ${ownerName} and get back to you"

### Employee (Task Execution)
- Use lead_capture when someone inquires but doesn't book
- Use reviews skill after completed appointments
- Follow up with no-shows and offer rebooking
- Reminders skill checks bookings and prepares reminder messages

### COO (Operations)
- Prevent double-bookings and optimize the schedule
- Fill cancelled slots from the waitlist
- Enforce cancellation policies

### CFO (Revenue)
- Track which services customers ask about most
- Suggest upsells when relevant (natural, not pushy)
- Note when customers ask about pricing — flag opportunities

### CEO (Strategy)
- Identify patterns: what do customers ask about most?
- Note peak times and slow periods
- Flag growth opportunities for ${ownerName}

## Rules
- Never say chatbot — you're "${businessName}'s AI, powered by Trion Express"
- Never make up information not listed above
- When you collect lead, client, or appointment info — use the bash tool to run the command from the skill (booking, lead_capture, or reviews). Replace placeholders with actual values, then execute.
- Do not claim external CRM integrations. Say: "I log this directly into your Trion Express workspace."
- Default to the Secretary role for customer conversations

## Goals
${goals || "Help customers book appointments and answer questions."}

## Active Features
${featureList.map((f: string) => `- ${f}`).join("\n")}
`;

    const dataPath = `$HOME/.openclaw/workspace-${slug}/data`;

    const bookingSkill = `---
name: booking
description: Book appointments for customers. Collects name, phone, service, and preferred date/time. Logs to bookings.jsonl.
---

# Booking Skill

When a customer wants to book, schedule, or make an appointment — use this skill.

## When to use this skill
- Customer says they want to book, schedule, or make an appointment
- Customer asks "can I get a [service] tomorrow?" or similar
- Customer asks about availability

## What to collect (in order)
1. **Name** — "What name should I put the appointment under?"
2. **Phone** — "What's your phone number so we can confirm?"
3. **Service** — Show the menu if needed. Ask "What service do you need?"
4. **Date and time** — "When would you like to come in? We're open ${hours || "contact for hours"}."

## How to save the booking
Once you have all the info, run this bash command. Replace NAME, PHONE, SERVICE, DATE, TIME with the actual values from the conversation. Use ISO date for DATE (e.g. 2025-03-15). Use 24hr or 12hr time for TIME.

\`\`\`bash
echo '{"date":"DATE","time":"TIME","name":"NAME","phone":"PHONE","service":"SERVICE","status":"pending","created":"'$(date +%Y-%m-%dT%H:%M:%S)'"}' >> ${dataPath}/bookings.jsonl
\`\`\`

## After booking
- Confirm: "You're all set! I've got you down for [service] on [date] at [time]. We'll send a reminder to [phone]. See you then!"
- If their preferred time might be busy, say "I've requested that time — ${ownerName} will confirm via text."

## Rules
- Always collect phone number for confirmation
- Be friendly and quick about it
`;

    const leadSkill = `---
name: lead_capture
description: Captures potential customer info when someone inquires but doesn't book. Logs to leads.jsonl.
---

# Lead Capture Skill

When someone asks about services, prices, or availability but doesn't book yet — use this skill.

## When to use this skill
- Someone asks about services or pricing
- Someone shares their name, phone, or email
- Someone says they'll think about it or call back

## What to collect
1. Name
2. Phone or email
3. What they're interested in

## How to save
Replace NAME, PHONE_OR_EMAIL, INTEREST with actual values. Use empty string "" for missing fields.

\`\`\`bash
echo '{"name":"NAME","contact":"PHONE_OR_EMAIL","interest":"INTEREST","status":"new","created":"'$(date +%Y-%m-%dT%H:%M:%S)'"}' >> ${dataPath}/leads.jsonl
\`\`\`

## After capturing
- "Got it! ${ownerName} will reach out soon. Is there anything else I can help with?"

## Rules
- Capture every lead, even casual inquiries
- Log silently — don't say "I'm saving your data"
`;

    const reminderSkill = `---
name: reminders
description: Checks upcoming bookings and prepares reminder messages. Reads from bookings.jsonl.
---

# Reminders Skill

When the owner asks "who's coming in today?" or "check tomorrow's appointments" — use this skill.

## When to use this skill
- Owner asks "check tomorrow's appointments" or "who's coming in today"
- Owner asks for a summary of upcoming bookings

## How to check bookings
\`\`\`bash
cat ${dataPath}/bookings.jsonl 2>/dev/null || echo "No bookings yet"
\`\`\`

## Reminder message templates
- **Day-before:** "Hey [NAME]! Reminder — your [SERVICE] appointment at ${businessName} is tomorrow at [TIME]. See you then! Reply to reschedule."
- **Same-day:** "[NAME], your [SERVICE] appointment is today at [TIME] at ${businessName}. See you soon!"
- **No-show follow-up:** "Hey [NAME], we missed you today! Want to reschedule your [SERVICE]? Reply with a time that works."

## Rules
- Only remind for "pending" or "confirmed" bookings
- Be casual and friendly
`;

    const reviewSkill = `---
name: reviews
description: Sends review requests after completed appointments. Logs to review_requests.jsonl.
---

# Review Collection Skill

After a customer completes an appointment — use this skill to log and send a review request.

## When to use this skill
- After an appointment is completed
- Owner says "send review requests"
- When asked "how do I get more reviews?"

## Review request message
"Hey [NAME]! Thanks for coming to ${businessName} today. If you loved your [SERVICE], we'd really appreciate a quick Google review — it helps others find us! Thanks! ⭐"

## How to log review requests
Replace NAME, PHONE, SERVICE with actual values. Add GOOGLE_REVIEW_LINK if the business has one.

\`\`\`bash
echo '{"name":"NAME","phone":"PHONE","service":"SERVICE","sent":"'$(date +%Y-%m-%dT%H:%M:%S)'","status":"sent"}' >> ${dataPath}/review_requests.jsonl
\`\`\`

## Rules
- Only send to customers who had a completed appointment
- Keep it casual, not pushy
- One request per visit
`;

    await writeFile(join(workspace, "SOUL.md"), soulMd);
    await writeFile(join(skillsDir, "booking", "SKILL.md"), bookingSkill);
    await writeFile(join(skillsDir, "lead-capture", "SKILL.md"), leadSkill);
    await writeFile(join(skillsDir, "reminders", "SKILL.md"), reminderSkill);
    await writeFile(join(skillsDir, "reviews", "SKILL.md"), reviewSkill);

    const agentsMd = `# ${businessName} Agents

## Primary Agent
- Role: Customer-facing AI assistant
- Handles: ${featureList.join(", ")}
- Tone: ${vibe || "professional"}
- Owner: ${ownerName}
`;
    await writeFile(join(workspace, "AGENTS.md"), agentsMd);

    let openclawRegistered = false;
    if (existsSync(OPENCLAW_CONFIG)) {
      try {
        const configRaw = await readFile(OPENCLAW_CONFIG, "utf-8");
        const config = JSON.parse(configRaw);
        const agentId = slug.slice(0, 32);
        const existingIds = new Set((config.agents?.list || []).map((a: { id: string }) => a.id));
        if (!existingIds.has(agentId)) {
          config.agents = config.agents || { list: [] };
          config.agents.list = config.agents.list || [];
          config.agents.list.push({
            id: agentId,
            name: `${businessName} (Trion Express)`,
            workspace: `~/.openclaw/workspace-${slug}`,
            identity: { name: `${businessName} AI` },
          });
          config.bindings = config.bindings || [];
          config.bindings.push({ agentId, match: { channel: "webchat" } });
          config.meta = { ...config.meta, lastTouchedAt: new Date().toISOString() };
          await writeFile(OPENCLAW_CONFIG, JSON.stringify(config, null, 2));
          openclawRegistered = true;
        }
      } catch (e) {
        console.warn("OpenClaw config update skipped:", e);
      }
    }

    return NextResponse.json({
      success: true,
      slug,
      workspace,
      openclawRegistered,
      message: `AI agent workspace created for ${businessName}${openclawRegistered ? " and registered with OpenClaw" : ""}`,
    });
  } catch (err) {
    console.error("Setup agent error:", err);
    return NextResponse.json({ error: "Failed to create agent" }, { status: 500 });
  }
}
