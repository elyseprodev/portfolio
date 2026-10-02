import type { Metadata } from "next";

import { HeroSection } from "@/components/sections/home/HeroSection";
import { HighlightsSection } from "@/components/sections/home/HighlightsSection";
import { SelectedProjectsSection } from "@/components/sections/home/SelectedProjectsSection";
import { SkillsPreviewSection } from "@/components/sections/home/SkillsPreviewSection";
import { AboutPreviewSection } from "@/components/sections/home/AboutPreviewSection";
import { ContactCtaSection } from "@/components/sections/ContactCtaSection";
import { site } from "@/content/site";
import { loadProfile, loadProjects, loadSkillGroups } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: `${site.name} — ${site.developerName}, ${site.role}`,
  description: site.description,
  path: "/",
  keywords: ["full-stack developer portfolio", "Rwanda developer"],
  type: "profile",
});

/**
 * ELYSE DEV — homepage.
 *
 * Content is loaded from the API when it is reachable and from the bundled
 * typed content otherwise; each section receives plain, validated data.
 */
export default async function HomePage() {
  const [
    { data: profile },
    { data: projects, source: projectSource, backend },
    { data: skillGroups },
  ] = await Promise.all([loadProfile(), loadProjects(), loadSkillGroups()]);

  const featured = projects.filter((project) => project.featured).slice(0, 3);
  const selected = featured.length ? featured : projects.slice(0, 3);

  return (
    <>
      <HeroSection profile={profile} />
      <HighlightsSection
        highlights={profile.highlights}
        focusAreas={profile.focusAreas}
      />
      <SelectedProjectsSection
        projects={selected}
        source={projectSource}
        backend={backend}
      />
      <SkillsPreviewSection groups={skillGroups} />
      <AboutPreviewSection profile={profile} />
      <ContactCtaSection
        availability={profile.availability}
        github={profile.github}
      />
    </>
  );
}
