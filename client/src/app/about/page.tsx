import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { PageContainer, Section } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Button } from "@/components/ui/Button";
import { SourceBadge } from "@/components/ui/Badges";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { ArrowRightIcon, CompassIcon, LayersIcon, ShieldIcon } from "@/components/ui/icons";
import { loadProfile } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "About me",
  description:
    "MURENGERANTWARI Elyse — a full-stack software developer from Rwanda working with React, Next.js, Node.js, Express, PHP and databases, currently learning cybersecurity.",
  path: "/about",
  keywords: ["about MURENGERANTWARI Elyse", "Rwandan developer"],
  type: "profile",
});

const APPROACH = [
  {
    icon: CompassIcon,
    title: "Understand before building",
    body: "I start by working out what the software is actually for. Most wasted work comes from solving the wrong problem carefully, so I would rather ask a second question than rewrite a finished screen.",
  },
  {
    icon: LayersIcon,
    title: "Keep the layers honest",
    body: "Interfaces present data, APIs validate and shape it, databases store it. Keeping those responsibilities separate is why I can change a query without breaking a page — and why this portfolio is split into client, server and database.",
  },
  {
    icon: ShieldIcon,
    title: "Assume it will fail",
    body: "Loading states, empty states, validation errors and rate limits are part of the feature, not polish added later. Learning cybersecurity has made that instinct sharper.",
  },
];

export default async function AboutPage() {
  const { data: profile, source, backend } = await loadProfile();

  return (
    <>
      <PageHeader
        overline="About me"
        title={
          <>
            I build web applications that
            <span className="text-accent-gradient"> actually get used</span>
          </>
        }
        description={profile.summary}
        actions={
          <>
            <Button
              href="/projects"
              variant="primary"
              icon={<ArrowRightIcon width={16} height={16} />}
            >
              See my work
            </Button>
            <Button href="/contact" variant="glass">
              Work with me
            </Button>
          </>
        }
        aside={
          <div className="glass glass-edge w-full max-w-xs overflow-hidden rounded-glass-lg p-3 lg:max-w-[18rem]">
            <Image
              src="/images/elyse-dev-mark.svg"
              alt="Abstract ELYSE DEV monogram artwork — a placeholder for a portrait photograph"
              width={640}
              height={640}
              sizes="(min-width: 1024px) 18rem, 80vw"
              className="h-auto w-full rounded-[1.3rem]"
            />
            <div className="flex items-center justify-between gap-3 px-2 py-3">
              <div>
                <p className="text-sm font-medium text-white">{profile.name}</p>
                <p className="text-caption text-text-muted">
                  {profile.role} · {profile.location}
                </p>
              </div>
              <SourceBadge source={source} backend={backend} />
            </div>
          </div>
        }
      />

      {/* Story ------------------------------------------------------------- */}
      <Section aria-labelledby="story-title">
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-[1.35fr_0.65fr]">
            <div>
              <RevealOnScroll>
                <SectionHeading
                  id="story-title"
                  overline="My journey"
                  title="From curiosity to full-stack work"
                />
              </RevealOnScroll>

              <div className="mt-8 space-y-5">
                {profile.bio.map((paragraph, index) => (
                  <RevealOnScroll key={paragraph.slice(0, 24)} delay={index * 70}>
                    <p className="text-[0.98rem] leading-relaxed text-text-secondary pretty-text">
                      {paragraph}
                    </p>
                  </RevealOnScroll>
                ))}
              </div>

              <RevealOnScroll delay={140}>
                <div className="glass-subtle mt-9 rounded-glass p-5">
                  <p className="text-[0.66rem] tracking-[0.14em] text-text-muted uppercase">
                    How I learned
                  </p>
                  <p className="mt-3 text-sm text-text-secondary pretty-text">
                    I learned by building. Each topic in the JavaScript and PHP
                    ecosystems went straight into a project — an education
                    platform, a messaging flow, a video application — and each
                    project taught me something a tutorial could not: how to
                    recover when the data does not arrive in the shape you
                    expected.
                  </p>
                </div>
              </RevealOnScroll>
            </div>

            {/* Side panels */}
            <div className="space-y-5">
              <RevealOnScroll delay={90}>
                <SpotlightCard padding="lg">
                  <h2 className="text-h4 font-semibold text-white">
                    Technical focus
                  </h2>
                  <ul className="mt-4 space-y-2.5">
                    {profile.focusAreas.map((area) => (
                      <li
                        key={area}
                        className="flex items-start gap-2.5 text-sm text-text-secondary"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-500"
                        />
                        {area}
                      </li>
                    ))}
                  </ul>
                </SpotlightCard>
              </RevealOnScroll>

              <RevealOnScroll delay={160}>
                <SpotlightCard padding="lg">
                  <h2 className="text-h4 font-semibold text-white">
                    What I am into
                  </h2>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {profile.interests.map((interest) => (
                      <li key={interest}>
                        <span className="chip">{interest}</span>
                      </li>
                    ))}
                  </ul>
                </SpotlightCard>
              </RevealOnScroll>

              <RevealOnScroll delay={230}>
                <SpotlightCard padding="lg">
                  <h2 className="text-h4 font-semibold text-white">
                    Reach me
                  </h2>
                  <p className="mt-3 text-sm text-text-secondary">
                    {profile.availability}
                  </p>
                  <SocialLinks
                    github={profile.github}
                    email={profile.email || undefined}
                    className="mt-4 flex flex-wrap items-center gap-2"
                  />
                  <Link
                    href="/contact"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm text-brand-300 transition-colors hover:text-brand-200"
                  >
                    Or use the contact form
                    <ArrowRightIcon width={15} height={15} />
                  </Link>
                </SpotlightCard>
              </RevealOnScroll>
            </div>
          </div>
        </PageContainer>
      </Section>

      {/* Approach ---------------------------------------------------------- */}
      <Section aria-labelledby="approach-title" className="pt-0">
        <PageContainer>
          <RevealOnScroll>
            <SectionHeading
              id="approach-title"
              overline="How I work"
              title="Three habits that shape everything I ship"
              description="Not a manifesto — just the things that consistently make my projects better."
            />
          </RevealOnScroll>

          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {APPROACH.map((item, index) => (
              <RevealOnScroll as="li" key={item.title} delay={index * 110} className="h-full">
                <SpotlightCard className="h-full" padding="lg">
                  <span
                    aria-hidden="true"
                    className="grid size-11 place-items-center rounded-xl border border-brand-500/25 bg-brand-500/10 text-brand-300"
                  >
                    <item.icon width={20} height={20} />
                  </span>
                  <h3 className="mt-5 text-h4 font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm text-text-secondary pretty-text">
                    {item.body}
                  </p>
                </SpotlightCard>
              </RevealOnScroll>
            ))}
          </ul>
        </PageContainer>
      </Section>
    </>
  );
}
