import { beforeEach, describe, expect, it } from "vitest";
import {
  loadStudents,
  saveStudents,
  reconcileStudents,
  loadGrades,
  saveGrades,
  SECTIONS,
  type Student,
} from "../students-data";
import { loadUsers, saveUsers, type ManagedUser } from "../users-data";

/** تخزين محلي وهمي لبيئة الاختبار */
function installStorage() {
  const map = new Map<string, string>();
  const storage = {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, String(v)),
    removeItem: (k: string) => void map.delete(k),
    clear: () => map.clear(),
    key: (i: number) => Array.from(map.keys())[i] ?? null,
    get length() {
      return map.size;
    },
  } as Storage;
  (globalThis as unknown as { localStorage: Storage }).localStorage = storage;
  return storage;
}

/** نفس منطق الحفظ في صفحة إدارة الطلاب (routes/students.tsx). */
function saveStudentForm(opts: {
  editing?: Student | null;
  studentUserId: string;
  guardianUserId?: string;
  grade: string;
  section: string;
  phone?: string;
  id?: number;
}) {
  const users = loadUsers();
  const studentUser = users.find((u) => u.id === opts.studentUserId && u.role === "student");
  const guardianUser = users.find((u) => u.id === opts.guardianUserId && u.role === "parent");
  if (!studentUser) throw new Error("student user required");

  const id = opts.editing ? opts.editing.id : (opts.id ?? Date.now());
  const record: Student = {
    id,
    name: studentUser.name,
    guardian: guardianUser?.name ?? "",
    grade: opts.grade,
    section: opts.section,
    phone: opts.phone ?? "",
  };

  const prev = loadStudents();
  saveStudents(opts.editing ? prev.map((s) => (s.id === id ? record : s)) : [...prev, record]);

  saveUsers(
    loadUsers().map((u) => {
      if (u.id === studentUser.id) return { ...u, studentId: id };
      if (u.role === "parent") {
        const kids = new Set(u.childStudentIds ?? []);
        if (guardianUser && u.id === guardianUser.id) kids.add(id);
        else kids.delete(id);
        return { ...u, childStudentIds: Array.from(kids) };
      }
      return u;
    }),
  );
  return record;
}

/** ما يحدث عند كل تنقل بين الصفحات (useStudents.sync). */
function navigate() {
  const result = reconcileStudents(loadStudents(), loadUsers(), loadGrades());
  if (result.changed) {
    saveStudents(result.students);
    saveUsers(result.users as ManagedUser[]);
  }
  return result;
}

const BASE_USERS: ManagedUser[] = [
  { id: "s1", name: "طالب اختبار", email: "s1@t.fi", role: "student" },
  { id: "s2", name: "طالبة اختبار", email: "s2@t.fi", role: "student" },
  { id: "p1", name: "ولي أمر أول", email: "p1@t.fi", role: "parent", childStudentIds: [] },
  { id: "p2", name: "ولي أمر ثانٍ", email: "p2@t.fi", role: "parent", childStudentIds: [] },
];

describe("ربط الطالب بولي الأمر والصف والقسم", () => {
  beforeEach(() => {
    installStorage();
    saveStudents([]);
    saveUsers(BASE_USERS.map((u) => ({ ...u })));
    saveGrades(["الأول", "الثاني", "الثالث"]);
  });

  it("الإنشاء يربط حساب الطالب وولي الأمر ويحفظ الصف والقسم", () => {
    saveStudentForm({ studentUserId: "s1", guardianUserId: "p1", grade: "الثاني", section: "ب", id: 101 });

    const rec = loadStudents().find((s) => s.id === 101)!;
    expect(rec).toMatchObject({ name: "طالب اختبار", guardian: "ولي أمر أول", grade: "الثاني", section: "ب" });

    const users = loadUsers();
    expect(users.find((u) => u.id === "s1")!.studentId).toBe(101);
    expect(users.find((u) => u.id === "p1")!.childStudentIds).toContain(101);
    expect(users.find((u) => u.id === "p2")!.childStudentIds).not.toContain(101);
  });

  it("التعديل ينقل الطالب لولي أمر آخر ويحدّث الصف والقسم دون تكرار السجل", () => {
    const created = saveStudentForm({ studentUserId: "s1", guardianUserId: "p1", grade: "الثاني", section: "ب", id: 101 });
    saveStudentForm({
      editing: created,
      studentUserId: "s1",
      guardianUserId: "p2",
      grade: "الثالث",
      section: "ج",
      phone: "+358 40 000 0000",
    });

    const all = loadStudents();
    expect(all).toHaveLength(1);
    expect(all[0]).toMatchObject({ grade: "الثالث", section: "ج", guardian: "ولي أمر ثانٍ", phone: "+358 40 000 0000" });

    const users = loadUsers();
    expect(users.find((u) => u.id === "p1")!.childStudentIds).not.toContain(101);
    expect(users.find((u) => u.id === "p2")!.childStudentIds).toContain(101);
  });

  it("لا تُفقد البيانات عند التنقل المتكرر بين الصفحات", () => {
    saveStudentForm({ studentUserId: "s1", guardianUserId: "p1", grade: "الثاني", section: "ب", id: 101 });
    navigate(); // إنشاء سجل تلقائي للطالب s2 غير المربوط
    const afterFirst = loadStudents();

    navigate();
    navigate();
    const afterMore = loadStudents();

    expect(afterMore).toHaveLength(afterFirst.length);
    const rec = afterMore.find((s) => s.id === 101)!;
    expect(rec).toMatchObject({ grade: "الثاني", section: "ب", guardian: "ولي أمر أول" });
    expect(loadUsers().find((u) => u.id === "p1")!.childStudentIds).toContain(101);
    // المزامنة الثانية مستقرة (لا تغييرات إضافية)
    expect(navigate().changed).toBe(false);
  });

  it("كل حساب طالب يحصل على سجل، ويُشتق ولي الأمر من الحساب المرتبط", () => {
    navigate();
    const students = loadStudents();
    expect(students.map((s) => s.name).sort()).toEqual(["طالب اختبار", "طالبة اختبار"].sort());

    const s2rec = students.find((s) => s.name === "طالبة اختبار")!;
    saveUsers(
      loadUsers().map((u) => (u.id === "p2" ? { ...u, childStudentIds: [s2rec.id] } : u)),
    );
    navigate();
    expect(loadStudents().find((s) => s.id === s2rec.id)!.guardian).toBe("ولي أمر ثانٍ");
  });

  it("حذف مستوى دراسي يصحّح الصف بدل فقدان الطالب", () => {
    saveStudentForm({ studentUserId: "s1", guardianUserId: "p1", grade: "الثالث", section: "ب", id: 101 });
    saveGrades(["الأول", "الثاني"]);
    navigate();

    const rec = loadStudents().find((s) => s.id === 101)!;
    expect(rec.grade).toBe("الأول");
    expect(loadGrades()).not.toContain("الثالث");
    expect(SECTIONS).toContain(rec.section);
  });
});

describe("منع تكرار الطالب", () => {
  it("يدمج سجلين لنفس الطالب في مستويين مختلفين", () => {
    const students = [
      { id: 1, name: "أحمد محمد", grade: "الثالث", section: "أ", guardian: "", phone: "" },
      { id: 2, name: "أحمد محمد", grade: "الخامس", section: "ب", guardian: "", phone: "" },
    ];
    const users = [{ id: "u1", name: "أحمد محمد", role: "student", studentId: 2 }];
    const r = reconcileStudents(students, users, ["الثالث", "الخامس"]);
    expect(r.students.filter((s) => s.name === "أحمد محمد")).toHaveLength(1);
    expect(r.users[0].studentId).toBe(r.students[0].id);
  });
});
