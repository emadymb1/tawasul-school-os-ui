import { useMemo } from "react";
import { useRole } from "./role-context";
import { loadUsers, SUBJECTS, type SubjectId } from "./users-data";
import { useGrades } from "./use-grades";

/**
 * نطاق المعلم الموحّد: نفس الصفوف والمواد في كل الصفحات
 * (الطلاب، الحضور والغياب، الواجبات والمهام، مساعد التحضير).
 */
export function useTeacherScope() {
  const { role } = useRole();
  const { grades: GRADES } = useGrades();

  const currentTeacher = useMemo(
    () => (role === "teacher" ? loadUsers().find((u) => u.role === "teacher") ?? null : null),
    [role],
  );

  const grades = useMemo<string[]>(() => {
    if (role !== "teacher") return GRADES;
    const g = currentTeacher?.grades ?? [];
    return g.length ? g.filter((x) => GRADES.includes(x)) : GRADES;
  }, [role, currentTeacher, GRADES]);

  const gradesWithPrefix = useMemo(() => grades.map((g) => `الصف ${g}`), [grades]);

  const subjectIds = useMemo<SubjectId[]>(() => {
    const all = SUBJECTS.map((s) => s.id);
    if (role !== "teacher") return all;
    const s = currentTeacher?.subjects ?? [];
    return s.length ? s : all;
  }, [role, currentTeacher]);

  return { role, currentTeacher, grades, gradesWithPrefix, subjectIds, isScoped: role === "teacher" };
}
