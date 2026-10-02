import { PageContainer, Section } from "@/components/layout/PageContainer";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { Button } from "@/components/ui/Button";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { GitHubIcon, MailIcon, SparkIcon } from "@/components/ui/icons";

interface ContactCtaSectionProps {
  availability: string;
  github: string;
}

/** ELYSE DEV — closing call to action, reused on several pages. */
export function ContactCtaSection({
  availability,
  github,
}: ContactCtaSectionProps) {
  return (
    <Section id="contact" aria-labelledby="contact-cta-title" className="pb-16">
      <PageContainer>
        <RevealOnScroll>
          <div className="glass glass-edge relative overflow-hidden rounded-glass-lg px-6 py-10 sm:px-10 sm:py-14">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(249,115,22,0.22), transparent 68%)",
              }}
            />

            <div className="relative max-w-2xl">
              <p className="inline-flex items-center gap-2 text-overline text-brand-400 uppercase">
                <SparkIcon width={14} height={14} />
                Let&apos;s build something
              </p>
              <h2
                id="contact-cta-title"
                className="mt-4 text-h1 font-semibold text-white"
              >
                Have a project worth finishing?
              </h2>
              <p className="mt-4 text-lead text-text-secondary pretty-text">
                I am open to collaborations, freelance work and full-stack roles.
                Tell me what you are building and I will tell you honestly
                whether I can help.
              </p>
              <p className="mt-3 text-caption text-text-muted">{availability}</p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                  href="/contact"
                  variant="primary"
                  size="lg"
                  icon={<MailIcon width={16} height={16} />}
                >
                  Start a conversation
                </Button>
                <MagneticButton
                  href={github}
                  variant="glass"
                  size="lg"
                  icon={<GitHubIcon width={16} height={16} />}
                >
                  See my GitHub
                </MagneticButton>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </PageContainer>
    </Section>
  );
}
