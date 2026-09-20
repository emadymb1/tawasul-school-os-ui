export type Subject = "القرآن" | "اللغة العربية" | "التربية الإسلامية";

export type Assignment = {
  id: number;
  title: string;
  subject: Subject;
  grade: string;
  due: string;
  total: number;
  desc: string;
  requiresUpload?: boolean;
};

export type SubmissionStatus = "pending" | "submitted" | "graded" | "late";

export type Submission = {
  assignmentId: number;
  status: SubmissionStatus;
  fileName?: string;
  note?: string;
  submittedAt?: string;
  grade?: number;
};

const A_KEY = "siy-assignments";
const S_KEY = "siy-submissions";

export const defaultAssignments: Assignment[] = [
  { id: 1, title: "حفظ سورة الملك من الآية 1 إلى 15", subject: "القرآن", grade: "الصف الرابع", due: "الأحد القادم", total: 24, desc: "مع مراعاة أحكام التجويد والمد.", requiresUpload: true },
  { id: 2, title: "تفسير آيات من سورة الحجرات", subject: "القرآن", grade: "الصف الثاني", due: "السبت القادم", total: 20, desc: "الآيات 10 - 13 مع بيان معاني المفردات.", requiresUpload: true },
  { id: 3, title: "إعراب جمل من درس الفعل المضارع", subject: "اللغة العربية", grade: "الصف الثالث", due: "الأحد القادم", total: 22, desc: "عشر جمل من كتاب النحو الواضح.", requiresUpload: true },
  { id: 4, title: "بحث قصير: أركان الإيمان", subject: "التربية الإسلامية", grade: "الصف الأول", due: "بعد أسبوعين", total: 18, desc: "صفحتان مع مراجع من الكتاب المدرسي.", requiresUpload: true },
];

export const defaultSubmissions: Submission[] = [
  { assignmentId: 3, status: "graded", fileName: "iraab.pdf", submittedAt: "قبل يومين", grade: 18 },
  { assignmentId: 1, status: "submitted", fileName: "recording.m4a", submittedAt: "أمس" },
];

export function loadAssignments(): Assignment[] {
  try {
    const raw = localStorage.getItem(A_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return defaultAssignments;
}

export function saveAssignments(a: Assignment[]) {
  try { localStorage.setItem(A_KEY, JSON.stringify(a)); } catch {}
}

export function loadSubmissions(): Submission[] {
  try {
    const raw = localStorage.getItem(S_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return defaultSubmissions;
}

export function saveSubmissions(s: Submission[]) {
  try { localStorage.setItem(S_KEY, JSON.stringify(s)); } catch {}
}

export const STATUS_LABELS: Record<SubmissionStatus, string> = {
  pending: "بانتظار الرفع",
  submitted: "تم التسليم",
  graded: "مُقيَّم",
  late: "متأخر",
};

export function subjectStyle(s: Subject) {
  if (s === "القرآن") return "bg-primary/10 text-primary border-primary/30";
  if (s === "اللغة العربية") return "bg-gold/20 text-gold-foreground border-gold/40";
  return "bg-accent text-accent-foreground border-accent-foreground/20";
}

export function statusStyle(s: SubmissionStatus) {
  if (s === "graded") return "bg-primary/10 text-primary border-primary/30";
  if (s === "submitted") return "bg-gold/20 text-gold-foreground border-gold/40";
  if (s === "late") return "bg-destructive/10 text-destructive border-destructive/30";
  return "bg-muted text-muted-foreground border-border";
}