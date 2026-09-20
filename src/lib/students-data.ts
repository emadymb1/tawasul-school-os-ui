export type Student = {
  id: number;
  name: string;
  grade: string;
  section: string;
  guardian: string;
  phone: string;
};

export const GRADES = ["الأول", "الثاني", "الثالث", "الرابع", "الخامس", "السادس"];
export const SECTIONS = ["أ", "ب", "ج"];

export const STUDENTS: Student[] = [
  { id: 1, name: "أحمد محمد العلي", grade: "الثالث", section: "أ", guardian: "محمد العلي", phone: "+358 40 123 4567" },
  { id: 2, name: "فاطمة يوسف الحسن", grade: "الثالث", section: "أ", guardian: "يوسف الحسن", phone: "+358 41 234 5678" },
  { id: 3, name: "عبدالله خالد النور", grade: "الرابع", section: "ب", guardian: "خالد النور", phone: "+358 45 345 6789" },
  { id: 4, name: "مريم عمر السالم", grade: "الثاني", section: "أ", guardian: "عمر السالم", phone: "+358 44 456 7890" },
  { id: 5, name: "يوسف إبراهيم القاسم", grade: "الخامس", section: "أ", guardian: "إبراهيم القاسم", phone: "+358 40 567 8901" },
  { id: 6, name: "زينب أحمد الفارس", grade: "الأول", section: "ب", guardian: "أحمد الفارس", phone: "+358 41 678 9012" },
];

export type AttendanceEntry = { date: string; status: "حاضر" | "غائب" | "متأخر"; note?: string };
export type AssignmentEntry = {
  title: string;
  subject: "القرآن الكريم" | "اللغة العربية" | "التربية الإسلامية";
  dueDate: string;
  status: "مُسلَّم" | "متأخر" | "لم يُسلَّم";
  grade?: number;
};
export type GradeEntry = { subject: string; component: string; score: number; max: number };
export type NoteEntry = { date: string; author: string; text: string };

export type StudentProfile = {
  student: Student;
  attendance: AttendanceEntry[];
  assignments: AssignmentEntry[];
  grades: GradeEntry[];
  notes: NoteEntry[];
};

/** Deterministic pseudo-random in [0,1) from a numeric seed. */
function rand(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

const ATT_DATES = ["2026-07-19", "2026-07-18", "2026-07-12", "2026-07-11", "2026-07-05", "2026-07-04"];

export function getStudentProfile(id: number): StudentProfile | null {
  const student = loadStudents().find((s) => s.id === id);
  if (!student) return null;

  const attendance: AttendanceEntry[] = ATT_DATES.map((date, i) => {
    const r = rand(id * 7 + i);
    if (r < 0.12) return { date, status: "غائب", note: "بعذر طبي" };
    if (r < 0.28) return { date, status: "متأخر", note: "تأخر 15 دقيقة" };
    return { date, status: "حاضر" };
  });

  const ASSIGNMENT_BASE: Omit<AssignmentEntry, "status" | "grade">[] = [
    { title: "حفظ سورة الملك (١-١٠)", subject: "القرآن الكريم", dueDate: "2026-07-19" },
    { title: "تفسير آيات من سورة لقمان", subject: "القرآن الكريم", dueDate: "2026-07-12" },
    { title: "قواعد: الفعل والفاعل", subject: "اللغة العربية", dueDate: "2026-07-18" },
    { title: "إملاء: الهمزة المتوسطة", subject: "اللغة العربية", dueDate: "2026-07-25" },
    { title: "أركان الإسلام — بحث قصير", subject: "التربية الإسلامية", dueDate: "2026-07-11" },
  ];

  const assignments: AssignmentEntry[] = ASSIGNMENT_BASE.map((a, i) => {
    const r = rand(id * 13 + i * 3);
    if (r < 0.18) return { ...a, status: "لم يُسلَّم" };
    if (r < 0.36) return { ...a, status: "متأخر", grade: 5 + Math.floor(rand(id + i) * 3) };
    return { ...a, status: "مُسلَّم", grade: 7 + Math.floor(rand(id * 2 + i) * 4) };
  });

  const GRADE_BASE: Omit<GradeEntry, "score">[] = [
    { subject: "القرآن الكريم", component: "الحفظ", max: 20 },
    { subject: "القرآن الكريم", component: "التفسير", max: 20 },
    { subject: "اللغة العربية", component: "القراءة والكتابة", max: 20 },
    { subject: "التربية الإسلامية", component: "الفقه والسيرة", max: 20 },
  ];

  const grades: GradeEntry[] = GRADE_BASE.map((g, i) => ({
    ...g,
    score: 12 + Math.floor(rand(id * 17 + i * 5) * 9),
  }));

  const notes: NoteEntry[] = [
    {
      date: "2026-07-19",
      author: "الأستاذ عبدالله",
      text:
        rand(id) > 0.5
          ? `أداء ممتاز في الحفظ هذا الأسبوع، ما شاء الله (${student.name.split(" ")[0]}).`
          : `تحسّن ملحوظ لدى ${student.name.split(" ")[0]} في التلاوة.`,
    },
    { date: "2026-07-12", author: "الأستاذ عبدالله", text: "يحتاج إلى مراجعة قواعد الإملاء." },
  ];

  return { student, attendance, assignments, grades, notes };
}

/* ============ المستويات الدراسية (قابلة للإدارة من صفحة الصلاحيات) ============ */
const GRADES_KEY = "siy-grades";

export function loadGrades(): string[] {
  try {
    const raw = localStorage.getItem(GRADES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as string[];
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch {}
  return GRADES;
}

export function saveGrades(grades: string[]): void {
  try {
    localStorage.setItem(GRADES_KEY, JSON.stringify(grades));
  } catch {}
}

/* ============ سجل الطلاب (محفوظ ومتزامن مع حسابات المستخدمين) ============ */
const STUDENTS_KEY = "siy-students";
const STUDENTS_BACKUP_KEY = "siy-students-backup";

export function loadStudents(): Student[] {
  try {
    const raw = localStorage.getItem(STUDENTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Student[];
      if (Array.isArray(parsed) && parsed.length) return parsed;
      // نسخة فارغة أو تالفة: نستعيد آخر نسخة محفوظة بدل العودة للبيانات الافتراضية
      const backup = localStorage.getItem(STUDENTS_BACKUP_KEY);
      if (backup) {
        const prev = JSON.parse(backup) as Student[];
        if (Array.isArray(prev) && prev.length) return prev;
      }
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return STUDENTS;
}

export function saveStudents(students: Student[]): void {
  try {
    // نحتفظ دائماً بآخر نسخة غير فارغة كنسخة احتياطية ضد الفقدان
    const current = localStorage.getItem(STUDENTS_KEY);
    if (current && current !== "[]" && students.length) {
      localStorage.setItem(STUDENTS_BACKUP_KEY, current);
    }
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  } catch {}
}


export type ReconcileUser = {
  id: string;
  name: string;
  role: string;
  studentId?: number;
  childStudentIds?: number[];
};

/**
 * يعيد بناء العلاقات تلقائياً بين حسابات المستخدمين وسجلات الطلاب:
 * - كل حساب بدور "طالب" يحصل على سجل طالب (يُنشأ إن كان مفقوداً) مع الحفاظ على الصف والقسم.
 * - اسم ولي الأمر يُشتق من حساب وليّ الأمر المرتبط.
 * - المستويات غير الموجودة تُستبدل بأول مستوى متاح بدل فقدان الطالب.
 */
export function reconcileStudents(
  students: Student[],
  users: ReconcileUser[],
  grades: string[],
): { students: Student[]; users: ReconcileUser[]; changed: boolean } {
  const gradeList = grades.length ? grades : GRADES;
  const byId = new Map<number, Student>(students.map((s) => [s.id, { ...s }]));
  let changed = false;

  const studentUsers = users.filter((u) => u.role === "student");


  const nextUsers = users.map((u) => ({ ...u }));
  const findUser = (id: string) => nextUsers.find((u) => u.id === id)!;

  // 0) منع تكرار نفس الطالب: سجل واحد فقط لكل طالب (لا يظهر في أكثر من مستوى)
  const linked = new Set(
    studentUsers.map((u) => u.studentId).filter((v): v is number => typeof v === "number"),
  );
  const norm = (n: string) => n.replace(/\s+/g, " ").trim();
  const keptByName = new Map<string, number>();
  const remap = new Map<number, number>();
  const ordered = Array.from(byId.values()).sort(
    (a, b) => (linked.has(b.id) ? 1 : 0) - (linked.has(a.id) ? 1 : 0),
  );
  for (const s of ordered) {
    const key = norm(s.name);
    if (!key) continue;
    const kept = keptByName.get(key);
    if (kept === undefined) keptByName.set(key, s.id);
    else {
      // دمج بدل الحذف: لا نفقد ولي الأمر أو الهاتف أو الصف المُدخل يدوياً
      const target = byId.get(kept)!;
      if (!target.guardian && s.guardian) target.guardian = s.guardian;
      if (!target.phone && s.phone) target.phone = s.phone;
      if (!target.grade && s.grade) target.grade = s.grade;
      if (!target.section && s.section) target.section = s.section;
      remap.set(s.id, kept);
      byId.delete(s.id);
      changed = true;
    }

  }
  if (remap.size) {
    for (const u of nextUsers) {
      if (u.studentId !== undefined && remap.has(u.studentId)) u.studentId = remap.get(u.studentId)!;
      if (u.childStudentIds) {
        u.childStudentIds = Array.from(
          new Set(u.childStudentIds.map((cid) => remap.get(cid) ?? cid)),
        );
      }
    }
  }

  // 1) ضمان وجود سجل لكل حساب طالب
  let seq = Math.max(0, ...Array.from(byId.keys()));

  const usedIds = new Set<number>();
  for (const su of nextUsers.filter((u) => u.role === "student")) {
    let sid = su.studentId;
    if (!sid || !byId.has(sid) || usedIds.has(sid)) {
      // محاولة المطابقة بالاسم قبل الإنشاء لتفادي التكرار
      const match = Array.from(byId.values()).find(
        (s) => !usedIds.has(s.id) && norm(s.name) === norm(su.name),
      );
      if (match) sid = match.id;
      else {
        sid = ++seq;
        byId.set(sid, {
          id: sid,
          name: su.name,
          grade: gradeList[0],
          section: SECTIONS[0],
          guardian: "",
          phone: "",
        });
        changed = true;
      }
      findUser(su.id).studentId = sid;
      changed = true;
    }
    usedIds.add(sid);

    const rec = byId.get(sid)!;
    if (rec.name !== su.name) {
      rec.name = su.name;
      changed = true;
    }
  }

  // 2) اشتقاق ولي الأمر من الحسابات المرتبطة (أول ولي أمر مرتبط فقط، لتفادي التذبذب)
  const guardianByChild = new Map<number, string>();
  for (const p of nextUsers.filter((u) => u.role === "parent")) {
    for (const cid of p.childStudentIds ?? []) {
      if (!guardianByChild.has(cid)) guardianByChild.set(cid, p.name);
    }
  }
  for (const [cid, name] of guardianByChild) {
    const rec = byId.get(cid);
    if (rec && rec.guardian !== name) {
      rec.guardian = name;
      changed = true;
    }
  }


  // 3) تصحيح المستويات المحذوفة
  for (const rec of byId.values()) {
    if (!gradeList.includes(rec.grade)) {
      rec.grade = gradeList[0];
      changed = true;
    }
    if (!SECTIONS.includes(rec.section)) {
      rec.section = SECTIONS[0];
      changed = true;
    }
  }

  return { students: Array.from(byId.values()), users: nextUsers, changed };
}
