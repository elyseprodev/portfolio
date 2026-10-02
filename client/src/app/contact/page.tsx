import type { Metadata } from "next";

import { PageContainer, Section } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Pill } from "@/components/ui/Badges";
import { ContactForm } from "@/components/contact/ContactForm";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { CheckIcon, GitHubIcon, MailIcon } from "@/components/ui/icons";
import { loadProfile, loadServiceStatus } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";
import { githubHandle } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "Contact Elyse Dev (ELYSE DEV) about collaborations, freelance work, development roles or questions. Messages are validated and stored by the portfolio's own API.",
  path: "/contact",
  keywords: ["hire full-stack developer Rwanda", "contact developer"],
});

export default async function ContactPage() {
  const [{ data: profile }, status] = await Promise.all([
    loadProfile(),
    loadServiceStatus(),
  ]);

  const emailConfigured = Boolean(status.integrations?.emailNotifications);

  return (
    <>
      <PageHeader
        overline="Contact"
        title={
          <>
            Tell me what you are building
            <span className="text-accent-gradient"> — let&apos;s see if I fit</span>
          </>
        }
        description={profile.availability}
        aside={
          <SpotlightCard className="w-full max-w-sm" padding="lg">
            <h2 className="text-h4 font-semibold text-white">Where to find me</h2>
            <ul className="mt-4 space-y-3 text-sm text-text-secondary">
              <li className="flex items-start gap-3">
                <GitHubIcon width={17} height={17} className="mt-0.5 text-brand-300" />
                <span>
                  <span className="block text-white">GitHub</span>
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-brand-300 hover:text-brand-200"
                  >
                    {githubHandle(profile.github)}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MailIcon width={17} height={17} className="mt-0.5 text-brand-300" />
                <span>
                  <span className="block text-white">E-mail</span>
                  {profile.email ? (
                    <a
                      href={`mailto:${profile.email}`}
                      className="break-all text-brand-300 hover:text-brand-200"
                    >
                      {profile.email}
                    </a>
                  ) : (
                    <span className="text-text-muted">
                      Not published yet — the form below is the reliable route.
                    </span>
                  )}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="mt-1.5 size-2 shrink-0 rounded-full bg-brand-500"
                />
                <span>
                  <span className="block text-white">Based in</span>
                  <span className="text-text-muted">
                    {profile.location} · remote-friendly
                  </span>
                </span>
              </li>
            </ul>

            <div className="hairline my-5" />

            <p className="text-caption text-text-muted">
              {status.reachable
                ? status.status === "degraded"
                  ? "The message API is online; the database reports a degraded state, so messages are stored in the local fallback store."
                  : "The message API and database are online."
                : "The message API is offline right now, so the form will tell you if it cannot store your message rather than pretending it succeeded."}
            </p>
          </SpotlightCard>
        }
      />

      <Section aria-labelledby="form-title" className="pt-0">
        <PageContainer>
          <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
            <RevealOnScroll>
              <h2 id="form-title" className="sr-only">
                Contact form
              </h2>
              <ContactForm />
            </RevealOnScroll>

            <div className="space-y-5">
              <RevealOnScroll delay={80}>
                <SpotlightCard padding="lg">
                  <h2 className="text-h4 font-semibold text-white">
                    What happens to your message
                  </h2>
                  <ul className="mt-4 space-y-3 text-sm text-text-secondary">
                    {[
                      "The browser validates it, then the server validates it again with Zod — client checks are for your convenience, not the security boundary.",
                      status.reachable
                        ? "It is stored in the portfolio database through a repository interface (MongoDB when configured, a local JSON store otherwise)."
                        : "The API is offline, so the form will report that it could not store your message.",
                      emailConfigured
                        ? "An e-mail notification is sent to me as well."
                        : "E-mail notifications are not configured on this deployment, so a reply is not automatic — but the message is stored and readable through the API.",
                      "Only a salted, non-reversible fingerprint is kept for abuse throttling. No raw IP address is stored, and there is no third-party tracking on this page.",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <span
                          aria-hidden="true"
                          className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-500/15 text-brand-300"
                        >
                          <CheckIcon width={12} height={12} />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </SpotlightCard>
              </RevealOnScroll>

              <RevealOnScroll delay={150}>
                <SpotlightCard padding="lg">
                  <h2 className="text-h4 font-semibold text-white">
                    Faster than a form
                  </h2>
                  <p className="mt-3 text-sm text-text-secondary pretty-text">
                    If your question is about code I have written, the GitHub
                    profile is usually the quickest route — you can see the work
                    and open an issue or discussion directly.
                  </p>
                  <SocialLinks
                    github={profile.github}
                    email={profile.email || undefined}
                    className="mt-4 flex flex-wrap items-center gap-2"
                  />
                </SpotlightCard>
              </RevealOnScroll>

              <RevealOnScroll delay={210}>
                <div className="glass-subtle rounded-glass p-5">
                  <Pill tone="muted">Response expectation</Pill>
                  <p className="mt-3 text-sm text-text-secondary pretty-text">
                    I read everything. If your message is a genuine enquiry about
                    work, I will reply with either a clear yes or a clear no —
                    silence is not an answer I like receiving either.
                  </p>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </PageContainer>
      </Section>
    </>
  );
}
