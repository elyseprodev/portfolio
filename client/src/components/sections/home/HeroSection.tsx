import Image from "next/image";

import { PageContainer, Section } from "@/components/layout/PageContainer";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Badges";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { ArrowRightIcon, MailIcon } from "@/components/ui/icons";
import { technologyChips } from "@/content/skills";
import type { Profile } from "@elyse/database/types";

/**
 * ELYSE DEV — hero.
 *
 * Deliberately restrained: one headline, one supporting paragraph, two clear
 * actions, and a floating capability panel. No carousel, no countdown, no wall
 * of badges.
 */
export function HeroSection({ profile }: { profile: Profile }) {
  return (
    <Section id="hero" spacing={false} className="pt-4 pb-10 sm:pt-8 sm:pb-14">
      <PageContainer>
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          {/* ---------------------------------------------------------------- */}
          {/* Copy                                                             */}
          {/* ---------------------------------------------------------------- */}
          <div className="hero-copy">
            <RevealOnScroll>
              <p className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-caption text-text-secondary backdrop-blur-md">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-500/70" />
                  <span className="relative inline-flex size-2 rounded-full bg-brand-500" />
                </span>
                {profile.role} · {profile.location}
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay={80}>
              <h1 className="mt-6 font-semibold">
                <span className="hero-name block text-white">Elyse</span>
                <span className="text-gradient block text-display">Dev</span>
              </h1>
            </RevealOnScroll>

            <RevealOnScroll delay={160}>
              <p className="mt-6 max-w-2xl text-lead text-text-secondary pretty-text">
                {profile.headline}
              </p>
              <p className="mt-4 max-w-xl text-sm text-text-muted pretty-text">
                {profile.summary}
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay={240}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                  href="/projects"
                  variant="primary"
                  size="lg"
                  icon={<ArrowRightIcon width={16} height={16} />}
                >
                  Explore my projects
                </Button>
                <MagneticButton
                  href="/contact"
                  variant="glass"
                  size="lg"
                  icon={<MailIcon width={16} height={16} />}
                >
                  Contact me
                </MagneticButton>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={320}>
              <ul className="mt-9 flex flex-wrap gap-2">
                {technologyChips.slice(0, 8).map((tech) => (
                  <li key={tech}>
                    <span className="chip">{tech}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-caption text-text-muted">
                {profile.availability}
              </p>
            </RevealOnScroll>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Visual + floating capability panel                               */}
          {/* ---------------------------------------------------------------- */}
          <RevealOnScroll delay={200} className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative">
              <div className="glass glass-edge relative overflow-hidden rounded-glass-lg p-3">
                <Image
                  src="/images/hero-visual.jpg"
                  alt="Layered glass panels with glowing orange edges — generated artwork in the ELYSE DEV palette, not a photograph"
                  width={1024}
                  height={1024}
                  priority
                  sizes="(min-width: 1024px) 38vw, 88vw"
                  className="h-auto w-full rounded-[1.4rem]"
                />
              </div>

              {/* Floating status chip */}
              <div className="glass glass-solid absolute -top-3 -right-2 hidden animate-float items-center gap-2 rounded-full px-3.5 py-2 sm:flex">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                <span className="text-caption text-text-secondary">
                  Open to collaborations
                </span>
              </div>

              {/* Capability panel */}
              <dl className="glass glass-solid absolute -bottom-6 left-3 right-3 grid grid-cols-2 gap-x-4 gap-y-3 rounded-glass p-4 sm:left-5 sm:right-5">
                {profile.highlights.slice(0, 4).map((highlight) => (
                  <div key={highlight.label}>
                    <dt className="text-[0.66rem] tracking-[0.14em] text-text-muted uppercase">
                      {highlight.label}
                    </dt>
                    <dd className="mt-1 text-[0.82rem] leading-snug font-medium text-white">
                      {highlight.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </RevealOnScroll>
        </div>

        <RevealOnScroll delay={400}>
          <div className="mt-24 flex flex-wrap items-center gap-3 sm:mt-28">
            <Pill tone="brand">Client · Server · Database</Pill>
            <span className="text-caption text-text-muted">
              This portfolio is a full-stack product, not a template — Next.js in
              front, Express behind it, MongoDB underneath.
            </span>
          </div>
        </RevealOnScroll>
      </PageContainer>
    </Section>
  );
}
