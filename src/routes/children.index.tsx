import { createFileRoute, Link, Navigate, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronLeft, Users, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useRole } from "@/lib/role-context";
import { loadUsers } from "@/lib/users-data";
import { useStudents } from "@/lib/use-students";
import {
  loadSelectedChildId,
  saveSelectedChildId,
  getCurrentParentChildIds,
} from "@/lib/selected-child";

export const Route = createFileRoute("/children/")({
  validateSearch: (search: Record<string, unknown>) => ({
    pick: search.pick === true || search.pick === "true" ? true : undefined,
  }),
  head: () => ({
    meta: [
      { title: "الأبناء — منارة" },
      { name: "description", content: "اختر الابن لعرض تفاصيله ومتابعته." },
      { property: "og:title", content: "الأبناء — منارة" },
      { property: "og:description", content: "شاشة اختيار الابن لولي الأمر." },
    ],
  }),
  component: ChildrenPage,
});

function ChildrenPage() {
  const { students } = useStudents();
  const { role } = useRole();
  const navigate = useNavigate();
  const { pick } = Route.useSearch();
  const [childIds, setChildIds] = useState<number[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const users = loadUsers();
    const ids = getCurrentParentChildIds(users);
    setChildIds(ids);
    const saved = loadSelectedChildId();
    if (saved && ids.includes(saved)) setSelectedId(saved);

    // When the parent explicitly came back to pick a child, never auto-redirect.
    if (pick) {
      setReady(true);
      return;
    }

    if (saved && ids.includes(saved)) {
      // Auto-load last selected child immediately.
      navigate({ to: "/children/$studentId", params: { studentId: String(saved) }, replace: true });
      return;
    }
    // Single child: auto-select without extra clicks.
    if (ids.length === 1) {
      saveSelectedChildId(ids[0]);
      navigate({ to: "/children/$studentId", params: { studentId: String(ids[0]) }, replace: true });
      return;
    }
    setReady(true);
  }, [navigate, pick]);

  if (role !== "parent") return <Navigate to="/" replace />;
  if (!ready) return null;

  const children = students.filter((s) => childIds.includes(s.id));

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold">الأبناء</h1>
        <p className="text-muted-foreground mt-1 text-sm">اختر الابن لعرض حضوره وواجباته ودرجاته والتواصل مع معلميه.</p>
      </header>

      {children.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            لا يوجد أبناء مرتبطون بحسابك حالياً.
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {children.map((s) => (
            <Link
              key={s.id}
              to="/children/$studentId"
              params={{ studentId: String(s.id) }}
              onClick={() => saveSelectedChildId(s.id)}
              className="group rounded-xl border border-border bg-card p-5 hover:border-primary/50 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Users className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate flex items-center gap-1.5">
                    {s.name}
                    {selectedId === s.id && (
                      <Star className="h-3.5 w-3.5 text-gold fill-gold" aria-label="آخر اختيار" />
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    الصف {s.grade} — قسم {s.section}
                  </div>
                </div>
                <ChevronLeft className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}