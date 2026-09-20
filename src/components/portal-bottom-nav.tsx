import { Link, useRouterState } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type BottomNavItem = { label: string; to: string; icon: LucideIcon };

export function PortalBottomNav({ items }: { items: BottomNavItem[] }) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  return (
    <nav className="sticky bottom-0 z-20 border-t border-border bg-card/95 backdrop-blur">
      <ul className="mx-auto flex max-w-3xl items-stretch justify-between px-2 py-2">
        {items.map((item) => {
          const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          return (
            <li key={item.to} className="flex-1">
              <Link
                to={item.to}
                className="flex flex-col items-center gap-1 rounded-2xl px-2 py-1.5 text-[11px] font-semibold text-muted-foreground"
              >
                <span
                  className={cn(
                    "flex h-9 w-14 items-center justify-center rounded-full transition-colors",
                    active ? "bg-gold text-gold-foreground" : "text-foreground/70",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                </span>
                <span className={cn(active && "text-foreground")}>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
