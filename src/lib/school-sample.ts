export type LessonTone = "coral" | "leaf" | "mint" | "gold";

export const TODAY_LESSONS: {
  time: string;
  subject: string;
  group: string;
  room: string;
  tone: LessonTone;
}[] = [
  { time: "08:00", subject: "القرآن الكريم", group: "الصف الخامس · أ", room: "قاعة ٢٠٤", tone: "coral" },
  { time: "10:00", subject: "اللغة العربية", group: "الصف الخامس · أ", room: "قاعة ٢٠٤", tone: "leaf" },
  { time: "11:30", subject: "التربية الإسلامية", group: "الصف السادس · أ", room: "قاعة ١١٨", tone: "mint" },
  { time: "12:30", subject: "التلاوة والتجويد", group: "الصف السادس · أ", room: "قاعة ١١٨", tone: "gold" },
];

export const SCHOOL_NOTICES = [
  { title: "اجتماع أولياء الأمور يوم السبت", meta: "فعالية · 2026-09-19", isNew: true },
  { title: "اختبار القرآن الكريم للصف الخامس", meta: "اختبار · 2026-09-22", isNew: false },
  { title: "إجازة المولد النبوي", meta: "إجازة · 2026-09-26", isNew: false },
  { title: "رحلة مدرسية إلى المكتبة العامة", meta: "فعالية · 2026-10-02", isNew: false },
];
