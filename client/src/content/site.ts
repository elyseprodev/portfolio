/**
 * ELYSE DEV — site-wide configuration: identity, navigation and metadata.
 */

export const site = {
  name: "ELYSE DEV",
  developerName: "Elyse Dev",
  role: "Full-Stack Software Developer",
  location: "Rwanda",
  description:
    "ELYSE DEV — the portfolio of Elyse Dev, a full-stack software developer from Rwanda building modern web applications with React, Next.js, Node.js, Express and PHP.",
  github: "https://github.com/elyseprodev",
  /**
   * No public e-mail address has been supplied. Leave empty and the contact
   * page will say so honestly instead of inventing one. Set it (or the
   * CONTACT_NOTIFY_TO env var on the server) when you are ready.
   */
  email: "",
  /**
   * Production domain — intentionally empty until it is known.
   * Metadata falls back to the deployment URL provided by the host.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "",
  keywords: [
    "Elyse Dev",
    "ELYSE DEV",
    "elyseprodev",
    "full-stack developer Rwanda",
    "Next.js developer",
    "React developer",
    "Node.js developer",
    "Express.js developer",
    "PHP developer",
    "portfolio",
  ],
} as const;

export interface NavItem {
  href: string;
  label: string;
  /** Short description used by the mobile menu. */
  hint: string;
}

export const navItems: NavItem[] = [
  { href: "/", label: "Home", hint: "Start here" },
  { href: "/about", label: "About", hint: "Who I am and how I work" },
  { href: "/skills", label: "Skills", hint: "Technologies I build with" },
  { href: "/projects", label: "Projects", hint: "What I have been building" },
  { href: "/experience", label: "Experience", hint: "Journey and learning" },
  { href: "/github", label: "GitHub", hint: "Repositories and activity" },
  { href: "/contact", label: "Contact", hint: "Let's work together" },
];

/** Section anchors used by the homepage in-page navigation. */
export const homeSections = [
  { id: "hero", label: "Introduction" },
  { id: "highlights", label: "At a glance" },
  { id: "projects", label: "Selected projects" },
  { id: "skills", label: "Skills" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;
