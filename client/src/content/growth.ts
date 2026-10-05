import type { GrowthProgram } from "@elyse/database/types";

/**
 * ELYSE DEV ACADEMY — the Developer Growth Programme.
 *
 * ⚠️ EDITABLE — a structured way for a developer to get measurably better:
 * four phases, a weekly rhythm, and assessment rubrics that say what "good"
 * means instead of leaving it to taste.
 *
 * Nothing here claims a cohort size, a completion rate or a placement record.
 * Those are facts only the academy can supply, and the site never invents them.
 */
export const growthProgram: GrowthProgram = {
  id: "developer-growth",
  name: "Developer Growth Programme",
  tagline: "Four phases from \"I can build things\" to \"I can be trusted with the hard parts\"",
  summary:
    "A structured practice programme for developers who already ship code and want to get deliberate about it. Each phase has one goal, a set of practices, and a piece of evidence you produce at the end — the evidence is what makes the progress real rather than felt.",
  durationWeeks: 12,
  weeklyHours: "6–8 hours a week",
  audiences: [
    "Self-taught developers who know the syntax but not the craft",
    "Bootcamp and university graduates closing the gap to a first job",
    "Junior developers who want to be trusted with the harder tickets",
    "Anyone returning to code after time away and needing a route back in",
  ],
  principles: [
    {
      title: "Practice beats watching",
      body: "Every session ends with something that runs, not something else that was read. Tutorials count as preparation, never as progress.",
    },
    {
      title: "One concept per week, applied",
      body: "A week takes a single idea — indexing, error handling, testing, a layout system — and uses it in a real project rather than in an isolated exercise.",
    },
    {
      title: "Read code like a professional",
      body: "A serious developer spends as much time reading code as writing it. Every phase includes reading and explaining other people's work.",
    },
    {
      title: "Evidence over memory",
      body: "Progress is judged by what can be shown: a repository, a test suite, a written decision, a benchmark, a review of your own old code.",
    },
  ],
  phases: [
    {
      id: "phase-foundations",
      name: "Foundations under the fingers",
      emoji: "🧱",
      weeks: "Weeks 1–3",
      goal: "Remove hesitation: no more looking up how a loop, a function or a module works in your main language.",
      practices: [
        "Daily 15-minute katas in your primary language, typed from scratch",
        "Rebuild one small tool you already use, without a tutorial",
        "Write your own reference notes for six core concepts",
        "Read one well-known open-source file end to end and summarise it",
      ],
      evidence:
        "A daily-practice log and a small tool you built unaided, both public in a repository.",
    },
    {
      id: "phase-depth",
      name: "Depth in one stack",
      emoji: "🔍",
      weeks: "Weeks 4–6",
      goal: "Go deep in one stack until the awkward parts are familiar: data, errors, performance and the standard library.",
      practices: [
        "Rewrite the same feature three ways and benchmark or compare them honestly",
        "Trace one request end to end through the whole stack",
        "Improve the worst-performing part of a project you own and measure the result",
        "Write a decision record: what you chose, the alternatives, and why",
      ],
      evidence:
        "A performance or design improvement with the before-and-after numbers written down.",
    },
    {
      id: "phase-quality",
      name: "Quality and review",
      emoji: "🧪",
      weeks: "Weeks 7–9",
      goal: "Make your work reviewable: tests that catch regressions, commits a stranger can follow, and code you would approve.",
      practices: [
        "Test an existing project from 0% to real coverage, starting with the risky paths",
        "Refactor one file until it has a single clear reason to change",
        "Review three pull requests in public repositories and post useful comments",
        "Write a bug report and a fix, in that order, for a project you do not own",
      ],
      evidence:
        "A test suite, a refactoring commit, and review comments you can point at publicly.",
    },
    {
      id: "phase-shipping",
      name: "Shipping and explaining",
      emoji: "🚀",
      weeks: "Weeks 10–12",
      goal: "Deploy something real, make it observable, and explain it to someone who is not you.",
      practices: [
        "Deploy a project with environment configuration, logs and a health check",
        "Write the README a newcomer needs: what it is, how to run it, what breaks",
        "Do a five-minute demo of your work to another developer and take the questions",
        "Prepare a short portfolio entry: problem, decisions, trade-offs, result",
      ],
      evidence:
        "A deployed project with a README, plus a written portfolio entry you can defend in an interview.",
    },
  ],
  rhythm: [
    {
      day: "Monday",
      focus: "Read and take notes",
      detail: "One concept, documented in your own words with one working example.",
    },
    {
      day: "Tuesday",
      focus: "Deliberate practice",
      detail: "Kata or exercise on that concept — typed, not copied.",
    },
    {
      day: "Wednesday",
      focus: "Apply it to a real project",
      detail: "Use the concept in the project you already own, however small the change.",
    },
    {
      day: "Thursday",
      focus: "Read someone else's code",
      detail: "Open-source, a colleague's pull request, or your own work from last month.",
    },
    {
      day: "Friday",
      focus: "Write it down",
      detail: "A short entry: what worked, what did not, what you would do differently.",
    },
  ],
  assessment: [
    {
      title: "Can you explain it without notes?",
      body: "If the concept only exists while the documentation tab is open, it is not learned yet. Explaining it out loud to someone is the honest test.",
    },
    {
      title: "Does it survive review?",
      body: "Work is assessed as if a senior reviewer had read it: naming, error handling, tests, and whether the commits can be understood in isolation.",
    },
    {
      title: "Did anything get measured?",
      body: "Performance claims need numbers, and improvements need a before-and-after. Unmeasured improvement is a story, not evidence.",
    },
  ],
};
