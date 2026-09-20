import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import {
  Bell,
  BookOpenCheck,
  CalendarDays,
  ClipboardCheck,
  LayoutGrid,
  Receipt,
  Users,
} from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { PortalBottomNav, type BottomNavItem } from "@/components/portal-bottom-nav";
import logo from "@/assets/madrasah-logo.png";
import { RoleProvider, useRole } from "@/lib/role-context";
import { PORTAL_BY_ROLE, SCHOOL_LATIN, SCHOOL_NAME } from "@/lib/portals";
import { RoleSwitcher } from "@/components/role-switcher";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">الصفحة غير موجودة</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          تعذّر تحميل الصفحة
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          حدث خطأ ما. يمكنك المحاولة مرة أخرى أو العودة للرئيسية.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            إعادة المحاولة
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            الرئيسية
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "لوحة التحكم — مدرسة الرابطة الإسلامية في فنلندا" },
      {
        name: "description",
        content:
          "نظرة عامة على اليوم الدراسي: الحضور، الواجبات المستحقة، وتقدم الحفظ والتلاوة.",
      },
      { name: "author", content: "مدرسة الرابطة الإسلامية في فنلندا" },
      { property: "og:title", content: "لوحة التحكم — مدرسة الرابطة الإسلامية في فنلندا" },
      {
        property: "og:description",
        content: "نظرة عامة على اليوم الدراسي: الحضور، الواجبات المستحقة، وتقدم الحفظ والتلاوة.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "لوحة التحكم — مدرسة الرابطة الإسلامية في فنلندا" },
      { name: "twitter:description", content: "نظرة عامة على اليوم الدراسي: الحضور، الواجبات المستحقة، وتقدم الحفظ والتلاوة." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/ab6e072b-bf69-41cb-be83-73e574aa19e1/id-preview-9e9a31c2--047ed3c7-0da0-4c10-a8f6-2d30baf14263.lovable.app-1784851981326.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/ab6e072b-bf69-41cb-be83-73e574aa19e1/id-preview-9e9a31c2--047ed3c7-0da0-4c10-a8f6-2d30baf14263.lovable.app-1784851981326.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cairo:wght@500;600;700;800&family=Tajawal:wght@400;500;700&display=swap",
      },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <RoleProvider>
        <AppShell />
      </RoleProvider>
    </QueryClientProvider>
  );
}

const STUDENT_NAV: BottomNavItem[] = [
  { label: "الرئيسية", to: "/", icon: LayoutGrid },
  { label: "جدولي", to: "/schedule", icon: CalendarDays },
  { label: "واجباتي", to: "/assignments", icon: BookOpenCheck },
  { label: "حضوري", to: "/attendance", icon: ClipboardCheck },
];

const PARENT_NAV: BottomNavItem[] = [
  { label: "الرئيسية", to: "/", icon: LayoutGrid },
  { label: "أبنائي", to: "/children", icon: Users },
  { label: "الفواتير", to: "/billing", icon: Receipt },
  { label: "الإشعارات", to: "/notifications", icon: Bell },
];

function BrandLockup() {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-primary">
        <img src={logo} alt={SCHOOL_NAME} className="h-full w-full object-contain" />
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-extrabold text-foreground">{SCHOOL_NAME}</span>
        <span className="block text-[10px] tracking-[0.2em] text-muted-foreground">
          {SCHOOL_LATIN}
        </span>
      </span>
    </div>
  );
}

function SampleBanner() {
  return (
    <div className="bg-accent px-4 py-2 text-center text-xs font-semibold text-accent-foreground">
      بيانات تجريبية — يمكنك التنقل بين البوابات من زر الدور.
    </div>
  );
}

function AppShell() {
  const { role } = useRole();
  const portal = PORTAL_BY_ROLE[role];
  const isCompact = role === "student" || role === "parent";

  if (isCompact) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-background">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur">
          <BrandLockup />
          <div className="mr-auto flex items-center gap-2">
            <RoleSwitcher />
          </div>
        </header>
        <SampleBanner />
        <main className="flex-1 p-4 pb-6">
          <Outlet />
        </main>
        <PortalBottomNav items={role === "student" ? STUDENT_NAV : PARENT_NAV} />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur">
            <SidebarTrigger />
            <div className="leading-tight">
              <div className="text-[10px] font-semibold tracking-[0.2em] text-muted-foreground">
                {portal.latin}
              </div>
              <div className="text-base font-extrabold text-foreground">{portal.title}</div>
            </div>
            <div className="mr-auto flex items-center gap-2">
              <RoleSwitcher />
            </div>
          </header>
          <SampleBanner />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
