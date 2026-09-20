import { createFileRoute, Navigate, Link } from "@tanstack/react-router";
import { Wallet, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRole } from "@/lib/role-context";

export const Route = createFileRoute("/billing")({
  head: () => ({
    meta: [
      { title: "الحسابات — مدرسة الرابطة الإسلامية" },
      { name: "description", content: "إدارة رسوم أولياء الأمور الشهرية ورسوم الكتب السنوية." },
      { property: "og:title", content: "الحسابات — مدرسة الرابطة الإسلامية" },
      { property: "og:description", content: "متابعة المدفوعات لكل ولي أمر عبر السنة الدراسية." },
    ],
  }),
  component: BillingPage,
});

function BillingPage() {
  const { role } = useRole();
  if (role !== "admin") return <Navigate to="/" replace />;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <header className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          <Wallet className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">الحسابات</h1>
          <p className="text-sm text-muted-foreground mt-1">
            رسوم شهرية حسب عدد الأبناء (١: ٣٠€، ٢: ٥٥€، ٣: ٨٠€، ٤+: ١٠٠€) ورسوم كتب سنوية ٣٥€.
          </p>
        </div>
      </header>
      <Card>
        <CardContent className="p-6 space-y-4 text-sm">
          <p>
            تتم إدارة تفاصيل المدفوعات لكل ولي أمر ضمن تبويب "الحسابات" في لوحة الإدارة، حيث يمكنك اختيار ولي الأمر، والسنة الدراسية، وتبديل حالة الدفع لكل شهر ورسوم الكتب.
          </p>
          <Button asChild>
            <Link to="/admin">
              <ExternalLink className="h-4 w-4 ml-2" /> فتح تبويب الحسابات في لوحة الإدارة
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}