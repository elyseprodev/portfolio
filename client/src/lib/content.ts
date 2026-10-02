/**
 * ELYSE DEV — content access layer.
 *
 * Strategy: try the API first (it owns the database), fall back to the typed
 * local content when the API is unavailable. Every loader reports where its
 * data came from so the UI can be honest about it (see the footer status line).
 */
import type {
  Certificate,
  ContentBundle,
  Course,
  CourseTrack,
  ExperienceEntry,
  Profile,
  Project,
  ServiceMeta,
  SkillGroup,
} from "@elyse/database/types";

import { apiGet, type DataSource } from "./api";
import { profile as localProfile } from "@/content/profile";
import { projects as localProjects } from "@/content/projects";
import { skillGroups as localSkillGroups } from "@/content/skills";
import { experience as localExperience } from "@/content/experience";
import { courses as localCourses, courseTracks as localCourseTracks } from "@/content/courses";

export interface Loaded<T> {
  data: T;
  source: DataSource;
  backend?: ServiceMeta;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isProjectArray(value: unknown): value is Project[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) => isRecord(item) && typeof item.slug === "string" && typeof item.title === "string",
    )
  );
}

function isSkillGroupArray(value: unknown): value is SkillGroup[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        isRecord(item) && typeof item.id === "string" && Array.isArray(item.skills),
    )
  );
}

function isExperienceArray(value: unknown): value is ExperienceEntry[] {
  return (
    Array.isArray(value) &&
    value.every((item) => isRecord(item) && typeof item.id === "string")
  );
}

function isCourseArray(value: unknown): value is Course[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        isRecord(item) &&
        typeof item.slug === "string" &&
        typeof item.language === "string" &&
        Array.isArray(item.modules),
    )
  );
}

function isCourseTrackArray(value: unknown): value is CourseTrack[] {
  return (
    Array.isArray(value) &&
    value.every((item) => isRecord(item) && typeof item.id === "string" && typeof item.name === "string")
  );
}

function isCertificate(value: unknown): value is Certificate {
  return (
    isRecord(value) &&
    typeof value.code === "string" &&
    typeof value.studentName === "string" &&
    typeof value.courseSlug === "string"
  );
}

function isProfile(value: unknown): value is Profile {
  return isRecord(value) && typeof value.name === "string" && typeof value.role === "string";
}

function backendOf(meta: Record<string, unknown> | undefined): ServiceMeta | undefined {
  const backend = meta?.backend;
  return isRecord(backend) && typeof backend.backend === "string"
    ? (backend as unknown as ServiceMeta)
    : undefined;
}

export async function loadProfile(): Promise<Loaded<Profile>> {
  const result = await apiGet<Profile>("/api/profile", { tags: ["content"] });
  if (result && isProfile(result.data)) {
    return {
      data: result.data,
      source: "api",
      ...(backendOf(result.meta) ? { backend: backendOf(result.meta) } : {}),
    };
  }
  return { data: localProfile, source: "local" };
}

export async function loadProjects(): Promise<Loaded<Project[]>> {
  const result = await apiGet<Project[]>("/api/projects", { tags: ["content", "projects"] });
  if (result && isProjectArray(result.data) && result.data.length > 0) {
    return {
      data: result.data,
      source: "api",
      ...(backendOf(result.meta) ? { backend: backendOf(result.meta) } : {}),
    };
  }
  return { data: localProjects, source: "local" };
}

export async function loadProject(
  slug: string,
): Promise<Loaded<Project | null>> {
  const result = await apiGet<Project>(`/api/projects/${encodeURIComponent(slug)}`, {
    tags: ["content", "projects", `project:${slug}`],
  });
  if (result && isRecord(result.data) && typeof result.data.slug === "string") {
    return { data: result.data, source: "api" };
  }
  return { data: localProjects.find((project) => project.slug === slug) ?? null, source: "local" };
}

export async function loadSkillGroups(): Promise<Loaded<SkillGroup[]>> {
  const result = await apiGet<SkillGroup[]>("/api/skills", { tags: ["content", "skills"] });
  if (result && isSkillGroupArray(result.data) && result.data.length > 0) {
    return {
      data: result.data,
      source: "api",
      ...(backendOf(result.meta) ? { backend: backendOf(result.meta) } : {}),
    };
  }
  return { data: localSkillGroups, source: "local" };
}

export async function loadExperience(): Promise<Loaded<ExperienceEntry[]>> {
  const result = await apiGet<ExperienceEntry[]>("/api/experience", {
    tags: ["content", "experience"],
  });
  if (result && isExperienceArray(result.data) && result.data.length > 0) {
    return {
      data: result.data,
      source: "api",
      ...(backendOf(result.meta) ? { backend: backendOf(result.meta) } : {}),
    };
  }
  return { data: localExperience, source: "local" };
}

export async function loadCourses(): Promise<Loaded<Course[]>> {
  const result = await apiGet<Course[]>("/api/courses", {
    tags: ["content", "courses"],
  });
  if (result && isCourseArray(result.data) && result.data.length > 0) {
    return {
      data: result.data,
      source: "api",
      ...(backendOf(result.meta) ? { backend: backendOf(result.meta) } : {}),
    };
  }
  return { data: localCourses, source: "local" };
}

export async function loadCourse(slug: string): Promise<Loaded<Course | null>> {
  const result = await apiGet<Course>(`/api/courses/${encodeURIComponent(slug)}`, {
    tags: ["content", "courses", `course:${slug}`],
  });
  if (result && isRecord(result.data) && typeof result.data.slug === "string") {
    return { data: result.data, source: "api" };
  }
  return { data: localCourses.find((course) => course.slug === slug) ?? null, source: "local" };
}

/**
 * Courses and tracks always come from the same typed modules the database was
 * seeded from, so the curriculum is never half-API and half-local on one page:
 * either the API answered with a full catalogue, or the bundled catalogue is
 * used. This is what keeps a course page and its card in the grid consistent.
 */
export async function loadAcademy(): Promise<
  Loaded<{ courses: Course[]; tracks: CourseTrack[] }>
> {
  const loaded = await loadCourses();
  const localTracks = isCourseTrackArray(localCourseTracks) ? localCourseTracks : [];
  const tracks = localTracks;
  return {
    data: { courses: loaded.data, tracks },
    source: loaded.source,
    ...(loaded.backend ? { backend: loaded.backend } : {}),
  };
}

/** Verifies a certificate by code. Returns null when the code is unknown. */
export async function loadCertificate(code: string): Promise<Certificate | null> {
  const result = await apiGet<Certificate>(
    `/api/certificates/${encodeURIComponent(code)}`,
    // A verification must never be served from a stale cache.
    { revalidate: 0 },
  );
  return result && isCertificate(result.data) ? result.data : null;
}

export async function loadContentBundle(): Promise<Loaded<ContentBundle>> {
  const result = await apiGet<ContentBundle>("/api/content", { tags: ["content"] });
  if (
    result &&
    isRecord(result.data) &&
    isProfile(result.data.profile) &&
    isProjectArray(result.data.projects) &&
    isSkillGroupArray(result.data.skillGroups) &&
    isExperienceArray(result.data.experience)
  ) {
    return {
      data: result.data,
      source: "api",
      ...(backendOf(result.meta) ? { backend: backendOf(result.meta) } : {}),
    };
  }

  return {
    data: {
      profile: localProfile,
      projects: localProjects,
      skillGroups: localSkillGroups,
      experience: localExperience,
      courses: localCourses,
      courseTracks: localCourseTracks,
    },
    source: "local",
  };
}

export interface ServiceStatus {
  reachable: boolean;
  status: "ok" | "degraded" | "offline";
  backend?: ServiceMeta;
  integrations?: { emailNotifications: boolean; githubToken: boolean };
  /** Present after a fallback fetch so the user can trigger revalidation. */
  checkedAt: string;
  /** Next.js cache revalidation window used by the fetch above (seconds). */
  revalidateSeconds: number;
}

/** Used by the footer status line and the contact page. */
export async function loadServiceStatus(): Promise<ServiceStatus> {
  const checkedAt = new Date().toISOString();
  const result = await apiGet<{
    status: "ok" | "degraded";
    database: ServiceMeta;
    integrations: { emailNotifications: boolean; githubToken: boolean };
  }>("/api/health", { revalidate: 60, tags: ["health"] });

  if (!result) {
    return {
      reachable: false,
      status: "offline",
      checkedAt,
      revalidateSeconds: 60,
    };
  }

  return {
    reachable: true,
    status: result.data.status,
    backend: result.data.database,
    integrations: result.data.integrations,
    checkedAt,
    revalidateSeconds: 60,
  };
}
