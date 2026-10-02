"use client";

/**
 * ELYSE DEV — contact form.
 *
 * • Client-side validation for immediate feedback, server validation as the
 *   source of truth (errors are mapped back onto the right fields).
 * • Honest states: submitting, stored, rate-limited, validation failed, or the
 *   message service being unreachable. It never shows "sent!" when nothing was
 *   stored, and it does explain the e-mail notification state.
 * • Accessible: labelled controls, `aria-invalid`, `aria-describedby`, a
 *   role="alert" error summary and focus moved to the first invalid field.
 */
import { useId, useRef, useState } from "react";

import {
  MESSAGE_MAX,
  contactTopics,
  emptyContactForm,
  validateContactForm,
  type ContactErrors,
  type ContactField,
  type ContactFormValues,
} from "@/lib/validation";
import {
  AlertIcon,
  ArrowRightIcon,
  CheckIcon,
  SpinnerIcon,
} from "@/components/ui/icons";
import { cn } from "@/lib/utils";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | {
      kind: "success";
      id: string;
      receivedAt: string;
      notification: "sent" | "not-configured" | "failed";
      notificationDetail?: string;
    }
  | { kind: "error"; message: string; fieldErrors?: { field: string; message: string }[] };

const FIELD_ORDER: ContactField[] = ["name", "email", "subject", "topic", "message"];

export function ContactForm() {
  const formId = useId();
  const formRef = useRef<HTMLFormElement | null>(null);
  const summaryRef = useRef<HTMLDivElement | null>(null);

  const [values, setValues] = useState<ContactFormValues>(emptyContactForm);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({});

  const update =
    (field: ContactField) =>
    (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
      const value = event.target.value;
      setValues((current) => ({ ...current, [field]: value }));
      if (touched[field] || errors[field]) {
        const nextErrors = validateContactForm({ ...values, [field]: value });
        setErrors((current) => ({ ...current, [field]: nextErrors[field] }));
      }
    };

  const blur = (field: ContactField) => () => {
    setTouched((current) => ({ ...current, [field]: true }));
    const nextErrors = validateContactForm(values);
    setErrors((current) => ({ ...current, [field]: nextErrors[field] }));
  };

  const focusField = (field: ContactField) => {
    const element = formRef.current?.querySelector<HTMLElement>(`[name="${field}"]`);
    element?.focus();
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Honeypot: a human never fills this hidden field.
    if (values.company.trim().length > 0) {
      setStatus({ kind: "success", id: "ignored", receivedAt: new Date().toISOString(), notification: "not-configured" });
      return;
    }

    const nextErrors = validateContactForm(values);
    setErrors(nextErrors);
    setTouched(
      Object.fromEntries(FIELD_ORDER.map((field) => [field, true])) as Record<
        ContactField,
        boolean
      >,
    );

    const firstInvalid = FIELD_ORDER.find((field) => nextErrors[field]);
    if (firstInvalid) {
      setStatus({
        kind: "error",
        message: "Please correct the highlighted fields and try again.",
      });
      focusField(firstInvalid);
      summaryRef.current?.focus();
      return;
    }

    setStatus({ kind: "submitting" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          subject: values.subject.trim(),
          topic: values.topic,
          message: values.message.trim(),
          company: values.company,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | {
            data?: {
              status: string;
              id: string;
              receivedAt: string;
              notification: "sent" | "not-configured" | "failed";
            };
            meta?: { notificationDetail?: string };
            error?: { code: string; message: string; details?: { field: string; message: string }[] };
          }
        | null;

      if (response.ok && payload?.data) {
        setStatus({
          kind: "success",
          id: payload.data.id,
          receivedAt: payload.data.receivedAt,
          notification: payload.data.notification,
          ...(payload.meta?.notificationDetail
            ? { notificationDetail: payload.meta.notificationDetail }
            : {}),
        });
        setValues(emptyContactForm);
        setTouched({});
        return;
      }

      const errorPayload = payload?.error;
      const fieldErrors = errorPayload?.details;

      if (fieldErrors?.length) {
        setErrors((current) => {
          const next: ContactErrors = { ...current };
          for (const issue of fieldErrors) {
            const field = FIELD_ORDER.find((candidate) => candidate === issue.field);
            if (field) next[field] = issue.message;
          }
          return next;
        });
        const first = FIELD_ORDER.find((field) =>
          fieldErrors.some((issue) => issue.field === field),
        );
        if (first) focusField(first);
      }

      setStatus({
        kind: "error",
        message:
          errorPayload?.message ??
          "The message could not be stored. Please try again in a moment.",
        ...(fieldErrors ? { fieldErrors } : {}),
      });
      summaryRef.current?.focus();
    } catch {
      setStatus({
        kind: "error",
        message:
          "The message service could not be reached. Check your connection and try again — or reach me on GitHub in the meantime.",
      });
    }
  }

  if (status.kind === "success") {
    return (
      <div className="glass glass-edge rounded-glass-lg p-6 sm:p-8" role="status">
        <span
          aria-hidden="true"
          className="grid size-12 place-items-center rounded-2xl border border-emerald-400/30 bg-emerald-500/12 text-emerald-300"
        >
          <CheckIcon width={22} height={22} />
        </span>

        <h2 className="mt-5 text-h3 font-semibold text-white">
          Your message is stored
        </h2>
        <p className="mt-3 text-sm text-text-secondary pretty-text">
          Reference <span className="font-mono text-brand-200">{status.id.slice(0, 12)}</span>
          {" · "}
          <time dateTime={status.receivedAt}>
            {new Date(status.receivedAt).toLocaleString()}
          </time>
        </p>

        <div
          className={cn(
            "mt-5 rounded-2xl border p-4 text-sm",
            status.notification === "sent"
              ? "border-emerald-400/25 bg-emerald-500/8 text-emerald-100"
              : status.notification === "failed"
                ? "border-amber-400/25 bg-amber-500/8 text-amber-100"
                : "border-white/12 bg-white/4 text-text-secondary",
          )}
        >
          {status.notification === "sent" ? (
            <>An e-mail notification was delivered — expect a reply at the address you provided.</>
          ) : status.notification === "failed" ? (
            <>
              The message is safely stored, but the e-mail notification could not
              be delivered. It will still be read from the dashboard/API.
            </>
          ) : (
            <>
              E-mail notifications are not configured on this deployment yet, so
              no e-mail was sent. The message is safely stored in the database
              and can be read through the API — a reply is not automatic.
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setStatus({ kind: "idle" })}
          className="btn btn-glass mt-6"
        >
          Send another message
          <ArrowRightIcon width={16} height={16} />
        </button>
      </div>
    );
  }

  const submitting = status.kind === "submitting";

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      className="glass glass-edge rounded-glass-lg p-5 sm:p-7"
      aria-labelledby={`${formId}-title`}
    >
      <h2 id={`${formId}-title`} className="text-h3 font-semibold text-white">
        Send me a message
      </h2>
      <p className="mt-2 text-sm text-text-secondary">
        Required fields are marked with an asterisk. I reply to everything that
        is a genuine enquiry.
      </p>

      <div
        ref={summaryRef}
        tabIndex={-1}
        role={status.kind === "error" ? "alert" : undefined}
        aria-live="assertive"
        className={cn("mt-5", status.kind === "error" ? "block" : "hidden")}
      >
        {status.kind === "error" ? (
          <div className="flex items-start gap-3 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">
            <AlertIcon width={18} height={18} className="mt-0.5 shrink-0" />
            <p>{status.message}</p>
          </div>
        ) : null}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field
          id={`${formId}-name`}
          name="name"
          label="Your name"
          required
          value={values.name}
          onChange={update("name")}
          onBlur={blur("name")}
          error={errors.name}
          autoComplete="name"
        />
        <Field
          id={`${formId}-email`}
          name="email"
          type="email"
          label="Email address"
          required
          value={values.email}
          onChange={update("email")}
          onBlur={blur("email")}
          error={errors.email}
          autoComplete="email"
        />
        <Field
          id={`${formId}-subject`}
          name="subject"
          label="Subject"
          required
          value={values.subject}
          onChange={update("subject")}
          onBlur={blur("subject")}
          error={errors.subject}
        />

        <div className="flex flex-col gap-2">
          <label
            htmlFor={`${formId}-topic`}
            className="text-caption font-medium text-text-secondary"
          >
            What is this about?
          </label>
          <select
            id={`${formId}-topic`}
            name="topic"
            value={values.topic}
            onChange={update("topic")}
            className="w-full rounded-2xl border border-white/12 bg-ink-950/60 px-3.5 py-3 text-sm text-white focus:border-brand-500/50 focus:outline-none"
          >
            {contactTopics.map((topic) => (
              <option key={topic.value} value={topic.value} className="bg-ink-900">
                {topic.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <label
          htmlFor={`${formId}-message`}
          className="text-caption font-medium text-text-secondary"
        >
          Message <span aria-hidden="true">*</span>
          <span className="sr-only">(required)</span>
        </label>
        <textarea
          id={`${formId}-message`}
          name="message"
          required
          rows={6}
          maxLength={MESSAGE_MAX}
          value={values.message}
          onChange={update("message")}
          onBlur={blur("message")}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? `${formId}-message-error` : `${formId}-message-hint`}
          className={cn(
            "w-full resize-y rounded-2xl border border-white/12 bg-ink-950/60 px-3.5 py-3 text-sm text-white placeholder:text-text-muted focus:border-brand-500/50 focus:outline-none",
            errors.message && "border-red-400/60",
          )}
          placeholder="What are you building, and what would you like help with?"
        />
        <div className="flex items-center justify-between gap-3">
          {errors.message ? (
            <p id={`${formId}-message-error`} className="text-caption text-red-300">
              {errors.message}
            </p>
          ) : (
            <p id={`${formId}-message-hint`} className="text-caption text-text-muted">
              The more context you give, the more useful my reply will be.
            </p>
          )}
          <p className="text-caption text-text-muted">
            {values.message.length}/{MESSAGE_MAX}
          </p>
        </div>
      </div>

      {/* Honeypot: invisible to humans, tempting to bots. */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor={`${formId}-company`}>Company (leave empty)</label>
        <input
          id={`${formId}-company`}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.company}
          onChange={(event) =>
            setValues((current) => ({ ...current, company: event.target.value }))
          }
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? (
            <>
              <SpinnerIcon width={16} height={16} />
              Sending…
            </>
          ) : (
            <>
              Send message
              <ArrowRightIcon width={16} height={16} />
            </>
          )}
        </button>

        <p className="text-caption text-text-muted">
          Stored in the portfolio database. No third-party tracking.
        </p>
      </div>
    </form>
  );
}

interface FieldProps {
  id: string;
  name: ContactField;
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  error?: string;
  required?: boolean;
  type?: string;
  autoComplete?: string;
}

function Field({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  required,
  type = "text",
  autoComplete,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-caption font-medium text-text-secondary">
        {label} {required ? <span aria-hidden="true">*</span> : null}
        {required ? <span className="sr-only">(required)</span> : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          "w-full rounded-2xl border border-white/12 bg-ink-950/60 px-3.5 py-3 text-sm text-white placeholder:text-text-muted focus:border-brand-500/50 focus:outline-none",
          error && "border-red-400/60",
        )}
      />
      {error ? (
        <p id={`${id}-error`} className="text-caption text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}
