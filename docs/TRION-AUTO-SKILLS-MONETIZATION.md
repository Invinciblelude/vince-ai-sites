# Trion Auto-Skills — Monetization Path

Trion now has an **auto-skills agent layer**: it routes user input to the right capability (Strategist, Site Builder, Outreach, General) and executes with skill-specific prompts.

---

## What's Built

### 1. Skill registry (`lib/trion-skills.ts`)
- **strategist** (Pro) — Job/role/business analysis → core needs, TRION model, packages, outreach
- **site_builder** (Free) — Build site preview, extract BIZDATA
- **outreach** (Pro) — Cold email/DM scripts
- **general** (Free) — Qualify leads, answer questions

### 2. Router
- Rule-based: message length, trigger patterns (e.g. "we're hiring", "I'm a barber")
- Pasted blocks (>150 chars, 3+ lines) → Strategist
- Returns `{ skill, confidence }`

### 3. Agent API (`/api/trion-agent`)
- Accepts `{ messages, systemPrompt?, hasPro? }`
- Routes last user message → skill
- Prepends skill-specific mode instruction to system prompt
- Streams response with headers: `X-Trion-Skill`, `X-Trion-Skill-Name`, `X-Trion-Skill-Tier`

### 4. Pitch page + widget
- Both use `/api/trion-agent` instead of `/api/demo-chat`
- Chat header shows active skill ("Business Strategist mode", "Site Builder mode")
- Quick action: "Analyze job/role" to trigger strategist flow

---

## Monetization (To Add)

### Option A: Gate Pro skills
When `skill.tier === "pro"` and `!hasPro`:
- Return a short message: "This is a Pro feature. [Upgrade to Pro](/pro-demo) to unlock full job/role analysis and outreach scripts."
- Or truncate response after ~200 chars + "Upgrade for full output."

### Option B: Usage limits
- Free: 3 strategist analyses per session, then prompt upgrade
- Pro: unlimited

### Option C: Output quality
- Free: basic analysis (core needs only)
- Pro: full 6-part output + outreach script

### Implementation
1. Add `hasPro` to request (from session, cookie, or Stripe subscription)
2. In `app/api/trion-agent/route.ts`, before streaming:
   ```ts
   if (skillDef?.tier === "pro" && !hasPro) {
     return new NextResponse(
       JSON.stringify({ error: "Pro feature", upgradeUrl: "/pro-demo" }),
       { status: 402, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
     );
   }
   ```
3. Or stream a truncated response with upgrade CTA at the end.

---

## Differentiation vs Free AI Chat

| Free ChatGPT/Claude | Trion with Auto-Skills |
|---------------------|------------------------|
| Generic response | Skill-specific output (strategist = 6-part analysis, site_builder = BIZDATA) |
| No structured extraction | BIZDATA, packages, outreach scripts — copy-paste ready |
| One-size-fits-all prompt | Router picks the right mode automatically |
| No site preview | Site preview + form pre-fill from chat |
| No monetization path | Pro skills gated, clear upgrade path |

---

## Next Steps

1. **Test routing** — Paste job posting, say "I'm a barber", ask for outreach script. Confirm correct skill activates.
2. **Add Pro gate** — When you have auth/payment, wire `hasPro` and block or truncate Pro skills for free users.
3. **Add more skills** — e.g. "Report Analyzer" (feasibility), "Competitor Research", "SOP Writer".
