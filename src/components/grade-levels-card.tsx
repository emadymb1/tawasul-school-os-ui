import { useState } from "react";
import { Plus, RotateCcw, Trash2, Layers } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useGrades } from "@/lib/use-grades";

/** بطاقة إدارة المستويات الدراسية (للمدير). */
export function GradeLevelsCard() {
  const { grades, addGrade, removeGrade, resetGrades } = useGrades();
  const [newGrade, setNewGrade] = useState("");

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              المستويات الدراسية
            </CardTitle>
            <CardDescription>
              أضِف أو احذف المستويات (الصفوف) المستخدمة في إسناد المعلمين وإدارة الطلاب.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              resetGrades();
              toast.success("تمت إعادة المستويات الافتراضية");
            }}
          >
            <RotateCcw className="h-4 w-4 ml-1" />
            إعادة الافتراضي
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <form
          className="flex flex-wrap gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (addGrade(newGrade)) {
              toast.success(`تمت إضافة المستوى: ${newGrade.trim()}`);
              setNewGrade("");
            } else {
              toast.error("اسم المستوى فارغ أو موجود مسبقاً");
            }
          }}
        >
          <Input
            value={newGrade}
            onChange={(e) => setNewGrade(e.target.value)}
            placeholder="اسم المستوى (مثال: السابع)"
            className="max-w-xs"
          />
          <Button type="submit" size="sm">
            <Plus className="h-4 w-4 ml-1" />
            إضافة مستوى
          </Button>
        </form>
        <div className="flex flex-wrap gap-2">
          {grades.map((g) => (
            <Badge key={g} variant="secondary" className="gap-1 py-1 pr-2">
              الصف {g}
              <button
                type="button"
                aria-label={`حذف ${g}`}
                className="text-destructive"
                onClick={() => {
                  removeGrade(g);
                  toast.success(`تم حذف المستوى: ${g}`);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {grades.length === 0 && (
            <p className="text-sm text-muted-foreground">لا توجد مستويات — أضِف واحداً على الأقل.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
