import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Deep-green hero banner with the decorative coral + gold circles. */
export function PortalHero({
  eyebrow,
  title,
  highlight,
  subtitle,
  actions,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  highlight?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[2rem] bg-primary p-6 text-primary-foreground sm:p-8",
        className,
      )}
    >
      <div className="pointer-events-none absolute -top-16 left-1/4 h-44 w-44 rounded-full bg-coral sm:left-1/3" />
      <div className="pointer-events-none absolute bottom-4 left-8 h-24 w-24 rounded-full bg-gold sm:bottom-6 sm:left-24" />
      <div className="relative z-10 max-w-xl">
        {eyebrow && (
          <span className="inline-flex rounded-full bg-primary-foreground/10 px-3 py-1 text-[11px] font-semibold tracking-widest text-primary-foreground/80">
            {eyebrow}
          </span>
        )}
        <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
          {title} {highlight && <span className="text-gold">{highlight}</span>}
        </h1>
        {subtitle && (
          <p className="mt-3 text-sm text-primary-foreground/75 sm:text-base">{subtitle}</p>
        )}
        {actions && <div className="mt-6 flex flex-wrap items-center gap-3">{actions}</div>}
      </div>
    </div>
  );
}

const TONES = {
  mint: "bg-mint text-mint-foreground",
  sage: "bg-sage text-sage-foreground",
  gold: "bg-gold text-gold-foreground",
  coral: "bg-coral text-coral-foreground",
  leaf: "bg-leaf text-leaf-foreground",
  green: "bg-primary text-primary-foreground",
} as const;

export type Tone = keyof typeof TONES;

/** Big rounded stat tile (attendance rate, lessons today, …). */
export function StatTile({
  label,
  value,
  suffix,
  to,
  tone = "mint",
  footer,
  className,
}: {
  label: ReactNode;
  value: ReactNode;
  suffix?: ReactNode;
  to?: string;
  tone?: Tone;
  footer?: ReactNode;
  className?: string;
}) {
  const body = (
    <>
      <div className="text-sm font-medium opacity-80">{label}</div>
      <div className="mt-2 flex items-end gap-1">
        <span className="text-4xl font-extrabold leading-none">{value}</span>
        {suffix && <span className="pb-1 text-lg font-bold opacity-80">{suffix}</span>}
      </div>
      {footer && <div className="mt-auto pt-4 text-xs opacity-70">{footer}</div>}
    </>
  );
  const classes = cn(
    "flex min-h-[9.5rem] flex-col rounded-[1.75rem] p-5 transition-transform",
    TONES[tone],
    to && "hover:-translate-y-0.5",
    className,
  );
  if (to) {
    return (
      <Link to={to} className={classes}>
        {body}
      </Link>
    );
  }
  return <div className={classes}>{body}</div>;
}

/** White rounded panel with a title row. */
export function PortalCard({
  title,
  action,
  children,
  className,
}: {
  title?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-[1.75rem] bg-card p-5 shadow-sm sm:p-6", className)}>
      {(title || action) && (
        <header className="mb-4 flex items-center justify-between gap-3">
          {title && <h2 className="text-lg font-extrabold text-foreground">{title}</h2>}
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function Pill({
  children,
  tone = "mint",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

const AVATAR_TONES: Tone[] = ["gold", "coral", "mint", "leaf", "sage"];

export function Avatar({ name, index = 0 }: { name: string; index?: number }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return (
    <span
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold",
        TONES[AVATAR_TONES[index % AVATAR_TONES.length]!],
      )}
    >
      {initials}
    </span>
  );
}
