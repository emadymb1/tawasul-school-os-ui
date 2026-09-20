import { useEffect, useState } from "react";
import { NotebookText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { summariesForGrade, type LessonSummary } from "@/lib/lesson-summaries";

export function LessonSummariesCard({ grade, title = "ملخصات الدروس" }: { grade: string; title?: string }) {
  const [items, setItems] = useState<LessonSummary[]>([]);
  useEffect(() => {
    setItems(summariesForGrade(grade).slice(0, 10));
  }, [grade]);

  if (items.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <NotebookText className="h-4 w-4 text-primary" />
          <CardTitle className="text-base">{title}</CardTitle>
          <Badge variant="outline">{items.length}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((s) => (
          <div key={s.id} className="rounded-lg border border-border p-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="font-semibold text-sm">{s.title}</div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-[10px]">
                  {s.subject}
                </Badge>
                <span className="text-[11px] text-muted-foreground" dir="ltr">{s.date}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{s.text}</p>
            {s.teacher && (
              <div className="text-[11px] text-muted-foreground/80 mt-2">{s.teacher}</div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
