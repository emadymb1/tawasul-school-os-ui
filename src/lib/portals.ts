import type { Role } from "./role-context";

export type PortalMeta = {
  role: Role;
  /** Portal name, e.g. "بوابة المدير" */
  title: string;
  /** Short line shown under the title */
  description: string;
  /** Latin subtitle used in the brand lockup */
  latin: string;
};

export const PORTALS: PortalMeta[] = [
  {
    role: "admin",
    title: "بوابة المدير",
    description: "نظرة عامة على المدرسة، الحسابات، الأدوار والصلاحيات.",
    latin: "Admin portal",
  },
  {
    role: "teacher",
    title: "بوابة الموظف",
    description: "الحصص، الحضور، الدرجات، والتواصل مع أولياء الأمور.",
    latin: "Staff portal",
  },
  {
    role: "student",
    title: "بوابة الطالب",
    description: "جدولي، واجباتي، درجاتي وسجل حضوري.",
    latin: "Student portal",
  },
  {
    role: "parent",
    title: "بوابة ولي الأمر",
    description: "متابعة الأبناء، الفواتير، السلوك والإشعارات.",
    latin: "Parent portal",
  },
];

export const PORTAL_BY_ROLE: Record<Role, PortalMeta> = PORTALS.reduce(
  (acc, p) => {
    acc[p.role] = p;
    return acc;
  },
  {} as Record<Role, PortalMeta>,
);

export const SCHOOL_NAME = "مدرسة الرابطة الإسلامية";
export const SCHOOL_LATIN = "S.I.Y KOULU — SCHOOL OS";
