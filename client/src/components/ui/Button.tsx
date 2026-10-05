import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn, isExternalLink } from "@/lib/utils";

export type ButtonVariant = "primary" | "glass" | "ghost";
export type ButtonSize = "md" | "lg";

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
): string {
  return cn(
    "btn",
    variant === "primary" && "btn-primary",
    variant === "glass" && "btn-glass",
    variant === "ghost" && "btn-ghost",
    size === "lg" && "px-7 py-3.5 text-[0.98rem]",
    className,
  );
}

interface BaseProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  /** Adds a small circular icon badge after the label. */
  icon?: ReactNode;
}

interface LinkButtonProps extends BaseProps {
  href: string;
  /** Force external rendering (opens in a new tab, rel-protected). */
  external?: boolean;
  onClick?: never;
  type?: never;
  disabled?: never;
}

interface ActionButtonProps
  extends BaseProps,
    Omit<ComponentPropsWithoutRef<"button">, "children" | "className"> {
  href?: undefined;
  external?: never;
}

type ButtonProps = LinkButtonProps | ActionButtonProps;

function IconBadge({ icon }: { icon: ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className="ml-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-current/15 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/btn:translate-x-0.5"
    >
      {icon}
    </span>
  );
}

/**
 * Shared button surface. Renders an anchor, a Next `Link`, or a real button —
 * whichever the interaction actually needs, so keyboard and screen-reader
 * behaviour stays correct.
 */
export function Button(props: ButtonProps) {
  const { children, variant = "primary", size = "md", className, icon } = props;
  const classes = buttonClasses(variant, size, "group/btn");

  if ("href" in props && props.href) {
    const { href, external } = props;
    const leavesSite = external ?? isExternalLink(href);

    if (leavesSite) {
      return (
        <a
          href={href}
          className={cn(classes, className)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
          {icon ? <IconBadge icon={icon} /> : null}
        </a>
      );
    }

    return (
      <Link href={href} className={cn(classes, className)}>
        {children}
        {icon ? <IconBadge icon={icon} /> : null}
      </Link>
    );
  }

  const {
    children: _children,
    variant: _variant,
    size: _size,
    className: _className,
    icon: _icon,
    ...rest
  } = props as ActionButtonProps;

  return (
    <button {...rest} className={cn(classes, className)}>
      {children}
      {icon ? <IconBadge icon={icon} /> : null}
    </button>
  );
}
