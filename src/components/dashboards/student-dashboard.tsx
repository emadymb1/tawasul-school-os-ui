import { Link } from "@tanstack/react-router";
import { Avatar, PortalCard, Pill, StatTile } from "@/components/portal-ui";
import { getStudentProfile } from "@/lib/students-data";
import { resolveCurrentStudentId } from "@/lib/current-student";
import { TODAY_LESSONS } from "@/lib/school-sample";

function gradeLetter(pct: number) {
  if (pct >= 85) return "A";
  if (pct >= 70) return "B";
  if (pct >= 55) return "C";
  return "D";
}

export function StudentDashboard() {
  const studentId = resolveCurrentStudentId();
  const profile = studentId != null ? getStudentProfile(studentId) : null;

  if (!profile) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <PortalCard>
          <p className="text-center text-sm text-muted-foreground">
            لا يوجد سجل طالب مرتبط بهذا الحساب — تواصل مع إدارة المدرسة.
          </p>
        </PortalCard>
      </div>
    );
  }

  const { student, attendance, assignments, grades } = profile;
  const present = attendance.filter((a) => a.status === "حاضر").length;
  const attendanceRate = attendance.length ? Math.round((present / attendance.length) * 100) : 0;
  const score = grades.reduce((s, g) => s + g.score, 0);
  const max = grades.reduce((s, g) => s + g.max, 0);
  const average = max ? Math.round((score / max) * 100) : 0;

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-4">
      <div>
        <div className="text-[11px] font-bold tracking-[0.2em] text-muted-foreground">مدرستي</div>
        <h1 className="text-3xl font-extrabold text-foreground">بوابة الطالب</h1>
      </div>

      <div className="relative overflow-hidden rounded-[2rem] bg-primary p-6 text-primary-foreground">
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-coral" />
        <div className="pointer-events-none absolute -top-8 left-14 h-20 w-20 rounded-full bg-gold/80" />
        <div className="relative z-10">
          <div className="text-sm text-primary-foreground/70">أهلاً،</div>
          <div className="mt-1 text-2xl font-extrabold">{student.name}</div>
          <div className="mt-1 text-sm text-primary-foreground/70">
            الصف {student.grade} · {student.section}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatTile label="نسبة الحضور" value={`${attendanceRate}%`} tone="mint" />
        <StatTile label="متوسط الدرجات" value={average} tone="sage" />
      </div>

      <PortalCard title="جدولي اليوم">
        <ul className="space-y-3">
          {TODAY_LESSONS.map((l) => (
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
        title="واجباتي"
        action={
          <Link to="/assignments" className="text-xs font-bold text-primary">
            عرض الكل
          </Link>
        }
      >
        <ul className="space-y-3">
          {assignments.slice(0, 4).map((a) => (
            <li key={a.title} className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-bold">{a.title}</div>
                <div className="text-[11px] text-muted-foreground">
                  {a.subject} · التسليم {a.dueDate}
                </div>
              </div>
              {a.status === "لم يُسلَّم" ? (
                <Pill tone="coral">متأخر</Pill>
              ) : a.status === "متأخر" ? (
                <Pill tone="gold">متأخر</Pill>
              ) : (
                <Pill tone="mint">مُسلَّم</Pill>
              )}
            </li>
          ))}
        </ul>
      </PortalCard>

      <PortalCard title="سجل الدرجات">
        <ul className="space-y-3">
          {grades.map((g) => {
            const pct = Math.round((g.score / g.max) * 100);
            return (
              <li key={`${g.subject}-${g.component}`} className="flex items-center justify-between gap-3">
                <span className="text-sm">
                  {g.subject} · {g.component}
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-base font-extrabold">{pct}</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-leaf text-xs font-bold text-leaf-foreground">
                    {gradeLetter(pct)}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </PortalCard>

      <PortalCard title="حضوري">
        <ul className="space-y-2">
          {attendance.slice(0, 6).map((a) => (
            <li key={a.date} className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-bold">{a.date}</div>
                {a.note && <div className="text-[11px] text-muted-foreground">{a.note}</div>}
              </div>
              {a.status === "حاضر" ? (
                <Pill tone="leaf">حاضر</Pill>
              ) : a.status === "متأخر" ? (
                <Pill tone="gold">متأخر</Pill>
              ) : (
                <Pill tone="coral">غائب</Pill>
              )}
            </li>
          ))}
        </ul>
      </PortalCard>

      <PortalCard title="معلمي">
        <div className="flex items-center gap-3">
          <Avatar name={student.guardian} />
          <div>
            <div className="text-sm font-bold">ولي الأمر: {student.guardian}</div>
            <div className="text-[11px] text-muted-foreground">{student.phone}</div>
          </div>
        </div>
      </PortalCard>
    </div>
  );
}
