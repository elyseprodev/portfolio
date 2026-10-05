"use client";

/**
 * ELYSE DEV — route error boundary.
 *
 * Catches rendering errors in any route segment and shows a branded recovery
 * screen. `reset()` re-renders the segment, so the visitor can retry without a
 * full reload; the digest is shown for support without leaking stack traces.
 */
import { useEffect } from "react";

import { Button } from "@/components/ui/Button";
import { PageContainer, Section } from "@/components/layout/PageContainer";
import { AlertIcon, ArrowRightIcon } from "@/components/ui/icons";

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Logged locally; production error reporting can be attached here.
    console.error("[client] route error:", error.message);
  }, [error]);

  return (
    <Section spacing={false} className="pt-10 pb-20">
      <PageContainer narrow>
        <div className="glass glass-edge rounded-glass-lg px-6 py-12 text-center sm:px-10">
          <span
            aria-hidden="true"
            className="mx-auto grid size-14 place-items-center rounded-2xl border border-amber-400/30 bg-amber-500/10 text-amber-200"
          >
            <AlertIcon width={26} height={26} />
          </span>

          <h1 className="mt-6 text-h2 font-semibold text-white">
            Something went wrong on this page
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm text-text-secondary pretty-text">
            The rest of the site is unaffected. Try again — and if it keeps
            failing, the contact page is the quickest way to tell me about it.
          </p>

          {error.digest ? (
            <p className="mt-4 font-mono text-caption text-text-muted">
              Reference: {error.digest}
            </p>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="btn btn-primary"
            >
              Try again
              <ArrowRightIcon width={16} height={16} />
            </button>
            <Button href="/" variant="glass">
              Back to home
            </Button>
          </div>
        </div>
      </PageContainer>
    </Section>
  );
}
