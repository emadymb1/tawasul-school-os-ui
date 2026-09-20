import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRole } from "@/lib/role-context";
import {
  DAY_STATUSES,
  MONTHS,
  STATUS_TONE,
  loadSchedule,
  saveSchedule,
  statusOf,
  type DayStatus,
} from "@/lib/monthly-schedule";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      { title: "جدول الدوام الشهري — منارة" },
      {
        name: "description",
        content: "جدول الدوام الشهري لأيام السبت والأحد من سبتمبر 2026 إلى مايو 2027.",
      },
      { property: "og:title", content: "جدول الدوام الشهري — منارة" },
      {
        property: "og:description",
        content: "أيام الدوام والإجازات والاختبارات والحفلات لكل سبت وأحد خلال العام الدراسي.",
      },
    ],
  }),
  component: SchedulePage,
});

function currentMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function SchedulePage() {
  const { role } = useRole();
  const canEdit = role === "admin";
  const [map, setMap] = useState<Record<string, DayStatus>>({});

  useEffect(() => {
    setMap(loadSchedule());
  }, []);

  const key = currentMonthKey();
  const visibleMonths = canEdit
    ? MONTHS
    : [MONTHS.find((m) => m.key === key) ?? MONTHS[0]];

  const setDay = (date: string, status: DayStatus) => {
    setMap((prev) => {
      const next = { ...prev, [date]: status };
      saveSchedule(next);
      return next;
    });
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-6xl mx-auto">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold">جدول الدوام الشهري</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          أيام السبت والأحد فقط — من سبتمبر ٢٠٢٦ إلى مايو ٢٠٢٧
          {canEdit ? " — يمكنك تعديل حالة كل يوم" : " — يُعرض الشهر الحالي فقط"}
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {visibleMonths.map((m) => (
          <Card key={m.key}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">{m.label}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y divide-border">
                {m.days.map((d) => {
                  const status = statusOf(map, d.date);
                  return (
                    <li key={d.date} className="flex items-center gap-3 px-4 py-2.5">
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm">{d.dayLabel}</div>
                        <div className="text-xs text-muted-foreground">{d.date}</div>
                      </div>
                      {canEdit ? (
                        <Select value={status} onValueChange={(v) => setDay(d.date, v as DayStatus)}>
                          <SelectTrigger className="w-52">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {DAY_STATUSES.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-medium ${STATUS_TONE[status]}`}
                        >
                          {status}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        {DAY_STATUSES.map((s) => (
          <div
            key={s}
            className={`rounded-lg border p-3 text-sm font-medium text-center ${STATUS_TONE[s]}`}
          >
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}
