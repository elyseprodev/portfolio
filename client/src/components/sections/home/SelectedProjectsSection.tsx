import { PageContainer, Section } from "@/components/layout/PageContainer";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { SourceBadge } from "@/components/ui/Badges";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ArrowRightIcon } from "@/components/ui/icons";
import type { Project, ServiceMeta } from "@elyse/database/types";
import type { DataSource } from "@/lib/api";

interface SelectedProjectsSectionProps {
  projects: Project[];
  source: DataSource;
  backend?: ServiceMeta;
}

/** ELYSE DEV — selected work on the homepage. */
export function SelectedProjectsSection({
  projects,
  source,
  backend,
}: SelectedProjectsSectionProps) {
  return (
    <Section id="projects" aria-labelledby="selected-projects-title">
      <PageContainer>
        <RevealOnScroll>
          <SectionHeading
            id="selected-projects-title"
            overline="Selected work"
            title="Projects I have been building"
            description="A full-stack portfolio, an education platform, a student messaging app and a video web application. Projects whose details are still being written are labelled so, and no link is shown that does not exist."
            action={
              <div className="flex flex-wrap items-center gap-3">
                <SourceBadge source={source} backend={backend} />
                <Button
                  href="/projects"
                  variant="glass"
                  icon={<ArrowRightIcon width={16} height={16} />}
                >
                  All projects
                </Button>
              </div>
            }
          />
        </RevealOnScroll>

        <ul className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <RevealOnScroll as="li" key={project.slug} delay={index * 110} className="h-full">
              <ProjectCard project={project} priority={index === 0} />
            </RevealOnScroll>
          ))}
        </ul>
      </PageContainer>
    </Section>
  );
}
