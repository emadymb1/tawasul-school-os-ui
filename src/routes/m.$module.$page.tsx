import { createFileRoute } from "@tanstack/react-router";

import {
  TawasulEmpty,
  TawasulFilters,
  TawasulPanel,
  TawasulSearch,
  TawasulSettingsForm,
  TawasulShell,
  TawasulTable,
  TawasulToolbar,
} from "@/components/tawasul-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { findPage } from "@/lib/tawasul-modules";
import { useUsers } from "@/lib/use-users";


export const Route = createFileRoute("/m/$module/$page")({
  head: ({ params }) => {
    const { module: mod, page } = findPage(params.module, params.page);
    const title = `${page?.title ?? "صفحة"} — ${mod?.title ?? "النظام"}`;
    const description = `${page?.title ?? "صفحة"} ضمن قسم ${mod?.title ?? ""} في بوابة المدير.`;
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
  component: TawasulGenericPage,
});

const FILTERS_BY_KIND: Record<string, string[]> = {
  manage: ["الحالة", "المرحلة الدراسية", "الصف الدراسي"],
  report: ["السنة الدراسية", "الفصل الدراسي", "المرحلة الدراسية"],
  view: ["الحالة", "التاريخ"],
};

const ROLE_LABELS: Record<string, string> = {
  admin: "مسؤول النظام",
  teacher: "موظف",
  student: "طالب",
  parent: "ولي أمر",
};

const SETTINGS_FIELDS = ["الاسم", "القيمة", "الوصف", "مفعّل"];

function TawasulGenericPage() {
  const params = Route.useParams();
  const { module: mod, page } = findPage(params.module, params.page);
  const { users } = useUsers();

  if (!mod || !page) {
    return (
      <TawasulShell crumbs={[{ label: "الرئيسية", to: "/" }, { label: "غير موجود" }]} title="الصفحة غير موجودة">
        <p className="text-sm text-muted-foreground">لا توجد صفحة بهذا الاسم.</p>
      </TawasulShell>
    );
  }

  const crumbs = [
    { label: "الرئيسية", to: "/" },
    { label: "أقسام النظام", to: "/m" },
    { label: mod.title, to: undefined },
    { label: page.title },
  ];

  const isUsers = mod.slug === "user-admin" && page.slug === "user-manage";

  return (
    <TawasulShell
      crumbs={crumbs}
      title={page.title}
      description={`${mod.title} — سيتم ربط هذه الصفحة ببيانات نظام المدرسة عبر واجهة البرمجة.`}
      actions={<Button variant="outline">تصدير</Button>}
    >
      {page.kind === "settings" ? (
        <TawasulSettingsForm fields={SETTINGS_FIELDS} />
      ) : (
        <div className="space-y-4">
          {page.kind === "manage" || page.kind === "view" ? (
            <TawasulSearch hint="الاسم المفضل، اسم العائلة، اسم المستخدم، الدور، رقم الطالب، البريد الإلكتروني" />
          ) : null}
          {FILTERS_BY_KIND[page.kind] && <TawasulFilters fields={FILTERS_BY_KIND[page.kind]!} />}
          <TawasulToolbar />
          {isUsers ? (
            <TawasulTable
              columns={["الاسم", "الحالة", "الدور الأساسي", "اسم المستخدم", "الإجراءات"]}
              rows={(users ?? []).map((u) => [
                u.name,
                <Badge key="s" variant="secondary">
                  كامل
                </Badge>,
                ROLE_LABELS[u.role] ?? u.role,
                u.email ?? "—",
                <Button key="a" size="sm" variant="outline">
                  تعديل
                </Button>,
              ])}
            />
          ) : (
            <TawasulEmpty />
          )}
          <TawasulPanel>
            <p className="text-xs leading-relaxed text-muted-foreground">
              المصدر في نظام المدرسة: <span className="font-mono">{mod.title} / {page.file}.php</span>
            </p>
          </TawasulPanel>
        </div>
      )}
    </TawasulShell>
  );
}
