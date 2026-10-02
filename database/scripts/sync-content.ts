/**
 * ELYSE DEV — content sync.
 *
 * The typed modules in `client/src/content/` are the single source of truth for
 * portfolio content. This script mirrors them into `database/data/*.json`,
 * which is what the database layer uses to seed MongoDB and what the local JSON
 * store reads.
 *
 *   npm run db:sync
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { profile } from "../../client/src/content/profile.ts";
import { projects } from "../../client/src/content/projects.ts";
import { skillGroups } from "../../client/src/content/skills.ts";
import { experience } from "../../client/src/content/experience.ts";

const here = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(here, "..", "data");

interface SyncTarget {
  file: string;
  payload: unknown;
}

async function main(): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });

  const targets: SyncTarget[] = [
    { file: "profile.json", payload: profile },
    { file: "projects.json", payload: projects },
    { file: "skills.json", payload: skillGroups },
    { file: "experience.json", payload: experience },
  ];

  for (const target of targets) {
    const path = join(DATA_DIR, target.file);
    await writeFile(path, `${JSON.stringify(target.payload, null, 2)}\n`, "utf8");
    console.info(`[db:sync] wrote ${target.file}`);
  }

  console.info(
    `[db:sync] done — ${projects.length} projects, ${skillGroups.length} skill groups, ${experience.length} experience entries.`,
  );
}

main().catch((error: unknown) => {
  console.error("[db:sync] failed:", error);
  process.exitCode = 1;
});
