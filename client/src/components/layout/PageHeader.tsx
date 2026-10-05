import type { ReactNode } from "react";

import { PageContainer, Section } from "./PageContainer";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";

interface PageHeaderProps {
  overline: string;
  title: ReactNode;
  description: ReactNode;
  /** Optional actions (buttons) rendered under the description. */
  actions?: ReactNode;
  /** Optional aside rendered next to the copy on large screens. */
  aside?: ReactNode;
}

/** ELYSE DEV — consistent page hero for every inner route. */
export function PageHeader({
  overline,
  title,
  description,
  actions,
  aside,
}: PageHeaderProps) {
  return (
    <Section spacing={false} className="pt-6 pb-10 sm:pt-10 sm:pb-14">
      <PageContainer>
        <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <div>
            <RevealOnScroll>
              <p className="text-overline font-medium text-brand-400 uppercase">
                <span className="mr-2 inline-block h-1.5 w-1.5 -translate-y-0.5 rounded-full bg-brand-500 align-middle" />
                {overline}
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay={70}>
              <h1 className="mt-4 text-h1 font-semibold text-white">{title}</h1>
            </RevealOnScroll>

            <RevealOnScroll delay={140}>
              <p className="mt-5 max-w-2xl text-lead text-text-secondary pretty-text">
                {description}
              </p>
            </RevealOnScroll>

            {actions ? (
              <RevealOnScroll delay={210}>
                <div className="mt-7 flex flex-wrap items-center gap-3">{actions}</div>
              </RevealOnScroll>
            ) : null}
          </div>

          {aside ? (
            <RevealOnScroll delay={160} className="lg:justify-self-end">
              {aside}
            </RevealOnScroll>
          ) : null}
        </div>
      </PageContainer>
    </Section>
  );
}
