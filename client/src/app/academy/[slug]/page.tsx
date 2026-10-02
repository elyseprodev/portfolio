import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageContainer, Section } from "@/components/layout/PageContainer";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Badges";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookIcon,
  CheckIcon,
  CompassIcon,
  GraduationIcon,
} from "@/components/ui/icons";
import {
  courseLevelLabels,
  courseStatusLabels,
  courses,
  getCourseBySlug,
  getCoursesByTrack,
  getTrackById,
} from "@/content/courses";
import { site } from "@/content/site";
import { loadCourse } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";

interface CoursePageProps {
  params: Promise<{ slug: string }>;
}

/** Every course prerenders at build time. */
export function generateStaticParams() {
  return courses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourseBySlug(slug);

  if (!course) {
    return buildMetadata({
      title: "Course",
      description: "A course from the Elyse Dev Academy.",
      path: `/academy/${slug}`,
    });
  }

  return buildMetadata({
    title: `${course.language} course`,
    description: `${course.tagline}. ${course.summary}`,
    path: `/academy/${course.slug}`,
    keywords: [course.language, "course", "curriculum", "learn to code", course.trackId],
    type: "article",
  });
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;
  const loaded = await loadCourse(slug);

  if (!loaded.data) notFound();

  const course = loaded.data;
  const track = getTrackById(course.trackId);
  const siblings = getCoursesByTrack(course.trackId).filter(
    (item) => item.slug !== course.slug,
  );
  const isReady = course.status === "available";

  return (
    <>
      {/* Hero ------------------------------------------------------------- */}
      <Section spacing={false} className="pt-6 pb-10 sm:pt-10">
        <PageContainer>
          <RevealOnScroll>
            <Link
              href="/academy"
              className="text-caption inline-flex items-center gap-2 text-text-muted transition-colors hover:text-white"
            >
              <ArrowLeftIcon width={14} height={14} />
              All courses
            </Link>
          </RevealOnScroll>

          <div className="mt-6 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div>
              <RevealOnScroll delay={60}>
                <div className="flex flex-wrap gap-2">
                  <Pill tone="brand">{courseLevelLabels[course.level]}</Pill>
                  <Pill tone="muted">{courseStatusLabels[course.status]}</Pill>
                  {track ? (
                    <Pill tone="muted">
                      {track.emoji ? (
                        <span aria-hidden="true" className="mr-1.5">
                          {track.emoji}
                        </span>
                      ) : null}
                      {track.name}
                    </Pill>
                  ) : null}
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={110}>
                <h1 className="mt-5 text-h1 font-semibold text-white">
                  {course.language} <span className="text-text-muted">course</span>
                </h1>
              </RevealOnScroll>

              <RevealOnScroll delay={160}>
                <p className="mt-4 max-w-2xl text-lead text-text-secondary pretty-text">
                  {course.summary}
                </p>
              </RevealOnScroll>

              <RevealOnScroll delay={210}>
                <dl className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {[
                    { label: "Weeks", value: course.weeks },
                    { label: "Hours", value: `${course.hours}` },
                    { label: "Modules", value: course.modules.length },
                    { label: "Capstone", value: "1" },
                  ].map((item) => (
                    <div key={item.label} className="glass glass-edge rounded-glass p-4">
                      <dt className="text-[0.66rem] tracking-[0.14em] text-text-muted uppercase">
                        {item.label}
                      </dt>
                      <dd className="font-display-numeric mt-1 text-h4 font-semibold text-white">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </RevealOnScroll>

              <RevealOnScroll delay={260}>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button href="#curriculum" variant="primary" icon={<ArrowRightIcon width={16} height={16} />}>
                    See the curriculum
                  </Button>
                  <Button href="/academy#certificates" variant="glass">
                    {isReady ? "Get the certificate" : "Issue a sample certificate"}
                  </Button>
                </div>
              </RevealOnScroll>
            </div>

            <RevealOnScroll delay={160}>
              <div className="glass glass-edge overflow-hidden rounded-glass-lg p-3">
                <Image
                  src={course.image}
                  alt={`Generated cover artwork for the ${course.language} course`}
                  width={1200}
                  height={750}
                  sizes="(min-width: 1024px) 40vw, 92vw"
                  className="h-auto w-full rounded-[1.4rem]"
                  priority
                />
                <p className="px-2 pt-3 pb-1 text-caption text-text-muted">
                  Generated artwork — the course itself lives in the curriculum below.
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </PageContainer>
      </Section>

      {/* Curriculum -------------------------------------------------------- */}
      <Section id="curriculum" aria-labelledby="curriculum-title">
        <PageContainer>
          <RevealOnScroll>
            <h2 id="curriculum-title" className="text-h2 font-semibold text-white">
              The curriculum
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-text-muted pretty-text">
              Six modules, in order. Hours are a guide to study time, not a deadline — the
              capstone at the end is what proves the course landed.
            </p>
          </RevealOnScroll>

          <ol className="mt-8 space-y-4">
            {course.modules.map((lesson, index) => (
              <RevealOnScroll as="li" key={lesson.title} delay={index * 70}>
                <SpotlightCard padding="lg" className="flex flex-wrap gap-x-6 gap-y-3">
                  <div className="flex min-w-0 flex-1 gap-5">
                    <span
                      aria-hidden="true"
                      className="font-display-numeric grid size-11 shrink-0 place-items-center rounded-xl border border-brand-500/25 bg-brand-500/10 text-sm font-semibold text-brand-300"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-h4 font-semibold text-white">{lesson.title}</h3>
                      <p className="mt-2 text-sm text-text-secondary pretty-text">
                        {lesson.summary}
                      </p>
                    </div>
                  </div>
                  <p className="font-display-numeric shrink-0 self-start text-caption tracking-[0.12em] text-text-muted uppercase">
                    {lesson.hours}h
                  </p>
                </SpotlightCard>
              </RevealOnScroll>
            ))}
          </ol>
        </PageContainer>
      </Section>

      {/* Outcomes, prerequisites, tooling -------------------------------- */}
      <Section spacing={false} className="pb-16" aria-labelledby="outcomes-title">
        <PageContainer>
          <div className="grid gap-6 lg:grid-cols-3">
            <RevealOnScroll>
              <div className="glass glass-edge h-full rounded-glass-lg p-6">
                <h2 id="outcomes-title" className="flex items-center gap-2.5 text-h4 font-semibold text-white">
                  <GraduationIcon width={18} height={18} className="text-brand-300" />
                  By the end you can
                </h2>
                <ul className="mt-4 space-y-3">
                  {course.outcomes.map((outcome) => (
                    <li key={outcome} className="flex gap-3 text-sm text-text-secondary">
                      <CheckIcon width={16} height={16} className="mt-0.5 shrink-0 text-brand-400" />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={90}>
              <div className="glass glass-edge h-full rounded-glass-lg p-6">
                <h2 className="flex items-center gap-2.5 text-h4 font-semibold text-white">
                  <CompassIcon width={18} height={18} className="text-brand-300" />
                  Before you start
                </h2>
                <ul className="mt-4 space-y-3">
                  {course.prerequisites.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-text-secondary">
                      <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-500/70" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="mt-6 flex items-center gap-2.5 text-sm font-semibold text-white">
                  <BookIcon width={16} height={16} className="text-brand-300" />
                  You will install
                </h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {course.tooling.map((tool) => (
                    <li key={tool} className="chip">
                      {tool}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={180}>
              <div className="glass glass-edge h-full rounded-glass-lg p-6">
                <h2 className="text-h4 font-semibold text-white">Capstone project</h2>
                <p className="mt-3 text-sm text-text-secondary pretty-text">
                  Plan, build and ship {course.capstone}. It is assessed the way a review would
                  assess it: naming, error handling, tests, and whether each commit can be
                  understood on its own.
                </p>
                <p className="mt-5 border-t border-white/8 pt-4 text-caption text-text-muted">
                  {isReady
                    ? "This course is marked available: finishing the capstone qualifies for a certificate of completion."
                    : "This course is still in production: certificates issued for it are labelled samples until it is marked available."}
                </p>
                <div className="mt-5">
                  <Button href="/academy#certificates" variant="glass">
                    {isReady ? "Certificate details" : "Sample certificate"}
                  </Button>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </PageContainer>
      </Section>

      {/* Siblings ---------------------------------------------------------- */}
      {siblings.length ? (
        <Section spacing={false} className="pb-20" aria-labelledby="more-title">
          <PageContainer>
            <RevealOnScroll>
              <h2 id="more-title" className="text-h3 font-semibold text-white">
                More in {track?.name ?? "this track"}
              </h2>
            </RevealOnScroll>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {siblings.slice(0, 6).map((sibling, index) => (
                <RevealOnScroll as="li" key={sibling.slug} delay={index * 70} className="h-full">
                  <SpotlightCard interactive className="flex h-full flex-col" padding="lg">
                    <p className="font-display-numeric text-sm font-semibold text-brand-300">
                      {sibling.mark}
                    </p>
                    <h3 className="mt-2 text-h4 font-semibold text-white">
                      <Link href={`/academy/${sibling.slug}`} className="hover:text-brand-200">
                        {sibling.language}
                      </Link>
                    </h3>
                    <p className="mt-2 text-sm text-text-muted pretty-text">{sibling.tagline}</p>
                    <p className="text-caption mt-4 text-text-muted">
                      {sibling.weeks} weeks · {sibling.hours} hours
                    </p>
                  </SpotlightCard>
                </RevealOnScroll>
              ))}
            </ul>
          </PageContainer>
        </Section>
      ) : null}

      <script
        type="application/ld+json"
        // Course schema with a real curriculum and no invented ratings.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            name: `${course.language} course`,
            description: course.summary,
            url: `${site.url}/academy/${course.slug}`,
            inLanguage: "en",
            provider: {
              "@type": "Organization",
              name: "Elyse Dev Academy",
              url: site.url,
            },
            ...(course.prerequisites.length
              ? { coursePrerequisites: course.prerequisites.join(", ") }
              : {}),
            educationalLevel: courseLevelLabels[course.level],
            timeRequired: `PT${course.hours}H`,
            hasCourseInstance: {
              "@type": "CourseInstance",
              courseMode: "online",
              courseWorkload: `PT${Math.round((course.hours / course.weeks) * 10) / 10}H`,
            },
            syllabusSections: course.modules.map((module) => ({
              "@type": "Syllabus",
              name: module.title,
              description: module.summary,
            })),
          }),
        }}
      />
    </>
  );
}
