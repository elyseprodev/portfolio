import { GitHubIcon, MailIcon } from "./icons";

interface SocialLinksProps {
  github: string;
  /** Only rendered when a real address has been supplied. */
  email?: string;
  className?: string;
}

/**
 * ELYSE DEV — outward links.
 *
 * Only links that actually exist are rendered: GitHub (known) and e-mail (only
 * if you set `profile.email`). No placeholder social accounts are invented.
 */
export function SocialLinks({ github, email, className }: SocialLinksProps) {
  return (
    <ul className={className ?? "flex flex-wrap items-center gap-2"}>
      <li>
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className="chip hover:border-brand-400/40"
        >
          <GitHubIcon width={15} height={15} />
          GitHub
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </li>
      {email ? (
        <li>
          <a href={`mailto:${email}`} className="chip hover:border-brand-400/40">
            <MailIcon width={15} height={15} />
            {email}
          </a>
        </li>
      ) : null}
    </ul>
  );
}
