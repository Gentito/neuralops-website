import fs from "node:fs";
import path from "node:path";

/** Root of the agency-agents git submodule. */
const ROOT = path.join(process.cwd(), "agency-agents");

export type Division = {
  key: string;
  label: string;
  icon: string;
  color: string;
  count: number;
};

export type Agent = {
  slug: string;
  stem: string;
  nameSlug: string;
  name: string;
  description: string;
  emoji: string;
  vibe: string;
  tools: string[];
  division: string;
  divisionLabel: string;
  accent: string;
  source: string;
};

/** An install target from the submodule's tools.json. */
export type Tool = {
  id: string;
  label: string;
  short: string;
  kebab: string;
  accent: string;
  installKind: "per-agent" | "roster" | "plugin";
  slugFrom: "source" | "name" | null;
  slugPrefix?: string;
  scope: { user: boolean; project: boolean };
  dest: { user: string[]; project: string[] };
};

type ToolsFile = {
  tools: Record<string, Omit<Tool, "kebab"> & { order?: number }>;
};

type DivisionsFile = {
  divisions: Record<string, { label: string; icon: string; color: string }>;
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Frontmatter `color:` uses plain names, not hex. Map the ones in use. */
const COLOR_HEX: Record<string, string> = {
  blue: "#3B82F6",
  green: "#22C55E",
  orange: "#F97316",
  purple: "#A855F7",
  teal: "#14B8A6",
  indigo: "#6366F1",
  red: "#EF4444",
  amber: "#F59E0B",
  cyan: "#06B6D4",
  violet: "#8B5CF6",
  pink: "#EC4899",
  gold: "#D4AF37",
  yellow: "#EAB308",
  slate: "#64748B",
  neon: "#39FF14",
  navy: "#1E3A8A",
  rose: "#F43F5E",
  metallic: "#9CA3AF",
  lime: "#84CC16",
  gray: "#6B7280",
  fuchsia: "#D946EF"
};

/** Minimal YAML frontmatter reader — enough for flat `key: value` pairs. */
function parseFrontmatter(raw: string): {
  data: Record<string, string>;
  body: string;
} {
  if (!raw.startsWith("---")) return { data: {}, body: raw };

  const end = raw.indexOf("\n---", 3);
  if (end === -1) return { data: {}, body: raw };

  const block = raw.slice(3, end).trim();
  const body = raw.slice(end + 4).replace(/^\r?\n/, "");
  const data: Record<string, string> = {};

  for (const line of block.split("\n")) {
    const match = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    if (!match) continue;
    let value = match[2].trim();
    const quoted =
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"));
    if (quoted) value = value.slice(1, -1);
    data[match[1].toLowerCase()] = value;
  }

  return { data, body };
}

function readDivisions(): DivisionsFile["divisions"] {
  const file = path.join(ROOT, "divisions.json");
  if (!fs.existsSync(file)) return {};
  try {
    const parsed = JSON.parse(fs.readFileSync(file, "utf8")) as DivisionsFile;
    return parsed.divisions ?? {};
  } catch {
    return {};
  }
}

function readTools(): Tool[] {
  const file = path.join(ROOT, "tools.json");
  if (!fs.existsSync(file)) return [];
  try {
    const parsed = JSON.parse(fs.readFileSync(file, "utf8")) as ToolsFile;
    return Object.entries(parsed.tools)
      .map(([kebab, tool]) => ({ ...tool, kebab }))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  } catch {
    return [];
  }
}

function loadCatalog(): {
  agents: Agent[];
  divisions: Division[];
  bodies: Map<string, string>;
} {
  const divisionMeta = readDivisions();
  const agents: Agent[] = [];
  const bodies = new Map<string, string>();

  for (const [key, meta] of Object.entries(divisionMeta)) {
    const dir = path.join(ROOT, key);
    if (!fs.existsSync(dir)) continue;

    for (const entry of fs.readdirSync(dir)) {
      if (!entry.endsWith(".md")) continue;
      if (entry.toLowerCase() === "readme.md") continue;

      const raw = fs.readFileSync(path.join(dir, entry), "utf8");
      const { data, body } = parseFrontmatter(raw);
      if (!data.name) continue;

      const fileSlug = entry.replace(/\.md$/, "");
      const slug = fileSlug.startsWith(`${key}-`)
        ? fileSlug.slice(key.length + 1)
        : fileSlug;

      const colorName = (data.color ?? "").toLowerCase();

      agents.push({
        slug,
        stem: fileSlug,
        nameSlug: slugify(data.name),
        name: data.name,
        description: data.description ?? "",
        emoji: data.emoji ?? "🤖",
        vibe: data.vibe ?? "",
        tools: data.tools
          ? data.tools.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
        division: key,
        divisionLabel: meta.label,
        accent: COLOR_HEX[colorName] ?? meta.color,
        source: `${key}/${entry}`
      });

      bodies.set(`${key}/${slug}`, body);
    }
  }

  agents.sort((a, b) => a.name.localeCompare(b.name));

  const divisions: Division[] = Object.entries(divisionMeta)
    .map(([key, meta]) => ({
      key,
      label: meta.label,
      icon: meta.icon,
      color: meta.color,
      count: agents.filter((a) => a.division === key).length
    }))
    .filter((d) => d.count > 0);

  return { agents, divisions, bodies };
}

let cached: ReturnType<typeof loadCatalog> | null = null;

function catalog() {
  if (!cached) cached = loadCatalog();
  return cached;
}

export function getAgents(): Agent[] {
  return catalog().agents;
}

export function getDivisions(): Division[] {
  return catalog().divisions;
}

export function getTools(): Tool[] {
  return readTools();
}

export function getAgentParams(): { division: string; slug: string }[] {
  return catalog().agents.map((a) => ({
    division: a.division,
    slug: a.slug
  }));
}

export function getAgent(
  division: string,
  slug: string
): { agent: Agent; body: string } | null {
  const agent = catalog().agents.find(
    (a) => a.division === division && a.slug === slug
  );
  if (!agent) return null;
  return { agent, body: catalog().bodies.get(`${division}/${slug}`) ?? "" };
}
