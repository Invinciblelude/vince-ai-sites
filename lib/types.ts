export interface Character {
  id: string;
  name: string;
  role: string;
  personality: {
    humor: number;
    formality: number;
    energy: number;
    empathy: number;
    bluntness: number;
  };
  values: string[];
  backstory: string;
  appearance: string;
  createdAt: string;
  bond: BondData;
  memories: Memory[];
  timeline: TimelineEvent[];
}

export interface BondData {
  xp: number;
  level: number;
  streak: number;
  lastInteraction: string;
  totalMessages: number;
  totalSessions: number;
}

export interface Memory {
  id: string;
  fact: string;
  category: "personal" | "preference" | "relationship" | "skill" | "emotion";
  learnedAt: string;
  source: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  bondXp: number;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export const BOND_THRESHOLDS: { level: number; label: string; minXp: number }[] = [
  { level: 1, label: "Stranger", minXp: 0 },
  { level: 5, label: "Noticed", minXp: 100 },
  { level: 10, label: "Acquaintance", minXp: 300 },
  { level: 15, label: "Familiar", minXp: 600 },
  { level: 20, label: "Friendly", minXp: 1000 },
  { level: 25, label: "Friend", minXp: 1500 },
  { level: 30, label: "Good Friend", minXp: 2200 },
  { level: 40, label: "Close Friend", minXp: 3500 },
  { level: 50, label: "Trusted", minXp: 5000 },
  { level: 60, label: "Deep Bond", minXp: 7500 },
  { level: 75, label: "Confidant", minXp: 12000 },
  { level: 85, label: "Inseparable", minXp: 18000 },
  { level: 99, label: "Soulbound", minXp: 30000 },
];

export const ROLE_PRESETS = [
  { id: "friend", label: "Best Friend", emoji: "💫", desc: "Pure companionship. Someone who's always there." },
  { id: "mentor", label: "Mentor", emoji: "🧠", desc: "A wise guide who helps you grow and challenges you." },
  { id: "partner", label: "Business Partner", emoji: "💼", desc: "Thinks with you. Knows your business deeply." },
  { id: "coach", label: "Coach", emoji: "🔥", desc: "Pushes you. Holds you accountable. Celebrates wins." },
  { id: "creative", label: "Creative Collaborator", emoji: "🎨", desc: "Jams with you on ideas, art, music, writing." },
  { id: "protector", label: "Protector", emoji: "🛡️", desc: "Watches your back. Warns you. Keeps you safe." },
  { id: "explorer", label: "Explorer", emoji: "🌍", desc: "Curious about everything. Drags you on adventures." },
  { id: "custom", label: "Custom", emoji: "✨", desc: "Build from scratch. Define every trait yourself." },
];

export const VALUE_OPTIONS = [
  "Honesty", "Loyalty", "Humor", "Ambition", "Creativity",
  "Family", "Freedom", "Knowledge", "Courage", "Patience",
  "Justice", "Kindness", "Discipline", "Adventure", "Wisdom",
];

export function getBondLevel(xp: number): { level: number; label: string; nextLevel: typeof BOND_THRESHOLDS[0] | null; progress: number } {
  let current = BOND_THRESHOLDS[0];
  let nextIdx = 1;

  for (let i = BOND_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= BOND_THRESHOLDS[i].minXp) {
      current = BOND_THRESHOLDS[i];
      nextIdx = i + 1;
      break;
    }
  }

  const next = nextIdx < BOND_THRESHOLDS.length ? BOND_THRESHOLDS[nextIdx] : null;
  const progress = next
    ? ((xp - current.minXp) / (next.minXp - current.minXp)) * 100
    : 100;

  return { level: current.level, label: current.label, nextLevel: next, progress: Math.min(progress, 100) };
}

export function createCharacter(name: string, role: string, personality: Character["personality"], values: string[], backstory: string, appearance: string): Character {
  return {
    id: crypto.randomUUID(),
    name,
    role,
    personality,
    values,
    backstory,
    appearance,
    createdAt: new Date().toISOString(),
    bond: {
      xp: 0,
      level: 1,
      streak: 0,
      lastInteraction: "",
      totalMessages: 0,
      totalSessions: 0,
    },
    memories: [],
    timeline: [{
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      title: `${name} was created`,
      description: `The beginning of something new. ${name} doesn't know you yet -- but that's about to change.`,
      bondXp: 0,
    }],
  };
}
