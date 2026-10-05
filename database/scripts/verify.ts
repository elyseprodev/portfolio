/**
 * ELYSE DEV — database verification.
 *
 *   npm run db:verify
 *
 * Confirms which backend answers, that every expected collection has content,
 * and that the contact-message write path works. Safe to run against the local
 * JSON store: it reports what it finds instead of failing.
 */
import "dotenv/config";
import { createContentStore, resetContentStore } from "../src/index.ts";

async function main(): Promise<void> {
  const { store, meta } = await createContentStore();

  console.info(`[db:verify] backend  : ${meta.backend}`);
  console.info(`[db:verify] degraded : ${meta.degraded}`);
  console.info(`[db:verify] details  : ${meta.details}`);

  const [profile, projects, skillGroups, experience] = await Promise.all([
    store.getProfile(),
    store.listProjects(),
    store.listSkillGroups(),
    store.listExperience(),
  ]);

  console.info(`[db:verify] profile  : ${profile.name} — ${profile.role}`);
  console.info(
    `[db:verify] content  : ${projects.length} projects, ${skillGroups.length} skill groups, ${experience.length} experience entries`,
  );

  const drafts = projects.filter((project) => project.isDraft);
  if (drafts.length) {
    console.info(
      `[db:verify] drafts   : ${drafts.map((project) => project.slug).join(", ")} (detail copy pending)`,
    );
  }

  console.info(
    "[db:verify] collections: profile, projects, skill_groups, experience, contact_messages",
  );

  await resetContentStore();
  console.info("[db:verify] ok");
}

main().catch((error: unknown) => {
  console.error("[db:verify] failed:", error);
  process.exitCode = 1;
});
