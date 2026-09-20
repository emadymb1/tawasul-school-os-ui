import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Avatar, PortalCard, Pill, StatTile } from "@/components/portal-ui";
import { getStudentProfile } from "@/lib/students-data";
import { getCurrentParentChildIds } from "@/lib/selected-child";
import { useUsers } from "@/lib/use-users";
import { SCHOOL_NOTICES, TODAY_LESSONS } from "@/lib/school-sample";
import { cn } from "@/lib/utils";

export function ParentDashboard() {
  const { users } = useUsers();
  const childIds = getCurrentParentChildIds(users);
  const profiles = useMemo(
    () => childIds.map((id) => getStudentProfile(id)).filter(Boolean),
    [childIds.join(",")],
  );
  const [activeId, setActiveId] = useState<number | null>(profiles[0]?.student.id ?? null);
  const active = profiles.find((p) => p!.student.id === activeId) ?? profiles[0] ?? null;

  if (!active) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <PortalCard>
          <p className="text-center text-sm text-muted-foreground">
            لا يوجد أبناء مرتبطون بهذا الحساب — تواصل مع إدارة المدرسة.
          </p>
        </PortalCard>
      </div>
    );
  }

  const { student, attendance, grades } = active;
  const present = attendance.filter((a) => a.status === "حاضر").length;
  const attendanceRate = attendance.length ? Math.round((present / attendance.length) * 100) : 0;
  const score = grades.reduce((s, g) => s + g.score, 0);
  const max = grades.reduce((s, g) => s + g.max, 0);
  const average = max ? Math.round((score / max) * 100) : 0;

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-4">
      <div>
        <div className="text-[11px] font-bold tracking-[0.2em] text-muted-foreground">أبنائي</div>
        <h1 className="text-3xl font-extrabold text-foreground">بوابة ولي الأمر</h1>
      </div>

      <div className="flex flex-wrap gap-2">
        {profiles.map((p) => {
          const isActive = p!.student.id === active.student.id;
          return (
            <button
              key={p!.student.id}
              type="button"
              onClick={() => setActiveId(p!.student.id)}
              className={cn(
                "rounded-full px-5 py-2.5 text-sm font-bold transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-foreground",
              )}
            >
              {p!.student.name.split(" ").slice(0, 2).join(" ")}
            </button>
          );
        })}
      </div>

      <div className="relative overflow-hidden rounded-[2.5rem] bg-primary p-6 text-primary-foreground">
        <div className="pointer-events-none absolute -bottom-10 -left-12 h-44 w-44 rounded-full bg-coral" />
        <div className="pointer-events-none absolute -top-8 left-16 h-24 w-24 rounded-full bg-gold/80" />
        <div className="relative z-10 flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold text-lg font-extrabold text-gold-foreground">
            {student.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
          </span>
          <div>
            <div className="text-2xl font-extrabold">{student.name}</div>
            <div className="text-sm text-primary-foreground/70">
              الصف {student.grade} · {student.section}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatTile label="نسبة الحضور" value={`${attendanceRate}%`} tone="mint" />
        <StatTile label="متوسط الدرجات" value={average} tone="sage" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatTile label="الفواتير" value="فتح" tone="coral" to="/billing" footer="الرسوم الشهرية ←" />
        <StatTile label="الإشعارات" value={1} tone="gold" to="/notifications" footer="غير مقروءة ←" />
      </div>

      <PortalCard title="حصص اليوم">
        <ul className="space-y-3">
          {TODAY_LESSONS.slice(0, 2).map((l) => (
            <li key={l.time} className="flex items-center gap-3">
              <Pill tone={l.tone}>{l.time}</Pill>
              <div>
                <div className="text-sm font-bold">{l.subject}</div>
                <div className="text-[11px] text-muted-foreground">{l.group}</div>
              </div>
            </li>
          ))}
        </ul>
      </PortalCard>

      <PortalCard
        title="الدرجات"
        action={
          <Link to="/children" search={{ pick: undefined }} className="text-xs font-bold text-primary">
            ملف الابن
          </Link>
        }
      >
        <ul className="space-y-3">
          {grades.slice(0, 4).map((g) => (
            <li key={`${g.subject}-${g.component}`} className="flex items-center justify-between gap-3">
              <span className="text-sm">
                {g.subject} · {g.component}
              </span>
              <span className="flex items-center gap-2">
                <span className="text-base font-extrabold">
                  {Math.round((g.score / g.max) * 100)}
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-leaf text-xs font-bold text-leaf-foreground">
                  A
                </span>
              </span>
            </li>
          ))}
        </ul>
      </PortalCard>

      <PortalCard title="إشعارات المدرسة">
        <ul className="space-y-3">
          {SCHOOL_NOTICES.map((n) => (
            <li key={n.title} className="flex items-start gap-3">
              <span
                className={cn(
                  "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                  n.isNew ? "bg-coral" : "bg-muted-foreground/30",
                )}
              />
              <div>
                <div className="text-sm font-bold">{n.title}</div>
                <div className="text-[11px] text-muted-foreground">{n.meta}</div>
              </div>
            </li>
          ))}
        </ul>
      </PortalCard>

      <PortalCard title="التواصل مع المدرسة">
        <div className="flex items-center gap-3">
          <Avatar name={student.guardian} />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold">{student.guardian}</div>
            <div className="text-[11px] text-muted-foreground">{student.phone}</div>
          </div>
          <Link
            to="/admin-contact"
            className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground"
          >
            مراسلة الإدارة
          </Link>
        </div>
      </PortalCard>
    </div>
  );
}
