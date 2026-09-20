import { useCallback, useEffect, useState } from "react";
import { loadUsers, saveUsers, type ManagedUser } from "./users-data";

const EVENT = "siy-users-changed";

/**
 * مصدر واحد لبيانات المستخدمين مع مزامنة بين الصفحات.
 * الحفظ يعتمد دائماً على أحدث نسخة من التخزين لتفادي فقدان المستخدمين.
 */
export function useUsers() {
  const [users, setUsersState] = useState<ManagedUser[]>([]);

  useEffect(() => {
    setUsersState(loadUsers());
    const onChange = () => setUsersState(loadUsers());
    window.addEventListener(EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  /** يقبل مصفوفة جديدة أو دالة تستقبل أحدث نسخة محفوظة. */
  const persist = useCallback(
    (next: ManagedUser[] | ((current: ManagedUser[]) => ManagedUser[])) => {
      const current = loadUsers();
      const value = typeof next === "function" ? next(current) : next;
      saveUsers(value);
      setUsersState(value);
      window.dispatchEvent(new Event(EVENT));
    },
    [],
  );

  return { users, persist, setUsers: persist };
}
