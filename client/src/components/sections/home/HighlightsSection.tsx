import { PageContainer, Section } from "@/components/layout/PageContainer";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import {
  CodeIcon,
  DatabaseIcon,
  LayersIcon,
  ShieldIcon,
} from "@/components/ui/icons";

const ICONS = [LayersIcon, DatabaseIcon, CodeIcon, ShieldIcon];

interface HighlightsSectionProps {
  highlights: { label: string; value: string; note?: string }[];
  focusAreas: string[];
}

/** ELYSE DEV — "at a glance" strip: four glass panels, staggered reveal. */
export function HighlightsSection({
  highlights,
  focusAreas,
}: HighlightsSectionProps) {
  return (
    <Section id="highlights" aria-label="At a glance" spacing={false} className="pb-12 sm:pb-16">
      <PageContainer>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((highlight, index) => {
            const Icon = ICONS[index % ICONS.length] ?? LayersIcon;
            return (
              <RevealOnScroll
                as="li"
                key={highlight.label}
                delay={index * 90}
                className="h-full"
              >
                <SpotlightCard className="h-full" padding="md">
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="grid size-10 shrink-0 place-items-center rounded-xl border border-brand-500/25 bg-brand-500/10 text-brand-300"
                    >
                      <Icon width={19} height={19} />
                    </span>
                    <div>
                      <p className="text-[0.66rem] tracking-[0.14em] text-text-muted uppercase">
                        {highlight.label}
                      </p>
                      <p className="mt-1.5 text-[0.95rem] font-medium text-white">
                        {highlight.value}
                      </p>
                      {highlight.note ? (
                        <p className="mt-1 text-caption text-text-muted">
                          {highlight.note}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </SpotlightCard>
              </RevealOnScroll>
            );
          })}
        </ul>

        <RevealOnScroll delay={120}>
          <div className="glass-subtle mt-4 rounded-glass p-5 sm:p-6">
            <p className="text-[0.66rem] tracking-[0.14em] text-text-muted uppercase">
              Focus areas
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {focusAreas.map((area) => (
                <li key={area}>
                  <span className="chip">{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </RevealOnScroll>
      </PageContainer>
    </Section>
  );
}
