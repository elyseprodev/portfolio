import type { Metadata } from "next";
import Image from "next/image";

import { GrowthProgramSection } from "@/components/academy/GrowthProgramSection";
import { CourseCard } from "@/components/academy/CourseCard";
import { PageContainer, Section } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getAvailableCourses, getFeaturedCourses } from "@/content/courses";
import { growthProgram } from "@/content/growth";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Developer Growth Programme — a 12-week plan to get measurably better",
  description:
    "A structured programme for working developers: four phases over twelve weeks, a weekly rhythm, and assessment that names what good looks like. Built for self-taught developers, graduates and juniors who want to be trusted with the hard parts.",
  path: "/academy/program",
  keywords: [
    "developer growth programme",
    "improve programming skills",
    "junior developer training",
    "deliberate practice programming",
    "code review practice",
    "portfolio project plan",
  ],
  type: "article",
});

export default function GrowthProgramPage() {
  const featured = getFeaturedCourses(3);
  const available = getAvailableCourses().slice(0, 3);

  return (
    <>
      <PageHeader
        overline="Elyse Dev Academy"
        title={growthProgram.name}
        description={growthProgram.tagline}
        actions={
          <>
            <Button href="/academy#courses" variant="primary">
              Pair it with a course
            </Button>
            <Button href="/contact" variant="glass">
              Ask about the programme
            </Button>
          </>
        }
        aside={
          <div className="glass glass-edge w-full max-w-sm overflow-hidden rounded-glass-lg p-3 lg:max-w-[20rem]">
            <Image
              src="/images/courses/tracks/systems.svg"
              alt="Generated artwork representing the systems and performance track"
              width={1600}
              height={420}
              sizes="(min-width: 1024px) 20rem, 80vw"
              className="h-auto w-full rounded-[1.3rem]"
              priority
            />
            <div className="grid grid-cols-2 gap-3 p-3">
              <div>
                <p className="text-[0.66rem] tracking-[0.14em] text-text-muted uppercase">
                  Duration
                </p>
                <p className="font-display-numeric text-lg font-semibold text-white">
                  {growthProgram.durationWeeks} weeks
                </p>
              </div>
              <div>
                <p className="text-[0.66rem] tracking-[0.14em] text-text-muted uppercase">
                  Per week
                </p>
                <p className="text-sm font-semibold text-white">{growthProgram.weeklyHours}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[0.66rem] tracking-[0.14em] text-text-muted uppercase">
                  Free
                </p>
                <p className="text-sm text-text-secondary">
                  Study it yourself, or ask about running it for a group.
                </p>
              </div>
            </div>
          </div>
        }
      />

      <GrowthProgramSection headingLevel="h2" />

      {/* Pair it with courses --------------------------------------------- */}
      <Section spacing={false} className="pb-20" aria-labelledby="program-courses-title">
        <PageContainer>
          <RevealOnScroll>
            <SectionHeading
              id="program-courses-title"
              overline="Pair it with a course"
              title="Courses that fit the programme"
              description="Phase two and three need a language to go deep in. These are the ones marked available now, plus the ones I would pick next."
              action={
                <Button href="/academy#courses" variant="glass">
                  All courses
                </Button>
              }
            />
          </RevealOnScroll>

          <ul className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[
              ...available,
              ...featured.filter(
                (course) => !available.some((item) => item.slug === course.slug),
              ),
            ]
              .slice(0, 3)
              .map((course, index) => (
                <RevealOnScroll as="li" key={course.slug} delay={index * 80} className="h-full">
                  <CourseCard course={course} className="h-full" />
                </RevealOnScroll>
              ))}
          </ul>
        </PageContainer>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOccupationalProgram",
            name: growthProgram.name,
            description: growthProgram.summary,
            programPrerequisites: growthProgram.audiences.join("; "),
            timeToComplete: `P${growthProgram.durationWeeks}W`,
            provider: { "@type": "Organization", name: "Elyse Dev Academy" },
          }),
        }}
      />
    </>
  );
}
