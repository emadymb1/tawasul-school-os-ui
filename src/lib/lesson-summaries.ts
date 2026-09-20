export type LessonSummary = {
  id: string;
  date: string; // ISO yyyy-mm-dd
  subject: string;
  grade: string; // e.g. "الصف الأول"
  title: string;
  text: string;
  teacher?: string;
  createdAt: number;
};

const KEY = "siy-lessons";
const BACKUP_KEY = "siy-lessons-backup";

export function loadLessonSummaries(): LessonSummary[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  try {
    const backup = localStorage.getItem(BACKUP_KEY);
    if (backup) return JSON.parse(backup);
  } catch {}
  return [];
}

export function saveLessonSummaries(list: LessonSummary[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
    localStorage.setItem(BACKUP_KEY, JSON.stringify(list));
  } catch {}
}

export function addLessonSummary(s: Omit<LessonSummary, "id" | "createdAt">) {
  const list = loadLessonSummaries();
  const entry: LessonSummary = {
    ...s,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: Date.now(),
  };
  saveLessonSummaries([entry, ...list]);
  return entry;
}

export function deleteLessonSummary(id: string) {
  saveLessonSummaries(loadLessonSummaries().filter((s) => s.id !== id));
}

/** يرشّح الملخصات لصف معيّن؛ يطابق "الصف الأول" مع grade="الأول" أيضاً */
export function summariesForGrade(grade: string): LessonSummary[] {
  const bare = grade.replace(/^الصف\s*/, "");
  return loadLessonSummaries()
    .filter((s) => s.grade === grade || s.grade.replace(/^الصف\s*/, "") === bare)
    .sort((a, b) => b.createdAt - a.createdAt);
}
