import { useCallback, useEffect, useState } from "react";
import { GRADES, loadGrades, saveGrades } from "./students-data";

const EVENT = "siy-grades-changed";

/** المستويات الدراسية القابلة للإدارة من صفحة الصلاحيات (المدير). */
export function useGrades() {
  const [grades, setGrades] = useState<string[]>(GRADES);

  useEffect(() => {
    setGrades(loadGrades());
    const onChange = () => setGrades(loadGrades());
    window.addEventListener(EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const update = useCallback((next: string[]) => {
    saveGrades(next);
    setGrades(next);
    window.dispatchEvent(new Event(EVENT));
  }, []);

  const addGrade = useCallback(
    (name: string) => {
      const value = name.trim();
      if (!value) return false;
      const current = loadGrades();
      if (current.includes(value)) return false;
      update([...current, value]);
      return true;
    },
    [update],
  );

  const removeGrade = useCallback(
    (name: string) => {
      update(loadGrades().filter((g) => g !== name));
    },
    [update],
  );

  const resetGrades = useCallback(() => update([...GRADES]), [update]);

  return { grades, addGrade, removeGrade, resetGrades };
}
