const KEY = "siy-selected-child-id";

export function loadSelectedChildId(): number | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

export function saveSelectedChildId(id: number): void {
  try {
    localStorage.setItem(KEY, String(id));
  } catch {}
}

export function clearSelectedChildId(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}

/** Returns the current parent's children ids (demo: first parent user). */
export function getCurrentParentChildIds(
  users?: { role: string; childStudentIds?: number[] }[] | null,
): number[] {
  const parent = (users ?? []).find((u) => u.role === "parent");
  return parent?.childStudentIds ?? [];
}