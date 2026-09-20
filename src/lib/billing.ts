import { loadStudents } from "./students-data";
import type { ManagedUser } from "./users-data";

/** Monthly fee tier by number of children. Cap at 4+ = 100€. */
export const MONTHLY_FEE_TABLE: Record<number, number> = { 1: 30, 2: 55, 3: 80, 4: 100 };
export const BOOKS_FEE = 35;

export function monthlyFeeFor(count: number): number {
  if (count <= 0) return 0;
  const capped = Math.min(count, 4);
  return MONTHLY_FEE_TABLE[capped] ?? 100;
}

/** School year runs Sep → May (9 months). */
export const SCHOOL_MONTHS: { month: number; label: string; offset: 0 | 1 }[] = [
  { month: 9, label: "سبتمبر", offset: 0 },
  { month: 10, label: "أكتوبر", offset: 0 },
  { month: 11, label: "نوفمبر", offset: 0 },
  { month: 12, label: "ديسمبر", offset: 0 },
  { month: 1, label: "يناير", offset: 1 },
  { month: 2, label: "فبراير", offset: 1 },
  { month: 3, label: "مارس", offset: 1 },
  { month: 4, label: "أبريل", offset: 1 },
  { month: 5, label: "مايو", offset: 1 },
];

/** Returns Sep-year of the current running school year. */
export function currentSchoolYearStart(now = new Date()): number {
  const y = now.getFullYear();
  const m = now.getMonth() + 1; // 1..12
  // Sep..Dec => SY starts this year; Jan..Aug => started previous year.
  // We include Jun/Jul/Aug in the "previous" SY (already ended) for display continuity.
  return m >= 9 ? y : y - 1;
}

export function schoolYearLabel(start: number): string {
  return `${start} / ${start + 1}`;
}

const STORAGE_KEY = "siy-billing";

/** All paid keys as a set: "<parentId>:m:<sy>:<month>" or "<parentId>:books:<sy>" */
export function loadPaid(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(arr);
  } catch {
    return new Set();
  }
}

export function savePaid(set: Set<string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
  } catch {}
}

export function monthKey(parentId: string, sy: number, month: number): string {
  return `${parentId}:m:${sy}:${month}`;
}

export function booksKey(parentId: string, sy: number): string {
  return `${parentId}:books:${sy}`;
}

/** Number of currently-linked children for a parent (from STUDENTS registry). */
export function childrenCount(parent: ManagedUser): number {
  const ids = parent.childStudentIds ?? [];
  const all = loadStudents();
  return ids.filter((id) => all.some((s) => s.id === id)).length;
}