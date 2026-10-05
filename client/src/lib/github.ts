/**
 * ELYSE DEV — client-side view of the GitHub activity payload.
 *
 * The client may not import from the server package, so this mirrors the shape
 * returned by `GET /api/github` (see server/src/services/github.service.ts).
 * Every value here is real GitHub data, or the payload reports
 * `available: false` and the UI shows the curated repository list instead.
 */
export interface GithubProfileSummary {
  login: string;
  name: string | null;
  bio: string | null;
  location: string | null;
  blog: string | null;
  avatarUrl: string;
  htmlUrl: string;
  publicRepos: number;
  followers: number;
  createdAt: string;
}

export interface GithubRepoSummary {
  name: string;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stars: number;
  forks: number;
  archived: boolean;
  fork: boolean;
  pushedAt: string | null;
  updatedAt: string | null;
}

export interface GithubActivityPayload {
  available: boolean;
  username: string;
  profile: GithubProfileSummary | null;
  repos: GithubRepoSummary[];
  languages: { name: string; repos: number }[];
  rateLimit: { limit: number | null; remaining: number | null; resetAt: string | null };
  fetchedAt: string;
  reason?: string;
  cached: boolean;
}
