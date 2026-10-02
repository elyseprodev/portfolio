"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";

/**
 * ELYSE DEV — certificate verification lookup.
 *
 * Sends the visitor to the server-rendered verification page
 * (`/certificate/<CODE>`), which is where the record is actually read. Keeping
 * the lookup as a navigation means a verified certificate has a URL someone can
 * share, and the verification itself stays server-side.
 */
export function VerifyForm({ initialCode = "" }: { initialCode?: string }) {
  const router = useRouter();
  const [code, setCode] = useState(initialCode);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleaned = code.trim().toUpperCase().replace(/\s+/g, "");
    const body = cleaned.startsWith("EDA") ? cleaned : `EDA-${cleaned}`;

    if (cleaned.replace(/[^A-Z0-9]/g, "").length < 8) {
      setError("A verification code looks like EDA-KM3P-9RTU.");
      return;
    }

    setError(null);
    setPending(true);
    router.push(`/certificate/${encodeURIComponent(body)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="glass glass-edge rounded-glass-lg p-6 sm:p-7" noValidate>
      <h3 className="text-h4 font-semibold text-white">Verify a code</h3>
      <p className="mt-2 text-sm text-text-muted">
        Paste the code from the bottom of a certificate to read its record.
      </p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="verify-code" className="sr-only">
            Verification code
          </label>
          <input
            id="verify-code"
            name="code"
            type="text"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            inputMode="text"
            autoCapitalize="characters"
            spellCheck={false}
            placeholder="EDA-KM3P-9RTU"
            aria-describedby={error ? "verify-code-error" : "verify-code-help"}
            className="w-full rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3 font-mono text-white placeholder:text-text-muted focus-visible:border-brand-400/60 focus-visible:outline-none"
          />
          <p id="verify-code-help" className="mt-1.5 text-caption text-text-muted">
            Lower case is fine — the code is normalised before it is looked up.
          </p>
        </div>
        <div className="sm:pt-0.5">
          <Button type="submit" variant="primary" disabled={pending}>
            {pending ? "Checking…" : "Verify"}
          </Button>
        </div>
      </div>

      {error ? (
        <p id="verify-code-error" role="alert" className="mt-3 text-sm text-amber-200">
          {error}
        </p>
      ) : null}
    </form>
  );
}
