import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, X, Clock, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Can, useRole, ReadOnlyNotice } from "@/lib/role-context";
import { AccessDenied } from "@/components/role-guard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { getStudentProfile, GRADES } from "@/lib/students-data";
import { useStudents } from "@/lib/use-students";
import { loadUsers, SUBJECTS, SUBJECT_LABELS, type SubjectId } from "@/lib/users-data";
import { useTeacherScope } from "@/lib/teacher-scope";
import { resolveCurrentStudentId } from "@/lib/current-student";



export const Route = createFileRoute("/attendance")({
  head: () => ({
    meta: [
      { title: "الحضور والغياب — منارة" },
      { name: "description", content: "تسجيل حضور وغياب الطلاب والمعلمين لكل حصة." },
      { property: "og:title", content: "الحضور والغياب — منارة" },
      { property: "og:description", content: "تسجيل حضور وغياب الطلاب والمعلمين." },
    ],
  }),
  component: AttendancePage,
});

type Status = "present" | "absent" | "late";

const initialTeachers = [
  { name: "الأستاذ عبدالله", subject: "القرآن الكريم", status: "present" as Status },
  { name: "الأستاذة فاطمة", subject: "اللغة العربية", status: "present" as Status },
  { name: "الأستاذ يوسف", subject: "التربية الإسلامية", status: "late" as Status },
];

function AttendancePage() {
  const { students } = useStudents();
  const { role, grades: allowedGrades, subjectIds: allowedSubjects } = useTeacherScope();

  const [grade, setGrade] = useState<string>(allowedGrades[0]);
  const [subject, setSubject] = useState<SubjectId>(allowedSubjects[0]);
  const [tab, setTab] = useState<"students" | "teachers">("students");
  const [statuses, setStatuses] = useState<Record<number, Status>>({});
  const [teacherStatuses, setTeacherStatuses] = useState<Record<string, Status>>(
    Object.fromEntries(initialTeachers.map((t) => [t.name, t.status])),
  );

  const classStudents = useMemo(
    () => students.filter((s) => s.grade === grade),
    [grade],
  );

  const statusOf = (id: number): Status => statuses[id] ?? "present";

  const setStatus = (id: number, s: Status) =>
    setStatuses((prev) => ({ ...prev, [id]: s }));

  const setTeacherStatus = (name: string, s: Status) =>
    setTeacherStatuses((prev) => ({ ...prev, [name]: s }));

  const counts = classStudents.reduce(
    (acc, s) => ({ ...acc, [statusOf(s.id)]: acc[statusOf(s.id)] + 1 }),
    { present: 0, absent: 0, late: 0 } as Record<Status, number>,
  );

  if (role === "student") return <MyAttendance />;

  if (role === "parent") {
    return (
      <AccessDenied
        title="سجل الحضور متاح للإدارة والمعلمين"
        hint="يمكنك متابعة حضور أبنائك من صفحة الأبناء."
      />
    );
  }

  const canSeeTeachersTab = role === "admin";

  return (

    <div className="p-4 md:p-8 space-y-6 max-w-6xl mx-auto">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold">الحضور والغياب</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          سجّل حضور طلاب اليوم — {new Date().toLocaleDateString("ar-EG", { weekday: "long", day: "numeric", month: "long" })}
        </p>
      </header>

      <div className="flex flex-wrap gap-3">
        <Select value={grade} onValueChange={setGrade}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            {allowedGrades.map((g) => (
              <SelectItem key={g} value={g}>الصف {g}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={subject} onValueChange={(v) => setSubject(v as SubjectId)}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            {allowedSubjects.map((s) => (
              <SelectItem key={s} value={s}>{SUBJECT_LABELS[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {canSeeTeachersTab && (
        <div className="flex gap-2 border-b border-border">
          {[
            { key: "students" as const, label: "الطلاب", icon: Users },
            { key: "teachers" as const, label: "المعلمون", icon: Users },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 -mb-px text-sm font-medium border-b-2 transition-colors ${
                tab === t.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {(!canSeeTeachersTab || tab === "students") && (
        <>
          <div className="grid grid-cols-3 gap-3">
            <StatCard label="حاضر" value={counts.present} tone="present" />
            <StatCard label="متأخر" value={counts.late} tone="late" />
            <StatCard label="غائب" value={counts.absent} tone="absent" />
          </div>

          <Card>
            <CardContent className="p-0">
              {classStudents.length === 0 ? (
                <div className="p-6 text-sm text-muted-foreground text-center">
                  لا يوجد طلاب مسجّلون في هذا الصف.
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {classStudents.map((s, i) => (
                    <li key={s.id} className="p-4 flex items-center gap-4">
                      <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{s.name}</div>
                        <div className="text-xs text-muted-foreground">
                          الصف {s.grade} / القسم {s.section} — رقم الطالب: {1000 + s.id}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <StatusBtn active={statusOf(s.id) === "present"} tone="present" onClick={() => setStatus(s.id, "present")}>
                          <Check className="h-4 w-4" />
                        </StatusBtn>
                        <StatusBtn active={statusOf(s.id) === "late"} tone="late" onClick={() => setStatus(s.id, "late")}>
                          <Clock className="h-4 w-4" />
                        </StatusBtn>
                        <StatusBtn active={statusOf(s.id) === "absent"} tone="absent" onClick={() => setStatus(s.id, "absent")}>
                          <X className="h-4 w-4" />
                        </StatusBtn>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Can permission="attendance.write" fallback={<ReadOnlyNotice text="يمكن للمعلم فقط تعديل كشف الحضور." />}>
              <Button size="lg">حفظ كشف الحضور</Button>
            </Can>
          </div>
        </>
      )}

      {canSeeTeachersTab && tab === "teachers" && (
        <>
          <Card>
            <CardContent className="p-0">
              <ul className="divide-y divide-border">
                {initialTeachers.map((t) => {
                  const current = teacherStatuses[t.name];
                  return (
                    <li key={t.name} className="p-4 flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-gold/20 text-gold-foreground flex items-center justify-center font-semibold shrink-0">
                        {t.name[t.name.indexOf(" ") + 1]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{t.name}</div>
                        <div className="text-xs text-muted-foreground">{t.subject}</div>
                      </div>
                      <div className="flex gap-1">
                        <StatusBtn
                          active={current === "present"}
                          tone="present"
                          onClick={() => setTeacherStatus(t.name, "present")}
                        >
                          <Check className="h-4 w-4" />
                        </StatusBtn>
                        <StatusBtn
                          active={current === "late"}
                          tone="late"
                          onClick={() => setTeacherStatus(t.name, "late")}
                        >
                          <Clock className="h-4 w-4" />
                        </StatusBtn>
                        <StatusBtn
                          active={current === "absent"}
                          tone="absent"
                          onClick={() => setTeacherStatus(t.name, "absent")}
                        >
                          <X className="h-4 w-4" />
                        </StatusBtn>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
          <div className="flex justify-end">
            <Button size="lg">حفظ كشف حضور المعلمين</Button>
          </div>
        </>
      )}
    </div>
  );
}



function MyAttendance() {
  const studentId = resolveCurrentStudentId();
  const profile = studentId != null ? getStudentProfile(studentId) : null;
  if (!profile) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            لا يوجد سجل طالب مرتبط بهذا الحساب — تواصل مع إدارة المدرسة.
          </CardContent>
        </Card>
      </div>
    );
  }
  const { student, attendance } = profile;
  const records = [...attendance].sort((a, b) => (a.date < b.date ? 1 : -1));
  const present = records.filter((a) => a.status === "حاضر").length;
  const late = records.filter((a) => a.status === "متأخر").length;
  const absent = records.filter((a) => a.status === "غائب").length;
  const rate = records.length ? Math.round((present / records.length) * 100) : 0;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-4xl mx-auto">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold">سجل حضوري وغيابي</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {student.name} — الصف {student.grade} / القسم {student.section}
        </p>
      </header>

      <div className="grid grid-cols-3 gap-3">
        <StatCard label="حاضر" value={present} tone="present" />
        <StatCard label="متأخر" value={late} tone="late" />
        <StatCard label="غائب" value={absent} tone="absent" />
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground">
            نسبة الحضور: <span className="font-bold text-foreground">{rate}%</span> ({present} من{" "}
            {records.length} يوماً)
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {records.map((a) => (
              <li key={a.date} className="p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="font-medium" dir="ltr" style={{ textAlign: "right" }}>
                    {a.date}
                  </div>
                  {a.note && (
                    <div className="text-xs text-muted-foreground mt-0.5">{a.note}</div>
                  )}
                </div>
                <Badge
                  variant="outline"
                  className={
                    a.status === "حاضر"
                      ? "bg-primary/10 text-primary border-primary/30"
                      : a.status === "متأخر"
                      ? "bg-gold/20 text-gold-foreground border-gold/40"
                      : "bg-destructive/10 text-destructive border-destructive/30"
                  }
                >
                  {a.status}
                </Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <ReadOnlyNotice text="هذا السجل للعرض فقط — للاستفسار تواصل مع معلمك." />
    </div>
  );
}

function StatCard({ label, value, tone }: { label: string; value: number; tone: Status }) {

  const style =
    tone === "present"
      ? "bg-primary/10 text-primary"
      : tone === "late"
      ? "bg-gold/20 text-gold-foreground"
      : "bg-destructive/10 text-destructive";
  return (
    <Card className={`border-0 ${style}`}>
      <CardContent className="p-4 text-center">
        <div className="text-3xl font-bold">{value}</div>
        <div className="text-xs mt-1">{label}</div>
      </CardContent>
    </Card>
  );
}

function StatusBtn({
  active,
  tone,
  onClick,
  children,
}: {
  active: boolean;
  tone: Status;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const activeStyle =
    tone === "present"
      ? "bg-primary text-primary-foreground border-primary"
      : tone === "late"
      ? "bg-gold text-gold-foreground border-gold"
      : "bg-destructive text-destructive-foreground border-destructive";
  return (
    <button
      onClick={onClick}
      className={`h-9 w-9 rounded-md border transition-colors flex items-center justify-center ${
        active ? activeStyle : "border-border bg-background text-muted-foreground hover:bg-muted"
      }`}
    >
      {children}
    </button>
  );
}