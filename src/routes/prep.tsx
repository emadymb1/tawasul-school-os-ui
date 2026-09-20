import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sparkles, Wand2, BookOpen, ListChecks, Target, Loader2, NotebookText, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTeacherScope } from "@/lib/teacher-scope";
import { SUBJECT_LABELS } from "@/lib/users-data";
import {
  addLessonSummary,
  deleteLessonSummary,
  loadLessonSummaries,
  type LessonSummary,
} from "@/lib/lesson-summaries";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/prep")({
  head: () => ({
    meta: [
      { title: "مساعد التحضير — منارة" },
      { name: "description", content: "مساعد ذكي لتحضير الدروس في القرآن الكريم واللغة العربية والتربية الإسلامية." },
      { property: "og:title", content: "مساعد التحضير — منارة" },
      { property: "og:description", content: "خطط الدروس بذكاء لموادك الشرعية." },
    ],
  }),
  component: PrepPage,
});

type Plan = {
  objectives: string[];
  intro: string;
  activities: { title: string; desc: string; time: string }[];
  homework: string;
  assessment: string;
};

const samplePlan: Plan = {
  objectives: [
    "أن يتلو الطالب الآيات تلاوة صحيحة مع تطبيق أحكام التجويد",
    "أن يفسّر الطالب مفردات الآيات تفسيراً موجزاً",
    "أن يستنبط الطالب فائدتين تربويتين من الآيات",
  ],
  intro:
    "تمهيد بسؤال حواري: ما أعظم نعمة أنعمها الله علينا؟ ثم ربط إجابات الطلاب بموضوع الدرس مع تلاوة عطرة من المعلم.",
  activities: [
    { title: "التلاوة النموذجية", desc: "يتلو المعلم الآيات ثم يتلو الطلاب بالتناوب مع التصحيح الفوري.", time: "١٠ دقائق" },
    { title: "شرح المفردات", desc: "استخراج المفردات الصعبة على السبورة مع معانيها.", time: "١٥ دقيقة" },
    { title: "المعنى الإجمالي", desc: "شرح المعنى الإجمالي للآيات مع أمثلة من الواقع.", time: "١٥ دقيقة" },
    { title: "نشاط جماعي", desc: "توزيع الطلاب مجموعات لاستخراج الفوائد وعرضها.", time: "١٥ دقيقة" },
  ],
  homework: "حفظ الآيات من (1) إلى (5) مع كتابة معاني ثلاث مفردات.",
  assessment: "أسئلة شفهية سريعة على المفردات وتلاوة عشوائية من الآيات.",
};

function PrepPage() {
  // نطاق المعلم الموحّد: نفس صفوف/مواد الطلاب والحضور والواجبات
  const { role, gradesWithPrefix, subjectIds } = useTeacherScope();
  const allowedSubjects = subjectIds.map((id) => SUBJECT_LABELS[id]);
  const [subject, setSubject] = useState(allowedSubjects[0] ?? "القرآن الكريم");
  const [topic, setTopic] = useState("تفسير آيات من سورة الرحمن");
  const [grade, setGrade] = useState(gradesWithPrefix[0] ?? "الصف الأول");
  const [duration, setDuration] = useState("٤٥ دقيقة");
  const [notes, setNotes] = useState("");
  const [prepDate, setPrepDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = () => {
    setLoading(true);
    setPlan(null);
    setTimeout(() => {
      setPlan(samplePlan);
      setLoading(false);
    }, 900);
  };

  if (role !== "teacher" && role !== "admin") {
    return (
      <div className="p-4 md:p-8 max-w-2xl mx-auto">
        <div className="rounded-xl border border-border bg-card p-8 text-center space-y-3">
          <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center">
            <Lock className="h-5 w-5 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-bold">مساعد التحضير متاح للمعلمين والإدارة فقط</h2>
          <p className="text-sm text-muted-foreground">
            هذه الأداة مخصصة لطاقم المدرسة لإعداد خطط الدروس.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-6xl mx-auto">
      <header>
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-gold/20 text-gold-foreground flex items-center justify-center">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">مساعد التحضير</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              خطة درس متكاملة في ثوانٍ — مصممة للمعلم المسلم
            </p>
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-2 h-fit">
          <CardHeader>
            <CardTitle className="text-base">تفاصيل الدرس</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>المادة</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {allowedSubjects.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>موضوع الدرس</Label>
              <Input value={topic} onChange={(e) => setTopic(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>الصف</Label>
                <Select value={grade} onValueChange={setGrade}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {gradesWithPrefix.map((g) => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>المدة</Label>
                <Input value={duration} onChange={(e) => setDuration(e.target.value)} />
              </div>
            </div>
            <div>
              <Label>ملاحظات إضافية</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="مثال: يوجد طلاب متأخرون في القراءة"
                rows={4}
              />
            </div>
            {role === "admin" && (
              <div className="rounded-md border border-primary/30 bg-primary/5 p-3 space-y-1.5">
                <Label htmlFor="prep-date" className="text-primary">تاريخ التحضير (خاص بالمدير)</Label>
                <Input
                  id="prep-date"
                  type="date"
                  value={prepDate}
                  onChange={(e) => setPrepDate(e.target.value)}
                  dir="ltr"
                />
                <p className="text-[11px] text-muted-foreground">
                  يمكن للمدير تعديل تاريخ التحضير للأغراض الإدارية أو التخطيط المستقبلي.
                </p>
              </div>
            )}
            <Button size="lg" className="w-full gap-2" onClick={generate} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
              {loading ? "جاري التحضير..." : "توليد خطة الدرس"}
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-3">
          {!plan && !loading && (
            <Card className="border-dashed">
              <CardContent className="p-10 text-center">
                <div className="h-14 w-14 mx-auto rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <BookOpen className="h-7 w-7" />
                </div>
                <h3 className="font-bold mt-4">جاهز لتحضير درسك</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
                  املأ تفاصيل الدرس على اليمين واضغط "توليد خطة الدرس" لتظهر خطة متكاملة تشمل الأهداف والأنشطة والتقويم.
                </p>
              </CardContent>
            </Card>
          )}
          {loading && (
            <Card>
              <CardContent className="p-10 flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <div className="text-sm text-muted-foreground">يجري إعداد خطة الدرس...</div>
              </CardContent>
            </Card>
          )}
          {plan && (
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">{subject}</Badge>
                    <Badge variant="outline">{grade}</Badge>
                    <Badge variant="outline">{duration}</Badge>
                    {role === "admin" && <Badge variant="outline">تاريخ: {prepDate}</Badge>}
                  </div>
                  <CardTitle className="mt-2">{topic}</CardTitle>
                </CardHeader>
              </Card>

              <Section icon={Target} title="الأهداف التعليمية">
                <ul className="space-y-2">
                  {plan.objectives.map((o, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <span className="text-primary font-bold shrink-0">{i + 1}.</span>
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </Section>

              <Section icon={BookOpen} title="التمهيد">
                <p className="text-sm leading-relaxed">{plan.intro}</p>
              </Section>

              <Section icon={ListChecks} title="الأنشطة">
                <ol className="space-y-3">
                  {plan.activities.map((a, i) => (
                    <li key={i} className="flex gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
                      <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="font-semibold text-sm">{a.title}</div>
                          <span className="text-xs text-muted-foreground shrink-0">{a.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{a.desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </Section>

              <div className="grid md:grid-cols-2 gap-4">
                <Section title="الواجب المنزلي">
                  <p className="text-sm">{plan.homework}</p>
                </Section>
                <Section title="التقويم">
                  <p className="text-sm">{plan.assessment}</p>
                </Section>
              </div>
            </div>
          )}
        </div>
      </div>

      <LessonSummariesSection
        allowedSubjects={allowedSubjects}
        grades={gradesWithPrefix}
      />
    </div>
  );
}

function LessonSummariesSection({
  allowedSubjects,
  grades,
}: {
  allowedSubjects: string[];
  grades: string[];
}) {
  const [items, setItems] = useState<LessonSummary[]>([]);
  const [subject, setSubject] = useState(allowedSubjects[0] ?? "");
  const [grade, setGrade] = useState(grades[0] ?? "");
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    setItems(loadLessonSummaries());
  }, []);

  const add = () => {
    if (!title.trim() || !text.trim() || !subject || !grade) {
      toast.error("يرجى تعبئة المادة والصف والعنوان والملخص");
      return;
    }
    const entry = addLessonSummary({ date, subject, grade, title: title.trim(), text: text.trim() });
    setItems((prev) => [entry, ...prev]);
    setTitle("");
    setText("");
    toast.success("تم نشر ملخص الدرس — سيظهر للطلاب وأولياء الأمور");
  };

  const remove = (id: string) => {
    deleteLessonSummary(id);
    setItems((prev) => prev.filter((s) => s.id !== id));
    toast.success("تم حذف الملخص");
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <NotebookText className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold">ملخص الدرس</h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            انشر ملخصاً لدرس اليوم ليظهر في واجهتي الطالب وولي الأمر
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-2 h-fit">
          <CardHeader>
            <CardTitle className="text-base">ملخص جديد</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>المادة</Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger><SelectValue placeholder="اختر المادة" /></SelectTrigger>
                  <SelectContent>
                    {allowedSubjects.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>الصف</Label>
                <Select value={grade} onValueChange={setGrade}>
                  <SelectTrigger><SelectValue placeholder="اختر الصف" /></SelectTrigger>
                  <SelectContent>
                    {grades.map((g) => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>التاريخ</Label>
              <Input type="date" dir="ltr" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <Label>عنوان الدرس</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مثال: تفسير سورة الملك 1-5" />
            </div>
            <div>
              <Label>الملخص</Label>
              <Textarea
                rows={5}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="ما تم شرحه في الدرس، النقاط المهمة، وما يُطلب مراجعته في البيت..."
              />
            </div>
            <Button className="w-full gap-2" onClick={add}>
              <NotebookText className="h-4 w-4" /> نشر الملخص
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 h-fit">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">الملخصات المنشورة</CardTitle>
              <Badge variant="outline">{items.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {items.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">
                لا توجد ملخصات منشورة بعد.
              </p>
            )}
            {items.map((s) => (
              <div key={s.id} className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="font-semibold text-sm">{s.title}</div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-[10px]">
                      {s.subject}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">{s.grade}</Badge>
                    <span className="text-[11px] text-muted-foreground" dir="ltr">{s.date}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      onClick={() => remove(s.id)}
                      aria-label="حذف الملخص"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{s.text}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon?: typeof BookOpen;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-primary" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}