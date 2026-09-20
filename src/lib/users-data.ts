import type { Role } from "./role-context";

export type SubjectId = "quran" | "arabic" | "islamic";

export const SUBJECTS: { id: SubjectId; label: string }[] = [
  { id: "quran", label: "القرآن الكريم" },
  { id: "arabic", label: "اللغة العربية" },
  { id: "islamic", label: "التربية الإسلامية" },
];

export const SUBJECT_LABELS: Record<SubjectId, string> = SUBJECTS.reduce(
  (acc, s) => {
    acc[s.id] = s.label;
    return acc;
  },
  {} as Record<SubjectId, string>,
);

export type ManagedUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  /** For teachers: which subjects they teach. */
  subjects?: SubjectId[];
  /** For teachers: which grades they teach (across their subjects). */
  grades?: string[];
  /** For parents: linked student IDs (from students-data). */
  childStudentIds?: number[];
  /** For students: link to student record in students-data. */
  studentId?: number;
};

const USERS_KEY = "siy-users";

const DEFAULT_USERS: ManagedUser[] = [
  { id: "u1", name: "الأستاذ عبدالله الحربي", email: "abdullah@siy.fi", role: "teacher", subjects: ["quran", "islamic"], grades: ["الثالث", "الرابع"] },
  { id: "u2", name: "الأستاذة فاطمة الزهراء", email: "fatimah@siy.fi", role: "teacher", subjects: ["arabic"], grades: ["الثاني", "الثالث", "الرابع", "الخامس"] },
  { id: "u3", name: "الطالب أحمد محمد", email: "ahmed@student.siy.fi", role: "student", studentId: 1 },
  { id: "u4", name: "الطالبة مريم علي", email: "maryam@student.siy.fi", role: "student", studentId: 4 },
  { id: "u5", name: "الطالب يوسف خالد", email: "yousef@student.siy.fi", role: "student", studentId: 5 },
  { id: "u6", name: "أبو أحمد (ولي أمر)", email: "abu.ahmed@family.fi", role: "parent", childStudentIds: [1, 4, 5] },
  { id: "u7", name: "أم مريم (ولي أمر)", email: "um.maryam@family.fi", role: "parent", childStudentIds: [4] },
];

const USERS_BACKUP_KEY = "siy-users-backup";

export function loadUsers(): ManagedUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as ManagedUser[];
      if (Array.isArray(parsed) && parsed.length) return parsed;
      // نسخة فارغة أو تالفة: نستعيد آخر نسخة محفوظة بدل فقدان الحسابات
      const backup = localStorage.getItem(USERS_BACKUP_KEY);
      if (backup) {
        const prev = JSON.parse(backup) as ManagedUser[];
        if (Array.isArray(prev) && prev.length) return prev;
      }
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return DEFAULT_USERS;
}

export function saveUsers(users: ManagedUser[]): void {
  try {
    const current = localStorage.getItem(USERS_KEY);
    if (current && current !== "[]" && users.length) {
      localStorage.setItem(USERS_BACKUP_KEY, current);
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {}
}


export function getTeachersBySubject(users: ManagedUser[], subject: SubjectId): ManagedUser[] {
  return users.filter((u) => u.role === "teacher" && (u.subjects ?? []).includes(subject));
}

export function getUncoveredSubjects(users: ManagedUser[]): SubjectId[] {
  return SUBJECTS.filter((s) => getTeachersBySubject(users, s.id).length === 0).map((s) => s.id);
}

export function getParentsOfStudent(users: ManagedUser[], studentId: number): ManagedUser[] {
  return users.filter((u) => u.role === "parent" && (u.childStudentIds ?? []).includes(studentId));
}