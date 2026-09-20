import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Send, Users as UsersIcon, MessagesSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRole, ROLE_NAMES } from "@/lib/role-context";
import { loadUsers, type ManagedUser } from "@/lib/users-data";

export const Route = createFileRoute("/messages")({
  head: () => ({
    meta: [
      { title: "دردشة الطاقم — منارة" },
      { name: "description", content: "دردشة داخلية بين المدير والمعلمين فقط." },
      { property: "og:title", content: "دردشة الطاقم — منارة" },
      { property: "og:description", content: "قناة تواصل خاصة بين إدارة المدرسة والمعلمين." },
    ],
  }),
  component: MessagesPage,
});

type Msg = { id: number; from: string; fromName: string; text: string; time: string };
const STORAGE_KEY = "siy-staff-chat";
const GROUP_ID = "__group__";

function loadChats(): Record<string, Msg[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    [GROUP_ID]: [
      { id: 1, from: "admin", fromName: "إدارة المدرسة", text: "السلام عليكم يا معلمين الكرام، تذكير باجتماع يوم الأحد بعد الحصة الأخيرة.", time: "٠٨:٣٠" },
    ],
  };
}
function saveChats(c: Record<string, Msg[]>) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(c)); } catch {}
}

function MessagesPage() {
  const { role } = useRole();
  if (role !== "admin" && role !== "teacher") return <Navigate to="/" replace />;

  const users = loadUsers();
  const teachers = users.filter((u) => u.role === "teacher");
  const admin: { id: string; name: string } = { id: "admin", name: ROLE_NAMES.admin };

  // Threads visible to current role: admin sees group + each teacher; teacher sees group + admin only.
  const threads = useMemo(() => {
    if (role === "admin") {
      return [
        { id: GROUP_ID, name: "المجموعة العامة (الطاقم)", group: true },
        ...teachers.map((t) => ({ id: t.id, name: t.name, group: false })),
      ];
    }
    return [
      { id: GROUP_ID, name: "المجموعة العامة (الطاقم)", group: true },
      { id: "admin", name: admin.name, group: false },
    ];
  }, [role, teachers]);

  const [chats, setChats] = useState<Record<string, Msg[]>>({});
  const [activeId, setActiveId] = useState<string>(GROUP_ID);
  const [text, setText] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { setChats(loadChats()); }, []);
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [chats, activeId]);

  // Thread key: group is shared; DM is sorted pair "a|b"
  const threadKey = (peerId: string) => {
    if (peerId === GROUP_ID) return GROUP_ID;
    const me = role === "admin" ? "admin" : (teachers.find((t) => t.name === ROLE_NAMES.teacher)?.id ?? "teacher-self");
    return [me, peerId].sort().join("|");
  };

  const activeKey = threadKey(activeId);
  const activeMessages = chats[activeKey] ?? [];

  const send = () => {
    const t = text.trim();
    if (!t) return;
    const me = role === "admin" ? { id: "admin", name: ROLE_NAMES.admin } : { id: "teacher-self", name: ROLE_NAMES.teacher };
    const msg: Msg = {
      id: Date.now(),
      from: me.id,
      fromName: me.name,
      text: t,
      time: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
    };
    const next = { ...chats, [activeKey]: [...(chats[activeKey] ?? []), msg] };
    setChats(next);
    saveChats(next);
    setText("");
  };

  const activeThread = threads.find((t) => t.id === activeId);

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      <header>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <MessagesSquare className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">دردشة الطاقم</h1>
            <p className="text-sm text-muted-foreground">قناة تواصل خاصة بين المدير والمعلمين فقط.</p>
          </div>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-4 min-h-[520px]">
        <Card className="md:col-span-1">
          <CardContent className="p-2">
            <div className="text-xs text-muted-foreground px-2 py-2">المحادثات</div>
            <ul className="space-y-1">
              {threads.map((t) => {
                const key = threadKey(t.id);
                const last = (chats[key] ?? []).at(-1);
                return (
                  <li key={t.id}>
                    <button
                      onClick={() => setActiveId(t.id)}
                      className={`w-full text-right p-2.5 rounded-lg flex items-center gap-3 transition-colors ${
                        activeId === t.id ? "bg-primary/10" : "hover:bg-muted"
                      }`}
                    >
                      <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${
                        t.group ? "bg-gold/20 text-gold-foreground" : "bg-primary/10 text-primary"
                      }`}>
                        {t.group ? <UsersIcon className="h-4 w-4" /> : t.name[0]}
                      </div>
                      <div className="flex-1 min-w-0 text-right">
                        <div className="font-semibold text-sm truncate">{t.name}</div>
                        <div className="text-[11px] text-muted-foreground truncate">
                          {last ? `${last.fromName}: ${last.text}` : "لا رسائل بعد"}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 flex flex-col">
          <CardContent className="p-0 flex flex-col h-full">
            <div className="border-b border-border p-4 flex items-center gap-2">
              <div className="font-semibold">{activeThread?.name}</div>
              {activeThread?.group && <Badge variant="outline">مجموعة</Badge>}
            </div>
            <div ref={listRef} className="flex-1 overflow-auto p-4 space-y-3 min-h-64">
              {activeMessages.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-10">لا رسائل بعد — ابدأ المحادثة.</div>
              )}
              {activeMessages.map((m) => {
                const mine = (role === "admin" && m.from === "admin") || (role === "teacher" && m.from === "teacher-self");
                return (
                  <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                      mine ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                    }`}>
                      {activeThread?.group && !mine && (
                        <div className="text-[10px] font-semibold opacity-80 mb-1">{m.fromName}</div>
                      )}
                      <div>{m.text}</div>
                      <div className={`text-[10px] mt-1 ${mine ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{m.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-border p-3 flex gap-2">
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") send(); }}
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