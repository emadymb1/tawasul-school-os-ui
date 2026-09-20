import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Role = "teacher" | "student" | "parent" | "admin";

export const ROLE_LABELS: Record<Role, string> = {
  teacher: "موظف",
  student: "طالب",
  parent: "ولي أمر",
  admin: "مدير",
};

export const ROLE_SUBTITLES: Record<Role, string> = {
  teacher: "موظف — القرآن الكريم",
  student: "طالب في الصف الرابع",
  parent: "ولي أمر الطالب أحمد",
  admin: "مدير المدرسة",
};

export const ROLE_NAMES: Record<Role, string> = {
  teacher: "الأستاذ عبدالله",
  student: "الطالب أحمد",
  parent: "الوالد أبو أحمد",
  admin: "إدارة المدرسة",
};

// permission keys used across the app
export type Permission =
  | "students.manage" // create/edit/delete students
  | "students.viewAll"
  | "attendance.write"
  | "attendance.viewAll"
  | "assignments.create"
  | "assignments.viewAll"
  | "prep.use"
  | "parents.broadcast"
  | "parents.chat";

export const ALL_PERMISSIONS: Permission[] = [
  "students.manage",
  "students.viewAll",
  "attendance.write",
  "attendance.viewAll",
  "assignments.create",
  "assignments.viewAll",
  "prep.use",
  "parents.broadcast",
  "parents.chat",
];

export const DEFAULT_PERMISSIONS: Record<Role, Permission[]> = {
  teacher: [
    "students.manage",
    "students.viewAll",
    "attendance.write",
    "attendance.viewAll",
    "assignments.create",
    "assignments.viewAll",
    "prep.use",
    "parents.broadcast",
    "parents.chat",
  ],
  student: [],
  parent: ["parents.chat"],
  admin: [
    "students.manage",
    "students.viewAll",
    "attendance.write",
    "attendance.viewAll",
    "assignments.create",
    "assignments.viewAll",
    "prep.use",
    "parents.broadcast",
    "parents.chat",
  ],
};

type Ctx = {
  role: Role;
  setRole: (r: Role) => void;
  can: (p: Permission) => boolean;
  permissions: Record<Role, Permission[]>;
  setRolePermissions: (r: Role, perms: Permission[]) => void;
  resetPermissions: () => void;
};

const RoleContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "siy-role";
const PERMS_KEY = "siy-role-permissions";

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>("teacher");
  const [permissions, setPermissions] = useState<Record<Role, Permission[]>>(DEFAULT_PERMISSIONS);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Role | null;
      if (saved === "teacher" || saved === "student" || saved === "parent" || saved === "admin") {
        setRoleState(saved);
      }
      const savedPerms = localStorage.getItem(PERMS_KEY);
      if (savedPerms) {
        const parsed = JSON.parse(savedPerms) as Record<Role, Permission[]>;
        if (parsed && parsed.teacher && parsed.student && parsed.parent) {
          if (!parsed.admin) parsed.admin = DEFAULT_PERMISSIONS.admin;
          setPermissions(parsed);
        }
      }
    } catch {}
  }, []);

  const setRole = (r: Role) => {
    setRoleState(r);
    try {
      localStorage.setItem(STORAGE_KEY, r);
    } catch {}
  };

  const setRolePermissions = (r: Role, perms: Permission[]) => {
    setPermissions((prev) => {
      const next = { ...prev, [r]: perms };
      try {
        localStorage.setItem(PERMS_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const resetPermissions = () => {
    setPermissions(DEFAULT_PERMISSIONS);
    try {
      localStorage.removeItem(PERMS_KEY);
    } catch {}
  };

  const value = useMemo<Ctx>(
    () => ({
      role,
      setRole,
      can: (p: Permission) => permissions[role]?.includes(p) ?? false,
      permissions,
      setRolePermissions,
      resetPermissions,
    }),
    [role, permissions],
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}

export function Can({ permission, children, fallback = null }: { permission: Permission; children: ReactNode; fallback?: ReactNode }) {
  const { can } = useRole();
  return <>{can(permission) ? children : fallback}</>;
}

export function ReadOnlyNotice({ text = "أنت في وضع العرض فقط — لا تملك صلاحية التعديل." }: { text?: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
      {text}
    </div>
  );
}