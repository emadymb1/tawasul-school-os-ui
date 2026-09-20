import { createFileRoute, Navigate } from "@tanstack/react-router";
import { Bell, Calendar, Megaphone, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRole } from "@/lib/role-context";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "الإشعارات العامة — منارة" },
      { name: "description", content: "إشعارات وإعلانات المدرسة العامة." },
      { property: "og:title", content: "الإشعارات العامة — منارة" },
      { property: "og:description", content: "آخر الإعلانات والاجتماعات والعطل المدرسية." },
    ],
  }),
  component: NotificationsPage,
});

type Notif = {
  id: number;
  type: "meeting" | "holiday" | "announcement" | "alert";
  title: string;
  body: string;
  date: string;
};

const items: Notif[] = [
  { id: 1, type: "meeting", title: "اجتماع أولياء الأمور", body: "اجتماع دوري السبت القادم بعد صلاة العصر في قاعة المدرسة.", date: "2026-08-01" },
  { id: 2, type: "holiday", title: "عطلة رسمية", body: "تعطل الدراسة يوم الأحد بمناسبة يوم الاستقلال الفنلندي.", date: "2026-08-08" },
  { id: 3, type: "announcement", title: "بدء تسجيل الفصل الجديد", body: "فتح باب التسجيل للفصل القادم عبر بوابة المدرسة.", date: "2026-07-20" },
  { id: 4, type: "alert", title: "تذكير بالزي المدرسي", body: "يرجى التأكيد على الأبناء بارتداء الزي المدرسي أيام الاختبارات.", date: "2026-07-18" },
];

function iconFor(t: Notif["type"]) {
  if (t === "meeting") return Calendar;
  if (t === "holiday") return Bell;
  if (t === "alert") return AlertCircle;
  return Megaphone;
}

function labelFor(t: Notif["type"]) {
  if (t === "meeting") return "اجتماع";
  if (t === "holiday") return "عطلة";
  if (t === "alert") return "تنبيه";
  return "إعلان";
}

function NotificationsPage() {
  const { role } = useRole();
  if (role !== "parent") return <Navigate to="/" replace />;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-4xl mx-auto">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold">الإشعارات العامة</h1>
        <p className="text-muted-foreground mt-1 text-sm">آخر إعلانات المدرسة والاجتماعات والعطل.</p>
      </header>

      <div className="space-y-3">
        {items.map((n) => {
          const Icon = iconFor(n.type);
          return (
            <Card key={n.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-[10px]">{labelFor(n.type)}</Badge>
                      <span className="font-semibold text-sm">{n.title}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{n.body}</p>
                  </div>
                  <div className="text-[11px] text-muted-foreground shrink-0" dir="ltr">
                    {n.date}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}