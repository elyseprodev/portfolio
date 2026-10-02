import type { Metadata } from "next";
import Link from "next/link";

import { CertificateDocument } from "@/components/academy/CertificateDocument";
import { VerifyForm } from "@/components/academy/VerifyForm";
import { PageContainer, Section } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Badges";
import { AlertIcon, CheckIcon } from "@/components/ui/icons";
import { loadCertificate } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";
import { normaliseCode } from "@/lib/certificate-code";

interface CertificatePageProps {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: CertificatePageProps): Promise<Metadata> {
  const { code } = await params;
  const normalised = normaliseCode(decodeURIComponent(code));

  return buildMetadata({
    title: `Certificate ${normalised}`,
    description: `Verification record for Elyse Dev Academy certificate ${normalised}.`,
    path: `/certificate/${normalised}`,
  });
}

/**
 * A certificate is verified on the server against the API — the record is read
 * fresh every time and never cached, so a revoked or mistyped code can never
 * appear verified because of a stale cache.
 */
export const dynamic = "force-dynamic";

export default async function CertificateVerifyPage({ params }: CertificatePageProps) {
  const { code } = await params;
  const requested = decodeURIComponent(code);
  const normalised = normaliseCode(requested);
  const certificate = await loadCertificate(normalised);

  if (!certificate) {
    return (
      <>
        <PageHeader
          overline="Certificate verification"
          title="No certificate matches that code"
          description={
            <>
              Codes look like <span className="font-mono text-text-primary">EDA-KM3P-9RTU</span>.
              Check for a mistyped character — the letters O, I, L, S, B and the digits 0, 1, 2, 5
              and 8 are never used, precisely so they cannot be confused.
            </>
          }
          aside={
            <div className="glass glass-edge w-full max-w-sm rounded-glass-lg p-6">
              <p className="flex items-center gap-2 text-sm font-medium text-amber-200">
                <AlertIcon width={16} height={16} />
                Not found
              </p>
              <p className="mt-2 text-sm text-text-muted">
                Nothing was recorded for <span className="font-mono">{normalised}</span>.
              </p>
            </div>
          }
        />

        <Section spacing={false} className="pb-20">
          <PageContainer>
            <div className="max-w-3xl">
              <VerifyForm initialCode={normalised} />
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/certificate" variant="primary">
                Issue a certificate
              </Button>
              <Button href="/academy#certificates" variant="glass">
                Back to the academy
              </Button>
            </div>
          </PageContainer>
        </Section>
      </>
    );
  }

  const isSample = certificate.kind === "sample";

  return (
    <>
      <PageHeader
        overline="Certificate verification"
        title="This certificate is on record"
        description={
          <>
            Issued by the Elyse Dev Academy for the {certificate.courseTitle} course. The code below
            resolves to exactly one record, and this page is the record.
          </>
        }
        actions={
          <>
            <Button href="/academy#certificates" variant="glass">
              Issue another
            </Button>
            <Button href="/academy" variant="ghost">
              Browse courses
            </Button>
          </>
        }
        aside={
          <div className="glass glass-edge w-full max-w-sm rounded-glass-lg p-6">
            <div className="flex flex-wrap gap-2">
              <Pill className="border-emerald-400/35 bg-emerald-500/12 text-emerald-200">
                <CheckIcon width={14} height={14} className="mr-1.5" />
                Verified {new Date().getFullYear()}
              </Pill>
              {isSample ? (
                <Pill className="border-amber-400/40 bg-amber-500/12 text-amber-200">Sample</Pill>
              ) : (
                <Pill className="border-emerald-400/35 bg-emerald-500/12 text-emerald-200">
                  Completion
                </Pill>
              )}
            </div>
            <dl className="mt-5 space-y-3">
              <div>
                <dt className="text-caption tracking-[0.14em] text-text-muted uppercase">
                  Code
                </dt>
                <dd className="font-mono text-sm text-white">{certificate.code}</dd>
              </div>
              <div>
                <dt className="text-caption tracking-[0.14em] text-text-muted uppercase">
                  Course
                </dt>
                <dd className="text-sm text-text-secondary">
                  <Link
                    href={`/academy/${certificate.courseSlug}`}
                    className="hover:text-white"
                  >
                    {certificate.courseTitle}
                  </Link>
                </dd>
              </div>
            </dl>
            <p className="mt-5 border-t border-white/8 pt-4 text-caption text-text-muted">
              Codes are checked live — nothing on this page is served from a cache.
            </p>
          </div>
        }
      />

      <Section spacing={false} className="pb-20" aria-labelledby="record-title">
        <PageContainer>
          <RevealOnScroll>
            <h2 id="record-title" className="sr-only">
              Certificate record
            </h2>
            <CertificateDocument certificate={certificate} />
          </RevealOnScroll>
        </PageContainer>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOccupationalCredential",
            name: `${certificate.courseTitle} certificate`,
            credentialCategory: isSample ? "sample" : "certificate",
            identifier: certificate.code,
            dateCreated: certificate.issuedAt,
            competencyRequired: `${certificate.hours} hours, ${certificate.moduleCount} modules`,
            recognizedBy: { "@type": "Organization", name: "Elyse Dev Academy" },
            ...(isSample
              ? { creativeWorkStatus: "Sample — the course is still in production" }
              : {}),
          }),
        }}
      />
    </>
  );
}
