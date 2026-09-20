import type { Permission } from "./role-context";

export type PermissionGroup = {
  label: string;
  permissions: { key: Permission; label: string; description: string }[];
};

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    label: "الطلاب",
    permissions: [
      { key: "students.manage", label: "إدارة الطلاب", description: "إضافة، تعديل وحذف بيانات الطلاب" },
      { key: "students.viewAll", label: "عرض جميع الطلاب", description: "الاطلاع على قائمة كل طلاب المدرسة" },
    ],
  },
  {
    label: "الحضور والغياب",
    permissions: [
      { key: "attendance.write", label: "تسجيل الحضور", description: "حفظ حضور وغياب الطلاب" },
      { key: "attendance.viewAll", label: "عرض سجل الحضور", description: "الاطلاع على سجلات الحضور لجميع الطلاب" },
    ],
  },
  {
    label: "الواجبات والمهام",
    permissions: [
      { key: "assignments.create", label: "إنشاء الواجبات", description: "إضافة وتعديل الواجبات المدرسية" },
      { key: "assignments.viewAll", label: "عرض كل الواجبات", description: "الاطلاع على واجبات جميع الصفوف" },
    ],
  },
  {
    label: "التحضير",
    permissions: [
      { key: "prep.use", label: "استخدام مساعد التحضير", description: "الوصول لأداة تحضير الدروس" },
    ],
  },
  {
    label: "أولياء الأمور",
    permissions: [
      { key: "parents.broadcast", label: "الإعلانات الجماعية", description: "إرسال إعلانات لجميع أولياء الأمور" },
      { key: "parents.chat", label: "الدردشة الفردية", description: "التواصل الفردي بين المعلم وولي الأمر" },
    ],
  },
];

export const PERMISSION_LABELS: Record<Permission, string> = PERMISSION_GROUPS.flatMap(
  (g) => g.permissions,
).reduce(
  (acc, p) => {
    acc[p.key] = p.label;
    return acc;
  },
  {} as Record<Permission, string>,
);