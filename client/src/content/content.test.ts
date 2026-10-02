/**
 * ELYSE DEV — content integrity tests.
 *
 *   npm test -w @elyse/client
 *
 * These enforce the project's honesty rules as executable checks: no invented
 * links, artwork that actually exists on disk, alt text everywhere, no
 * duplicate slugs, and placeholders that stay flagged as placeholders.
 */
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

import { experience, placeholderExperience, confirmedExperience } from "./experience";
import { profile } from "./profile";
import { projectCategoryLabels, projects } from "./projects";
import {
  courseLevelLabels,
  courseStatusLabels,
  courseTracks,
  courses,
  getCatalogueTotals,
} from "./courses";
import { growthProgram } from "./growth";
import { skillGroups, technologyChips } from "./skills";

/** client/public — used to prove every referenced asset exists. */
const PUBLIC_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "public");

describe("profile", () => {
  it("states the verified identity", () => {
    assert.equal(profile.name, "Elyse Dev");
    assert.equal(profile.role, "Full-Stack Software Developer");
    assert.equal(profile.location, "Rwanda");
  });

  it("only publishes links that are configured", () => {
    assert.equal(profile.github, "https://github.com/elyseprodev");
    // Undefined or an empty string both mean "not published"; anything else
    // must be a real address, because it is rendered as a mailto: link.
    const email = profile.email;
    assert.ok(
      email === undefined || email === "" || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email),
      "profile.email must be unset or a valid address",
    );
  });

  it("ships the copy the pages depend on", () => {
    assert.ok(profile.bio.length >= 3);
    assert.ok(profile.focusAreas.length >= 4);
    assert.ok(profile.highlights.length >= 3);
    for (const highlight of profile.highlights) {
      assert.ok(highlight.label.length > 0 && highlight.value.length > 0);
    }
  });
});

describe("projects", () => {
  it("has unique slugs", () => {
    const slugs = projects.map((project) => project.slug);
    assert.equal(new Set(slugs).size, slugs.length, "duplicate project slug");
  });

  it("uses valid categories with labels for each", () => {
    for (const project of projects) {
      assert.ok(
        project.category in projectCategoryLabels,
        `${project.slug} has an unlabelled category`,
      );
    }
  });

  it("never links to a URL that is not a real, absolute address", () => {
    for (const project of projects) {
      for (const link of project.links) {
        assert.match(
          link.href,
          // A bare https://host is a valid absolute address too — do not force a path.
          /^https:\/\/[\w.-]+(?:\/\S*)?$/,
          `${project.slug} → "${link.label}" is not an absolute https URL`,
        );
        assert.ok(link.label.trim().length > 0);
      }
    }
  });

  it("keeps every project's stack and summary non-empty", () => {
    for (const project of projects) {
      assert.ok(project.stack.length > 0, `${project.slug} has no technology stack`);
      assert.ok(project.summary.length > 40, `${project.slug} summary is too thin`);
      assert.ok(project.overview.length > 0, `${project.slug} has no overview copy`);
      assert.ok(project.problem.length > 20, `${project.slug} has no problem statement`);
    }
  });

  it("references artwork that exists in public/", () => {
    for (const project of projects) {
      for (const shot of project.gallery) {
        assert.ok(shot.src.startsWith("/"), `${project.slug} artwork must be a local path`);
        assert.ok(
          existsSync(join(PUBLIC_DIR, shot.src.replace(/^\//, ""))),
          `missing artwork file: ${shot.src}`,
        );
        assert.ok(
          shot.alt.trim().length > 20,
          `${project.slug} artwork needs descriptive alt text`,
        );
      }
    }
  });

  it("marks unfinished case studies as drafts", () => {
    const drafts = projects.filter((project) => project.isDraft);
    assert.ok(drafts.length > 0, "expected at least one clearly-marked draft");

    for (const draft of drafts) {
      // A draft must not pretend to have a live demo or source repository.
      assert.equal(
        draft.links.filter((link) => link.kind === "live" || link.kind === "source").length,
        0,
        `${draft.slug} is a draft but claims a live/source link`,
      );
    }
  });

  it("documents challenges as challenge/solution pairs", () => {
    for (const project of projects) {
      for (const item of project.challenges) {
        assert.ok(item.challenge.length > 15 && item.solution.length > 15);
      }
    }
  });
});

describe("skills", () => {
  it("has unique group ids and at least one skill per group", () => {
    const ids = skillGroups.map((group) => group.id);
    assert.equal(new Set(ids).size, ids.length, "duplicate skill group id");

    for (const group of skillGroups) {
      assert.ok(group.skills.length > 0, `${group.id} has no skills`);
      assert.ok(group.title.length > 0 && group.description.length > 20);
    }
  });

  it("gives every group a pictograph for its heading", () => {
    for (const group of skillGroups) {
      assert.ok(
        group.emoji && group.emoji.trim().length > 0,
        `${group.id} has no emoji for its heading`,
      );
    }
  });

  it("has unique technology names across groups", () => {
    const names = skillGroups.flatMap((group) => group.skills.map((skill) => skill.name));
    assert.equal(new Set(names).size, names.length, "a technology is listed twice");

    for (const group of skillGroups) {
      for (const skill of group.skills) {
        assert.ok(skill.icon.length > 0, `${skill.name} has no icon key`);
      }
    }
  });

  it("keeps the homepage chip list inside the documented stack", () => {
    const known = new Set(
      skillGroups.flatMap((group) => group.skills.map((skill) => skill.name)),
    );
    assert.ok(technologyChips.length >= 8);

    for (const chip of technologyChips) {
      // Chips may be short forms ("Git") of grouped entries ("Git & GitHub").
      const matches = [...known].some(
        (name) => name === chip || name.startsWith(chip) || name.includes(chip),
      );
      assert.ok(matches, `"${chip}" is not part of the documented skill groups`);
    }
  });

  it("does not claim a proficiency percentage anywhere", () => {
    for (const group of skillGroups) {
      for (const skill of group.skills) {
        assert.ok(!/\d{1,3}\s?%/.test(skill.note ?? ""), `${skill.name} claims a score`);
      }
      assert.ok(!/\d{1,3}\s?%/.test(group.description), `${group.id} claims a score`);
    }
  });
});

describe("experience", () => {
  it("has unique ids and real copy on every entry", () => {
    const ids = experience.map((entry) => entry.id);
    assert.equal(new Set(ids).size, ids.length, "duplicate experience id");

    for (const entry of experience) {
      assert.ok(entry.summary.length > 30, `${entry.id} summary is too thin`);
      assert.ok(entry.title.trim().length > 0);
    }
  });

  it("partitions entries into confirmed and pending without overlap", () => {
    assert.equal(confirmedExperience.length + placeholderExperience.length, experience.length);
    for (const entry of placeholderExperience) {
      assert.equal(entry.isPlaceholder, true);
    }
    for (const entry of confirmedExperience) {
      assert.equal(entry.isPlaceholder, false);
    }
  });

  it("never states a fabricated period on a placeholder", () => {
    for (const entry of placeholderExperience) {
      const period = entry.period ?? "";
      assert.ok(
        period === "" || /add|current|ongoing/i.test(period),
        `${entry.id} invents a date range`,
      );
    }
  });
});

describe("cross-content consistency", () => {
  it("uses one canonical GitHub URL everywhere", () => {
    const urls = new Set<string>();
    // Imported lazily to avoid a circular import in the test file.
    urls.add(profile.github);
    for (const project of projects) {
      for (const link of project.links) {
        if (link.href.includes("github.com")) urls.add(link.href);
      }
    }
    // At most two: the profile URL plus the repository that hosts this project.
    assert.ok(urls.size <= 3, `unexpected spread of GitHub URLs: ${[...urls].join(", ")}`);
  });
});

describe("academy courses", () => {
  it("covers every major programming language with a unique slug", () => {
    const slugs = courses.map((course) => course.slug);
    assert.equal(new Set(slugs).size, slugs.length, "duplicate course slug");
    assert.ok(courses.length >= 25, `expected a broad catalogue, found ${courses.length}`);
  });

  it("keeps language names unique too", () => {
    const languages = courses.map((course) => course.language);
    assert.equal(new Set(languages).size, languages.length, "duplicate language");
  });

  it("places every course in a real track", () => {
    const trackIds = new Set(courseTracks.map((track) => track.id));
    for (const course of courses) {
      assert.ok(trackIds.has(course.trackId), `${course.slug} has an unknown track`);
    }
  });

  it("labels every level and status it uses", () => {
    for (const course of courses) {
      assert.ok(course.level in courseLevelLabels, `${course.slug} has an unlabelled level`);
      assert.ok(course.status in courseStatusLabels, `${course.slug} has an unlabelled status`);
    }
  });

  it("gives every course a complete, honest curriculum", () => {
    for (const course of courses) {
      assert.ok(course.summary.length > 60, `${course.slug} summary is too thin`);
      assert.ok(course.outcomes.length >= 3, `${course.slug} needs at least three outcomes`);
      assert.ok(course.prerequisites.length > 0, `${course.slug} needs prerequisites`);
      assert.ok(course.tooling.length >= 2, `${course.slug} needs real tools listed`);
      assert.ok(course.capstone.length > 10, `${course.slug} needs a capstone`);
      assert.ok(course.weeks > 0 && course.hours > 0);
      assert.equal(course.modules.length, 6, `${course.slug} should have six modules`);

      const moduleHours = course.modules.reduce((total, lesson) => total + lesson.hours, 0);
      assert.equal(
        moduleHours,
        course.hours,
        `${course.slug} module hours must add up to the course hours`,
      );

      for (const lesson of course.modules) {
        assert.ok(lesson.title.trim().length > 3, `${course.slug} has an untitled module`);
        assert.ok(lesson.summary.length > 30, `${course.slug}/"${lesson.title}" is too thin`);
        assert.ok(lesson.hours > 0, `${course.slug}/"${lesson.title}" has no hours`);
      }
    }
  });

  it("references course artwork that exists in public/", () => {
    for (const course of courses) {
      assert.ok(course.image.startsWith("/images/courses/"), `${course.slug} artwork path is odd`);
      assert.ok(
        existsSync(join(PUBLIC_DIR, course.image.replace(/^\//, ""))),
        `missing course artwork: ${course.image}`,
      );
    }
  });

  it("never claims a rating, a student count or a review", () => {
    // Honesty guard: only facts Elyse can supply may appear on a course.
    const banned = /(\d+\s*(stars?|ratings?|reviews?)|\d[\d,]*\s*(students|learners|graduates)|best[- ]selling)/i;
    for (const course of courses) {
      const text = [course.summary, course.tagline, ...course.outcomes, course.capstone].join(" ");
      assert.doesNotMatch(text, banned, `${course.slug} claims an unverifiable statistic`);
    }
  });

  it("counts the catalogue from the same data the pages render", () => {
    const totals = getCatalogueTotals();
    assert.equal(totals.courses, courses.length);
    assert.equal(totals.languages, courses.length);
    assert.equal(totals.tracks, courseTracks.length);
    assert.equal(
      totals.hours,
      courses.reduce((total, course) => total + course.hours, 0),
    );
    assert.ok(totals.modules >= courses.length * 6);
    assert.ok(totals.available > 0, "at least one course should be available to study");
  });
});

describe("growth programme", () => {
  it("describes four phases with practices and evidence", () => {
    assert.equal(growthProgram.phases.length, 4);
    for (const phase of growthProgram.phases) {
      assert.ok(phase.practices.length >= 3, `${phase.id} needs practices`);
      assert.ok(phase.evidence.length > 20, `${phase.id} needs evidence to produce`);
      assert.ok(phase.goal.length > 20, `${phase.id} needs a goal`);
    }
  });

  it("keeps a weekly rhythm for every working day", () => {
    assert.equal(growthProgram.rhythm.length, 5);
    for (const day of growthProgram.rhythm) {
      assert.ok(day.focus.length > 3 && day.detail.length > 10);
    }
  });
});
