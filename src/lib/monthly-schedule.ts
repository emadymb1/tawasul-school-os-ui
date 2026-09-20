export type DayStatus =
  | "دوام"
  | "إجازة"
  | "راحة"
  | "اختبارات"
  | "حفل نصف العام الدراسي"
  | "حفل نهاية العام الدراسي";

export const DAY_STATUSES: DayStatus[] = [
  "دوام",
  "إجازة",
  "راحة",
  "اختبارات",
  "حفل نصف العام الدراسي",
  "حفل نهاية العام الدراسي",
];

export const STATUS_TONE: Record<DayStatus, string> = {
  "دوام": "bg-primary/10 border-primary/30 text-primary",
  "إجازة": "bg-destructive/10 border-destructive/30 text-destructive",
  "راحة": "bg-muted border-border text-muted-foreground",
  "اختبارات": "bg-gold/20 border-gold/40 text-gold-foreground",
  "حفل نصف العام الدراسي": "bg-accent border-accent-foreground/20 text-accent-foreground",
  "حفل نهاية العام الدراسي": "bg-accent border-accent-foreground/20 text-accent-foreground",
};

export type ScheduleDay = {
  /** ISO date yyyy-mm-dd */
  date: string;
  /** 6 = Saturday, 0 = Sunday */
  weekday: number;
  dayLabel: string;
};

export type ScheduleMonth = {
  key: string; // yyyy-mm
  label: string;
  days: ScheduleDay[];
};

const MONTH_LABELS = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

/** سبتمبر 2026 → مايو 2027 */
const RANGE: { year: number; month: number }[] = [
  { year: 2026, month: 8 },
  { year: 2026, month: 9 },
  { year: 2026, month: 10 },
  { year: 2026, month: 11 },
  { year: 2027, month: 0 },
  { year: 2027, month: 1 },
  { year: 2027, month: 2 },
  { year: 2027, month: 3 },
  { year: 2027, month: 4 },
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function buildMonths(): ScheduleMonth[] {
  return RANGE.map(({ year, month }) => {
    const days: ScheduleDay[] = [];
    const last = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    for (let d = 1; d <= last; d++) {
      const wd = new Date(Date.UTC(year, month, d)).getUTCDay();
      if (wd === 6 || wd === 0) {
        days.push({
          date: `${year}-${pad(month + 1)}-${pad(d)}`,
          weekday: wd,
          dayLabel: wd === 6 ? "السبت" : "الأحد",
        });
      }
    }
    return { key: `${year}-${pad(month + 1)}`, label: `${MONTH_LABELS[month]} ${year}`, days };
  });
}

export const MONTHS = buildMonths();

const KEY = "siy-monthly-schedule";

export function defaultStatus(date: string): DayStatus {
  return date >= "2026-12-19" && date <= "2027-01-04" ? "إجازة" : "دوام";
}

export function loadSchedule(): Record<string, DayStatus> {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Record<string, DayStatus>;
  } catch {}
  return {};
}

export function saveSchedule(map: Record<string, DayStatus>): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(map));
  } catch {}
}

export function statusOf(map: Record<string, DayStatus>, date: string): DayStatus {
  return map[date] ?? defaultStatus(date);
}
