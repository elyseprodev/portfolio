import Image from "next/image";

import { PageContainer, Section } from "@/components/layout/PageContainer";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { ArrowRightIcon } from "@/components/ui/icons";
import type { Profile } from "@elyse/database/types";

/** ELYSE DEV — short about preview with a link to the full story. */
export function AboutPreviewSection({ profile }: { profile: Profile }) {
  return (
    <Section id="about" aria-labelledby="about-preview-title">
      <PageContainer>
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <RevealOnScroll className="order-2 lg:order-1">
            <div className="glass glass-edge relative overflow-hidden rounded-glass-lg p-3">
              <Image
                src="/images/about-workspace.jpg"
                alt="A dark desk at night with a laptop and a monitor showing blurred code, lit by warm orange light"
                width={1024}
                height={1024}
                sizes="(min-width: 1024px) 34vw, 88vw"
                className="h-auto w-full rounded-[1.4rem]"
              />
            </div>
          </RevealOnScroll>

          <div className="order-1 lg:order-2">
            <RevealOnScroll>
              <SectionHeading
                id="about-preview-title"
                overline="About me"
                as="h2"
                title="A developer who reads the docs and finishes the job"
                description={profile.bio[0]}
              />
            </RevealOnScroll>

            <RevealOnScroll delay={110}>
              <p className="mt-5 max-w-2xl text-sm text-text-muted pretty-text">
                {profile.bio[2]}
              </p>

              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {profile.interests.slice(0, 4).map((interest) => (
                  <li
                    key={interest}
                    className="flex items-start gap-2.5 text-sm text-text-secondary"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-500"
                    />
                    {interest}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                  href="/about"
                  variant="glass"
                  icon={<ArrowRightIcon width={16} height={16} />}
                >
                  Read my full story
                </Button>
                <SocialLinks
                  github={profile.github}
                  email={profile.email || undefined}
                />
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </PageContainer>
    </Section>
  );
}
