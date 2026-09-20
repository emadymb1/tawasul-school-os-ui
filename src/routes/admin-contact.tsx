import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { Send, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useRole } from "@/lib/role-context";

export const Route = createFileRoute("/admin-contact")({
  head: () => ({
    meta: [
      { title: "التواصل مع الإدارة — منارة" },
      { name: "description", content: "أرسل رسالة إلى إدارة المدرسة وتابع الردود." },
      { property: "og:title", content: "التواصل مع الإدارة — منارة" },
      { property: "og:description", content: "تواصل ولي الأمر مع إدارة المدرسة." },
    ],
  }),
  component: AdminContactPage,
});

type Msg = { id: number; subject: string; body: string; date: string; from: "parent" | "admin"; status: "مرسلة" | "مقروءة" | "تم الرد" };

const history: Msg[] = [
  { id: 1, subject: "طلب استئذان يوم السبت", body: "السلام عليكم، أرجو استئذان الابن أحمد لحضور موعد طبي.", date: "2026-07-15", from: "parent", status: "تم الرد" },
  { id: 2, subject: "رد: طلب استئذان", body: "وعليكم السلام، تم قبول الطلب بارك الله فيكم.", date: "2026-07-15", from: "admin", status: "مقروءة" },
];

function AdminContactPage() {
  const { role } = useRole();
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  if (role !== "parent") return <Navigate to="/" replace />;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-4xl mx-auto">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold">التواصل مع الإدارة</h1>
        <p className="text-muted-foreground mt-1 text-sm">أرسل استفسارك أو طلبك مباشرة إلى إدارة المدرسة.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary" /> رسالة جديدة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="الموضوع"
          />
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="اكتب رسالتك هنا..."
            rows={5}
          />
          <div className="flex justify-end">
            <Button
              className="gap-2"
              disabled={!subject.trim() || !body.trim()}
              onClick={() => { setSubject(""); setBody(""); }}
            >
              <Send className="h-4 w-4" /> إرسال إلى الإدارة
            </Button>
          </div>
        </CardContent>
      </Card>

      <section>
        <h2 className="text-lg font-bold mb-3">الرسائل السابقة</h2>
        <div className="space-y-3">
          {history.map((m) => (
            <Card key={m.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant={m.from === "admin" ? "default" : "secondary"}>
                        {m.from === "admin" ? "الإدارة" : "أنت"}
                      </Badge>
                      <span className="font-semibold text-sm truncate">{m.subject}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{m.body}</p>
                  </div>
                  <div className="text-[11px] text-muted-foreground text-left shrink-0" dir="ltr">
                    {m.date}
                  </div>
                </div>
                <div className="mt-2">
                  <Badge variant="outline" className="text-[10px]">{m.status}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}