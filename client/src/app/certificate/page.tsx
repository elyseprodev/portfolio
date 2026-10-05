import type { Metadata } from "next";
import Image from "next/image";

import { CertificateForm } from "@/components/academy/CertificateForm";
import { VerifyForm } from "@/components/academy/VerifyForm";
import { PageContainer, Section } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { summariseCourses } from "@/content/courses";
import { loadCourses } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Certificates — issue one, verify one",
  description:
    "Issue an Elyse Dev Academy certificate of completion for any course, print it or save it as a PDF, and verify any certificate by its code. Samples are clearly labelled while a course is still in production.",
  path: "/certificate",
  keywords: [
    "certificate of completion",
    "verify certificate",
    "coding course certificate",
    "verifiable credential",
  ],
});

export default async function CertificatePage() {
  const loaded = await loadCourses();
  const options = summariseCourses(loaded.data).map(({ slug, language, hours, status }) => ({
    slug,
    language,
    hours,
    status,
  }));

  return (
    <>
      <PageHeader
        overline="Elyse Dev Academy"
        title="Certificates"
        description="Every course ends in a certificate with a code anyone can check. Issue one below, or paste a code to read the record behind it — no account and no email address required."
        aside={
          <div className="glass glass-edge w-full max-w-sm overflow-hidden rounded-glass-lg p-3 lg:max-w-[18rem]">
            <Image
              src="/images/courses/tracks/web.svg"
              alt="Generated artwork representing the web and frontend track"
              width={1600}
              height={420}
              sizes="(min-width: 1024px) 18rem, 80vw"
              className="h-auto w-full rounded-[1.3rem]"
              priority
            />
          </div>
        }
      />

      <Section spacing={false} className="pb-8" aria-labelledby="issue-title">
        <PageContainer>
          <RevealOnScroll>
            <SectionHeading
              id="issue-title"
              overline="Issue"
              title="Create a certificate"
              description="The name is printed exactly as you type it. The course decides whether it is a certificate of completion or a clearly-labelled sample."
            />
          </RevealOnScroll>
          <div className="mt-10">
            <CertificateForm courses={options} />
          </div>
        </PageContainer>
      </Section>

      <Section aria-labelledby="verify-title">
        <PageContainer>
          <RevealOnScroll>
            <SectionHeading
              id="verify-title"
              overline="Verify"
              title="Check a certificate code"
              description="A code such as EDA-KM3P-9RTU resolves to one record: the name, the course, the issue date and the curriculum it covers."
            />
          </RevealOnScroll>
          <div className="mt-8 max-w-3xl">
            <VerifyForm />
          </div>

          <RevealOnScroll delay={80}>
            <div className="glass glass-edge mt-8 rounded-glass-lg p-6">
              <h3 className="text-h4 font-semibold text-white">What is stored, and what is not</h3>
              <ul className="mt-4 grid gap-4 sm:grid-cols-3">
                <li className="text-sm text-text-secondary">
                  <span className="font-medium text-white">Stored:</span> the printed name, the
                  course, the issue date, the curriculum size and the code.
                </li>
                <li className="text-sm text-text-secondary">
                  <span className="font-medium text-white">Not stored:</span> no email address, no
                  account, no login record, no IP address kept alongside the certificate.
                </li>
                <li className="text-sm text-text-secondary">
                  <span className="font-medium text-white">Rate limited:</span> the issuance
                  endpoint throttles per visitor, so the codes cannot be farmed in bulk.
                </li>
              </ul>
            </div>
          </RevealOnScroll>
        </PageContainer>
      </Section>
    </>
  );
}
