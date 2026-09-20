import { Link } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";

export function MonthlyScheduleCard() {
  return (
    <Link
      to="/schedule"
      className="group block rounded-xl border border-border bg-card p-5 hover:border-primary/50 hover:shadow-md transition-all"
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <CalendarDays className="h-5 w-5" />
        </div>
        <div>
          <div className="font-semibold">جدول الدوام الشهري</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            أيام السبت والأحد — الشهر الحالي (للعرض فقط)
          </div>
        </div>
      </div>
    </Link>
  );
}
