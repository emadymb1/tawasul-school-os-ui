import { createFileRoute, Link, notFound, Navigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CornerUpLeft,
  ClipboardCheck,
  BookOpenCheck,
  GraduationCap,
  MessagesSquare,
  User,
  Phone,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getStudentProfile, type StudentProfile } from "@/lib/students-data";
import { useStudents } from "@/lib/use-students";
import { loadUsers, SUBJECTS, SUBJECT_LABELS, type SubjectId, type ManagedUser } from "@/lib/users-data";
import { useRole } from "@/lib/role-context";
import { saveSelectedChildId, getCurrentParentChildIds } from "@/lib/selected-child";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/children/$studentId")({
  loader: ({ params }): StudentProfile => {
    const id = Number(params.studentId);
    const profile = getStudentProfile(id);
    if (!profile) throw notFound();
    return profile;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.student.name} — متابعة الابن` : "متابعة الابن" },
      { name: "description", content: "متابعة حضور الابن وواجباته ودرجاته والتواصل مع معلميه." },
      { property: "og:title", content: "متابعة الابن — منارة" },
      { property: "og:description", content: "لوحة قراءة فقط لولي الأمر لمتابعة الابن." },
    ],
  }),
  component: ChildDetailPage,
  notFoundComponent: ChildNotFound,
});

function ChildNotFound() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-xl font-bold">الابن غير موجود</h1>
      <Button asChild variant="outline" className="mt-4">
        <Link to="/children" search={{ pick: true }}>العودة إلى الأبناء</Link>
      </Button>
    </div>
  );
}

function ChildDetailPage() {
  const { students } = useStudents();
  const { role } = useRole();
  const navigate = useNavigate();
  const router = useRouter();
  const { student, attendance, assignments, grades } =
    Route.useLoaderData() as StudentProfile;

  // Remember this child as the last selected so next visit auto-loads it.
  useEffect(() => {
    saveSelectedChildId(student.id);
  }, [student.id]);

  if (role !== "parent") return <Navigate to="/" replace />;


  const siblingIds = getCurrentParentChildIds(loadUsers());
  const siblings = students.filter((s) => siblingIds.includes(s.id));
  const hasMultiple = siblings.length > 1;

  const totalDays = attendance.length;
  const presentDays = attendance.filter((a) => a.status === "حاضر").length;
  const attendanceRate = totalDays ? Math.round((presentDays / totalDays) * 100) : 0;
  const submittedCount = assignments.filter((a) => a.status === "مُسلَّم").length;
  const submissionRate = assignments.length
    ? Math.round((submittedCount / assignments.length) * 100)
    : 0;
  const overallScore = grades.reduce((s, g) => s + g.score, 0);
  const overallMax = grades.reduce((s, g) => s + g.max, 0);
  const overallPct = overallMax ? Math.round((overallScore / overallMax) * 100) : 0;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          to="/children"
          search={{ pick: true }}
          className="hover:text-foreground inline-flex items-center gap-1"
        >
          <ArrowRight className="h-4 w-4" />
          العودة إلى الأبناء
        </Link>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 px-2 gap-1"
          onClick={() => router.history.back()}
        >
          <CornerUpLeft className="h-4 w-4" />
          تراجع
        </Button>
        {hasMultiple && (
          <div className="ms-auto flex items-center gap-2">
            <span className="text-xs">تبديل الابن:</span>
            <Select
              value={String(student.id)}
              onValueChange={(v) => {
                const id = Number(v);
                saveSelectedChildId(id);
                navigate({ to: "/children/$studentId", params: { studentId: String(id) } });
              }}
            >
              <SelectTrigger className="h-8 w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {siblings.map((s) => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    {s.name} — الصف {s.grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <User className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{student.name}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant="secondary">الصف {student.grade}</Badge>
                <Badge variant="outline">القسم {student.section}</Badge>
              </div>
              <div className="mt-3 text-sm text-muted-foreground flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" />
                <span dir="ltr">{student.phone}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-lg border border-dashed border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
        هذه الصفحة للعرض فقط — لمتابعة أداء الابن والتواصل مع معلميه.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <StatCard label="نسبة الحضور" value={attendanceRate} hint={`حاضر ${presentDays} من ${totalDays}`} />
        <StatCard label="تسليم الواجبات" value={submissionRate} hint={`${submittedCount} من ${assignments.length} مُسلَّم`} />
        <StatCard label="المعدل العام" value={overallPct} hint={`${overallScore} / ${overallMax}`} />
      </div>

      <Tabs defaultValue="assignments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="assignments" className="gap-1">
            <BookOpenCheck className="h-4 w-4" /> الواجبات
          </TabsTrigger>
          <TabsTrigger value="attendance" className="gap-1">
            <ClipboardCheck className="h-4 w-4" /> الحضور والغياب
          </TabsTrigger>
          <TabsTrigger value="grades" className="gap-1">
            <GraduationCap className="h-4 w-4" /> الدرجات
          </TabsTrigger>
          <TabsTrigger value="teachers" className="gap-1">
            <MessagesSquare className="h-4 w-4" /> التواصل مع المعلمين
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assignments">
          <Card>
            <CardHeader><CardTitle className="text-base">واجبات الابن</CardTitle></CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الواجب</TableHead>
                      <TableHead>المادة</TableHead>
                      <TableHead>تاريخ التسليم</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الدرجة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignments.map((a) => (
                      <TableRow key={a.title}>
                        <TableCell className="font-medium">{a.title}</TableCell>
                        <TableCell><Badge variant="secondary">{a.subject}</Badge></TableCell>
                        <TableCell dir="ltr" className="text-right">{a.dueDate}</TableCell>
                        <TableCell><AssignmentStatus status={a.status} /></TableCell>
                        <TableCell>{a.grade != null ? `${a.grade}/10` : "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <Card>
            <CardHeader><CardTitle className="text-base">سجل حضور الابن</CardTitle></CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>ملاحظة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendance.map((a) => (
                      <TableRow key={a.date}>
                        <TableCell dir="ltr" className="text-right">{a.date}</TableCell>
                        <TableCell><StatusBadge status={a.status} /></TableCell>
                        <TableCell className="text-muted-foreground">{a.note ?? "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grades">
          <Card>
            <CardHeader><CardTitle className="text-base">درجات المواد</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {grades.map((g) => {
                const pct = Math.round((g.score / g.max) * 100);
                return (
                  <div key={`${g.subject}-${g.component}`}>
                    <div className="flex items-center justify-between text-sm">
                      <div className="font-medium">
                        {g.subject} <span className="text-muted-foreground">— {g.component}</span>
                      </div>
                      <div className="text-muted-foreground">{g.score}/{g.max} · {pct}%</div>
                    </div>
                    <Progress value={pct} className="mt-2 h-2" />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teachers">
          <TeachersContact />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({ label, value, hint }: { label: string; value: number; hint: string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-2xl font-bold mt-1">{value}%</div>
        <Progress value={value} className="mt-2 h-2" />
        <div className="text-[11px] text-muted-foreground mt-2">{hint}</div>
      </CardContent>
    </Card>
  );
}

function TeachersContact() {
  const users = loadUsers();
  const teachers = users.filter((u) => u.role === "teacher");
  // Map subject -> teachers
  const bySubject: Record<SubjectId, ManagedUser[]> = { quran: [], arabic: [], islamic: [] };
  for (const t of teachers) {
    for (const s of t.subjects ?? []) bySubject[s].push(t);
  }

  const [active, setActive] = useState<{ teacher: ManagedUser; subject: SubjectId } | null>(null);
  const [msg, setMsg] = useState("");

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <Card className="md:col-span-1">
        <CardHeader><CardTitle className="text-base">معلمو الابن</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {SUBJECTS.map((s) => (
            <div key={s.id}>
              <div className="text-xs font-semibold text-muted-foreground mb-2">{s.label}</div>
              <div className="space-y-1">
                {bySubject[s.id].length === 0 ? (
                  <div className="text-xs text-muted-foreground">لا يوجد معلم لهذه المادة.</div>
                ) : (
                  bySubject[s.id].map((t) => {
                    const isActive = active?.teacher.id === t.id && active.subject === s.id;
                    return (
                      <button
                        key={t.id + s.id}
                        onClick={() => { setActive({ teacher: t, subject: s.id }); setMsg(""); }}
                        className={`w-full text-right p-2 rounded-md text-sm transition-colors ${
                          isActive ? "bg-primary/10 text-primary" : "hover:bg-muted"
                        }`}
                      >
                        {t.name}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardContent className="pt-6">
          {!active ? (
            <div className="text-center text-muted-foreground py-16 text-sm">
              اختر معلم مادة لبدء المحادثة.
            </div>
          ) : (
            <div className="flex flex-col h-full min-h-[360px]">
              <div className="border-b border-border pb-3 mb-4">
                <div className="font-semibold">{active.teacher.name}</div>
                <div className="text-xs text-muted-foreground">
                  معلم مادة {SUBJECT_LABELS[active.subject]}
                </div>
              </div>
              <div className="flex-1 space-y-3 mb-4">
                <div className="flex justify-start">
                  <div className="max-w-[75%] rounded-2xl px-4 py-2 text-sm bg-primary text-primary-foreground">
                    وعليكم السلام، أهلاً بك. كيف يمكنني مساعدتك بخصوص أداء الابن؟
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Textarea
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="اكتب رسالتك للمعلم..."
                  rows={2}
                />
                <Button className="gap-2" disabled={!msg.trim()} onClick={() => setMsg("")}>
                  <Send className="h-4 w-4" /> إرسال
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: "حاضر" | "غائب" | "متأخر" }) {
  if (status === "حاضر")
    return (
      <Badge className="gap-1 bg-emerald-600 hover:bg-emerald-600">
        <CheckCircle2 className="h-3 w-3" /> حاضر
      </Badge>
    );
  if (status === "متأخر")
    return (
      <Badge variant="secondary" className="gap-1">
        <Clock className="h-3 w-3" /> متأخر
      </Badge>
    );
  return (
    <Badge variant="destructive" className="gap-1">
      <XCircle className="h-3 w-3" /> غائب
    </Badge>
  );
}

function AssignmentStatus({ status }: { status: "مُسلَّم" | "متأخر" | "لم يُسلَّم" }) {
  if (status === "مُسلَّم") return <Badge className="bg-emerald-600 hover:bg-emerald-600">مُسلَّم</Badge>;
  if (status === "متأخر") return <Badge variant="secondary">متأخر</Badge>;
  return <Badge variant="destructive">لم يُسلَّم</Badge>;
}