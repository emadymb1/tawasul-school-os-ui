import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send, Search, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useRole } from "@/lib/role-context";
import { AccessDenied } from "@/components/role-guard";

export const Route = createFileRoute("/parents")({
  head: () => ({
    meta: [
      { title: "تواصل أولياء الأمور — منارة" },
      { name: "description", content: "تواصل مباشر بين المدرسة وأولياء الأمور." },
      { property: "og:title", content: "تواصل أولياء الأمور — منارة" },
      { property: "og:description", content: "رسائل واجتماعات ومتابعة الطلاب مع أولياء الأمور." },
    ],
  }),
  component: ParentsPage,
});

type Parent = {
  id: number;
  name: string;
  student: string;
  grade: string;
  last: string;
  unread: number;
};

const parents: Parent[] = [
  { id: 1, name: "أبو أحمد", student: "أحمد بن محمد", grade: "الصف الرابع", last: "جزاكم الله خيراً، سيحضر غداً بإذن الله.", unread: 0 },
  { id: 2, name: "أبو عبدالرحمن", student: "عبدالرحمن الخالدي", grade: "الصف الثاني", last: "هل يمكن معرفة تفاصيل الاختبار؟", unread: 2 },
  { id: 3, name: "أم يوسف", student: "يوسف العتيبي", grade: "الصف الثالث", last: "شكراً على المتابعة الدائمة.", unread: 0 },
  { id: 4, name: "أبو زيد", student: "زيد المطيري", grade: "الصف الأول", last: "متى يبدأ الحفظ من سورة تبارك؟", unread: 1 },
];

type ChatMsg = { from: "parent" | "teacher"; text: string; time: string };
const initialThreads: Record<number, ChatMsg[]> = {
  1: [{ from: "parent", text: "جزاكم الله خيراً، سيحضر غداً بإذن الله.", time: "٠٨:٤٠" }],
  2: [
    { from: "parent", text: "السلام عليكم، كيف مستوى ابني في الحفظ هذا الأسبوع؟", time: "٠٩:١٠" },
    { from: "teacher", text: "وعليكم السلام. ابنك مجتهد، حفظ ١٥ آية بإتقان.", time: "٠٩:١٢" },
  ],
  3: [{ from: "parent", text: "شكراً على المتابعة الدائمة.", time: "١٠:٠٠" }],
  4: [{ from: "parent", text: "متى يبدأ الحفظ من سورة تبارك؟", time: "١١:١٥" }],
};

function ParentsPage() {
  const { role } = useRole();
  const [selected, setSelected] = useState<Parent>(parents[1]);
  const [text, setText] = useState("");
  const [broadcast, setBroadcast] = useState("");
  const [threads, setThreads] = useState<Record<number, ChatMsg[]>>(initialThreads);

  const now = () => new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });

  const send = () => {
    const t = text.trim();
    if (!t) return;
    setThreads((prev) => ({
      ...prev,
      [selected.id]: [...(prev[selected.id] ?? []), { from: "teacher", text: t, time: now() }],
    }));
    setText("");
  };

  const sendBroadcast = () => {
    const t = broadcast.trim();
    if (!t) return;
    setThreads((prev) => {
      const next = { ...prev };
      for (const p of parents) {
        next[p.id] = [...(next[p.id] ?? []), { from: "teacher", text: `📢 ${t}`, time: now() }];
      }
      return next;
    });
    toast.success(`تم إرسال الإعلان إلى ${parents.length} من أولياء الأمور`);
    setBroadcast("");
  };

  const messages = threads[selected.id] ?? [];

  if (role !== "admin" && role !== "teacher") {
    return (
      <AccessDenied
        title="هذه الصفحة للتواصل مع أولياء الأمور من الطاقم"
        hint="للتواصل مع المدرسة استخدم صفحة التواصل مع الإدارة."
      />
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold">تواصل أولياء الأمور</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          راسل أولياء الأمور مباشرة أو أرسل إعلاناً جماعياً
        </p>
      </header>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="h-4 w-4 text-primary" />
            <div className="font-semibold text-sm">إعلان جماعي لأولياء الأمور</div>
          </div>
          <Textarea
            value={broadcast}
            onChange={(e) => setBroadcast(e.target.value)}
            placeholder="مثال: تذكير باجتماع أولياء الأمور يوم السبت القادم بعد صلاة العصر."
            rows={2}
            className="bg-background"
          />
          <div className="flex justify-end mt-3">
            <Button className="gap-2" disabled={!broadcast.trim()} onClick={sendBroadcast}>
              <Send className="h-4 w-4" /> إرسال للجميع
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4 min-h-[500px]">
        <Card className="md:col-span-1 flex flex-col">
          <CardContent className="p-3 flex flex-col gap-2 h-full">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="بحث..." className="pr-9" />
            </div>
            <div className="flex-1 overflow-auto -mx-1 px-1">
              {parents.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className={`w-full text-right p-3 rounded-lg transition-colors flex gap-3 items-start ${
                    selected.id === p.id ? "bg-primary/10" : "hover:bg-muted"
                  }`}
                >
                  <div className="h-10 w-10 rounded-full bg-gold/20 text-gold-foreground flex items-center justify-center font-semibold shrink-0">
                    {p.name[p.name.indexOf(" ") + 1] || "و"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-semibold text-sm truncate">{p.name}</div>
                      {p.unread > 0 && (
                        <Badge className="h-5 min-w-5 px-1.5 bg-primary text-primary-foreground">
                          {p.unread}
                        </Badge>
                      )}
                    </div>
                    <div className="text-[11px] text-muted-foreground truncate">
                      {p.student} — {p.grade}
                    </div>
                    <div className="text-xs text-muted-foreground/80 truncate mt-1">
                      {p.last}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 flex flex-col">
          <CardContent className="p-0 flex flex-col h-full">
            <div className="border-b border-border p-4">
              <div className="font-semibold">{selected.name}</div>
              <div className="text-xs text-muted-foreground">
                ولي أمر {selected.student} — {selected.grade}
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-3 min-h-64">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.from === "teacher" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                      m.from === "teacher"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <div>{m.text}</div>
                    <div className={`text-[10px] mt-1 ${m.from === "teacher" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {m.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border p-3 flex gap-2">
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="اكتب رسالتك..."
              />
              <Button className="gap-2" disabled={!text.trim()} onClick={send}>
                <Send className="h-4 w-4" /> إرسال
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}