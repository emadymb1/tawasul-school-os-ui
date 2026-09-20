import { createFileRoute, Link } from "@tanstack/react-router";
import { LayoutGrid } from "lucide-react";

import { TawasulShell } from "@/components/tawasul-page";
import { TAWASUL_GROUPS, TAWASUL_MODULES, TAWASUL_PAGE_COUNT } from "@/lib/tawasul-modules";

export const Route = createFileRoute("/m/")({
  head: () => ({
    meta: [
      { title: "أقسام النظام — بوابة المدير" },
      { name: "description", content: "جميع أقسام وصفحات نظام إدارة المدرسة داخل بوابة المدير." },
      { property: "og:title", content: "أقسام النظام — بوابة المدير" },
      { property: "og:description", content: "جميع أقسام وصفحات نظام إدارة المدرسة داخل بوابة المدير." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ModulesIndex,
});

function ModulesIndex() {
  return (
    <TawasulShell
      crumbs={[{ label: "الرئيسية", to: "/" }, { label: "أقسام النظام" }]}
      title="أقسام النظام"
      description={`جميع أقسام النظام وصفحاته (${TAWASUL_PAGE_COUNT} صفحة) مطابقة لنظام المدرسة، جاهزة للربط لاحقاً بواجهة البرمجة الحقيقية.`}
    >
      <div className="space-y-6">
        {TAWASUL_GROUPS.map((g) => {
          const mods = TAWASUL_MODULES.filter((m) => m.group === g.key);
          if (mods.length === 0) return null;
          return (
            <section key={g.key} className="space-y-3">
              <h2 className="text-sm font-extrabold tracking-[0.2em] text-muted-foreground">{g.title}</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {mods.map((m) => (
                  <Link
                    key={m.slug}
                    to="/m/$module"
                    params={{ module: m.slug }}
                    className="tile flex items-center justify-between gap-3 p-4 transition hover:border-gold"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-mint text-mint-foreground">
                        <LayoutGrid className="h-5 w-5" />
                      </span>
                      <span className="font-bold text-foreground">{m.title}</span>
                    </span>
                    <span className="text-xs text-muted-foreground">{m.pages.length} صفحة</span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </TawasulShell>
  );
}
