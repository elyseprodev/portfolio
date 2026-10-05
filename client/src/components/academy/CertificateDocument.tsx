import type { Certificate } from "@elyse/database/types";

import { cn } from "@/lib/utils";

/**
 * ELYSE DEV — the certificate itself.
 *
 * Rendered as a real document rather than a screenshot of one: it prints
 * cleanly (see `.certificate-print` in globals.css), it scales on a phone, and
 * every field on it comes from the stored record, not from the page.
 *
 * Honesty rule: a certificate for a course that is not marked available is
 * issued with `kind: "sample"` and is drawn with a visible SAMPLE label. A
 * sample is never presented as a completed qualification.
 */
export function CertificateDocument({
  certificate,
  className,
  id = "certificate-document",
}: {
  certificate: Certificate;
  className?: string;
  id?: string;
}) {
  const issued = new Date(certificate.issuedAt);
  const issuedLabel = Number.isNaN(issued.getTime())
    ? certificate.issuedAt
    : issued.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

  const isSample = certificate.kind === "sample";

  return (
    <figure
      id={id}
      className={cn(
        "certificate-print glass glass-edge relative overflow-hidden rounded-glass-lg p-6 sm:p-9",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-16 size-64 rounded-full bg-brand-500/10 blur-3xl"
      />

      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="font-display-numeric grid size-12 place-items-center rounded-2xl border border-brand-500/30 bg-brand-500/10 text-lg font-bold text-brand-300"
          >
            ED
          </span>
          <div>
            <p className="text-caption tracking-[0.24em] text-text-muted uppercase">
              Elyse Dev Academy
            </p>
            <p className="text-sm text-text-secondary">
              {isSample ? "Sample certificate" : "Certificate of completion"}
            </p>
          </div>
        </div>

        {isSample ? (
          <span className="rounded-full border border-amber-400/40 bg-amber-500/12 px-3 py-1 text-caption text-amber-200">
            SAMPLE — course in progress
          </span>
        ) : (
          <span className="rounded-full border border-emerald-400/35 bg-emerald-500/12 px-3 py-1 text-caption text-emerald-200">
            Verified
          </span>
        )}
      </div>

      <div className="relative mt-8">
        <p className="text-caption tracking-[0.2em] text-text-muted uppercase">
          This certifies that
        </p>
        <p className="font-display-numeric mt-2 text-3xl font-bold text-white sm:text-4xl">
          {certificate.studentName}
        </p>

        <p className="mt-5 max-w-xl text-sm text-text-secondary pretty-text">
          {isSample
            ? "has begun the curriculum below and, on completion, will be issued a certificate of completion for"
            : "has completed the curriculum, the module exercises and the capstone project for"}
        </p>
        <p className="mt-1 text-h3 font-semibold text-brand-300">
          {certificate.courseTitle}
        </p>
      </div>

      <dl className="relative mt-8 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-4">
        <div>
          <dt className="text-[0.66rem] tracking-[0.14em] text-text-muted uppercase">
            Verification code
          </dt>
          <dd className="font-mono text-sm font-medium text-white">{certificate.code}</dd>
        </div>
        <div>
          <dt className="text-[0.66rem] tracking-[0.14em] text-text-muted uppercase">
            Issued
          </dt>
          <dd className="text-sm text-text-secondary">{issuedLabel}</dd>
        </div>
        <div>
          <dt className="text-[0.66rem] tracking-[0.14em] text-text-muted uppercase">
            Curriculum
          </dt>
          <dd className="font-display-numeric text-sm text-text-secondary">
            {certificate.hours} hours · {certificate.moduleCount} modules
          </dd>
        </div>
        <div>
          <dt className="text-[0.66rem] tracking-[0.14em] text-text-muted uppercase">
            Verify at
          </dt>
          <dd className="text-sm text-text-secondary">
            <span className="font-mono">/certificate/{certificate.code}</span>
          </dd>
        </div>
      </dl>

      <figcaption className="relative mt-6 border-t border-white/8 pt-4 text-caption text-text-muted">
        Every certificate carries a unique code that anyone can check on this
        site. No email address, account or personal detail beyond the name on
        the certificate is stored.
      </figcaption>
    </figure>
  );
}
