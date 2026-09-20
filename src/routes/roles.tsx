import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ShieldCheck, RotateCcw, Save, UserPlus, Search, Trash2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import {
  ROLE_LABELS,
  useRole,
  ReadOnlyNotice,
  type Permission,
  type Role,
} from "@/lib/role-context";
import { PERMISSION_GROUPS } from "@/lib/permissions-catalog";
import { AccessDenied } from "@/components/role-guard";
import { type ManagedUser } from "@/lib/users-data";
import { useUsers } from "@/lib/use-users";
import { GradeLevelsCard } from "@/components/grade-levels-card";

export const Route = createFileRoute("/roles")({
  head: () => ({
    meta: [
      { title: "إدارة الأدوار والصلاحيات — مدرسة الرابطة الإسلامية في فنلندا" },
      {
        name: "description",
        content:
          "تحكّم بصلاحيات المعلمين والطلاب وأولياء الأمور، وعيّن الأدوار لمستخدمي المدرسة.",
      },
      { property: "og:title", content: "إدارة الأدوار والصلاحيات — مدرسة الرابطة الإسلامية" },
      {
        property: "og:description",
        content: "إدارة صلاحيات كل دور وتعيين الأدوار للمستخدمين داخل المدرسة.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RolesPage,
});

const ROLES: Role[] = ["admin", "teacher", "student", "parent"];

function RolesPage() {
  const { role, permissions, setRolePermissions, resetPermissions } = useRole();
  const canManage = role === "admin";

  if (role !== "admin") {
    return (
      <AccessDenied
        title="الأدوار والصلاحيات متاحة للإدارة فقط"
        hint="تواصل مع إدارة المدرسة لأي تعديل على الحسابات أو الصلاحيات."
      />
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">إدارة الأدوار والصلاحيات</h1>
          <p className="text-sm text-muted-foreground">
            حدّد ما يمكن لكل دور القيام به، وعيّن الأدوار للمستخدمين في المدرسة.
          </p>
        </div>
      </div>

      {!canManage && (
        <ReadOnlyNotice text="أنت في وضع العرض فقط — تعديل الصلاحيات وتعيين الأدوار متاح للمعلمين (المسؤولين) فقط." />
      )}

      <Tabs defaultValue="permissions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="permissions">الأدوار والصلاحيات</TabsTrigger>
          <TabsTrigger value="users">تعيين الأدوار للمستخدمين</TabsTrigger>
        </TabsList>

        <TabsContent value="permissions" className="space-y-4">
          <div className="flex justify-end">
            {canManage && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  resetPermissions();
                  toast.success("تمت إعادة الصلاحيات إلى الوضع الافتراضي");
                }}
              >
                <RotateCcw className="h-4 w-4 ml-2" />
                استعادة الافتراضي
              </Button>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {ROLES.map((r) => (
              <RoleCard
                key={r}
                role={r}
                current={permissions[r] ?? []}
                disabled={!canManage}
                onSave={(perms) => {
                  setRolePermissions(r, perms);
                  toast.success(`تم حفظ صلاحيات ${ROLE_LABELS[r]}`);
                }}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <GradeLevelsCard />
          <UsersTab canManage={canManage} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RoleCard({
  role,
  current,
  disabled,
  onSave,
}: {
  role: Role;
  current: Permission[];
  disabled: boolean;
  onSave: (perms: Permission[]) => void;
}) {
  const [selected, setSelected] = useState<Set<Permission>>(new Set(current));

  useEffect(() => {
    setSelected(new Set(current));
  }, [current]);

  const toggle = (p: Permission, on: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (on) next.add(p);
      else next.delete(p);
      return next;
    });
  };

  const dirty = useMemo(() => {
    if (selected.size !== current.length) return true;
    return current.some((p) => !selected.has(p));
  }, [selected, current]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{ROLE_LABELS[role]}</CardTitle>
          <Badge variant="secondary">{selected.size} صلاحية</Badge>
        </div>
        <CardDescription>حدّد الصلاحيات الممنوحة لهذا الدور.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {PERMISSION_GROUPS.map((group) => (
          <div key={group.label} className="space-y-2">
            <div className="text-sm font-semibold text-foreground">{group.label}</div>
            <div className="space-y-2">
              {group.permissions.map((p) => {
                const id = `${role}-${p.key}`;
                return (
                  <label
                    key={p.key}
                    htmlFor={id}
                    className="flex items-start gap-2 rounded-md border border-border/50 p-2 hover:bg-accent/40 cursor-pointer"
                  >
                    <Checkbox
                      id={id}
                      checked={selected.has(p.key)}
                      onCheckedChange={(v) => toggle(p.key, v === true)}
                      disabled={disabled}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{p.label}</div>
                      <div className="text-xs text-muted-foreground">{p.description}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        ))}

        {!disabled && (
          <div className="flex justify-end pt-2">
            <Button
              size="sm"
              disabled={!dirty}
              onClick={() => onSave(Array.from(selected))}
            >
              <Save className="h-4 w-4 ml-2" />
              حفظ التغييرات
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function UsersTab({ canManage }: { canManage: boolean }) {
  const { users, persist } = useUsers();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<{ name: string; email: string; role: Role }>({
    name: "",
    email: "",
    role: "student",
  });

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return users;
    return users.filter(
      (u) => u.name.includes(q) || u.email.toLowerCase().includes(q.toLowerCase()),
    );
  }, [users, query]);

  const changeRole = (id: string, role: Role) => {
    persist(users.map((u) => (u.id === id ? { ...u, role } : u)));
    toast.success("تم تحديث الدور");
  };

  const remove = (id: string) => {
    persist(users.filter((u) => u.id !== id));
    toast.success("تم حذف المستخدم");
  };

  const addUser = () => {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("يرجى إدخال الاسم والبريد");
      return;
    }
    const newUser: ManagedUser = {
      id: `u${Date.now()}`,
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
    };
    persist([newUser, ...users]);
    setForm({ name: "", email: "", role: "student" });
    setOpen(false);
    toast.success("تمت إضافة المستخدم");
  };

  const counts = useMemo(() => {
    return {
      teacher: users.filter((u) => u.role === "teacher").length,
      student: users.filter((u) => u.role === "student").length,
      parent: users.filter((u) => u.role === "parent").length,
    };
  }, [users]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>مستخدمو المدرسة</CardTitle>
            <CardDescription>
              معلمون: {counts.teacher} · طلاب: {counts.student} · أولياء أمور: {counts.parent}
            </CardDescription>
          </div>
          {canManage && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <UserPlus className="h-4 w-4 ml-2" />
                  إضافة مستخدم
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>إضافة مستخدم جديد</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="new-name">الاسم</Label>
                    <Input
                      id="new-name"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="مثال: الطالب محمد"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="new-email">البريد الإلكتروني</Label>
                    <Input
                      id="new-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="name@siy.fi"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>الدور</Label>
                    <Select
                      value={form.role}
                      onValueChange={(v) => setForm((f) => ({ ...f, role: v as Role }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.map((r) => (
                          <SelectItem key={r} value={r}>
                            {ROLE_LABELS[r]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    إلغاء
                  </Button>
                  <Button onClick={addUser}>إضافة</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative max-w-sm">
          <Search className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث بالاسم أو البريد..."
            className="pr-9"
          />
        </div>

        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم</TableHead>
                <TableHead>البريد</TableHead>
                <TableHead className="w-40">الدور</TableHead>
                {canManage && <TableHead className="w-16"></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm" dir="ltr">
                    {u.email}
                  </TableCell>
                  <TableCell>
                    {canManage ? (
                      <Select
                        value={u.role}
                        onValueChange={(v) => changeRole(u.id, v as Role)}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLES.map((r) => (
                            <SelectItem key={r} value={r}>
                              {ROLE_LABELS[r]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant="secondary">{ROLE_LABELS[u.role]}</Badge>
                    )}
                  </TableCell>
                  {canManage && (
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(u.id)}
                        aria-label="حذف"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={canManage ? 4 : 3} className="text-center text-muted-foreground py-8">
                    لا يوجد مستخدمون مطابقون.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}