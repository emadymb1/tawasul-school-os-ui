import { useCallback, useEffect, useState } from "react";
import {
  loadStudents,
  saveStudents,
  reconcileStudents,
  type Student,
} from "./students-data";
import { loadUsers, saveUsers, type ManagedUser } from "./users-data";
import { loadGrades } from "./students-data";

const EVENT = "siy-students-changed";
const USERS_EVENT = "siy-users-changed";

/**
 * مصدر واحد لسجلات الطلاب، محفوظ في التخزين ومتزامن مع حسابات المستخدمين:
 * أي حساب طالب جديد يحصل تلقائياً على سجل، وتُعاد علاقات ولي الأمر والصف والقسم دون فقدان.
 */
export function useStudents() {
  const [students, setStudentsState] = useState<Student[]>([]);

  const sync = useCallback(() => {
    const currentUsers = loadUsers();
    const result = reconcileStudents(loadStudents(), currentUsers, loadGrades());
    if (result.changed) {
      saveStudents(result.students);
      const usersChanged = JSON.stringify(result.users) !== JSON.stringify(currentUsers);
      if (usersChanged) {
        saveUsers(result.users as ManagedUser[]);
        window.dispatchEvent(new Event(USERS_EVENT));
      }
    }
    setStudentsState(result.students);
  }, []);


  useEffect(() => {
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener(USERS_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener(USERS_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [sync]);

  /** يقبل مصفوفة جديدة أو دالة تستقبل أحدث نسخة محفوظة. */
  const persist = useCallback(
    (next: Student[] | ((current: Student[]) => Student[])) => {
      const current = loadStudents();
      const value = typeof next === "function" ? next(current) : next;
      saveStudents(value);
      setStudentsState(value);
      window.dispatchEvent(new Event(EVENT));
    },
    [],
  );

  return { students, persist, setStudents: persist, refresh: sync };
}
