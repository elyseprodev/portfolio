import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { PageContainer, Section } from "@/components/layout/PageContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { growthProgram } from "@/content/growth";

/**
 * ELYSE DEV ACADEMY — the Developer Growth Programme.
 *
 * Built from one content module so the same programme can be summarised on the
 * academy page and shown in full on its own route without a second copy of the
 * text drifting out of date.
 */
export function GrowthProgramSection({ headingLevel = "h2" }: { headingLevel?: "h2" | "h3" }) {
  return (
    <Section id="growth-programme" aria-labelledby="growth-programme-title">
      <PageContainer>
        <RevealOnScroll>
          <SectionHeading
            id="growth-programme-title"
            as={headingLevel}
            overline="For working developers"
            title={growthProgram.name}
            description={growthProgram.summary}
          />
        </RevealOnScroll>

        <RevealOnScroll delay={80}>
          <dl className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="glass glass-edge rounded-glass p-5">
              <dt className="text-caption tracking-[0.14em] text-text-muted uppercase">
                Duration
              </dt>
              <dd className="font-display-numeric mt-1 text-h4 font-semibold text-white">
                {growthProgram.durationWeeks} weeks
              </dd>
            </div>
            <div className="glass glass-edge rounded-glass p-5">
              <dt className="text-caption tracking-[0.14em] text-text-muted uppercase">
                Commitment
              </dt>
              <dd className="font-display-numeric mt-1 text-h4 font-semibold text-white">
                {growthProgram.weeklyHours}
              </dd>
            </div>
            <div className="glass glass-edge rounded-glass p-5">
              <dt className="text-caption tracking-[0.14em] text-text-muted uppercase">
                Phases
              </dt>
              <dd className="font-display-numeric mt-1 text-h4 font-semibold text-white">
                {growthProgram.phases.length} phases
              </dd>
            </div>
          </dl>
        </RevealOnScroll>

        {/* Principles ----------------------------------------------------- */}
        <RevealOnScroll delay={120}>
          <h3 className="mt-12 text-h3 font-semibold text-white">
            How the programme is built
          </h3>
        </RevealOnScroll>
        <ul className="mt-6 grid gap-5 md:grid-cols-2">
          {growthProgram.principles.map((principle, index) => (
            <RevealOnScroll as="li" key={principle.title} delay={index * 90} className="h-full">
              <SpotlightCard className="h-full" padding="lg">
                <h4 className="text-h4 font-semibold text-white">{principle.title}</h4>
                <p className="mt-3 text-sm text-text-secondary pretty-text">{principle.body}</p>
              </SpotlightCard>
            </RevealOnScroll>
          ))}
        </ul>

        {/* Phases --------------------------------------------------------- */}
        <RevealOnScroll delay={80}>
          <h3 className="mt-14 text-h3 font-semibold text-white">The four phases</h3>
        </RevealOnScroll>
        <ol className="mt-6 grid gap-5 lg:grid-cols-2">
          {growthProgram.phases.map((phase, index) => (
            <RevealOnScroll as="li" key={phase.id} delay={index * 90} className="h-full">
              <SpotlightCard className="flex h-full flex-col" padding="lg">
                <div className="flex items-center justify-between gap-4">
                  <h4 className="text-h4 font-semibold text-white">
                    <span aria-hidden="true" className="mr-2">
                      {phase.emoji}
                    </span>
                    {phase.name}
                  </h4>
                  <span className="font-display-numeric shrink-0 text-caption tracking-[0.12em] text-brand-300 uppercase">
                    {phase.weeks}
                  </span>
                </div>

                <p className="mt-3 text-sm text-text-secondary pretty-text">{phase.goal}</p>

                <ul className="mt-4 space-y-2">
                  {phase.practices.map((practice) => (
                    <li key={practice} className="flex gap-2.5 text-sm text-text-muted">
                      <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-500/70" />
                      <span>{practice}</span>
                    </li>
                  ))}
                </ul>

                <p className="mt-5 border-t border-white/8 pt-4 text-caption text-text-secondary">
                  <span className="font-medium text-white">Evidence produced: </span>
                  {phase.evidence}
                </p>
              </SpotlightCard>
            </RevealOnScroll>
          ))}
        </ol>

        {/* Weekly rhythm + assessment ------------------------------------ */}
        <div className="mt-14 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <RevealOnScroll>
            <h3 className="text-h3 font-semibold text-white">A week in the programme</h3>
            <dl className="mt-6 space-y-3">
              {growthProgram.rhythm.map((day) => (
                <div
                  key={day.day}
                  className="glass glass-edge flex flex-wrap items-baseline gap-x-4 gap-y-1 rounded-glass px-5 py-4"
                >
                  <dt className="font-display-numeric w-24 shrink-0 text-sm font-semibold text-brand-300">
                    {day.day}
                  </dt>
                  <dd className="min-w-0 flex-1">
                    <span className="text-sm font-medium text-white">{day.focus}</span>
                    <span className="block text-caption text-text-muted">{day.detail}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </RevealOnScroll>

          <RevealOnScroll delay={120}>
            <h3 className="text-h3 font-semibold text-white">What &ldquo;good&rdquo; means</h3>
            <ul className="mt-6 space-y-4">
              {growthProgram.assessment.map((item) => (
                <li key={item.title} className="glass glass-edge rounded-glass p-5">
                  <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                  <p className="mt-2 text-sm text-text-muted pretty-text">{item.body}</p>
                </li>
              ))}
            </ul>
            <div className="glass glass-edge mt-6 rounded-glass p-5">
              <h4 className="text-sm font-semibold text-white">Who it is for</h4>
              <ul className="mt-3 space-y-2">
                {growthProgram.audiences.map((audience) => (
                  <li key={audience} className="flex gap-2.5 text-sm text-text-muted">
                    <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-500/70" />
                    <span>{audience}</span>
                  </li>
                ))}
              </ul>
            </div>
          </RevealOnScroll>
        </div>
      </PageContainer>
    </Section>
  );
}
