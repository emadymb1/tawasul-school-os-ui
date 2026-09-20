import { createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import {
  Settings2,
  UserPlus,
  Trash2,
  BookOpen,
  Users as UsersIcon,
  GraduationCap,
  Heart,
  AlertTriangle,
  ExternalLink,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useRole } from "@/lib/role-context";
import {
  SUBJECTS,
  SUBJECT_LABELS,
  getTeachersBySubject,
  getUncoveredSubjects,
  type ManagedUser,
  type SubjectId,
} from "@/lib/users-data";
import { useUsers } from "@/lib/use-users";
import { useStudents } from "@/lib/use-students";
import { useGrades } from "@/lib/use-grades";
import {
  BOOKS_FEE,
  booksKey,
  childrenCount,
  currentSchoolYearStart,
  loadPaid,
  monthKey,
  monthlyFeeFor,
  savePaid,
  schoolYearLabel,
  SCHOOL_MONTHS,
} from "@/lib/billing";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "لوحة الإدارة — مدرسة الرابطة الإسلامية في فنلندا" },
      {
        name: "description",
        content:
          "إدارة المعلمين والطلاب وأولياء الأمور وتخصيص المواد لكل معلم في مدرسة الرابطة الإسلامية.",
      },
      { property: "og:title", content: "لوحة الإدارة — مدرسة الرابطة الإسلامية" },
      {
        property: "og:description",
        content: "إدارة موحّدة للمستخدمين وتخصيص المواد الدراسية للمعلمين.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

const ADMIN_TABS = ["teachers", "students", "parents", "matrix", "billing"] as const;
type AdminTab = (typeof ADMIN_TABS)[number];

function AdminPage() {
  const { students: allStudents } = useStudents();
  const { role } = useRole();
  const canManage = role === "admin";

  const { users, persist } = useUsers();
  const routeHash = useRouterState({ select: (r) => r.location.hash });
  const [tab, setTab] = useState<AdminTab>("teachers");

  useEffect(() => {
    const h = (routeHash ?? "").replace(/^#/, "") as AdminTab;
    if ((ADMIN_TABS as readonly string[]).includes(h)) setTab(h);
  }, [routeHash]);



  const teachers = users.filter((u) => u.role === "teacher");
  const students = users.filter((u) => u.role === "student");
  const parents = users.filter((u) => u.role === "parent");
  const uncovered = getUncoveredSubjects(users);

  if (!canManage) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>غير مصرّح</CardTitle>
            <CardDescription>
              لوحة الإدارة متاحة فقط للمعلمين المسؤولين. يرجى التواصل مع إدارة المدرسة إن كنت تحتاج صلاحية.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          <Settings2 className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">لوحة الإدارة</h1>
          <p className="text-sm text-muted-foreground">
            إدارة المعلمين والطلاب وأولياء الأمور، وتخصيص المواد الدراسية لكل معلم.
          </p>
        </div>
      </div>

      {uncovered.length > 0 && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
          <div className="text-sm">
            <div className="font-semibold text-destructive mb-1">مواد بلا معلم</div>
            <div className="text-muted-foreground">
              المواد التالية لا يوجد لها معلم مخصّص:{" "}
              <span className="font-medium text-foreground">
                {uncovered.map((s) => SUBJECT_LABELS[s]).join("، ")}
              </span>
              . يدرس كل طالب جميع المواد؛ يرجى إسناد المعلمين.
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={GraduationCap} label="المعلمون" value={teachers.length} />
        <StatCard icon={UsersIcon} label="الطلاب" value={allStudents.length} hint={`${students.length} حساب مرتبط`} />
        <StatCard icon={Heart} label="أولياء الأمور" value={parents.length} />
        <StatCard icon={BookOpen} label="المواد" value={SUBJECTS.length} hint="لكل الطلاب" />
      </div>

      <Tabs
        value={tab}
        onValueChange={(v) => {
          setTab(v as AdminTab);
          if (typeof window !== "undefined") history.replaceState(null, "", `#${v}`);
        }}
        className="space-y-4"
      >

        <TabsList>
          <TabsTrigger value="teachers">المعلمون</TabsTrigger>
          <TabsTrigger value="students">الطلاب</TabsTrigger>
          <TabsTrigger value="parents">أولياء الأمور</TabsTrigger>
          <TabsTrigger value="matrix">المواد والمعلمون</TabsTrigger>
          <TabsTrigger value="billing">الحسابات</TabsTrigger>
        </TabsList>

        <TabsContent value="teachers">
          <TeachersTab users={users} onChange={persist} />
        </TabsContent>

        <TabsContent value="students">
          <StudentsTab users={users} />
        </TabsContent>

        <TabsContent value="parents">
          <ParentsTab users={users} onChange={persist} />
        </TabsContent>

        <TabsContent value="matrix">
          <SubjectMatrix users={users} />
        </TabsContent>

        <TabsContent value="billing">
          <BillingTab users={users} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof UsersIcon;
  label: string;
  value: number;
  hint?: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-muted-foreground text-xs">
          <Icon className="h-4 w-4" />
          <span>{label}</span>
        </div>
        <div className="text-2xl font-bold mt-1">{value}</div>
        {hint && <div className="text-[11px] text-muted-foreground mt-1">{hint}</div>}
      </CardContent>
    </Card>
  );
}

/* ---------------- Teachers ---------------- */

function TeachersTab({
  users,
  onChange,
}: {
  users: ManagedUser[];
  onChange: (next: ManagedUser[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ManagedUser | null>(null);
  const [form, setForm] = useState<{ teacherUserId: string; subjects: SubjectId[]; grades: string[] }>({
    teacherUserId: "",
    subjects: [],
    grades: [],
  });

  const { grades: gradeOptions } = useGrades();
  const teachers = users.filter((u) => u.role === "teacher");
  const isAssigned = (u: ManagedUser) => (u.subjects ?? []).length > 0 && (u.grades ?? []).length > 0;

  const openNew = () => {
    setEditing(null);
    setForm({ teacherUserId: "", subjects: [], grades: [] });
    setOpen(true);
  };

  const openEdit = (u: ManagedUser) => {
    setEditing(u);
    setForm({ teacherUserId: u.id, subjects: u.subjects ?? [], grades: u.grades ?? [] });
    setOpen(true);
  };


  const toggleSubject = (s: SubjectId, on: boolean) => {
    setForm((f) => ({
      ...f,
      subjects: on ? [...f.subjects, s] : f.subjects.filter((x) => x !== s),
    }));
  };

  const toggleGrade = (g: string, on: boolean) => {
    setForm((f) => ({
      ...f,
      grades: on ? [...f.grades, g] : f.grades.filter((x) => x !== g),
    }));
  };

  const save = () => {
    const target = users.find((u) => u.id === form.teacherUserId);
    if (!target) {
      toast.error("يرجى اختيار المعلم من قائمة المستخدمين");
      return;
    }
    if (form.subjects.length === 0) {
      toast.error("يرجى اختيار مادة واحدة على الأقل");
      return;
    }
    if (form.grades.length === 0) {
      toast.error("يرجى اختيار صف واحد على الأقل");
      return;
    }
    onChange(
      users.map((u) =>
        u.id === target.id
          ? { ...u, role: "teacher", subjects: form.subjects, grades: form.grades }
          : u,
      ),
    );
    toast.success(editing ? "تم تحديث بيانات المعلم" : "تم إسناد المواد والصفوف للمعلم");
    setOpen(false);
  };


  const remove = (id: string) => {
    onChange(users.filter((u) => u.id !== id));
    toast.success("تم حذف المعلم");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <CardTitle>المعلمون</CardTitle>
            <CardDescription>حدّد المواد التي يدرّسها كل معلم — يمكن أن يدرّس المعلم أكثر من مادة.</CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={openNew}>
                <UserPlus className="h-4 w-4 ml-2" />
                إضافة معلم
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editing ? "تعديل معلم" : "إضافة معلم جديد"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label>المعلم</Label>
                  <Select
                    value={form.teacherUserId}
                    onValueChange={(v) => {
                      const u = users.find((x) => x.id === v);
                      setForm({
                        teacherUserId: v,
                        subjects: u?.subjects ?? [],
                        grades: u?.grades ?? [],
                      });
                    }}
                    disabled={!!editing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المعلم من المستخدمين" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.name} — {u.email}
                          {isAssigned(u) ? " (مُسند)" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {teachers.length === 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      لا يوجد مستخدمون بدور "معلم" — أضِفهم من صفحة الأدوار والصلاحيات.
                    </p>
                  )}

                </div>

                <div className="space-y-2">
                  <Label>المواد الدراسية</Label>
                  <div className="space-y-2">
                    {SUBJECTS.map((s) => {
                      const id = `subj-${s.id}`;
                      return (
                        <label
                          key={s.id}
                          htmlFor={id}
                          className="flex items-center gap-2 rounded-md border border-border/50 p-2 hover:bg-accent/40 cursor-pointer"
                        >
                          <Checkbox
                            id={id}
                            checked={form.subjects.includes(s.id)}
                            onCheckedChange={(v) => toggleSubject(s.id, v === true)}
                          />
                          <span className="text-sm">{s.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>الصفوف</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {gradeOptions.map((g) => {
                      const id = `grade-${g}`;
                      return (
                        <label
                          key={g}
                          htmlFor={id}
                          className="flex items-center gap-2 rounded-md border border-border/50 p-2 hover:bg-accent/40 cursor-pointer"
                        >
                          <Checkbox
                            id={id}
                            checked={form.grades.includes(g)}
                            onCheckedChange={(v) => toggleGrade(g, v === true)}
                          />
                          <span className="text-sm">الصف {g}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={save}>{editing ? "حفظ" : "إضافة"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم</TableHead>
                <TableHead>البريد</TableHead>
                <TableHead>المواد</TableHead>
                <TableHead>الصفوف</TableHead>
                <TableHead className="w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm" dir="ltr">
                    {t.email}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {(t.subjects ?? []).length === 0 ? (
                        <Badge variant="outline" className="border-destructive/40 text-destructive">
                          بلا مواد
                        </Badge>
                      ) : (
                        (t.subjects ?? []).map((s) => (
                          <Badge key={s} variant="secondary">
                            {SUBJECT_LABELS[s]}
                          </Badge>
                        ))
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {(t.grades ?? []).length === 0 ? (
                        <Badge variant="outline" className="border-destructive/40 text-destructive">
                          بلا صفوف
                        </Badge>
                      ) : (
                        (t.grades ?? []).map((g) => (
                          <Badge key={g} variant="outline">
                            {g}
                          </Badge>
                        ))
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(t)} aria-label="تعديل">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => remove(t.id)} aria-label="حذف">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {teachers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    لا يوجد معلمون بعد.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

/* ---------------- Students ---------------- */

function StudentsTab({ users }: { users: ManagedUser[] }) {
  const { students: allStudents } = useStudents();
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <CardTitle>الطلاب</CardTitle>
            <CardDescription>
              يدرس كل طالب جميع المواد ({SUBJECTS.map((s) => s.label).join("، ")}). للإدارة الكاملة استخدم صفحة الطلاب.
            </CardDescription>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/students">
              <ExternalLink className="h-4 w-4 ml-2" />
              الإدارة الكاملة
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم</TableHead>
                <TableHead>الصف</TableHead>
                <TableHead>القسم</TableHead>
                <TableHead>ولي الأمر</TableHead>
                <TableHead>حساب مرتبط</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allStudents.map((s) => {
                const account = users.find((u) => u.role === "student" && u.studentId === s.id);
                return (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">
                      <Link to="/students/$studentId" params={{ studentId: String(s.id) }} className="hover:underline">
                        {s.name}
                      </Link>
                    </TableCell>
                    <TableCell>{s.grade}</TableCell>
                    <TableCell>{s.section}</TableCell>
                    <TableCell className="text-muted-foreground">{s.guardian}</TableCell>
                    <TableCell>
                      {account ? (
                        <Badge variant="secondary">نعم</Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">لا</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

/* ---------------- Parents ---------------- */

function ParentsTab({
  users,
  onChange,
}: {
  users: ManagedUser[];
  onChange: (next: ManagedUser[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const { students: allStudents } = useStudents();
  const [editing, setEditing] = useState<ManagedUser | null>(null);
  const [form, setForm] = useState<{ name: string; email: string; children: number[] }>({
    name: "",
    email: "",
    children: [],
  });

  const parents = users.filter((u) => u.role === "parent");

  const openNew = () => {
    setEditing(null);
    setForm({ name: "", email: "", children: [] });
    setOpen(true);
  };

  const openEdit = (u: ManagedUser) => {
    setEditing(u);
    setForm({ name: u.name, email: u.email, children: u.childStudentIds ?? [] });
    setOpen(true);
  };

  const toggleChild = (id: number, on: boolean) => {
    setForm((f) => ({
      ...f,
      children: on ? [...f.children, id] : f.children.filter((x) => x !== id),
    }));
  };

  const save = () => {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("يرجى إدخال الاسم والبريد");
      return;
    }
    if (editing) {
      onChange(
        users.map((u) =>
          u.id === editing.id
            ? { ...u, name: form.name.trim(), email: form.email.trim(), childStudentIds: form.children }
            : u,
        ),
      );
      toast.success("تم تحديث بيانات ولي الأمر");
    } else {
      const newUser: ManagedUser = {
        id: `u${Date.now()}`,
        name: form.name.trim(),
        email: form.email.trim(),
        role: "parent",
        childStudentIds: form.children,
      };
      onChange([newUser, ...users]);
      toast.success("تمت إضافة ولي الأمر");
    }
    setOpen(false);
  };

  const remove = (id: string) => {
    onChange(users.filter((u) => u.id !== id));
    toast.success("تم حذف ولي الأمر");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <CardTitle>أولياء الأمور</CardTitle>
            <CardDescription>اربط كل ولي أمر بأبنائه من قائمة الطلاب.</CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={openNew}>
                <UserPlus className="h-4 w-4 ml-2" />
                إضافة ولي أمر
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editing ? "تعديل ولي أمر" : "إضافة ولي أمر جديد"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="p-name">الاسم</Label>
                  <Input
                    id="p-name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="مثال: أبو محمد"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="p-email">البريد</Label>
                  <Input
                    id="p-email"
                    type="email"
                    dir="ltr"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="parent@family.fi"
                  />
                </div>
                <div className="space-y-2">
                  <Label>الأبناء</Label>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {allStudents.map((s) => {
                      const id = `child-${s.id}`;
                      return (
                        <label
                          key={s.id}
                          htmlFor={id}
                          className="flex items-center gap-2 rounded-md border border-border/50 p-2 hover:bg-accent/40 cursor-pointer"
                        >
                          <Checkbox
                            id={id}
                            checked={form.children.includes(s.id)}
                            onCheckedChange={(v) => toggleChild(s.id, v === true)}
                          />
                          <span className="text-sm">
                            {s.name}{" "}
                            <span className="text-xs text-muted-foreground">
                              — {s.grade} / {s.section}
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={save}>{editing ? "حفظ" : "إضافة"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم</TableHead>
                <TableHead>البريد</TableHead>
                <TableHead>الأبناء</TableHead>
                <TableHead className="w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parents.map((p) => {
                const kids = (p.childStudentIds ?? [])
                  .map((id) => allStudents.find((s) => s.id === id))
                  .filter((x): x is (typeof allStudents)[number] => Boolean(x));
                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm" dir="ltr">
                      {p.email}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {kids.length === 0 ? (
                          <span className="text-xs text-muted-foreground">لا يوجد ارتباط</span>
                        ) : (
                          kids.map((k) => (
                            <Badge key={k.id} variant="secondary">
                              {k.name}
                            </Badge>
                          ))
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(p)} aria-label="تعديل">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => remove(p.id)} aria-label="حذف">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {parents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    لا يوجد أولياء أمور بعد.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

/* ---------------- Subject × Teachers matrix ---------------- */

function SubjectMatrix({ users }: { users: ManagedUser[] }) {
  const rows = useMemo(
    () =>
      SUBJECTS.map((s) => ({
        subject: s,
        teachers: getTeachersBySubject(users, s.id),
      })),
    [users],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>المواد والمعلمون</CardTitle>
        <CardDescription>
          كل طالب في المدرسة يدرس هذه المواد الثلاث — قد يتعدّد المعلمون في المادة الواحدة.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-3">
          {rows.map(({ subject, teachers }) => (
            <div
              key={subject.id}
              className="rounded-lg border border-border/60 p-4 space-y-3 bg-card"
            >
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-semibold">{subject.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {teachers.length} {teachers.length === 1 ? "معلم" : "معلمون"}
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                {teachers.length === 0 ? (
                  <div className="text-xs text-destructive">لا يوجد معلم مخصّص لهذه المادة.</div>
                ) : (
                  teachers.map((t) => (
                    <div
                      key={t.id}
                      className="text-sm rounded-md border border-border/50 px-2.5 py-1.5 bg-accent/30"
                    >
                      {t.name}
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
/* ---------------- Billing ---------------- */

const ALL_PARENTS = "__all__";

function BillingTab({ users }: { users: ManagedUser[] }) {
  const parents = users.filter((u) => u.role === "parent");
  const [selectedId, setSelectedId] = useState<string>(parents[0]?.id ?? "");
  const [paid, setPaid] = useState<Set<string>>(new Set());
  const [sy, setSy] = useState<number>(Math.max(currentSchoolYearStart(), 2026));

  useEffect(() => {
    setPaid(loadPaid());
  }, []);

  useEffect(() => {
    if (!selectedId && parents[0]) setSelectedId(parents[0].id);
  }, [parents, selectedId]);

  const isAll = selectedId === ALL_PARENTS;
  const parent = parents.find((p) => p.id === selectedId);
  const count = parent ? childrenCount(parent) : 0;
  const fee = monthlyFeeFor(count);

  const toggle = (key: string) => {
    setPaid((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      savePaid(next);
      return next;
    });
  };

  const firstYear = Math.max(currentSchoolYearStart(), 2026);
  const years = [firstYear, firstYear + 1];

  const totalDue = fee * SCHOOL_MONTHS.length + BOOKS_FEE;
  const totalPaid =
    (parent
      ? SCHOOL_MONTHS.reduce(
          (acc, m) => acc + (paid.has(monthKey(parent.id, sy, m.month)) ? fee : 0),
          0,
        )
      : 0) + (parent && paid.has(booksKey(parent.id, sy)) ? BOOKS_FEE : 0);

  // الخلاصة التراكمية لجميع أولياء الأمور
  const summaryRows = parents.map((p) => {
    const c = childrenCount(p);
    const f = monthlyFeeFor(c);
    const due = f * SCHOOL_MONTHS.length + BOOKS_FEE;
    const pd =
      SCHOOL_MONTHS.reduce((acc, m) => acc + (paid.has(monthKey(p.id, sy, m.month)) ? f : 0), 0) +
      (paid.has(booksKey(p.id, sy)) ? BOOKS_FEE : 0);
    return { parent: p, children: c, fee: f, due, paid: pd, rest: due - pd };
  });
  const allChildren = summaryRows.reduce((a, r) => a + r.children, 0);
  const allDue = summaryRows.reduce((a, r) => a + r.due, 0);
  const allPaid = summaryRows.reduce((a, r) => a + r.paid, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <CardTitle>الحسابات والرسوم</CardTitle>
            <CardDescription>
              رسوم شهرية حسب عدد الأبناء (١: ٣٠€، ٢: ٥٥€، ٣: ٨٠€، ٤+: ١٠٠€)، ورسوم كتب سنوية ٣٥€.
              العام الدراسي: سبتمبر — مايو.
            </CardDescription>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Select value={selectedId} onValueChange={setSelectedId}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="اختر ولي أمر" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_PARENTS}>الكل (خلاصة تراكمية)</SelectItem>
                {parents.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={String(sy)} onValueChange={(v) => setSy(Number(v))}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {schoolYearLabel(y)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isAll ? (
          parents.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">لا يوجد أولياء أمور.</div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <StatCard icon={UsersIcon} label="أولياء الأمور" value={parents.length} />
                <StatCard icon={UsersIcon} label="إجمالي الأبناء" value={allChildren} />
                <StatCard icon={BookOpen} label="إجمالي مستحق" value={allDue} hint="€ للسنة" />
                <StatCard icon={BookOpen} label="إجمالي مدفوع" value={allPaid} hint="€" />
                <StatCard icon={BookOpen} label="المتبقي" value={allDue - allPaid} hint="€" />
              </div>

              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ولي الأمر</TableHead>
                      <TableHead>الأبناء</TableHead>
                      <TableHead>الرسم الشهري</TableHead>
                      <TableHead>مستحق</TableHead>
                      <TableHead>مدفوع</TableHead>
                      <TableHead>المتبقي</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {summaryRows.map((r) => (
                      <TableRow key={r.parent.id}>
                        <TableCell className="font-medium">{r.parent.name}</TableCell>
                        <TableCell>{r.children}</TableCell>
                        <TableCell>{r.fee} €</TableCell>
                        <TableCell>{r.due} €</TableCell>
                        <TableCell>{r.paid} €</TableCell>
                        <TableCell>
                          {r.rest === 0 ? (
                            <Badge className="bg-primary/15 text-primary border-primary/30">
                              مكتمل
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="border-destructive/40 text-destructive"
                            >
                              {r.rest} €
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50">
                      <TableCell className="font-bold">الإجمالي</TableCell>
                      <TableCell className="font-bold">{allChildren}</TableCell>
                      <TableCell>—</TableCell>
                      <TableCell className="font-bold">{allDue} €</TableCell>
                      <TableCell className="font-bold">{allPaid} €</TableCell>
                      <TableCell className="font-bold">{allDue - allPaid} €</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          )
        ) : !parent ? (
          <div className="text-center text-muted-foreground py-8">لا يوجد أولياء أمور.</div>
        ) : (

          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard icon={UsersIcon} label="عدد الأبناء" value={count} />
              <StatCard icon={BookOpen} label="الرسم الشهري" value={fee} hint="€" />
              <StatCard icon={BookOpen} label="إجمالي مستحق" value={totalDue} hint="€ للسنة" />
              <StatCard icon={BookOpen} label="مدفوع" value={totalPaid} hint="€" />
            </div>

            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>البند</TableHead>
                    <TableHead>المبلغ</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead className="w-24">تبديل</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SCHOOL_MONTHS.map((m) => {
                    const key = monthKey(parent.id, sy, m.month);
                    const isPaid = paid.has(key);
                    const year = sy + m.offset;
                    return (
                      <TableRow key={m.month}>
                        <TableCell className="font-medium">
                          {m.label} {year}
                        </TableCell>
                        <TableCell>{fee} €</TableCell>
                        <TableCell>
                          {isPaid ? (
                            <Badge className="bg-primary/15 text-primary border-primary/30">
                              تم الدفع
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="border-destructive/40 text-destructive"
                            >
                              لم يتم الدفع
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Switch checked={isPaid} onCheckedChange={() => toggle(key)} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow>
                    <TableCell className="font-medium">
                      الكتب — {schoolYearLabel(sy)}
                    </TableCell>
                    <TableCell>{BOOKS_FEE} €</TableCell>
                    <TableCell>
                      {paid.has(booksKey(parent.id, sy)) ? (
                        <Badge className="bg-primary/15 text-primary border-primary/30">
                          تم الدفع
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-destructive/40 text-destructive"
                        >
                          لم يتم الدفع
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={paid.has(booksKey(parent.id, sy))}
                        onCheckedChange={() => toggle(booksKey(parent.id, sy))}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
