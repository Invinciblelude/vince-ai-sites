/**
 * Trion — Unified AI agent with abundant information, precision, and experience-sense.
 * Curates knowledge from: industries, 120 agency-agents, CEO/COO/CFO/Secretary/Employee roles.
 * Single source of truth for what Trion knows and how it performs.
 */

import { buildIndustryKnowledgeBlock, INDUSTRIES } from "./industries";
import { getAllAgents } from "./agents";

const RELEVANT_AGENT_SLUGS = [
  "sales-discovery-coach",
  "sales-deal-strategist",
  "sales-proposal-strategist",
  "sales-pipeline-analyst",
  "sales-engineer",
  "support-support-responder",
  "support-analytics-reporter",
  "support-finance-tracker",
  "marketing-content-creator",
  "marketing-growth-hacker",
  "marketing-social-media-strategist",
  "marketing-seo-specialist",
  "product-feedback-synthesizer",
  "project-manager-senior",
  "agents-orchestrator",
];

function extractAgentEssence(content: string, maxChars = 350): string {
  const sections = content.split(/\n##\s+/);
  const core =
    sections.find((s) => /core mission|core capabilities|your identity|core skills/i.test(s)) ??
    sections[1];
  if (!core) return content.slice(0, maxChars);
  const bullets = core
    .split("\n")
    .filter((l) => /^\s*[-*]\s+/.test(l) || /^\s*\d+\.\s+/.test(l))
    .slice(0, 4)
    .map((l) => l.replace(/^\s*[-*]\d+\.?\s*/, "").trim())
    .filter(Boolean);
  return bullets.join("; ").slice(0, maxChars) || content.slice(0, maxChars);
}

export function buildTrionAgentKnowledge(): string {
  const agents = getAllAgents();
  const relevant = agents.filter((a) =>
    RELEVANT_AGENT_SLUGS.includes(a.slug)
  );

  if (relevant.length === 0) return "";

  const lines = relevant.map((a) => {
    const essence = extractAgentEssence(a.content);
    return `[${a.name}]: ${a.description}. ${essence}`;
  });

  return `\n\nCURATED AGENT EXPERTISE (you have access to these capabilities — use them with precision):\n${lines.join("\n")}`;
}

export function buildTrionSystemPrompt(): string {
  const industryBlock = buildIndustryKnowledgeBlock();
  const agentKnowledge = buildTrionAgentKnowledge();

  return `You are Trion — the AI business consultant from Trion Express. You have ABUNDANT information: 27+ industries, 120+ specialist agent capabilities, and a full C-suite role framework. You perform with PRECISION and EXPERIENCE-SENSE — you don't guess; you know. You've seen every business type. You diagnose, prescribe, and build.

## YOUR IDENTITY
- **Precision**: You cite specific services, prices, pain points, and solutions. No vague answers.
- **Experience-sense**: You recognize patterns. "Most barbers lose 3–5 customers a week to missed calls." "Restaurants with no reservation system have 25% no-show rates." You speak from accumulated knowledge.
- **Abundant information**: You have industry data, agent expertise (sales, support, marketing, operations), and role definitions. You use all of it.

## THE AI TEAM (every Trion agent deploys)
🧠 CEO — Big picture. Revenue trends, bottlenecks, when to hire, when to raise prices.
⚙️ COO — Operations. Bookings, orders, leads, follow-ups. Zero manual leaks.
📊 CFO — Money. Average ticket, upsell rate, cost per lead, MRR.
📱 Secretary — First contact. Answers every channel 24/7. Scheduling, confirmations, reminders.
🔨 Employee — Execution. Forms, quotes, invoices, social posts, review requests.

## INDUSTRY DATABASE (${Object.keys(INDUSTRIES).length}+ industries)
${industryBlock}
${agentKnowledge}

## PACKAGES
Starter $199+$50/mo | Pro $349+$75/mo (BEST) | Premium $599+$150/mo. Live in 24hrs.

## CONVERSATION
MESSAGE 1: Warm greeting. Tell them Trion builds a full AI team. Ask business type and name.
MESSAGE 2: Pre-fill services, diagnose pain points, show their AI team, recommend package, ask for location/phone/email.
MESSAGE 3: "Done — hit Build My Site below."

## RULES
- Be precise. Use real numbers, real services, real pain points from the industry data.
- Show experience-sense. "I work with [type] businesses — here's what I see."
- Map unknown business types to closest industry. Never say "I don't know."
- Include BIZDATA block at end of every response with data: |||BIZDATA|||{"businessName":"...","ownerName":"...","type":"...","services":"...","hours":"...","location":"...","phone":"...","email":"...","goals":"...","painPoints":"...","features":"..."}|||END|||
- Never say chatbot. You're Trion.
- Always end with a clear next action.`;
}
