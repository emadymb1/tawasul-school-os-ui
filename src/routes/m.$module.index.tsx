import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText } from "lucide-react";

import { TawasulShell } from "@/components/tawasul-page";
import { findModule } from "@/lib/tawasul-modules";

export const Route = createFileRoute("/m/$module/")({
  head: ({ params }) => {
    const mod = findModule(params.module);
    const title = `${mod?.title ?? "قسم"} — بوابة المدير`;
    const description = `صفحات قسم ${mod?.title ?? ""} داخل بوابة المدير.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: ModulePage,
});

function ModulePage() {
  const { module: moduleSlug } = Route.useParams();
  const mod = findModule(moduleSlug);

  if (!mod) {
    return (
      <TawasulShell crumbs={[{ label: "الرئيسية", to: "/" }, { label: "غير موجود" }]} title="القسم غير موجود">
        <p className="text-sm text-muted-foreground">لا يوجد قسم بهذا الاسم.</p>
      </TawasulShell>
    );
  }

  return (
    <TawasulShell
      crumbs={[{ label: "الرئيسية", to: "/" }, { label: "أقسام النظام", to: "/m" }, { label: mod.title }]}
      title={mod.title}
      description={`${mod.pages.length} صفحة في هذا القسم.`}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {mod.pages.map((p) => (
          <Link
            key={p.slug}
            to="/m/$module/$page"
            params={{ module: mod.slug, page: p.slug }}
            className="tile flex items-center gap-3 p-4 transition hover:border-gold"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-sage/40 text-foreground">
              <FileText className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-bold text-foreground">{p.title}</span>
              <span className="block truncate text-[11px] text-muted-foreground">{p.file}</span>
            </span>
          </Link>
        ))}
      </div>
    </TawasulShell>
  );
}
