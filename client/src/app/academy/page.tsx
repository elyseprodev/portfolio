import type { Metadata } from "next";
import Image from "next/image";

import { CertificateForm } from "@/components/academy/CertificateForm";
import { CourseCard } from "@/components/academy/CourseCard";
import { GrowthProgramSection } from "@/components/academy/GrowthProgramSection";
import { PageContainer, Section } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { Button } from "@/components/ui/Button";
import { SourceBadge } from "@/components/ui/Badges";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  courseStatusLabels,
  getCatalogueTotals,
  getTrackSummaries,
  summariseCourses,
} from "@/content/courses";
import { site } from "@/content/site";
import { loadAcademy } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";

const TITLE = "Academy — courses in every major programming language";
const DESCRIPTION =
  "Free, structured courses in 33 programming languages: HTML and CSS, JavaScript and TypeScript, Python, Java, C# and Go through Rust, C++, SQL, Swift, Kotlin, R, Haskell and more — each with a weekly curriculum, a capstone project and a verifiable certificate.";

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/academy",
  keywords: [
    "learn programming",
    "programming courses",
    "JavaScript course",
    "Python course",
    "Rust course",
    "SQL course",
    "free coding curriculum",
    "developer growth programme",
    "certificate of completion",
  ],
});

/** Every course is known at build time, so the whole academy prerenders. */
export const revalidate = 3600;

export default async function AcademyPage() {
  const academy = await loadAcademy();
  const { courses, tracks } = academy.data;
  const totals = getCatalogueTotals();

  /**
   * Cards receive summaries, not full courses: the curriculum of every course
   * is what its own page is for. This keeps the catalogue's HTML small.
   */
  const summaries = summariseCourses(courses);
  const availableCount = summaries.filter((course) => course.status === "available").length;
  const countByStatus = (status: (typeof summaries)[number]["status"]) =>
    summaries.filter((course) => course.status === status).length;

  return (
    <>
      <PageHeader
        overline="Elyse Dev Academy"
        title={
          <>
            Learn the language.
            <br />
            Then ship something real.
          </>
        }
        description={
          <>
            {totals.languages} courses, one for every major programming language — {totals.modules}{" "}
            modules and about {totals.hours} hours of curriculum. Each course is specific to its
            language&apos;s real ecosystem, ends in a capstone project, and awards a certificate
            anyone can verify by code.
          </>
        }
        actions={
          <>
            <Button href="/academy#courses" variant="primary">
              Browse the catalogue
            </Button>
            <Button href="#certificates" variant="glass">
              Issue a certificate
            </Button>
            <Button href="/academy/program" variant="ghost">
              Developer Growth Programme
            </Button>
          </>
        }
        aside={
          <div className="glass glass-edge w-full max-w-sm overflow-hidden rounded-glass-lg p-3 lg:max-w-[20rem]">
            <Image
              src="/images/courses/tracks/backend.svg"
              alt="Generated artwork representing the backend and APIs track"
              width={1600}
              height={420}
              sizes="(min-width: 1024px) 20rem, 80vw"
              className="h-auto w-full rounded-[1.3rem]"
              priority
            />
            <dl className="grid grid-cols-2 gap-3 p-3">
              <div>
                <dt className="text-[0.66rem] tracking-[0.14em] text-text-muted uppercase">
                  Languages
                </dt>
                <dd className="font-display-numeric text-lg font-semibold text-white">
                  {totals.languages}
                </dd>
              </div>
              <div>
                <dt className="text-[0.66rem] tracking-[0.14em] text-text-muted uppercase">
                  Tracks
                </dt>
                <dd className="font-display-numeric text-lg font-semibold text-white">
                  {totals.tracks}
                </dd>
              </div>
              <div>
                <dt className="text-[0.66rem] tracking-[0.14em] text-text-muted uppercase">
                  Curriculum
                </dt>
                <dd className="font-display-numeric text-lg font-semibold text-white">
                  {totals.hours}h
                </dd>
              </div>
              <div>
                <dt className="text-[0.66rem] tracking-[0.14em] text-text-muted uppercase">
                  Live now
                </dt>
                <dd className="font-display-numeric text-lg font-semibold text-white">
                  {availableCount}
                </dd>
              </div>
            </dl>
            <div className="flex items-center justify-between gap-3 px-3 pb-2">
              <p className="text-caption text-text-muted">
                Free to study. No account, no email required.
              </p>
              <SourceBadge source={academy.source} backend={academy.backend} />
            </div>
          </div>
        }
      />

      {/* How the academy works ------------------------------------------- */}
      <Section spacing={false} className="pb-4" aria-labelledby="academy-truth-title">
        <PageContainer>
          <RevealOnScroll>
            <div className="glass glass-edge rounded-glass-lg p-6 sm:p-7">
              <h2 id="academy-truth-title" className="text-h4 font-semibold text-white">
                What a course is, exactly
              </h2>
              <ul className="mt-4 grid gap-4 sm:grid-cols-3">
                <li className="text-sm text-text-secondary">
                  <span className="font-medium text-white">A published curriculum.</span> Every
                  course lists its modules, hours, prerequisites, tooling and the capstone you build
                  — before you commit a week to it.
                </li>
                <li className="text-sm text-text-secondary">
                  <span className="font-medium text-white">A status you can trust.</span>{" "}
                  &ldquo;Available now&rdquo; means the material is ready; &ldquo;in
                  development&rdquo; means the curriculum is published while lessons are being
                  produced; &ldquo;on the roadmap&rdquo; means planned.
                </li>
                <li className="text-sm text-text-secondary">
                  <span className="font-medium text-white">A certificate with a code.</span> Issued
                  for the course, verifiable at its own URL, and labelled a sample whenever the
                  course is not finished yet.
                </li>
              </ul>
            </div>
          </RevealOnScroll>
        </PageContainer>
      </Section>

      {/* Catalogue -------------------------------------------------------- */}
      <Section id="courses" aria-labelledby="courses-title">
        <PageContainer>
          <RevealOnScroll>
            <SectionHeading
              id="courses-title"
              overline="The catalogue"
              title="Every language, grouped by what it is for"
              description={`${totals.languages} courses across ${totals.tracks} tracks. Each one is written for that language specifically — the tooling, the concepts and the project at the end are its own.`}
            />
          </RevealOnScroll>

          <nav aria-label="Course tracks" className="mt-8 flex flex-wrap gap-2">
            {tracks.map((track) => (
              <a
                key={track.id}
                href={`#track-${track.id}`}
                className="chip transition-colors hover:border-brand-400/50 hover:text-white"
              >
                {track.emoji ? (
                  <span aria-hidden="true" className="mr-1.5">
                    {track.emoji}
                  </span>
                ) : null}
                {track.name}
                <span className="ml-1.5 text-text-muted">
                  {getTrackSummaries(track.id).length}
                </span>
              </a>
            ))}
          </nav>

          {tracks.map((track) => {
            const trackCourses = getTrackSummaries(track.id);
            if (!trackCourses.length) return null;

            return (
              <div key={track.id} id={`track-${track.id}`} className="mt-12 scroll-mt-28">
                <RevealOnScroll>
                  <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/8 pb-5">
                    <div>
                      <h3 className="text-h3 font-semibold text-white">
                        {track.emoji ? (
                          <span aria-hidden="true" className="mr-2">
                            {track.emoji}
                          </span>
                        ) : null}
                        {track.name}
                      </h3>
                      <p className="mt-2 max-w-2xl text-sm text-text-muted pretty-text">
                        {track.description}
                      </p>
                    </div>
                    <p className="text-caption tracking-[0.12em] text-text-muted uppercase">
                      {trackCourses.length} course{trackCourses.length === 1 ? "" : "s"}
                    </p>
                  </div>
                </RevealOnScroll>

                <ul className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {trackCourses.map((course, index) => (
                    <RevealOnScroll
                      as="li"
                      key={course.slug}
                      delay={index * 80}
                      className="h-full"
                    >
                      <CourseCard course={course} className="h-full" />
                    </RevealOnScroll>
                  ))}
                </ul>
              </div>
            );
          })}
        </PageContainer>
      </Section>

      {/* Certificates ------------------------------------------------------ */}
      <Section id="certificates" aria-labelledby="certificates-title">
        <PageContainer>
          <RevealOnScroll>
            <SectionHeading
              id="certificates-title"
              overline="Certificates"
              title="A certificate that anyone can check"
              description="Issue one for yourself or a student, print it, and send the code with it. The record lives on the server and the verification page is public — no account, no login, no email address stored."
            />
          </RevealOnScroll>

          <div className="mt-10">
            <CertificateForm
              courses={summaries.map(({ slug, language, hours, status }) => ({
                slug,
                language,
                hours,
                status,
              }))}
            />
          </div>

          <RevealOnScroll delay={80}>
            <p className="mt-6 text-caption text-text-muted">
              Course statuses on this page:{" "}
              {(["available", "in-development", "planned"] as const)
                .map(
                  (status) =>
                    `${courseStatusLabels[status]} — ${countByStatus(status)}`,
                )
                .join(" · ")}
              . Statuses are edited in one file,{" "}
              <code className="text-text-secondary">client/src/content/courses.ts</code>.
            </p>
          </RevealOnScroll>
        </PageContainer>
      </Section>

      {/* Growth programme --------------------------------------------------- */}
      <GrowthProgramSection headingLevel="h2" />

      {/* Closing CTA ------------------------------------------------------- */}
      <Section spacing={false} className="pb-20" aria-labelledby="academy-cta-title">
        <PageContainer>
          <RevealOnScroll>
            <div className="glass glass-edge flex flex-wrap items-center justify-between gap-6 rounded-glass-lg p-7">
              <div>
                <h2 id="academy-cta-title" className="text-h3 font-semibold text-white">
                  Questions about a course, or want to teach one?
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-text-muted">
                  The academy is built in public. If a module is wrong, out of date, or missing the
                  language you want next, say so — {site.name} reads every message.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button href="/contact" variant="primary">
                  Send a message
                </Button>
                <Button href="/projects" variant="glass">
                  See the portfolio
                </Button>
              </div>
            </div>
          </RevealOnScroll>
        </PageContainer>
      </Section>

      {/* Structured data for search engines -------------------------------- */}
      <script
        type="application/ld+json"
        // Catalogue-level schema: a list of courses, not a fake rating.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Elyse Dev Academy courses",
            numberOfItems: courses.length,
            itemListElement: summaries.map((course, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "Course",
                name: `${course.language} course`,
                description: course.tagline,
                url: `${site.url}/academy/${course.slug}`,
                provider: { "@type": "Organization", name: "Elyse Dev Academy" },
              },
            })),
          }),
        }}
      />
    </>
  );
}
