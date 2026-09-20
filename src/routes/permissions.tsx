import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, RotateCcw, Check, X } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  ROLE_LABELS,
  useRole,
  ALL_PERMISSIONS,
  type Permission,
  type Role,
} from "@/lib/role-context";
import { PERMISSION_GROUPS } from "@/lib/permissions-catalog";
import { GradeLevelsCard } from "@/components/grade-levels-card";

const ROLES: Role[] = ["admin", "teacher", "student", "parent"];

export const Route = createFileRoute("/permissions")({
  head: () => ({
    meta: [
      { title: "مصفوفة الصلاحيات — مدرسة الرابطة الإسلامية في فنلندا" },
      { name: "description", content: "تفعيل وتعطيل صلاحيات can(...) لكل دور من مكان واحد." },
      { property: "og:title", content: "مصفوفة الصلاحيات — S.I.Y Koulu" },
      { property: "og:description", content: "تحكم مبسّط بصلاحيات المعلم والطالب وولي الأمر." },
    ],
  }),
  component: PermissionsMatrixPage,
});

function PermissionsMatrixPage() {
  const { role, permissions, setRolePermissions, resetPermissions } = useRole();

  if (role !== "admin") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>غير مصرّح</CardTitle>
          <CardDescription>هذه الصفحة متاحة للمدير فقط.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const toggle = (role: Role, perm: Permission, value: boolean) => {
    const current = permissions[role] ?? [];
    const next = value ? Array.from(new Set([...current, perm])) : current.filter((p) => p !== perm);
    setRolePermissions(role, next);
  };

  const toggleAllForRole = (role: Role, value: boolean) => {
    setRolePermissions(role, value ? [...ALL_PERMISSIONS] : []);
    toast.success(value ? `تم منح كل الصلاحيات لـ${ROLE_LABELS[role]}` : `تم سحب كل الصلاحيات من ${ROLE_LABELS[role]}`);
  };

  const counts: Record<Role, number> = {
    admin: permissions.admin?.length ?? 0,
    teacher: permissions.teacher?.length ?? 0,
    student: permissions.student?.length ?? 0,
    parent: permissions.parent?.length ?? 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            مصفوفة الصلاحيات
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            فعّل أو عطّل كل صلاحية <code className="text-xs">can(...)</code> لكل دور من جدول واحد.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => { resetPermissions(); toast.success("تمت إعادة الصلاحيات الافتراضية"); }}>
          <RotateCcw className="h-4 w-4 ml-1" />
          إعادة الافتراضي
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {ROLES.map((r) => (
          <Card key={r}>
            <CardContent className="p-4 flex items-center justify-between gap-3">
              <div>
                <div className="text-sm text-muted-foreground">{ROLE_LABELS[r]}</div>
                <div className="text-lg font-semibold">
                  {counts[r]} <span className="text-xs text-muted-foreground">/ {ALL_PERMISSIONS.length}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => toggleAllForRole(r, true)}>
                  <Check className="h-3 w-3 ml-1" /> منح الكل
                </Button>
                <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => toggleAllForRole(r, false)}>
                  <X className="h-3 w-3 ml-1" /> سحب الكل
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <GradeLevelsCard />


      {PERMISSION_GROUPS.map((group) => (
        <Card key={group.label}>
          <CardHeader>
            <CardTitle className="text-base">{group.label}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الصلاحية</TableHead>
                  {ROLES.map((r) => (
                    <TableHead key={r} className="text-center w-24">{ROLE_LABELS[r]}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {group.permissions.map((p) => (
                  <TableRow key={p.key}>
                    <TableCell>
                      <div className="font-medium">{p.label}</div>
                      <div className="text-xs text-muted-foreground">{p.description}</div>
                      <Badge variant="outline" className="mt-1 text-[10px] font-mono">{p.key}</Badge>
                    </TableCell>
                    {ROLES.map((r) => {
                      const enabled = permissions[r]?.includes(p.key) ?? false;
                      return (
                        <TableCell key={r} className="text-center">
                          <Switch
                            checked={enabled}
                            onCheckedChange={(v) => toggle(r, p.key, v)}
                            aria-label={`${p.label} لـ${ROLE_LABELS[r]}`}
                          />
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}