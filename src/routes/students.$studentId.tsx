import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowRight,
  ClipboardCheck,
  BookOpenCheck,
  MessagesSquare,
  Phone,
  User,
  GraduationCap,
  StickyNote,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getStudentProfile, type StudentProfile } from "@/lib/students-data";

export const Route = createFileRoute("/students/$studentId")({
  loader: ({ params }): StudentProfile => {
    const id = Number(params.studentId);
    const profile = getStudentProfile(id);
    if (!profile) throw notFound();
    return profile;
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.student.name} — ملف الطالب`
          : "ملف الطالب",
      },
      {
        name: "description",
        content: "ملف الطالب: بيانات، حضور، واجبات، درجات وملاحظات المعلم.",
      },
      { property: "og:title", content: "ملف الطالب — مدرسة الرابطة الإسلامية" },
      {
        property: "og:description",
        content: "عرض شامل لسجل الطالب في المدرسة.",
      },
    ],
  }),
  component: StudentDetailPage,
  notFoundComponent: StudentNotFound,
});

function StudentNotFound() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-xl font-bold">الطالب غير موجود</h1>
      <p className="text-sm text-muted-foreground mt-2">تعذر العثور على بيانات هذا الطالب.</p>
      <Button asChild variant="outline" className="mt-4">
        <Link to="/students">العودة لقائمة الطلاب</Link>
      </Button>
    </div>
  );
}

function StudentDetailPage() {
  const { student, attendance, assignments, grades, notes } =
    Route.useLoaderData() as StudentProfile;

  const totalDays = attendance.length;
  const presentDays = attendance.filter((a) => a.status === "حاضر").length;
  const lateDays = attendance.filter((a) => a.status === "متأخر").length;
  const absentDays = attendance.filter((a) => a.status === "غائب").length;
  const attendanceRate = totalDays ? Math.round((presentDays / totalDays) * 100) : 0;

  const submittedCount = assignments.filter((a) => a.status === "مُسلَّم").length;
  const submissionRate = assignments.length
    ? Math.round((submittedCount / assignments.length) * 100)
    : 0;

  const overallScore = grades.reduce((sum, g) => sum + g.score, 0);
  const overallMax = grades.reduce((sum, g) => sum + g.max, 0);
  const overallPct = overallMax ? Math.round((overallScore / overallMax) * 100) : 0;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/students" className="hover:text-foreground inline-flex items-center gap-1">
          <ArrowRight className="h-4 w-4" />
          العودة إلى قائمة الطلاب
        </Link>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{student.name}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <Badge variant="secondary">الصف {student.grade}</Badge>
                  <Badge variant="outline">القسم {student.section}</Badge>
                </div>
                <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5" />
                    <span>ولي الأمر: {student.guardian}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" />
                    <span dir="ltr">{student.phone}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm" className="gap-1">
                <Link to="/attendance" search={{ studentId: student.id } as never}>
                  <ClipboardCheck className="h-4 w-4" />
                  تسجيل الحضور
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="gap-1">
                <Link to="/assignments" search={{ studentId: student.id } as never}>
                  <BookOpenCheck className="h-4 w-4" />
                  الواجبات
                </Link>
              </Button>
              <Button asChild size="sm" className="gap-1">
                <Link to="/parents" search={{ studentId: student.id } as never}>
                  <MessagesSquare className="h-4 w-4" />
                  مراسلة ولي الأمر
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-xs text-muted-foreground">نسبة الحضور</div>
            <div className="text-2xl font-bold mt-1">{attendanceRate}%</div>
            <Progress value={attendanceRate} className="mt-2 h-2" />
            <div className="text-[11px] text-muted-foreground mt-2">
              حاضر {presentDays} · متأخر {lateDays} · غائب {absentDays}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-xs text-muted-foreground">تسليم الواجبات</div>
            <div className="text-2xl font-bold mt-1">{submissionRate}%</div>
            <Progress value={submissionRate} className="mt-2 h-2" />
            <div className="text-[11px] text-muted-foreground mt-2">
              {submittedCount} من {assignments.length} واجبات مُسلَّمة
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-xs text-muted-foreground">المعدل العام</div>
            <div className="text-2xl font-bold mt-1">{overallPct}%</div>
            <Progress value={overallPct} className="mt-2 h-2" />
            <div className="text-[11px] text-muted-foreground mt-2">
              {overallScore} / {overallMax} نقطة
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="attendance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="attendance" className="gap-1">
            <ClipboardCheck className="h-4 w-4" /> سجل الحضور
          </TabsTrigger>
          <TabsTrigger value="assignments" className="gap-1">
            <BookOpenCheck className="h-4 w-4" /> الواجبات
          </TabsTrigger>
          <TabsTrigger value="grades" className="gap-1">
            <GraduationCap className="h-4 w-4" /> الدرجات
          </TabsTrigger>
          <TabsTrigger value="notes" className="gap-1">
            <StickyNote className="h-4 w-4" /> ملاحظات المعلم
          </TabsTrigger>
        </TabsList>

        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">آخر أيام الحضور</CardTitle>
            </CardHeader>
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
                        <TableCell>
                          <StatusBadge status={a.status} />
                        </TableCell>
                        <TableCell className="text-muted-foreground">{a.note ?? "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">الواجبات الأخيرة</CardTitle>
            </CardHeader>
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
                        <TableCell>
                          <Badge variant="secondary">{a.subject}</Badge>
                        </TableCell>
                        <TableCell dir="ltr" className="text-right">{a.dueDate}</TableCell>
                        <TableCell>
                          <AssignmentStatus status={a.status} />
                        </TableCell>
                        <TableCell>{a.grade != null ? `${a.grade}/10` : "—"}</TableCell>
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
            <CardHeader>
              <CardTitle className="text-base">درجات المواد</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {grades.map((g) => {
                const pct = Math.round((g.score / g.max) * 100);
                return (
                  <div key={`${g.subject}-${g.component}`}>
                    <div className="flex items-center justify-between text-sm">
                      <div className="font-medium">
                        {g.subject} <span className="text-muted-foreground">— {g.component}</span>
                      </div>
                      <div className="text-muted-foreground">
                        {g.score}/{g.max} · {pct}%
                      </div>
                    </div>
                    <Progress value={pct} className="mt-2 h-2" />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">ملاحظات المعلم</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {notes.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">لا توجد ملاحظات.</p>
              ) : (
                notes.map((n, i) => (
                  <div key={i} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{n.author}</span>
                      <span dir="ltr">{n.date}</span>
                    </div>
                    <p className="text-sm mt-2 leading-relaxed">{n.text}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatusBadge({ status }: { status: "حاضر" | "غائب" | "متأخر" }) {
  if (status === "حاضر") {
    return (
      <Badge className="gap-1 bg-emerald-600 hover:bg-emerald-600">
        <CheckCircle2 className="h-3 w-3" /> حاضر
      </Badge>
    );
  }
  if (status === "متأخر") {
    return (
      <Badge variant="secondary" className="gap-1">
        <Clock className="h-3 w-3" /> متأخر
      </Badge>
    );
  }
  return (
    <Badge variant="destructive" className="gap-1">
      <XCircle className="h-3 w-3" /> غائب
    </Badge>
  );
}

function AssignmentStatus({ status }: { status: "مُسلَّم" | "متأخر" | "لم يُسلَّم" }) {
  if (status === "مُسلَّم") {
    return <Badge className="bg-emerald-600 hover:bg-emerald-600">مُسلَّم</Badge>;
  }
  if (status === "متأخر") {
    return <Badge variant="secondary">متأخر</Badge>;
  }
  return <Badge variant="destructive">لم يُسلَّم</Badge>;
}