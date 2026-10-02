/**
 * ELYSE DEV — content routes.
 *
 *   GET /api/content                → everything the client needs in one call
 *   GET /api/profile                → developer profile
 *   GET /api/projects               → list (filter: category, featured, q, limit)
 *   GET /api/projects/:slug         → single project
 *   GET /api/skills                 → skill groups
 *   GET /api/experience             → experience & learning entries
 */
import { Router } from "express";
import { getStoreMeta, resolveContentStore } from "@elyse/database";
import { sendOk } from "../lib/api-response.ts";
import { projectQuerySchema } from "../lib/validation.ts";
import { HttpError } from "../middleware/error-handler.ts";

export const contentRouter = Router();

contentRouter.get("/content", async (_req, res) => {
  const store = await resolveContentStore();
  const content = await store.getContent();
  sendOk(res, content, { backend: getStoreMeta() });
});

contentRouter.get("/profile", async (_req, res) => {
  const store = await resolveContentStore();
  sendOk(res, await store.getProfile(), { backend: getStoreMeta() });
});

contentRouter.get("/projects", async (req, res) => {
  const query = projectQuerySchema.parse(req.query);
  const store = await resolveContentStore();
  let projects = await store.listProjects();

  if (query.category) {
    projects = projects.filter((project) => project.category === query.category);
  }
  if (query.featured !== undefined) {
    const wantsFeatured =
      query.featured === true || query.featured === "true";
    projects = projects.filter((project) => project.featured === wantsFeatured);
  }
  if (query.q) {
    const needle = query.q.toLowerCase();
    projects = projects.filter((project) =>
      [project.title, project.tagline, project.summary, ...project.stack]
        .join(" ")
        .toLowerCase()
        .includes(needle),
    );
  }
  if (query.limit) {
    projects = projects.slice(0, query.limit);
  }

  sendOk(res, projects, {
    backend: getStoreMeta(),
    count: projects.length,
    total: (await store.listProjects()).length,
  });
});

contentRouter.get("/projects/:slug", async (req, res) => {
  const store = await resolveContentStore();
  const slug = req.params.slug;
  const project = await store.getProject(slug);
  if (!project) {
    throw new HttpError(404, "project_not_found", `No project with slug "${slug}".`);
  }
  sendOk(res, project, { backend: getStoreMeta() });
});

contentRouter.get("/skills", async (_req, res) => {
  const store = await resolveContentStore();
  sendOk(res, await store.listSkillGroups(), { backend: getStoreMeta() });
});

contentRouter.get("/experience", async (_req, res) => {
  const store = await resolveContentStore();
  sendOk(res, await store.listExperience(), { backend: getStoreMeta() });
});
