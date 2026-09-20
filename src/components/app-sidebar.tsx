import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  BookOpenCheck,
  CalendarDays,
  ChevronDown,
  ClipboardCheck,
  FileText,
  Folder,
  GraduationCap,
  LayoutGrid,
  Mail,
  MessagesSquare,
  Receipt,
  ShieldCheck,
  Sparkles,
  Users,
  UsersRound,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import logo from "@/assets/madrasah-logo.png";
import { useRole, ROLE_NAMES, ROLE_SUBTITLES, type Role } from "@/lib/role-context";
import { PORTAL_BY_ROLE, SCHOOL_LATIN, SCHOOL_NAME } from "@/lib/portals";
import {
  TAWASUL_GROUPS,
  TAWASUL_MODULES,
  type TawasulGroup,
  type TawasulModule,
} from "@/lib/tawasul-modules";

type Item = { title: string; url: string; hash?: string; icon: typeof Users; roles: Role[] };
type Group = { label: string; items: Item[] };

const GROUPS: Group[] = [
  {
    label: "التدريس",
    items: [
      { title: "لوحة الموظف", url: "/", icon: LayoutGrid, roles: ["teacher"] },
      { title: "نظرة عامة", url: "/", icon: LayoutGrid, roles: ["admin"] },
      { title: "جدول الدوام", url: "/schedule", icon: CalendarDays, roles: ["teacher", "admin"] },
      { title: "الحضور والغياب", url: "/attendance", icon: ClipboardCheck, roles: ["teacher", "admin"] },
      { title: "سجل الدرجات", url: "/assignments", icon: BookOpenCheck, roles: ["teacher", "admin"] },
      { title: "مساعد التحضير", url: "/prep", icon: Sparkles, roles: ["teacher", "admin"] },
    ],
  },
  {
    label: "المدرسة",
    items: [
      { title: "الطلاب", url: "/students", icon: Users, roles: ["teacher", "admin"] },
      { title: "أولياء الأمور", url: "/parents", icon: UsersRound, roles: ["teacher", "admin"] },
      { title: "الرسائل", url: "/messages", icon: MessagesSquare, roles: ["teacher", "admin"] },
      { title: "الإشعارات", url: "/notifications", icon: Bell, roles: ["teacher", "admin"] },
    ],
  },
  {
    label: "الإدارة",
    items: [
      { title: "لوحة الإدارة", url: "/admin", icon: GraduationCap, roles: ["admin"] },
      { title: "الحسابات والفواتير", url: "/admin", hash: "billing", icon: Receipt, roles: ["admin"] },
      { title: "الأدوار", url: "/roles", icon: ShieldCheck, roles: ["admin"] },
      { title: "مصفوفة الصلاحيات", url: "/permissions", icon: ShieldCheck, roles: ["admin"] },
      { title: "التواصل مع الإدارة", url: "/admin-contact", icon: Mail, roles: ["admin"] },
    ],
  },
];

function SystemModuleMenu({ module, pathname, onNavigate }: {
  module: TawasulModule;
  pathname: string;
  onNavigate: () => void;
}) {
  const modulePath = `/m/${module.slug}`;
  const isActive = pathname === modulePath || pathname.startsWith(`${modulePath}/`);
  const [open, setOpen] = useState(isActive);

  useEffect(() => {
    if (isActive) setOpen(true);
  }, [isActive]);

  return (
    <SidebarMenuSubItem>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            size="sm"
            isActive={pathname === modulePath}
            tooltip={module.title}
            className="h-8 rounded-xl"
          >
            <Folder className="h-3.5 w-3.5" />
            <span className="flex-1 truncate text-right">{module.title}</span>
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="mr-3 ml-0 border-r border-l-0 pr-2.5 pl-0">
            <SidebarMenuSubItem>
              <SidebarMenuSubButton asChild size="sm" isActive={pathname === modulePath}>
                <Link to="/m/$module" params={{ module: module.slug }} onClick={onNavigate}>
                  <LayoutGrid className="h-3.5 w-3.5" />
                  <span>نظرة عامة</span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
            {module.pages.map((page) => {
              const pagePath = `${modulePath}/${page.slug}`;
              return (
                <SidebarMenuSubItem key={page.slug}>
                  <SidebarMenuSubButton asChild size="sm" isActive={pathname === pagePath}>
                    <Link
                      to="/m/$module/$page"
                      params={{ module: module.slug, page: page.slug }}
                      onClick={onNavigate}
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span>{page.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuSubItem>
  );
}

function SystemGroupMenu({ group, pathname, onNavigate }: {
  group: { key: TawasulGroup; title: string };
  pathname: string;
  onNavigate: () => void;
}) {
  const modules = TAWASUL_MODULES.filter((module) => module.group === group.key);
  const isActive = modules.some((module) => pathname.startsWith(`/m/${module.slug}`));
  const [open, setOpen] = useState(isActive);

  useEffect(() => {
    if (isActive) setOpen(true);
  }, [isActive]);

  return (
    <SidebarMenuItem>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={group.title} className="rounded-full">
            <Folder className="h-4 w-4" />
            <span className="flex-1 text-right font-bold">{group.title}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="mr-3 ml-0 border-r border-l-0 pr-2.5 pl-0">
            {modules.map((module) => (
              <SystemModuleMenu
                key={module.slug}
                module={module}
                pathname={pathname}
                onNavigate={onNavigate}
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  const { state, isMobile, setOpenMobile } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const currentHash = useRouterState({ select: (r) => r.location.hash });
  const { role } = useRole();

  const isActive = (p: string, hash?: string) => {
    if (hash) return pathname === p && currentHash === hash;
    if (p === "/admin") return pathname === "/admin" && !currentHash;
    return p === "/" ? pathname === "/" : pathname.startsWith(p);
  };

  const groups = GROUPS.map((g) => ({
    ...g,
    items: g.items.filter((i) => i.roles.includes(role)),
  })).filter((g) => g.items.length > 0);
  const closeOnMobile = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar collapsible="icon" side="right">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gold">
            <img src={logo} alt={SCHOOL_NAME} className="h-full w-full object-contain" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="font-extrabold leading-tight text-sidebar-foreground">{SCHOOL_NAME}</div>
              <div className="truncate text-[10px] tracking-[0.2em] text-sidebar-foreground/60">
                {SCHOOL_LATIN}
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-[11px] tracking-[0.2em] text-sidebar-foreground/50">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const key = `${item.url}${item.hash ?? ""}`;
                  const active = isActive(item.url, item.hash);
                  return (
                    <SidebarMenuItem key={key}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.title}
                        className={
                          active
                            ? "rounded-full bg-gold font-bold text-gold-foreground hover:bg-gold hover:text-gold-foreground"
                            : "rounded-full"
                        }
                      >
                        <Link
                          to={item.url}
                          hash={item.hash}
                          className="flex items-center gap-3"
                           onClick={closeOnMobile}
                        >
                          <item.icon className="h-4 w-4 shrink-0" />
                          {!collapsed && <span className="flex-1">{item.title}</span>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        {role === "admin" && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-[11px] tracking-[0.2em] text-sidebar-foreground/50">
              أقسام النظام
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/m" || pathname === "/m/"}
                    tooltip="فهرس أقسام النظام"
                    className={
                      pathname === "/m" || pathname === "/m/"
                        ? "rounded-full bg-gold font-bold text-gold-foreground hover:bg-gold hover:text-gold-foreground"
                        : "rounded-full"
                    }
                  >
                    <Link to="/m" onClick={closeOnMobile}>
                      <LayoutGrid className="h-4 w-4" />
                      {!collapsed && <span>جميع الأقسام</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {!collapsed && TAWASUL_GROUPS.map((group) => (
                  <SystemGroupMenu
                    key={group.key}
                    group={group}
                    pathname={pathname}
                    onNavigate={closeOnMobile}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {!collapsed && (
        <SidebarFooter className="p-3">
          <div className="rounded-2xl bg-sidebar-accent p-3 text-sidebar-accent-foreground">
            <div className="text-xs font-bold">{ROLE_NAMES[role]}</div>
            <div className="mt-0.5 text-[11px] text-sidebar-foreground/70">{ROLE_SUBTITLES[role]}</div>
            <div className="mt-2 text-[11px] font-semibold text-sidebar-primary">
              {PORTAL_BY_ROLE[role].title}
            </div>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
