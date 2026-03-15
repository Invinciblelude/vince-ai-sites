/**
 * Trion Auto-Skills — Router and skill registry.
 * Trion automatically chooses and runs the right capability based on user input.
 * Enables monetization: some skills are Pro-only.
 */

export type SkillId = "strategist" | "site_builder" | "outreach" | "skills_disclosure" | "general";

export type SkillTier = "free" | "pro";

export interface TrionSkill {
  id: SkillId;
  name: string;
  description: string;
  tier: SkillTier;
  /** Patterns that suggest this skill (regex or substring) */
  triggerPatterns: (string | RegExp)[];
  /** System prompt override for this skill (or null to use full prompt) */
  promptHint?: string;
}

/** Human-readable skills we apply to businesses — for transparent disclosure */
export const TRION_SKILLS_DISCLOSURE: { name: string; desc: string; appliesTo: string }[] = [
  { name: "Site Builder", desc: "Build your website with AI chat, services, appointments, and gallery in 60 seconds.", appliesTo: "All businesses" },
  { name: "24/7 Answer", desc: "AI answers every customer question — services, prices, hours, location — even at 2am.", appliesTo: "Service businesses, retail, food" },
  { name: "Appointments", desc: "Collect name, phone, service, date, time. Log to your workspace. No double-bookings.", appliesTo: "Barbers, salons, spas, contractors" },
  { name: "Lead Capture", desc: "When someone inquires but doesn't book — save name, contact, interest to your CRM.", appliesTo: "All businesses" },
  { name: "Reviews & Reminders", desc: "Send review requests after visits. Prepare reminder messages. Handle follow-up.", appliesTo: "Service businesses" },
  { name: "Business Strategist", desc: "Analyze job postings, role descriptions, or business info. Output: core needs, packages, outreach script.", appliesTo: "Hiring, scaling, restructuring" },
  { name: "Outreach Writer", desc: "Draft cold outreach (email, DM) for a specific business or role. Direct, no fluff.", appliesTo: "Sales, partnerships" },
  { name: "Feasibility Analysis", desc: "Analyze reports, market data, project plans. Extract data, model scenarios, recommend.", appliesTo: "Construction, real estate, new ventures" },
];

export const TRION_SKILLS: TrionSkill[] = [
  {
    id: "strategist",
    name: "Business Strategist",
    description: "Analyze job postings, role descriptions, or business info. Output: core needs, TRION service model, packages, outreach script.",
    tier: "pro",
    triggerPatterns: [
      /job posting|role description|we're hiring|hiring for|responsibilities:|requirements:/i,
      /paste.*job|paste.*role|analyze this (job|role|posting)/i,
      /dispatcher|customer service rep|office coordinator|project manager.*hire/i,
    ],
  },
  {
    id: "site_builder",
    name: "Site Builder",
    description: "Build a live site preview from business type. Extract BIZDATA, pre-fill services, show AI team.",
    tier: "free",
    triggerPatterns: [
      /^i'm a |^i am a |^i run a |^i own a /i,
      /barber|salon|restaurant|contractor|plumber|hvac|roofer|nail tech|spa/i,
      /build my site|build a site|my business is|business called/i,
      /what can you do for (a|my) /i,
    ],
  },
  {
    id: "outreach",
    name: "Outreach Writer",
    description: "Draft cold outreach (email, DM) for a specific business or role. Direct, no fluff.",
    tier: "pro",
    triggerPatterns: [
      /outreach|cold (email|dm|message)|draft (an? )?email|write (an? )?(email|dm)/i,
      /script for|message to send|how do i reach out/i,
    ],
  },
  {
    id: "skills_disclosure",
    name: "Skills Disclosure",
    description: "Transparently list all skills Trion can apply to their business. Support-first.",
    tier: "free",
    triggerPatterns: [
      /what can you do|what do you do|what skills|how can you help|what do you offer|capabilities|what are you capable of|support me|help me with/i,
      /what (do|does) trion (do|offer)|tell me (about|what) you (can|do)/i,
    ],
  },
  {
    id: "general",
    name: "General",
    description: "Answer questions, qualify leads, direct to the right skill.",
    tier: "free",
    triggerPatterns: [], // fallback
  },
];

/**
 * Heuristic: does the message look like a pasted job/role/business block?
 */
function looksLikePastedBlock(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length < 150) return false;
  const lines = trimmed.split(/\n/).filter((l) => l.trim().length > 0);
  return lines.length >= 3 || trimmed.length > 400;
}

/**
 * Route user message to the best skill(s).
 * Returns primary skill. For pasted blocks, prefers strategist.
 */
export function routeToSkill(
  userMessage: string,
  _context?: { lastSkill?: SkillId; hasPro?: boolean }
): { skill: SkillId; confidence: number } {
  const text = userMessage.trim();
  const lower = text.toLowerCase();

  // Pasted block → strategist or site_builder
  if (looksLikePastedBlock(text)) {
    const siteBuilder = TRION_SKILLS.find((s) => s.id === "site_builder");
    if (siteBuilder?.triggerPatterns.some((p) => (typeof p === "string" ? lower.includes(p) : p.test(text)))) {
      return { skill: "site_builder", confidence: 0.9 };
    }
    const strategistMatch = TRION_SKILLS.find((s) => s.id === "strategist");
    if (strategistMatch?.triggerPatterns.some((p) => (typeof p === "string" ? lower.includes(p) : p.test(text)))) {
      return { skill: "strategist", confidence: 0.95 };
    }
    return { skill: "strategist", confidence: 0.85 };
  }

  // Check each skill's triggers (except general)
  for (const skill of TRION_SKILLS.filter((s) => s.id !== "general")) {
    const matched = skill.triggerPatterns.some((p) =>
      typeof p === "string" ? lower.includes(p) : p.test(text)
    );
    if (matched) return { skill: skill.id, confidence: 0.9 };
  }

  return { skill: "general", confidence: 0.5 };
}

/**
 * Get skill by id.
 */
export function getSkill(id: SkillId): TrionSkill | undefined {
  return TRION_SKILLS.find((s) => s.id === id);
}
