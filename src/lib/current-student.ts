import { loadUsers } from "./users-data";
import { loadStudents } from "./students-data";

/**
 * يحدّد الطالب الحالي لواجهة الطالب ديناميكياً:
 * 1) أول حساب دوره student وله studentId يطابق سجل طالب موجود.
 * 2) وإلا أول سجل طالب موجود في التخزين.
 * يعيد null إذا لا يوجد أي سجل — ولا يفترض معرّفاً ثابتاً أبداً.
 */
export function resolveCurrentStudentId(): number | null {
  const students = loadStudents();
  if (students.length === 0) return null;

  const users = loadUsers();
  for (const u of users) {
    if (u.role === "student" && typeof u.studentId === "number") {
      if (students.some((s) => s.id === u.studentId)) return u.studentId;
    }
  }
  return students[0].id;
}
