import type { Metadata } from "next";

import { PageContainer, Section } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Button } from "@/components/ui/Button";
import { Pill, SourceBadge } from "@/components/ui/Badges";
import { ExperienceTimeline } from "@/components/sections/ExperienceTimeline";
import { ArrowRightIcon, GraduationIcon, ShieldIcon } from "@/components/ui/icons";
import { confirmedExperience } from "@/content/experience";
import { loadExperience } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Experience & learning journey",
  description:
    "The development journey of Elyse Dev: full-stack project work, self-directed learning across the JavaScript and PHP ecosystems, and an ongoing cybersecurity learning track.",
  path: "/experience",
  keywords: ["developer learning journey", "full-stack experience Rwanda"],
});

export default async function ExperiencePage() {
  const { data: experience, source, backend } = await loadExperience();
  const pending = experience.filter((entry) => entry.isPlaceholder);

  return (
    <>
      <PageHeader
        overline="Experience & learning"
        title={
          <>
            Where I have been,
            <span className="text-accent-gradient"> where I am going</span>
          </>
        }
        description="A timeline of the work I can stand behind — project work, deliberate self-directed learning and the security knowledge I am building on top. Slots that need information only I can supply are marked as placeholders rather than filled with guesses."
        actions={
          <>
            <Button
              href="/projects"
              variant="primary"
              icon={<ArrowRightIcon width={16} height={16} />}
            >
              See the projects behind this
            </Button>
            <Button href="/contact" variant="glass">
              Get in touch
            </Button>
          </>
        }
        aside={
          <SpotlightCard className="w-full max-w-xs" padding="lg">
            <p className="text-[0.66rem] tracking-[0.14em] text-text-muted uppercase">
              Timeline
            </p>
            <p className="mt-3 text-3xl font-semibold text-white">
              {confirmedExperience.length}
            </p>
            <p className="mt-1 text-sm text-text-secondary">
              documented entries in your journey
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Pill tone="brand">{pending.length} placeholders</Pill>
            </div>
            <SourceBadge source={source} backend={backend} className="mt-5" />
          </SpotlightCard>
        }
      />

      <Section aria-labelledby="timeline-title" className="pt-0">
        <PageContainer>
          <RevealOnScroll>
            <SectionHeading
              id="timeline-title"
              overline="Timeline"
              title="How this developer was built"
              description="Ordered from current focus backwards. Every claim here is something I did; anything that still needs verifying lives in the placeholder panel at the bottom."
            />
          </RevealOnScroll>

          <div className="mt-12">
            <ExperienceTimeline entries={experience} />
          </div>
        </PageContainer>
      </Section>

      <Section aria-labelledby="learning-title" className="pt-0 pb-16">
        <PageContainer>
          <RevealOnScroll>
            <SectionHeading
              id="learning-title"
              overline="Ongoing learning"
              title="What I am studying right now"
              description="Learning is part of the work, not a separate hobby — anything I study is applied to a project within the same month."
            />
          </RevealOnScroll>

          <ul className="mt-10 grid gap-5 md:grid-cols-2">
            <RevealOnScroll as="li" className="h-full">
              <SpotlightCard className="h-full" padding="lg" edge>
                <span
                  aria-hidden="true"
                  className="grid size-11 place-items-center rounded-xl border border-brand-500/25 bg-brand-500/10 text-brand-300"
                >
                  <ShieldIcon width={20} height={20} />
                </span>
                <h3 className="mt-5 text-h4 font-semibold text-white">
                  Cybersecurity fundamentals
                </h3>
                <p className="mt-3 text-sm text-text-secondary pretty-text">
                  Secure authentication and authorisation patterns, input
                  validation, and the OWASP categories behind the most common web
                  vulnerabilities. I practise by hardening my own APIs — the one
                  behind this site validates every request and reports failures
                  honestly.
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {["Auth patterns", "Input validation", "Rate limiting", "OWASP basics"].map(
                    (item) => (
                      <li key={item}>
                        <span className="chip">{item}</span>
                      </li>
                    ),
                  )}
                </ul>
              </SpotlightCard>
            </RevealOnScroll>

            <RevealOnScroll as="li" delay={110} className="h-full">
              <SpotlightCard className="h-full" padding="lg" edge>
                <span
                  aria-hidden="true"
                  className="grid size-11 place-items-center rounded-xl border border-brand-500/25 bg-brand-500/10 text-brand-300"
                >
                  <GraduationIcon width={20} height={20} />
                </span>
                <h3 className="mt-5 text-h4 font-semibold text-white">
                  Deeper full-stack engineering
                </h3>
                <p className="mt-3 text-sm text-text-secondary pretty-text">
                  Typed JavaScript with TypeScript, better API design, database
                  indexing and query performance, and testing my own endpoints
                  rather than only clicking through them. This portfolio is the
                  sandbox: shared types, a validated API and fourteen automated
                  API tests that run on every change.
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {["TypeScript", "API design", "Testing", "MongoDB indexes"].map((item) => (
                    <li key={item}>
                      <span className="chip">{item}</span>
                    </li>
                  ))}
                </ul>
              </SpotlightCard>
            </RevealOnScroll>
          </ul>
        </PageContainer>
      </Section>
    </>
  );
}
