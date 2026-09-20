import { Lock } from "lucide-react";

/** بطاقة موحّدة تُعرض عند محاولة فتح صفحة خارج صلاحية الدور الحالي. */
export function AccessDenied({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <div className="rounded-xl border border-border bg-card p-8 text-center space-y-3">
        <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center">
          <Lock className="h-5 w-5 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="text-sm text-muted-foreground">
          {hint ?? "لا تملك صلاحية الوصول إلى هذه الصفحة بدورك الحالي."}
        </p>
      </div>
    </div>
  );
}
