import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus, BookOpenCheck, Calendar, Users, Upload, FileText, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Can, useRole } from "@/lib/role-context";
import { AccessDenied } from "@/components/role-guard";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  loadAssignments,
  saveAssignments,
  loadSubmissions,
  saveSubmissions,
  subjectStyle,
  statusStyle,
  STATUS_LABELS,
  type Assignment,
  type Submission,
  type SubmissionStatus,
  type Subject,
} from "@/lib/assignments-data";
import { useTeacherScope } from "@/lib/teacher-scope";

export const Route = createFileRoute("/assignments")({
  head: () => ({
    meta: [
      { title: "الواجبات والمهام — منارة" },
      { name: "description", content: "إسناد ومتابعة الواجبات في القرآن واللغة العربية والتربية الإسلامية." },
      { property: "og:title", content: "الواجبات والمهام — منارة" },
      { property: "og:description", content: "إسناد ومتابعة الواجبات المدرسية." },
    ],
  }),
  component: AssignmentsPage,
});

const SUBJECTS: Subject[] = ["القرآن", "اللغة العربية", "التربية الإسلامية"];

const SUBJECT_BY_ID: Record<string, Subject> = {
  quran: "القرآن",
  arabic: "اللغة العربية",
  islamic: "التربية الإسلامية",
};

function AssignmentsPage() {
  // نطاق المعلم الموحّد: نفس صفوف/مواد الحضور والطلاب والتحضير
  const { role, isScoped, gradesWithPrefix, subjectIds } = useTeacherScope();

  const allowedSubjects = useMemo<Subject[]>(() => {
    const s = subjectIds.map((id) => SUBJECT_BY_ID[id]).filter(Boolean);
    return s.length ? s : SUBJECTS;
  }, [subjectIds]);
  const allowedGrades = useMemo<string[] | null>(
    () => (isScoped ? gradesWithPrefix : null),
    [isScoped, gradesWithPrefix],
  );

  const [items, setItems] = useState<Assignment[]>(() => loadAssignments());
  const [subs, setSubs] = useState<Submission[]>(() => loadSubmissions());
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    subject: allowedSubjects[0],
    grade: allowedGrades?.[0] ?? "الصف الأول",
    due: "",
    desc: "",
  });
  const [subjectFilter, setSubjectFilter] = useState<Subject | "all">("all");

  useEffect(() => { saveAssignments(items); }, [items]);
  useEffect(() => { saveSubmissions(subs); }, [subs]);

  const submissionsByAssignment = useMemo(() => {
    const map = new Map<number, number>();
    subs.forEach((s) => {
      if (s.status === "submitted" || s.status === "graded") {
        map.set(s.assignmentId, (map.get(s.assignmentId) ?? 0) + 1);
      }
    });
    return map;
  }, [subs]);

  const submittedCount = (a: Assignment) => submissionsByAssignment.get(a.id) ?? 0;

  const scopedItems = useMemo(
    () =>
      items.filter(
        (i) =>
          allowedSubjects.includes(i.subject) &&
          (!allowedGrades || allowedGrades.includes(i.grade)),
      ),
    [items, allowedSubjects, allowedGrades],
  );

  const filtered =
    subjectFilter === "all" ? scopedItems : scopedItems.filter((i) => i.subject === subjectFilter);

  const handleAdd = () => {
    if (!form.title.trim()) return;
    setItems((prev) => [
      {
        id: Date.now(),
        title: form.title,
        subject: form.subject,
        grade: form.grade,
        due: form.due || "الأسبوع القادم",
        total: 20,
        desc: form.desc,
        requiresUpload: true,
      },
      ...prev,
    ]);
    setForm({ title: "", subject: "القرآن", grade: "الصف الأول", due: "", desc: "" });
    setOpen(false);
  };

  const isStudent = role === "student";

  if (role === "parent") {
    return (
      <AccessDenied
        title="الواجبات متاحة للإدارة والمعلمين والطلاب"
        hint="يمكنك متابعة واجبات أبنائك من صفحة الأبناء."
      />
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-6xl mx-auto">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">الواجبات والمهام</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {isStudent
              ? "قائمة الواجبات الخاصة بك مع حالتها وإمكانية الرفع"
              : "جميع الواجبات المُسندة للطلاب مع نسب التسليم"}
          </p>
        </div>
        <Can permission="assignments.create">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2">
              <Plus className="h-4 w-4" /> واجب جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>إسناد واجب جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>عنوان الواجب</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="مثال: حفظ سورة النبأ"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>المادة</Label>
                  <Select
                    value={form.subject}
                    onValueChange={(v) => setForm({ ...form, subject: v as Subject })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {allowedSubjects.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>الصف</Label>
                  <Select value={form.grade} onValueChange={(v) => setForm({ ...form, grade: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(allowedGrades ?? ["الصف الأول", "الصف الثاني", "الصف الثالث", "الصف الرابع", "الصف الخامس", "الصف السادس"]).map((g) => (
                        <SelectItem key={g} value={g}>{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>موعد التسليم</Label>
                <Input
                  value={form.due}
                  onChange={(e) => setForm({ ...form, due: e.target.value })}
                  placeholder="السبت القادم"
                />
              </div>
              <div>
                <Label>تفاصيل</Label>
                <Textarea
                  value={form.desc}
                  onChange={(e) => setForm({ ...form, desc: e.target.value })}
                  placeholder="اذكر تعليمات الواجب"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
              <Button onClick={handleAdd}>إرسال الواجب</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </Can>
      </header>

      {isStudent ? (
        <StudentView items={items} subs={subs} setSubs={setSubs} />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <SummaryCard icon={BookOpenCheck} label="إجمالي الواجبات" value={scopedItems.length} />
            <SummaryCard icon={CheckCircle2} label="مسلَّم" value={Array.from(submissionsByAssignment.values()).reduce((a, b) => a + b, 0)} />
            <SummaryCard icon={Calendar} label="مستحق هذا الأسبوع" value={scopedItems.filter((i) => i.due.includes("السبت") || i.due.includes("الأحد")).length} />
            <SummaryCard icon={Clock} label="متأخر" value={scopedItems.reduce((s, i) => s + Math.max(0, i.total - submittedCount(i)), 0)} />
          </div>

          <Tabs value={subjectFilter} onValueChange={(v) => setSubjectFilter(v as Subject | "all")}>
            <TabsList className="w-full flex flex-wrap h-auto">
              <TabsTrigger value="all">كل المواد</TabsTrigger>
              {allowedSubjects.map((s) => (
                <TabsTrigger key={s} value={s}>{s}</TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value={subjectFilter} className="mt-4 space-y-6">
              {(subjectFilter === "all" ? allowedSubjects : [subjectFilter]).map((subj) => {
                const list = filtered.filter((i) => i.subject === subj);
                if (list.length === 0) return null;
                return (
                  <section key={subj} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold">{subj}</h2>
                      <Badge variant="outline" className={subjectStyle(subj)}>{list.length} واجبات</Badge>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      {list.map((a) => {
                        const done = submittedCount(a);
                        const pct = Math.round((done / a.total) * 100);
                        return (
                          <Card key={a.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                              <Badge variant="outline" className={subjectStyle(a.subject)}>{a.subject}</Badge>
                              <CardTitle className="text-base mt-2 leading-relaxed">{a.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <p className="text-sm text-muted-foreground">{a.desc}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {a.grade}</span>
                                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {a.due}</span>
                              </div>
                              <div>
                                <div className="flex justify-between text-xs mb-1.5">
                                  <span className="text-muted-foreground">التسليم</span>
                                  <span className="font-semibold">{done} / {a.total}</span>
                                </div>
                                <div className="h-2 rounded-full bg-muted overflow-hidden">
                                  <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value }: { icon: typeof BookOpenCheck; label: string; value: number }) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xl font-bold">{value}</div>
          <div className="text-xs text-muted-foreground">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function StudentView({
  items,
  subs,
  setSubs,
}: {
  items: Assignment[];
  subs: Submission[];
  setSubs: (s: Submission[] | ((p: Submission[]) => Submission[])) => void;
}) {
  const getSub = (id: number): Submission | undefined => subs.find((s) => s.assignmentId === id);

  const statusOf = (id: number): SubmissionStatus => getSub(id)?.status ?? "pending";

  const groups = useMemo(() => {
    const g: Record<Subject, Assignment[]> = {
      "القرآن": [],
      "اللغة العربية": [],
      "التربية الإسلامية": [],
    };
    items.forEach((a) => g[a.subject].push(a));
    return g;
  }, [items]);

  const stats = {
    total: items.length,
    submitted: items.filter((a) => ["submitted", "graded"].includes(statusOf(a.id))).length,
    pending: items.filter((a) => statusOf(a.id) === "pending").length,
    graded: items.filter((a) => statusOf(a.id) === "graded").length,
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SummaryCard icon={BookOpenCheck} label="إجمالي الواجبات" value={stats.total} />
        <SummaryCard icon={CheckCircle2} label="مُسلَّمة" value={stats.submitted} />
        <SummaryCard icon={Clock} label="بانتظارك" value={stats.pending} />
        <SummaryCard icon={FileText} label="مُقيَّمة" value={stats.graded} />
      </div>

      <div className="space-y-6">
        {SUBJECTS.map((subj) => {
          const list = groups[subj];
          if (list.length === 0) return null;
          return (
            <section key={subj} className="space-y-3">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">{subj}</h2>
                <Badge variant="outline" className={subjectStyle(subj)}>{list.length} واجبات</Badge>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {list.map((a) => (
                  <StudentAssignmentCard
                    key={a.id}
                    a={a}
                    sub={getSub(a.id)}
                    setSubs={setSubs}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}

function StudentAssignmentCard({
  a,
  sub,
  setSubs,
}: {
  a: Assignment;
  sub?: Submission;
  setSubs: (s: Submission[] | ((p: Submission[]) => Submission[])) => void;
}) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState(sub?.note ?? "");
  const [fileName, setFileName] = useState(sub?.fileName ?? "");
  const status = sub?.status ?? "pending";

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFileName(f.name);
  };

  const submit = () => {
    setSubs((prev) => {
      const others = prev.filter((s) => s.assignmentId !== a.id);
      return [
        ...others,
        {
          assignmentId: a.id,
          status: "submitted",
          fileName: fileName || "ملف بدون اسم",
          note,
          submittedAt: "الآن",
        },
      ];
    });
    setOpen(false);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <Badge variant="outline" className={subjectStyle(a.subject)}>{a.subject}</Badge>
          <Badge variant="outline" className={statusStyle(status)}>{STATUS_LABELS[status]}</Badge>
        </div>
        <CardTitle className="text-base mt-2 leading-relaxed">{a.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{a.desc}</p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {a.due}</span>
          {sub?.grade != null && (
            <span className="flex items-center gap-1 font-semibold text-primary">
              الدرجة: {sub.grade} / 20
            </span>
          )}
        </div>
        {sub?.fileName && (
          <div className="rounded-md border border-border bg-muted/40 p-2 text-xs flex items-center gap-2">
            <FileText className="h-3.5 w-3.5" />
            <span className="truncate">{sub.fileName}</span>
            {sub.submittedAt && <span className="text-muted-foreground ms-auto">{sub.submittedAt}</span>}
          </div>
        )}
        {a.requiresUpload && status !== "graded" && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2 w-full" variant={status === "pending" ? "default" : "outline"}>
                <Upload className="h-4 w-4" />
                {status === "pending" ? "رفع الواجب" : "تحديث التسليم"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{a.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>الملف</Label>
                  <Input type="file" onChange={onFile} />
                  {fileName && <p className="text-xs text-muted-foreground mt-1">{fileName}</p>}
                </div>
                <div>
                  <Label>ملاحظة للمعلم (اختياري)</Label>
                  <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="أي شرح تحب إضافته" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
                <Button onClick={submit} disabled={!fileName}>تأكيد الرفع</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}