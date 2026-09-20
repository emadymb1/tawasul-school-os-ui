import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus, Users, Search, ClipboardCheck, BookOpenCheck, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Can, useRole } from "@/lib/role-context";
import { AccessDenied } from "@/components/role-guard";
import { GRADES, SECTIONS, type Student } from "@/lib/students-data";
import { useStudents } from "@/lib/use-students";
import { useGrades } from "@/lib/use-grades";
import { type ManagedUser } from "@/lib/users-data";
import { useUsers } from "@/lib/use-users";
import { useTeacherScope } from "@/lib/teacher-scope";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/students")({
  head: () => ({
    meta: [
      { title: "إدارة الطلاب — مدرسة الرابطة الإسلامية" },
      { name: "description", content: "إدارة بيانات الطلاب: الصف والقسم وروابط الحضور والواجبات." },
      { property: "og:title", content: "إدارة الطلاب — S.I.Y Koulu" },
      { property: "og:description", content: "قائمة الطلاب مع الصف والقسم وروابط الغياب والواجبات." },
    ],
  }),
  component: StudentsPage,
});

function StudentsPage() {
  const { role } = useRole();
  // نطاق المعلم الموحّد: نفس صفوف الحضور والواجبات والتحضير
  const { grades: allowedGrades } = useTeacherScope();

  const { students, persist: persistStudents } = useStudents();
  const { users, persist } = useUsers();
  const [query, setQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState<string>("all");
  const [sectionFilter, setSectionFilter] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const { grades: gradeOptions } = useGrades();
  const [editing, setEditing] = useState<Student | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Student | null>(null);

  const [form, setForm] = useState<{
    studentUserId: string;
    guardianUserId: string;
    grade: string;
    section: string;
    phone: string;
  }>({
    studentUserId: "",
    guardianUserId: "",
    grade: GRADES[0],
    section: SECTIONS[0],
    phone: "",
  });

  const studentUsers = useMemo(() => users.filter((u) => u.role === "student"), [users]);
  const parentUsers = useMemo(() => users.filter((u) => u.role === "parent"), [users]);

  // المعلم يرى طلاب صفوفه فقط
  const scoped = useMemo(
    () => students.filter((s) => allowedGrades.includes(s.grade)),
    [students, allowedGrades],
  );

  const filtered = useMemo(
    () =>
      scoped.filter((s) => {
        const q = query.trim();
        const matchesQ =
          !q || s.name.includes(q) || s.guardian.includes(q) || s.phone.includes(q);
        const matchesG = gradeFilter === "all" || s.grade === gradeFilter;
        const matchesS = sectionFilter === "all" || s.section === sectionFilter;
        return matchesQ && matchesG && matchesS;
      }),
    [scoped, query, gradeFilter, sectionFilter],
  );

  const openNew = () => {
    setEditing(null);
    setForm({
      studentUserId: "",
      guardianUserId: "",
      grade: allowedGrades[0] ?? GRADES[0],
      section: SECTIONS[0],
      phone: "",
    });
    setOpen(true);
  };

  const openEdit = (s: Student) => {
    setEditing(s);
    setForm({
      studentUserId:
        studentUsers.find((u) => u.studentId === s.id)?.id ??
        studentUsers.find((u) => u.name.includes(s.name) || s.name.includes(u.name))?.id ??
        "",
      guardianUserId:
        parentUsers.find((u) => (u.childStudentIds ?? []).includes(s.id))?.id ??
        parentUsers.find((u) => u.name.includes(s.guardian))?.id ??
        "",
      grade: s.grade,
      section: s.section,
      phone: s.phone,
    });
    setOpen(true);
  };

  const save = () => {
    const studentUser = studentUsers.find((u) => u.id === form.studentUserId);
    const guardianUser = parentUsers.find((u) => u.id === form.guardianUserId);
    if (!studentUser) {
      toast.error("يرجى اختيار الطالب من قائمة المستخدمين");
      return;
    }
    const name = studentUser.name;
    const guardian = guardianUser?.name ?? "";

    // منع تكرار نفس الطالب في أكثر من مستوى: نعيد استخدام سجله إن وُجد
    const existing =
      (editing ? students.find((s) => s.id === editing.id) : undefined) ??
      students.find((s) => s.id === studentUser.studentId) ??
      students.find((s) => s.name.trim() === name.trim());

    if (!editing && existing) {
      toast.info("هذا الطالب مسجّل مسبقاً — تم تحديث بياناته بدل إنشاء سجل مكرر");
    }

    const id = existing ? existing.id : Date.now();
    const record: Student = { id, name, guardian, grade: form.grade, section: form.section, phone: form.phone };

    persistStudents((prev) =>
      prev.some((s) => s.id === id)
        ? prev.map((s) => (s.id === id ? record : s))
        : [...prev, record],
    );

    // ربط المستخدمين: الطالب ← سجل الطالب، وليّ الأمر ← أبناؤه
    const next = (latest: ManagedUser[]) => latest.map((u) => {
      if (u.id === studentUser.id) return { ...u, studentId: id };
      if (u.role === "parent") {
        const kids = new Set(u.childStudentIds ?? []);
        if (guardianUser && u.id === guardianUser.id) kids.add(id);
        else kids.delete(id);
        return { ...u, childStudentIds: Array.from(kids) };
      }
      return u;
    });
    persist(next);

    setOpen(false);
    toast.success(editing || existing ? "تم تحديث بيانات الطالب" : "تمت إضافة الطالب");
  };

  /**
   * حذف كامل: يزيل سجل الطالب وحساب المستخدم المرتبط وروابط ولي الأمر،
   * حتى لا تعيد المزامنة إنشاء السجل مرة أخرى.
   */
  const remove = (s: Student) => {
    persistStudents((prev) => prev.filter((x) => x.id !== s.id));
    persist((latest) =>
      latest
        .filter((u) => !(u.role === "student" && (u.studentId === s.id || u.name.trim() === s.name.trim())))
        .map((u) =>
          u.role === "parent"
            ? { ...u, childStudentIds: (u.childStudentIds ?? []).filter((cid) => cid !== s.id) }
            : u,
        ),
    );
    setConfirmDelete(null);
    toast.success("تم حذف الطالب وحسابه المرتبط");
  };



  const totalByGrade = useMemo(() => {
    const m = new Map<string, number>();
    scoped.forEach((s) => m.set(s.grade, (m.get(s.grade) ?? 0) + 1));
    return m;
  }, [scoped]);

  if (role !== "admin" && role !== "teacher") {
    return (
      <AccessDenied
        title="إدارة الطلاب متاحة للإدارة والمعلمين فقط"
        hint="يمكنك متابعة بيانات أبنائك من صفحة الأبناء أو لوحة التحكم."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            إدارة الطلاب
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            بيانات الطلاب حسب الصف والقسم مع روابط سريعة للحضور والواجبات.
          </p>
        </div>

        <Can permission="students.manage">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="gap-2">
              <Plus className="h-4 w-4" />
              إضافة طالب
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "تعديل بيانات الطالب" : "طالب جديد"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>الطالب</Label>
                <Select
                  value={form.studentUserId}
                  onValueChange={(v) => setForm({ ...form, studentUserId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الطالب من المستخدمين" />
                  </SelectTrigger>
                  <SelectContent>
                    {studentUsers.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {studentUsers.length === 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    لا يوجد مستخدمون بدور "طالب" — أضِفهم من صفحة الأدوار والصلاحيات.
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>الصف</Label>
                  <Select value={form.grade} onValueChange={(v) => setForm({ ...form, grade: v })}>
                    <SelectTrigger><SelectValue placeholder="اختر الصف" /></SelectTrigger>
                    <SelectContent>
                      {gradeOptions.map((g) => <SelectItem key={g} value={g}>الصف {g}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>القسم</Label>
                  <Select value={form.section} onValueChange={(v) => setForm({ ...form, section: v })}>
                    <SelectTrigger><SelectValue placeholder="اختر القسم" /></SelectTrigger>
                    <SelectContent>
                      {SECTIONS.map((s) => <SelectItem key={s} value={s}>القسم {s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>ولي الأمر</Label>
                <Select
                  value={form.guardianUserId}
                  onValueChange={(v) => setForm({ ...form, guardianUserId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر ولي الأمر من المستخدمين" />
                  </SelectTrigger>
                  <SelectContent>
                    {parentUsers.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {parentUsers.length === 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    لا يوجد مستخدمون بدور "ولي أمر" — أضِفهم من صفحة الأدوار والصلاحيات.
                  </p>
                )}
              </div>

              <div>
                <Label>رقم الهاتف</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+358 ..." dir="ltr" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
              <Button onClick={save}>حفظ</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </Can>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-xs text-muted-foreground">إجمالي الطلاب</div>
            <div className="text-2xl font-bold mt-1">{scoped.length}</div>
          </CardContent>
        </Card>
        {allowedGrades.slice(0, 3).map((g) => (
          <Card key={g}>
            <CardContent className="pt-6">
              <div className="text-xs text-muted-foreground">الصف {g}</div>
              <div className="text-2xl font-bold mt-1">{totalByGrade.get(g) ?? 0}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">قائمة الطلاب</CardTitle>
          <div className="flex flex-wrap gap-2 pt-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث بالاسم أو ولي الأمر..."
                className="pr-9"
              />
            </div>
            <Select value={gradeFilter} onValueChange={setGradeFilter}>
              <SelectTrigger className="w-[140px]"><SelectValue placeholder="الصف" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الصفوف</SelectItem>
                {allowedGrades.map((g) => <SelectItem key={g} value={g}>الصف {g}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={sectionFilter} onValueChange={setSectionFilter}>
              <SelectTrigger className="w-[140px]"><SelectValue placeholder="القسم" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأقسام</SelectItem>
                {SECTIONS.map((s) => <SelectItem key={s} value={s}>القسم {s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الطالب</TableHead>
                  <TableHead>الصف</TableHead>
                  <TableHead>القسم</TableHead>
                  <TableHead>ولي الأمر</TableHead>
                  <TableHead>الهاتف</TableHead>
                  <TableHead className="text-center">روابط سريعة</TableHead>
                  <TableHead className="text-center">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      لا يوجد طلاب مطابقون للبحث.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell><Badge variant="secondary">{s.grade}</Badge></TableCell>
                      <TableCell><Badge variant="outline">{s.section}</Badge></TableCell>
                      <TableCell>{s.guardian}</TableCell>
                      <TableCell dir="ltr" className="text-right">{s.phone}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button asChild size="sm" variant="outline" className="gap-1">
                            <Link to="/attendance" search={{ studentId: s.id } as never}>
                              <ClipboardCheck className="h-3.5 w-3.5" />
                              الحضور
                            </Link>
                          </Button>
                          <Button asChild size="sm" variant="outline" className="gap-1">
                            <Link to="/assignments" search={{ studentId: s.id } as never}>
                              <BookOpenCheck className="h-3.5 w-3.5" />
                              الواجبات
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                       <TableCell>
                        <Can permission="students.manage">
                        <div className="flex items-center justify-center gap-1">
                          <Button size="icon" variant="ghost" onClick={() => openEdit(s)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => setConfirmDelete(s)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>

                        </div>
                        </Can>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف الطالب</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف سجل «{confirmDelete?.name}» وحسابه المرتبط وإزالته من قائمة أبناء ولي الأمر.
              لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirmDelete && remove(confirmDelete)}>
              حذف نهائي
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>

  );
}