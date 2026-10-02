import { PageContainer, Section } from "@/components/layout/PageContainer";

/**
 * ELYSE DEV — route loading state.
 *
 * A glass skeleton rather than a spinner, so the layout does not jump when the
 * real content arrives. Announced politely for screen readers.
 */
export default function Loading() {
  return (
    <Section spacing={false} className="pt-6 pb-16">
      <PageContainer>
        <p role="status" className="sr-only">
          Loading page content…
        </p>

        <div aria-hidden="true" className="animate-pulse-soft space-y-6">
          <div className="h-3 w-32 rounded-full bg-white/8" />
          <div className="h-10 w-3/4 max-w-xl rounded-2xl bg-white/8" />
          <div className="h-4 w-2/3 max-w-lg rounded-full bg-white/6" />

          <div className="grid gap-5 pt-8 md:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="glass-subtle h-64 rounded-glass"
                style={{ animationDelay: `${index * 120}ms` }}
              />
            ))}
          </div>
        </div>
      </PageContainer>
    </Section>
  );
}
