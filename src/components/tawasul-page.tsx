import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type Crumb = { label: string; to?: string };

export function TawasulBreadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
      {items.map((c, i) => (
        <span key={`${c.label}-${i}`} className="flex items-center gap-1">
          {i > 0 && <ChevronLeft className="h-3 w-3 opacity-50" />}
          {c.to ? (
            <Link to={c.to} className="font-semibold text-gold hover:underline">
              {c.label}
            </Link>
          ) : (
            <span>{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function TawasulShell({
  crumbs,
  title,
  description,
  actions,
  children,
}: {
  crumbs: Crumb[];
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <TawasulBreadcrumb items={crumbs} />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">{title}</h1>
          {description && (
            <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">{description}</p>
          )}
        </div>
        {actions}
      </div>
      {children}
    </div>
  );
}

export function TawasulPanel({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`tile p-4 sm:p-5 ${className}`}>
      {title && <h2 className="mb-3 text-lg font-extrabold text-foreground">{title}</h2>}
      {children}
    </section>
  );
}

export function TawasulFilters({ fields }: { fields: string[] }) {
  return (
    <section className="rounded-3xl border border-border/60 bg-muted/40 p-4 sm:p-5">
      <h2 className="mb-3 text-base font-extrabold text-foreground">التصفيات</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {fields.map((f) => (
          <label key={f} className="flex items-center gap-3">
            <span className="w-32 shrink-0 text-sm font-semibold text-muted-foreground">{f}</span>
            <Input placeholder={f} className="bg-card" />
          </label>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <Button>إذهب</Button>
        <button type="button" className="text-sm text-muted-foreground hover:underline">
          إزالة التصفية
        </button>
      </div>
    </section>
  );
}

export function TawasulSearch({ hint }: { hint?: string }) {
  return (
    <section className="rounded-3xl border border-border/60 bg-muted/40 p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-semibold text-muted-foreground">البحث عن</span>
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="bg-card pr-9" placeholder="ابحث…" />
        </div>
        <Button>إذهب</Button>
      </div>
      {hint && <p className="mt-2 text-xs text-muted-foreground">{hint}</p>}
    </section>
  );
}

export function TawasulToolbar({ label = "إضافة" }: { label?: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-lg font-extrabold text-foreground">معاينة</h2>
      <Button variant="outline" className="gap-2">
        <Plus className="h-4 w-4" />
        {label}
      </Button>
    </div>
  );
}

export function TawasulTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: ReactNode[][];
}) {
  if (rows.length === 0) return <TawasulEmpty />;
  return (
    <div className="tile overflow-x-auto p-0">
      <table className="w-full min-w-[620px] text-right text-sm">
        <thead>
          <tr className="border-b border-border/60 text-xs text-muted-foreground">
            {columns.map((c) => (
              <th key={c} className="px-4 py-3 font-bold">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-border/40 last:border-0">
              {r.map((cell, j) => (
                <td key={j} className="px-4 py-3 align-middle">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TawasulEmpty({ text = "لا توجد سجلات لعرضها." }: { text?: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-muted/30 px-4 py-10 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}

export function TawasulSettingsForm({ fields }: { fields: string[] }) {
  return (
    <TawasulPanel title="الإعدادات">
      <div className="space-y-3">
        {fields.map((f) => (
          <label key={f} className="grid gap-2 sm:grid-cols-[200px_1fr] sm:items-center">
            <span className="text-sm font-semibold text-foreground">{f}</span>
            <Input placeholder={f} />
          </label>
        ))}
      </div>
      <div className="mt-4 flex justify-end">
        <Button>حفظ</Button>
      </div>
    </TawasulPanel>
  );
}
