import { cn } from "@/lib/utils";

/**
 * ELYSE DEV — technology tile.
 *
 * A glass tile carrying a two-letter monogram and a brand-adjacent accent.
 * Deliberately not official brand logos: those are trademarks with specific
 * usage rules, and a consistent monogram system keeps the grid visually calm.
 * (Drop real SVGs in later if you prefer — the `icon` key in the content files
 * already identifies each technology.)
 */
interface Accent {
  monogram: string;
  accent: string;
  glow: string;
}

const ACCENTS: Record<string, Accent> = {
  html5: { monogram: "H5", accent: "#fb923c", glow: "rgba(251,146,60,0.30)" },
  css3: { monogram: "C3", accent: "#60a5fa", glow: "rgba(96,165,250,0.28)" },
  javascript: { monogram: "JS", accent: "#fbbf24", glow: "rgba(251,191,36,0.28)" },
  react: { monogram: "Re", accent: "#67e8f9", glow: "rgba(103,232,249,0.26)" },
  nextjs: { monogram: "N", accent: "#e5e7eb", glow: "rgba(229,231,235,0.22)" },
  tailwind: { monogram: "Tw", accent: "#38bdf8", glow: "rgba(56,189,248,0.26)" },
  node: { monogram: "Nd", accent: "#86efac", glow: "rgba(134,239,172,0.26)" },
  express: { monogram: "Ex", accent: "#f97316", glow: "rgba(249,115,22,0.28)" },
  php: { monogram: "Ph", accent: "#c4b5fd", glow: "rgba(196,181,253,0.26)" },
  mongodb: { monogram: "Mg", accent: "#4ade80", glow: "rgba(74,222,128,0.26)" },
  mysql: { monogram: "My", accent: "#7dd3fc", glow: "rgba(125,211,252,0.26)" },
  database: { monogram: "Db", accent: "#fdba74", glow: "rgba(253,186,116,0.26)" },
  git: { monogram: "Git", accent: "#fb923c", glow: "rgba(251,146,60,0.28)" },
  api: { monogram: "{}", accent: "#fcd34d", glow: "rgba(252,211,77,0.26)" },
  shield: { monogram: "Au", accent: "#fca5a5", glow: "rgba(252,165,165,0.26)" },
  lock: { monogram: "Lk", accent: "#fda4af", glow: "rgba(253,164,175,0.24)" },
  responsive: { monogram: "Rw", accent: "#a5b4fc", glow: "rgba(165,180,252,0.26)" },
};

const FALLBACK: Accent = {
  monogram: "</>",
  accent: "#fdba74",
  glow: "rgba(253,186,116,0.26)",
};

interface TechIconProps {
  icon: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const SIZE: Record<NonNullable<TechIconProps["size"]>, string> = {
  sm: "size-9 text-[0.68rem]",
  md: "size-11 text-[0.76rem]",
  lg: "size-12 text-[0.82rem]",
};

export function TechIcon({ icon, className, size = "md" }: TechIconProps) {
  const accent = ACCENTS[icon] ?? FALLBACK;

  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center rounded-xl border border-white/12 font-mono font-semibold tracking-tight",
        "bg-white/[0.05] backdrop-blur-sm",
        SIZE[size],
        className,
      )}
      style={{
        color: accent.accent,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.10), 0 10px 24px -18px ${accent.glow}`,
      }}
    >
      {accent.monogram}
    </span>
  );
}
