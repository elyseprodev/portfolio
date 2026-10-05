"use client";

/**
 * ELYSE DEV — development activity panel.
 *
 * Live GitHub data when the API and GitHub both answer; otherwise an honest
 * explanation plus the curated list of real repositories. No contribution
 * graphs, streak counters or totals are ever synthesised.
 */
import { useCallback, useState } from "react";

import { Pill } from "@/components/ui/Badges";
import { GitHubIcon, ExternalLinkIcon, SpinnerIcon } from "@/components/ui/icons";
import type { GithubActivityPayload } from "@/lib/github";
import { cn, compactNumber, formatDate } from "@/lib/utils";

interface GitHubActivityPanelProps {
  initial: GithubActivityPayload | null;
  /** Real repositories worth surfacing even when the API is down. */
  curated: { name: string; description: string; href: string }[];
  profileHref: string;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  PHP: "#4F5D95",
  CSS: "#563d7c",
  HTML: "#e34c26",
  Python: "#3572A5",
  Java: "#b07219",
  C: "#555555",
  "C++": "#f34b7d",
  Shell: "#89e051",
  Dart: "#00B4AB",
  Ruby: "#701516",
  Go: "#00ADD8",
};

export function GitHubActivityPanel({
  initial,
  curated,
  profileHref,
}: GitHubActivityPanelProps) {
  const [activity, setActivity] = useState<GithubActivityPayload | null>(initial);
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setState("loading");
    setError(null);
    try {
      const response = await fetch("/api/github?refresh=1", { cache: "no-store" });
      const payload = (await response.json()) as
        | { data: GithubActivityPayload }
        | { error: { message: string } };

      if (!response.ok || !("data" in payload)) {
        setActivity(null);
        setState("error");
        setError(
          "error" in payload
            ? payload.error.message
            : "The activity API did not answer. Showing the curated list instead.",
        );
        return;
      }

      setActivity(payload.data);
      setState("idle");
    } catch {
      setActivity(null);
      setState("error");
      setError(
        "Could not reach the activity API. Showing the curated list instead.",
      );
    }
  }, []);

  const live = activity?.available ? activity : null;
  const notice = live ? null : (error ?? activity?.reason ?? null);

  return (
    <div className="space-y-5">
      {/* Status + refresh */}
      <div className="glass-subtle flex flex-wrap items-center justify-between gap-3 rounded-glass p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Pill tone={live ? "brand" : "muted"}>
            {live ? "Live GitHub data" : "Curated list"}
          </Pill>
          {live?.fetchedAt ? (
            <span className="text-caption text-text-muted">
              Fetched {formatDate(live.fetchedAt)}
              {live.cached ? " (cached)" : ""}
            </span>
          ) : null}
          {live?.rateLimit.remaining !== null && live ? (
            <span className="text-caption text-text-muted">
              API requests remaining: {live.rateLimit.remaining}
            </span>
          ) : null}
        </div>

        <button
          type="button"
          onClick={refresh}
          disabled={state === "loading"}
          className="btn btn-glass !min-h-9 !px-3.5 !text-[0.8rem]"
        >
          {state === "loading" ? (
            <>
              <SpinnerIcon width={15} height={15} />
              Refreshing…
            </>
          ) : (
            <>
              <GitHubIcon width={15} height={15} />
              Refresh activity
            </>
          )}
        </button>
      </div>

      {notice ? (
        <div className="rounded-glass border border-amber-400/25 bg-amber-500/8 p-4 text-sm text-amber-100">
          <p className="font-medium">Why you are not seeing live activity</p>
          <p className="mt-1.5 text-amber-100/85">{notice}</p>
        </div>
      ) : null}

      {/* Profile summary */}
      {live?.profile ? (
        <div className="glass glass-edge grid gap-5 rounded-glass p-5 sm:grid-cols-[auto_1fr] sm:p-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={live.profile.avatarUrl}
            alt={`${live.profile.login} on GitHub`}
            width={72}
            height={72}
            loading="lazy"
            className="size-16 rounded-2xl border border-white/12 object-cover sm:size-18"
          />
          <div>
            <p className="text-h4 font-semibold text-white">
              {live.profile.name ?? live.profile.login}
            </p>
            <p className="mt-1 font-mono text-caption text-brand-300">
              @{live.profile.login}
            </p>
            {live.profile.bio ? (
              <p className="mt-3 text-sm text-text-secondary">{live.profile.bio}</p>
            ) : null}
            <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <div>
                <dt className="text-caption text-text-muted">Public repositories</dt>
                <dd className="font-medium text-white">
                  {compactNumber(live.profile.publicRepos)}
                </dd>
              </div>
              <div>
                <dt className="text-caption text-text-muted">Followers</dt>
                <dd className="font-medium text-white">
                  {compactNumber(live.profile.followers)}
                </dd>
              </div>
              <div>
                <dt className="text-caption text-text-muted">On GitHub since</dt>
                <dd className="font-medium text-white">
                  {formatDate(live.profile.createdAt)}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      ) : null}

      {/* Language mix — real aggregation of repository languages */}
      {live && live.languages.length ? (
        <div className="glass rounded-glass p-5 sm:p-6">
          <h3 className="text-h4 font-semibold text-white">
            Languages across public repositories
          </h3>
          <p className="mt-2 text-caption text-text-muted">
            Counted from primary repository languages — not a claimed
            proficiency score.
          </p>
          <ul className="mt-5 space-y-3">
            {live.languages.slice(0, 6).map((language) => {
              const total = live.languages.reduce((sum, item) => sum + item.repos, 0);
              const share = Math.round((language.repos / total) * 100);
              return (
                <li key={language.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">{language.name}</span>
                    <span className="text-text-muted">
                      {language.repos} repo{language.repos === 1 ? "" : "s"} · {share}%
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/8">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.max(share, 3)}%`,
                        backgroundColor:
                          LANGUAGE_COLORS[language.name] ?? "#f97316",
                        opacity: 0.85,
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      {/* Repository list */}
      <div>
        <h3 className="text-h4 font-semibold text-white">
          {live ? "Most recent repositories" : "Repositories I can point to"}
        </h3>
        <p className="mt-2 text-caption text-text-muted">
          {live
            ? "Fetched live from the GitHub API and filtered to non-fork, non-archived repositories."
            : "Links below are real, verifiable repositories."}
        </p>

        <ul className="mt-5 grid gap-4 md:grid-cols-2">
          {(live ? live.repos.slice(0, 6) : []).map((repo) => (
            <li key={repo.fullName}>
              <a
                href={repo.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glass glass-interactive block h-full rounded-glass p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-mono text-sm font-medium text-white">
                    {repo.name}
                  </p>
                  <ExternalLinkIcon width={16} height={16} className="text-text-muted" />
                </div>
                <p className="mt-3 min-h-10 text-sm text-text-secondary">
                  {repo.description ?? "No description provided."}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-caption text-text-muted">
                  {repo.language ? (
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        aria-hidden="true"
                        className="size-2 rounded-full"
                        style={{
                          backgroundColor: LANGUAGE_COLORS[repo.language] ?? "#f97316",
                        }}
                      />
                      {repo.language}
                    </span>
                  ) : null}
                  <span>★ {repo.stars}</span>
                  <span>⑂ {repo.forks}</span>
                  {repo.pushedAt ? (
                    <span>Updated {formatDate(repo.pushedAt)}</span>
                  ) : null}
                </div>
              </a>
            </li>
          ))}
        </ul>

        {!live ? (
          <ul className="mt-5 grid gap-4 md:grid-cols-2">
            {curated.map((repo) => (
              <li key={repo.href}>
                <a
                  href={repo.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass glass-interactive block h-full rounded-glass p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-mono text-sm font-medium text-white">
                      {repo.name}
                    </p>
                    <ExternalLinkIcon width={16} height={16} className="text-text-muted" />
                  </div>
                  <p className="mt-3 text-sm text-text-secondary">
                    {repo.description}
                  </p>
                </a>
              </li>
            ))}
          </ul>
        ) : null}

        <div className={cn("mt-6 flex flex-wrap gap-3")}>
          <a
            href={profileHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            <GitHubIcon width={17} height={17} />
            Open my GitHub profile
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </div>
    </div>
  );
}
