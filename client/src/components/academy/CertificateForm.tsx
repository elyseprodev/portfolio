"use client";

import { useState } from "react";

import { CertificateDocument } from "@/components/academy/CertificateDocument";
import { Button } from "@/components/ui/Button";
import type { Certificate, CourseStatus } from "@elyse/database/types";

/**
 * What the form actually needs from a course. Deliberately not the whole
 * record: this component is a client component, and everything passed to it is
 * serialised into the page's HTML.
 */
export interface CourseOption {
  slug: string;
  language: string;
  hours: number;
  status: CourseStatus;
}

type Status =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "issued"; certificate: Certificate }
  | { state: "error"; message: string };

/**
 * ELYSE DEV — certificate issuance.
 *
 * The form posts to the same-origin proxy (`/api/academy/certificates`), which
 * forwards to the API. Validation and rate limiting live on the server — the
 * client only checks the obvious things so a visitor sees an answer instantly.
 *
 * The result renders as a real certificate document with a print button, and it
 * stays on screen while the code is verified.
 */
export function CertificateForm({ courses }: { courses: CourseOption[] }) {
  const available = courses.filter((course) => course.status === "available");
  const upcoming = courses.filter((course) => course.status !== "available");

  const [studentName, setStudentName] = useState("");
  const [courseSlug, setCourseSlug] = useState(available[0]?.slug ?? courses[0]?.slug ?? "");
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [fieldError, setFieldError] = useState<string | null>(null);

  const selected = courses.find((course) => course.slug === courseSlug);
  const isSample = selected ? selected.status !== "available" : false;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldError(null);

    if (studentName.trim().length < 2) {
      setFieldError("Please enter the name that should appear on the certificate.");
      return;
    }
    if (!courseSlug) {
      setFieldError("Please choose a course.");
      return;
    }

    setStatus({ state: "submitting" });
    try {
      const response = await fetch("/api/academy/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentName: studentName.trim(), courseSlug }),
      });
      const payload = (await response.json()) as
        | { data: Certificate }
        | { error: { message: string } };

      if (response.ok && "data" in payload) {
        setStatus({ state: "issued", certificate: payload.data });
        return;
      }

      setStatus({
        state: "error",
        message:
          "error" in payload && payload.error?.message
            ? payload.error.message
            : "The certificate could not be issued right now. Please try again shortly.",
      });
    } catch {
      setStatus({
        state: "error",
        message: "The certificate service could not be reached. Please try again in a moment.",
      });
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
      <form
        onSubmit={handleSubmit}
        className="glass glass-edge rounded-glass-lg p-6 sm:p-7"
        aria-labelledby="certificate-form-title"
        noValidate
      >
        <h3 id="certificate-form-title" className="text-h4 font-semibold text-white">
          Issue a certificate
        </h3>
        <p className="mt-2 text-sm text-text-muted">
          One name, one course, one code anyone can verify. Nothing else is stored.
        </p>

        <div className="mt-6 space-y-5">
          <div>
            <label htmlFor="student-name" className="text-sm font-medium text-text-secondary">
              Name on the certificate
            </label>
            <input
              id="student-name"
              name="studentName"
              type="text"
              autoComplete="name"
              required
              maxLength={80}
              value={studentName}
              onChange={(event) => setStudentName(event.target.value)}
              aria-describedby="student-name-help"
              className="mt-2 w-full rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3 text-white placeholder:text-text-muted focus-visible:border-brand-400/60 focus-visible:outline-none"
              placeholder="e.g. Amina Kayitesi"
            />
            <p id="student-name-help" className="mt-1.5 text-caption text-text-muted">
              Use the name you want a reader to see — any script is fine.
            </p>
          </div>

          <div>
            <label htmlFor="course-slug" className="text-sm font-medium text-text-secondary">
              Course
            </label>
            <select
              id="course-slug"
              name="courseSlug"
              value={courseSlug}
              onChange={(event) => setCourseSlug(event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3 text-white focus-visible:border-brand-400/60 focus-visible:outline-none"
            >
              <optgroup label="Available now">
                {available.map((course) => (
                  <option key={course.slug} value={course.slug}>
                    {course.language} — {course.hours}h
                  </option>
                ))}
              </optgroup>
              <optgroup label="Curriculum published, lessons in production">
                {upcoming.map((course) => (
                  <option key={course.slug} value={course.slug}>
                    {course.language} — sample certificate
                  </option>
                ))}
              </optgroup>
            </select>
            {isSample ? (
              <p className="mt-2 text-caption text-amber-200/90">
                {selected?.language} is not marked complete yet, so this is issued as a clearly
                labelled <strong>sample</strong> certificate.
              </p>
            ) : null}
          </div>

          {fieldError ? (
            <p role="alert" className="text-sm text-amber-200">
              {fieldError}
            </p>
          ) : null}

          <Button type="submit" variant="primary" disabled={status.state === "submitting"}>
            {status.state === "submitting" ? "Issuing…" : "Issue certificate"}
          </Button>

          {status.state === "error" ? (
            <p role="alert" className="text-sm text-amber-200">
              {status.message}
            </p>
          ) : null}
        </div>
      </form>

      <div aria-live="polite">
        {status.state === "issued" ? (
          <>
            <CertificateDocument certificate={status.certificate} />
            <div className="mt-5 flex flex-wrap gap-3">
              <Button variant="glass" onClick={() => window.print()}>
                Print or save as PDF
              </Button>
              <Button variant="glass" href={`/certificate/${status.certificate.code}`}>
                Open the verification page
              </Button>
            </div>
          </>
        ) : (
          <div className="glass glass-edge rounded-glass-lg p-6 sm:p-7">
            <h3 className="text-h4 font-semibold text-white">How it works</h3>
            <ol className="mt-4 space-y-3 text-sm text-text-secondary">
              <li className="flex gap-3">
                <span className="font-display-numeric text-brand-300">1</span>
                Enter the name to print and choose a course.
              </li>
              <li className="flex gap-3">
                <span className="font-display-numeric text-brand-300">2</span>
                The API validates the request, applies a rate limit and issues a code such as{" "}
                <span className="font-mono text-text-primary">EDA-KM3P-9RTU</span>.
              </li>
              <li className="flex gap-3">
                <span className="font-display-numeric text-brand-300">3</span>
                Anyone can paste that code into the verify field to confirm the record — no
                account required.
              </li>
            </ol>
            <p className="mt-5 border-t border-white/8 pt-4 text-caption text-text-muted">
              Courses marked &ldquo;in development&rdquo; issue a labelled sample certificate:
              the curriculum is published, the graded work is not.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
