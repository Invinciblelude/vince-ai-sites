import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface Agent {
  slug: string;
  name: string;
  description: string;
  color: string;
  emoji: string;
  vibe: string;
  division: string;
  content: string;
}

export interface Division {
  id: string;
  label: string;
  emoji: string;
  color: string;
  count: number;
}

const DIVISION_MAP: Record<string, { label: string; emoji: string; color: string }> = {
  engineering: { label: "Engineering", emoji: "💻", color: "blue" },
  design: { label: "Design", emoji: "🎨", color: "purple" },
  marketing: { label: "Marketing", emoji: "📢", color: "green" },
  "paid-media": { label: "Paid Media", emoji: "💰", color: "yellow" },
  sales: { label: "Sales", emoji: "💼", color: "orange" },
  product: { label: "Product", emoji: "📊", color: "indigo" },
  "project-management": { label: "Project Management", emoji: "🎬", color: "teal" },
  testing: { label: "Testing", emoji: "🧪", color: "red" },
  support: { label: "Support", emoji: "🛟", color: "cyan" },
  "game-development": { label: "Game Development", emoji: "🎮", color: "pink" },
  "spatial-computing": { label: "Spatial Computing", emoji: "🥽", color: "violet" },
  specialized: { label: "Specialized", emoji: "🎯", color: "amber" },
};

const FILE_TO_DIVISION: Record<string, string> = {};

function buildFileDivisionMap() {
  if (Object.keys(FILE_TO_DIVISION).length > 0) return;

  const repoAgentsDir = path.join(process.cwd(), "content", "agents");
  const sourceRepo = path.join(process.cwd(), "..", "agency-agents");

  const divisions = Object.keys(DIVISION_MAP);

  for (const div of divisions) {
    const divPath = path.join(sourceRepo, div);
    if (!fs.existsSync(divPath)) continue;

    const walk = (dir: string) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          walk(path.join(dir, entry.name));
        } else if (entry.name.endsWith(".md") && entry.name !== "README.md") {
          FILE_TO_DIVISION[entry.name] = div;
        }
      }
    };
    walk(divPath);
  }
}

function inferDivision(filename: string): string {
  buildFileDivisionMap();
  if (FILE_TO_DIVISION[filename]) return FILE_TO_DIVISION[filename];

  const prefixMap: Record<string, string> = {
    engineering: "engineering",
    design: "design",
    marketing: "marketing",
    "paid-media": "paid-media",
    sales: "sales",
    product: "product",
    "project-management": "project-management",
    "project-manager": "project-management",
    testing: "testing",
    support: "support",
    unity: "game-development",
    unreal: "game-development",
    godot: "game-development",
    roblox: "game-development",
    game: "game-development",
    level: "game-development",
    narrative: "game-development",
    technical: "game-development",
    xr: "spatial-computing",
    visionos: "spatial-computing",
    macos: "spatial-computing",
    terminal: "spatial-computing",
  };

  for (const [prefix, div] of Object.entries(prefixMap)) {
    if (filename.startsWith(prefix)) return div;
  }

  return "specialized";
}

const agentsDir = path.join(process.cwd(), "content", "agents");

function safeParseFrontmatter(raw: string): { data: Record<string, string>; content: string } {
  try {
    const { data, content } = matter(raw);
    return { data, content };
  } catch {
    const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!fmMatch) return { data: {}, content: raw };

    const data: Record<string, string> = {};
    for (const line of fmMatch[1].split("\n")) {
      const idx = line.indexOf(":");
      if (idx > 0) {
        const key = line.slice(0, idx).trim();
        const val = line.slice(idx + 1).trim();
        data[key] = val;
      }
    }
    return { data, content: fmMatch[2] };
  }
}

export function getAllAgents(): Agent[] {
  const files = fs.readdirSync(agentsDir).filter((f) => f.endsWith(".md"));

  return files.map((file) => {
    const raw = fs.readFileSync(path.join(agentsDir, file), "utf-8");
    const { data, content } = safeParseFrontmatter(raw);
    const slug = file.replace(/\.md$/, "");

    return {
      slug,
      name: data.name || slug,
      description: data.description || "",
      color: data.color || "gray",
      emoji: data.emoji || "🤖",
      vibe: data.vibe || "",
      division: inferDivision(file),
      content,
    };
  }).sort((a, b) => a.name.localeCompare(b.name));
}

export function getAgentBySlug(slug: string): Agent | undefined {
  const file = `${slug}.md`;
  const filePath = path.join(agentsDir, file);
  if (!fs.existsSync(filePath)) return undefined;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = safeParseFrontmatter(raw);

  return {
    slug,
    name: data.name || slug,
    description: data.description || "",
    color: data.color || "gray",
    emoji: data.emoji || "🤖",
    vibe: data.vibe || "",
    division: inferDivision(file),
    content,
  };
}

export function getDivisions(): Division[] {
  const agents = getAllAgents();
  const counts: Record<string, number> = {};
  for (const agent of agents) {
    counts[agent.division] = (counts[agent.division] || 0) + 1;
  }

  return Object.entries(DIVISION_MAP)
    .map(([id, meta]) => ({
      id,
      label: meta.label,
      emoji: meta.emoji,
      color: meta.color,
      count: counts[id] || 0,
    }))
    .filter((d) => d.count > 0)
    .sort((a, b) => b.count - a.count);
}

export function getAgentsByDivision(division: string): Agent[] {
  return getAllAgents().filter((a) => a.division === division);
}

export { DIVISION_MAP };
