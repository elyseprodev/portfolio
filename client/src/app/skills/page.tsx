import type { Metadata } from "next";

import { PageContainer, Section } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Button } from "@/components/ui/Button";
import { SourceBadge } from "@/components/ui/Badges";
import { TechIcon } from "@/components/ui/TechIcon";
import { SkillGroupTitle } from "@/components/ui/SkillGroupTitle";
import { ArrowRightIcon, GitHubIcon } from "@/components/ui/icons";
import { technologyChips } from "@/content/skills";
import { loadSkillGroups } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Skills & technologies",
  description:
    "The technologies Elyse Dev builds with: HTML, CSS, JavaScript, React, Next.js, Tailwind CSS, Node.js, Express, PHP, MongoDB, MySQL, Git and security fundamentals.",
  path: "/skills",
  keywords: ["React developer skills", "Node.js Express developer", "PHP MySQL developer"],
});

export default async function SkillsPage() {
  const { data: skillGroups, source, backend } = await loadSkillGroups();

  return (
    <>
      <PageHeader
        overline="Skills & technologies"
        title={
          <>
            The stack I build with,
            <span className="text-accent-gradient"> honestly described</span>
          </>
        }
        description="Grouped by discipline instead of ranked with invented percentages. What matters is what I use each tool for — so every entry says that, and nothing here claims expertise I have not demonstrated."
        actions={
          <>
            <Button
              href="/projects"
              variant="primary"
              icon={<ArrowRightIcon width={16} height={16} />}
            >
              See these in use
            </Button>
            <Button href="/github" variant="glass" icon={<GitHubIcon width={16} height={16} />}>
              Check my repositories
            </Button>
          </>
        }
        aside={
          <SpotlightCard className="w-full max-w-xs" padding="lg">
            <p className="text-[0.66rem] tracking-[0.14em] text-text-muted uppercase">
              At a glance
            </p>
            <ul className="mt-4 space-y-3 text-sm text-text-secondary">
              <li>4 skill groups · {technologyChips.length} technologies</li>
              <li>Frontend, backend, databases and practice</li>
              <li>No fabricated proficiency scores</li>
            </ul>
            <SourceBadge source={source} backend={backend} className="mt-5" />
          </SpotlightCard>
        }
      />

      <Section aria-labelledby="groups-title" className="pt-0">
        <PageContainer>
          <h2 id="groups-title" className="sr-only">
            Skill groups
          </h2>

          <div className="grid gap-6 lg:grid-cols-2">
            {skillGroups.map((group, index) => (
              <RevealOnScroll key={group.id} delay={index * 100} className="h-full">
                <SpotlightCard className="h-full" padding="lg">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-overline text-brand-400 uppercase">
                        {group.shortLabel}
                      </p>
                      <SkillGroupTitle
                        as="h3"
                        emoji={group.emoji}
                        title={group.title}
                        className="mt-2 text-h3 font-semibold text-white"
                      />
                    </div>
                    <span className="chip chip-brand">
                      {group.skills.length} entries
                    </span>
                  </div>

                  <p className="mt-4 text-sm text-text-secondary pretty-text">
                    {group.description}
                  </p>

                  <ul className="mt-7 space-y-3">
                    {group.skills.map((skill) => (
                      <li
                        key={skill.name}
                        className="flex items-start gap-3.5 rounded-2xl border border-white/8 bg-white/[0.03] p-3.5 transition-all duration-300 hover:translate-x-1 hover:border-brand-500/30 hover:bg-brand-500/[0.06]"
                      >
                        <TechIcon icon={skill.icon} />
                        <span className="min-w-0">
                          <span className="block text-[0.92rem] font-medium text-white">
                            {skill.name}
                          </span>
                          {skill.note ? (
                            <span className="mt-0.5 block text-caption text-text-muted">
                              {skill.note}
                            </span>
                          ) : null}
                        </span>
                      </li>
                    ))}
                  </ul>
                </SpotlightCard>
              </RevealOnScroll>
            ))}
          </div>
        </PageContainer>
      </Section>

      <Section aria-labelledby="practice-title" className="pt-0 pb-16">
        <PageContainer>
          <RevealOnScroll>
            <SectionHeading
              id="practice-title"
              overline="Beyond the list"
              title="What these skills are for"
              description="A technology list is only useful if it maps to work. Here is what each group actually produces in my projects."
            />
          </RevealOnScroll>

          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                title: "Interfaces people can use",
                body: "Responsive layouts built mobile-first, semantic HTML, keyboard support and readable contrast — tested at 320px, 375px, 768px, 1024px and 1440px.",
              },
              {
                title: "APIs that behave",
                body: "Express routes with validation, predictable JSON envelopes, sensible status codes, rate limiting and error messages a frontend can display without guessing.",
              },
              {
                title: "Data that holds up",
                body: "MongoDB document models with Mongoose and relational MySQL schemas, chosen per project rather than by habit, with indexes where queries need them.",
              },
            ].map((item, index) => (
              <RevealOnScroll as="li" key={item.title} delay={index * 110} className="h-full">
                <SpotlightCard className="h-full" padding="lg">
                  <h3 className="text-h4 font-semibold text-white">{item.title}</h3>
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
