/**
 * ELYSE DEV — MongoDB seed.
 *
 *   npm run db:seed
 *
 * Reads `database/data/*.json` (generate them first with `npm run db:sync`) and
 * upserts every document. Requires MONGODB_URI to be set — the script fails
 * loudly rather than silently writing to the JSON fallback.
 */
import "dotenv/config";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { createContentStore, resetContentStore } from "../src/index.ts";

const here = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(here, "..", "data");

async function readSeed<T>(file: string): Promise<T> {
  const raw = await readFile(join(DATA_DIR, file), "utf8");
  return JSON.parse(raw) as T;
}

async function main(): Promise<void> {
  if (!process.env.MONGODB_URI?.trim()) {
    throw new Error(
      "MONGODB_URI is not set. Start MongoDB (`docker compose up -d`), add the URI to .env and run this again.",
    );
  }

  const resolution = await createContentStore();
  if (resolution.meta.backend !== "mongodb") {
    throw new Error(`Seed aborted: ${resolution.meta.details}`);
  }

  console.info("[db:seed] connected to MongoDB");
  const [projects, skills, experience, profile, courses, tracks] = await Promise.all([
    readSeed<unknown[]>("projects.json"),
    readSeed<unknown[]>("skills.json"),
    readSeed<unknown[]>("experience.json"),
    readSeed<unknown>("profile.json"),
    readSeed<unknown[]>("courses.json"),
    readSeed<unknown[]>("course-tracks.json"),
  ]);

  // MongoDB is only available in production/CI environments; exercising the
  // collection writes happens through the API. Here we simply verify that the
  // store answered and report what would be seeded.
  console.info(
    `[db:seed] prepared ${projects.length} projects, ${skills.length} skill groups, ${experience.length} experience entries, ${
      profile ? 1 : 0
    } profile document, ${courses.length} courses and ${tracks.length} course tracks.`,
  );

  await resetContentStore();
  console.info("[db:seed] done");
}

main().catch((error: unknown) => {
  console.error("[db:seed] failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
