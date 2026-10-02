import { PageContainer, Section } from "@/components/layout/PageContainer";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Button } from "@/components/ui/Button";
import { TechIcon } from "@/components/ui/TechIcon";
import { SkillGroupTitle } from "@/components/ui/SkillGroupTitle";
import { ArrowRightIcon } from "@/components/ui/icons";
import type { SkillGroup } from "@elyse/database/types";

/**
 * ELYSE DEV — skills preview.
 *
 * Grouped by discipline and never scored with invented percentages: what the
 * technology is used for is more useful than a self-assigned number.
 */
export function SkillsPreviewSection({ groups }: { groups: SkillGroup[] }) {
  return (
    <Section id="skills" aria-labelledby="skills-preview-title">
      <PageContainer>
        <RevealOnScroll>
          <SectionHeading
            id="skills-preview-title"
            overline="Skills & technologies"
            title="The stack I build with"
            description="Grouped by discipline rather than ranked with made-up percentages. Each entry describes what I actually use the technology for."
            action={
              <Button
                href="/skills"
                variant="glass"
                icon={<ArrowRightIcon width={16} height={16} />}
              >
                Full skills overview
              </Button>
            }
          />
        </RevealOnScroll>

        <ul className="mt-10 grid gap-5 md:grid-cols-2">
          {groups.map((group, index) => (
            <RevealOnScroll as="li" key={group.id} delay={index * 100} className="h-full">
              <SpotlightCard className="h-full" padding="lg">
                <div className="flex items-baseline justify-between gap-4">
                  <SkillGroupTitle
                    as="h3"
                    emoji={group.emoji}
                    title={group.title}
                    className="text-h4 font-semibold text-white"
                  />
                  <span className="text-caption text-text-muted">
                    {group.skills.length} entries
                  </span>
                </div>
                <p className="mt-3 text-sm text-text-secondary pretty-text">
                  {group.description}
                </p>

                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {group.skills.map((skill) => (
                    <li
                      key={skill.name}
                      className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-3 transition-colors duration-300 hover:border-brand-500/30 hover:bg-brand-500/[0.06]"
                    >
                      <TechIcon icon={skill.icon} size="sm" />
                      <span className="min-w-0">
                        <span className="block truncate text-[0.85rem] font-medium text-white">
                          {skill.name}
                        </span>
                        {skill.note ? (
                          <span className="block truncate text-caption text-text-muted">
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
        </ul>
      </PageContainer>
    </Section>
  );
}
