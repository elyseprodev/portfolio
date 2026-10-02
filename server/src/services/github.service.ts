/**
 * ELYSE DEV — GitHub activity service.
 *
 * Proxies the public GitHub REST API so the browser never needs a token and so
 * rate limits can be cached and reported honestly. When GitHub cannot be
 * reached (or the unauthenticated limit is exhausted) the route answers with
 * `available: false` and a human explanation — the client then shows its
 * curated static repository list. No numbers are ever invented.
 */
import { env } from "../config/env.ts";

export interface GithubProfile {
  login: string;
  name: string | null;
  bio: string | null;
  company: string | null;
  location: string | null;
  blog: string | null;
  avatarUrl: string;
  htmlUrl: string;
  publicRepos: number;
  followers: number;
  following: number;
  createdAt: string;
}

export interface GithubRepo {
  name: string;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stars: number;
  forks: number;
  openIssues: number;
  archived: boolean;
  fork: boolean;
  pushedAt: string | null;
  updatedAt: string | null;
}

export interface GithubActivity {
  available: boolean;
  username: string;
  profile: GithubProfile | null;
  repos: GithubRepo[];
  languages: { name: string; repos: number }[];
  rateLimit: {
    limit: number | null;
    remaining: number | null;
    resetAt: string | null;
  };
  fetchedAt: string;
  /** Explanation shown to the visitor when `available` is false. */
  reason?: string;
  /** True when the response came from the in-memory cache. */
  cached: boolean;
}

interface CacheEntry {
  value: GithubActivity;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

const GITHUB_API = "https://api.github.com";

function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "elyse-dev-portfolio",
  };
  if (env.github.token) {
    headers.Authorization = `Bearer ${env.github.token}`;
  }
  return headers;
}

interface RawGithubProfile {
  login: string;
  name: string | null;
  bio: string | null;
  company: string | null;
  location: string | null;
  blog: string | null;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

interface RawGithubRepo {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  archived: boolean;
  fork: boolean;
  pushed_at: string | null;
  updated_at: string | null;
}

function mapProfile(raw: RawGithubProfile): GithubProfile {
  return {
    login: raw.login,
    name: raw.name,
    bio: raw.bio,
    company: raw.company,
    location: raw.location,
    blog: raw.blog,
    avatarUrl: raw.avatar_url,
    htmlUrl: raw.html_url,
    publicRepos: raw.public_repos,
    followers: raw.followers,
    following: raw.following,
    createdAt: raw.created_at,
  };
}

function mapRepo(raw: RawGithubRepo): GithubRepo {
  return {
    name: raw.name,
    fullName: raw.full_name,
    description: raw.description,
    htmlUrl: raw.html_url,
    homepage: raw.homepage,
    language: raw.language,
    topics: raw.topics ?? [],
    stars: raw.stargazers_count,
    forks: raw.forks_count,
    openIssues: raw.open_issues_count,
    archived: raw.archived,
    fork: raw.fork,
    pushedAt: raw.pushed_at,
    updatedAt: raw.updated_at,
  };
}

function readRateLimit(headers: Headers): GithubActivity["rateLimit"] {
  return {
    limit: numberOrNull(headers.get("x-ratelimit-limit")),
    remaining: numberOrNull(headers.get("x-ratelimit-remaining")),
    resetAt: headers.get("x-ratelimit-reset")
      ? new Date(Number(headers.get("x-ratelimit-reset")) * 1000).toISOString()
      : null,
  };
}

function numberOrNull(value: string | null): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function unavailable(
  reason: string,
  rateLimit: GithubActivity["rateLimit"] = {
    limit: null,
    remaining: null,
    resetAt: null,
  },
  cached = false,
): GithubActivity {
  return {
    available: false,
    username: env.github.username,
    profile: null,
    repos: [],
    languages: [],
    rateLimit,
    fetchedAt: new Date().toISOString(),
    reason,
    cached,
  };
}

/** Aggregates repository languages — real data only, never estimated. */
function summariseLanguages(repos: GithubRepo[]): GithubActivity["languages"] {
  const counts = new Map<string, number>();
  for (const repo of repos) {
    if (!repo.language) continue;
    counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, repos: count }))
    .sort((a, b) => b.repos - a.repos || a.name.localeCompare(b.name));
}

export async function getGithubActivity(
  username = env.github.username,
): Promise<GithubActivity> {
  const cached = cache.get(username);
  if (cached && cached.expiresAt > Date.now()) {
    return { ...cached.value, cached: true };
  }

  try {
    const [profileResponse, reposResponse] = await Promise.all([
      fetch(`${GITHUB_API}/users/${encodeURIComponent(username)}`, {
        headers: buildHeaders(),
        signal: AbortSignal.timeout(8000),
      }),
      fetch(
        `${GITHUB_API}/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`,
        { headers: buildHeaders(), signal: AbortSignal.timeout(8000) },
      ),
    ]);

    const rateLimit = readRateLimit(reposResponse.headers);

    if (profileResponse.status === 404) {
      const result = unavailable("That GitHub account could not be found.", rateLimit);
      cache.set(username, { value: result, expiresAt: Date.now() + 60_000 });
      return result;
    }

    if (profileResponse.status === 403 || reposResponse.status === 403) {
      const result = unavailable(
        env.github.token
          ? "GitHub rate limit reached. Live activity will return shortly — the curated list below still links to real repositories."
          : "GitHub's unauthenticated rate limit was reached. Add a GITHUB_TOKEN on the server for a higher limit — the curated list below still links to real repositories.",
        rateLimit,
      );
      cache.set(username, { value: result, expiresAt: Date.now() + 60_000 });
      return result;
    }

    if (!profileResponse.ok || !reposResponse.ok) {
      const result = unavailable(
        `GitHub responded with ${profileResponse.status}/${reposResponse.status}. Showing the curated list instead.`,
        rateLimit,
      );
      cache.set(username, { value: result, expiresAt: Date.now() + 120_000 });
      return result;
    }

    const profile = mapProfile((await profileResponse.json()) as RawGithubProfile);
    const repos = ((await reposResponse.json()) as RawGithubRepo[])
      .map(mapRepo)
      .filter((repo) => !repo.fork && !repo.archived);

    const sorted = [...repos].sort((a, b) => {
      if (b.stars !== a.stars) return b.stars - a.stars;
      return (b.pushedAt ?? "").localeCompare(a.pushedAt ?? "");
    });

    const result: GithubActivity = {
      available: true,
      username,
      profile,
      repos: sorted,
      languages: summariseLanguages(sorted),
      rateLimit,
      fetchedAt: new Date().toISOString(),
      cached: false,
    };

    cache.set(username, {
      value: result,
      expiresAt: Date.now() + env.github.cacheTtl,
    });
    return result;
  } catch (error) {
    const reason = error instanceof Error ? error.message : "unknown error";
    return unavailable(
      `Could not reach GitHub (${reason}). Showing the curated list instead.`,
    );
  }
}
