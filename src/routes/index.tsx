import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { PortalCard, PortalHero, StatTile, Pill, Avatar } from "@/components/portal-ui";
import { StudentDashboard } from "@/components/dashboards/student-dashboard";
import { ParentDashboard } from "@/components/dashboards/parent-dashboard";
import { useRole, ROLE_NAMES } from "@/lib/role-context";
import { useStudents } from "@/lib/use-students";
import { getStudentProfile } from "@/lib/students-data";
import { SCHOOL_NOTICES, TODAY_LESSONS } from "@/lib/school-sample";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "الرئيسية — مدرسة الرابطة الإسلامية في فنلندا" },
      {
        name: "description",
        content:
          "بوابة لكل دور: المدير، الموظف، الطالب، وولي الأمر — الحضور، الجداول، الدرجات والإشعارات.",
      },
      { property: "og:title", content: "الرئيسية — مدرسة الرابطة الإسلامية في فنلندا" },
      {
        property: "og:description",
        content:
          "بوابة لكل دور: المدير، الموظف، الطالب، وولي الأمر — الحضور، الجداول، الدرجات والإشعارات.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function todayLabel() {
  return new Date().toLocaleDateString("ar-EG", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function Home() {
  const { role } = useRole();
  if (role === "student") return <StudentDashboard />;
  if (role === "parent") return <ParentDashboard />;
  if (role === "admin") return <AdminOverview />;
  return <StaffDashboard />;
}

function useSchoolStats() {
  const { students } = useStudents();
  return useMemo(() => {
    const profiles = students.map((s) => getStudentProfile(s.id)).filter(Boolean);
    let present = 0;
    let total = 0;
    let score = 0;
    let max = 0;
    for (const p of profiles) {
      for (const a of p!.attendance) {
        total += 1;
        if (a.status === "حاضر") present += 1;
      }
      for (const g of p!.grades) {
        score += g.score;
        max += g.max;
      }
    }
    return {
      students,
      attendanceRate: total ? Math.round((present / total) * 1000) / 10 : 0,
      average: max ? Math.round((score / max) * 100) : 0,
    };
  }, [students]);
}

function StaffDashboard() {
  const { students, attendanceRate, average } = useSchoolStats();
  const { role } = useRole();
  const roster = students.slice(0, 5);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <PortalHero
          eyebrow={todayLabel()}
          title="السلام عليكم يا"
          highlight={ROLE_NAMES[role]}
          subtitle={`لديك ${TODAY_LESSONS.length} حصص اليوم و${students.length} طالباً في صفوفك.`}
          actions={
            <>
              <Link
                to="/attendance"
                className="rounded-full bg-coral px-6 py-3 text-sm font-bold text-coral-foreground"
              >
                تسجيل الحضور
              </Link>
              <Link
                to="/assignments"
                className="rounded-full border border-primary-foreground/25 px-6 py-3 text-sm font-bold text-primary-foreground"
              >
                فتح سجل الدرجات
              </Link>
            </>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <StatTile label="نسبة الحضور" value={attendanceRate} suffix="%" tone="mint" to="/attendance" footer="فتح ←" />
          <div className="grid grid-cols-2 gap-4">
            <StatTile label="حصص اليوم" value={TODAY_LESSONS.length} tone="gold" to="/schedule" />
            <StatTile label="متوسط الدرجات" value={average} tone="sage" to="/assignments" />
          </div>
        </div>
      </div>

      <PortalCard
        title="جدول اليوم"
        action={
          <Link to="/schedule" className="rounded-full bg-secondary px-4 py-2 text-xs font-bold">
            عرض الأسبوع
          </Link>
        }
      >
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TODAY_LESSONS.map((l) => (
            <li key={l.time} className="rounded-3xl border border-border bg-background p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-muted-foreground">{l.time}</span>
                <Pill tone={l.tone}>{l.room}</Pill>
              </div>
              <div className="mt-3 text-lg font-extrabold text-foreground">{l.subject}</div>
              <div className="mt-1 text-xs text-muted-foreground">{l.group}</div>
            </li>
          ))}
        </ul>
      </PortalCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <PortalCard title="كشف الحضور" action={<Pill tone="mint">الصف الخامس · أ</Pill>}>
          <ul className="space-y-3">
            {roster.map((s, i) => (
              <li
                key={s.id}
                className="flex items-center gap-3 rounded-3xl bg-background px-3 py-2.5"
              >
                <Avatar name={s.name} index={i} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold">{s.name}</div>
                  <div className="text-[11px] text-muted-foreground">
                    الصف {s.grade} · {s.section}
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-leaf text-xs font-bold text-leaf-foreground">
                    ح
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                    غ
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <Link
            to="/attendance"
            className="mt-4 block rounded-full bg-primary py-3 text-center text-sm font-bold text-primary-foreground"
          >
            حفظ الحضور
          </Link>
        </PortalCard>

        <PortalCard title="إشعارات المدرسة" action={<Pill tone="gold">١ جديد</Pill>}>
          <ul className="divide-y divide-border rounded-3xl border border-border">
            {SCHOOL_NOTICES.map((n) => (
              <li key={n.title} className="flex items-start gap-3 p-4">
                <span
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.isNew ? "bg-coral" : "bg-muted-foreground/30"}`}
                />
                <div>
                  <div className="text-sm font-bold">{n.title}</div>
                  <div className="text-[11px] text-muted-foreground">{n.meta}</div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex items-center gap-3">
            <span className="text-xs font-bold text-muted-foreground">متوسط الصف</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-coral" style={{ width: `${average}%` }} />
            </div>
            <span className="text-sm font-extrabold">{average}</span>
          </div>
        </PortalCard>
      </div>
    </div>
  );
}

function AdminOverview() {
  const { students, attendanceRate, average } = useSchoolStats();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PortalHero
        eyebrow={todayLabel()}
        title="نظرة عامة على"
        highlight="المدرسة"
        subtitle="الطلاب، الحضور، الحسابات والصلاحيات — كل ما تحتاجه الإدارة في مكان واحد."
        actions={
          <>
            <Link
              to="/admin"
              className="rounded-full bg-coral px-6 py-3 text-sm font-bold text-coral-foreground"
            >
              لوحة الإدارة
            </Link>
            <Link
              to="/roles"
              className="rounded-full border border-primary-foreground/25 px-6 py-3 text-sm font-bold text-primary-foreground"
            >
              الأدوار والصلاحيات
            </Link>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatTile label="عدد الطلاب" value={students.length} tone="gold" to="/students" footer="فتح ←" />
        <StatTile label="نسبة الحضور" value={attendanceRate} suffix="%" tone="mint" to="/attendance" footer="فتح ←" />
        <StatTile label="متوسط الدرجات" value={average} tone="sage" to="/assignments" footer="فتح ←" />
        <StatTile label="الحسابات" value="فتح" tone="coral" to="/admin" footer="الفواتير والرسوم ←" />
        <StatTile label="الموظفون" value="فتح" tone="leaf" to="/roles" footer="الأدوار ←" />
        <StatTile label="إشعارات غير مقروءة" value={1} tone="mint" to="/notifications" footer="فتح ←" />
      </div>

      <PortalCard title="إشعارات المدرسة">
        <ul className="divide-y divide-border rounded-3xl border border-border">
          {SCHOOL_NOTICES.map((n) => (
            <li key={n.title} className="flex items-start gap-3 p-4">
              <span
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.isNew ? "bg-coral" : "bg-muted-foreground/30"}`}
              />
              <div>
                <div className="text-sm font-bold">{n.title}</div>
                <div className="text-[11px] text-muted-foreground">{n.meta}</div>
              </div>
            </li>
          ))}
        </ul>
      </PortalCard>
    </div>
  );
}
