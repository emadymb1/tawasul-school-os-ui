import { createFileRoute } from "@tanstack/react-router";
import { Eye, EyeOff, LockKeyhole, UserRound } from "lucide-react";
import { type FormEvent, useState } from "react";
import logo from "@/assets/madrasah-logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SCHOOL_LATIN, SCHOOL_NAME } from "@/lib/portals";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: `تسجيل الدخول — ${SCHOOL_NAME}` },
      {
        name: "description",
        content: "صفحة الدخول الموحدة إلى بوابات المدير والموظف والطالب وولي الأمر.",
      },
      { property: "og:title", content: `تسجيل الدخول — ${SCHOOL_NAME}` },
      {
        property: "og:description",
        content: "سجّل الدخول بحساب المدرسة للوصول إلى بوابتك.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignInPage,
});

function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setNotice("واجهة تسجيل الدخول جاهزة، وسيتم تفعيل الدخول عند ربط خادم المدرسة.");
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden bg-primary px-6 pb-12 pt-8 text-primary-foreground sm:px-10 sm:pb-16 sm:pt-10">
        <div className="pointer-events-none absolute -left-24 -top-24 h-52 w-52 rounded-full bg-coral/80" />
        <div className="pointer-events-none absolute -bottom-16 right-[12%] h-32 w-32 rounded-full bg-gold" />

        <div className="relative z-10 mx-auto max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-card">
              <img src={logo} alt={SCHOOL_NAME} className="h-full w-full object-contain" />
            </span>
            <div className="min-w-0 leading-tight">
              <div className="text-xl font-extrabold sm:text-2xl">{SCHOOL_NAME}</div>
              <div className="mt-1 truncate text-[10px] text-primary-foreground/65">
                {SCHOOL_LATIN}
              </div>
            </div>
          </div>

          <h1 className="mt-10 max-w-xl text-4xl font-extrabold leading-tight sm:text-5xl">
            مساحة واحدة هادئة لكل المدرسة.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-8 text-primary-foreground/75 sm:text-lg">
            الجداول، الحضور، الدرجات والإشعارات — ادخل بحساب المدرسة الذي تم تزويدك به.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-3xl px-6 py-9 sm:px-10 sm:py-12">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">تسجيل الدخول</h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground sm:text-base">
              استخدم اسم المستخدم وكلمة المرور الخاصة بحسابك المدرسي.
            </p>
          </div>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-border bg-card text-lg font-extrabold text-primary">
            ع
          </span>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-bold text-foreground">
              اسم المستخدم أو البريد الإلكتروني
            </label>
            <div className="relative">
              <UserRound className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                maxLength={255}
                placeholder="أدخل اسم المستخدم أو البريد الإلكتروني"
                className="h-14 bg-card pr-12 text-base"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-bold text-foreground">
              كلمة المرور
            </label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                minLength={6}
                maxLength={128}
                placeholder="أدخل كلمة المرور"
                className="h-14 bg-card px-12 text-base"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                title={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 text-sm">
            <label className="flex cursor-pointer items-center gap-2 font-medium text-foreground">
              <input type="checkbox" name="remember" className="h-4 w-4 accent-primary" />
              تذكّرني
            </label>
            <span className="font-semibold text-muted-foreground">نسيت كلمة المرور؟</span>
          </div>

          <Button type="submit" size="lg" className="h-14 w-full text-base font-bold">
            تسجيل الدخول
          </Button>

          {notice ? (
            <p role="status" className="rounded-2xl bg-accent px-4 py-3 text-center text-sm font-semibold leading-6 text-accent-foreground">
              {notice}
            </p>
          ) : null}
        </form>

        <p className="mt-6 rounded-2xl bg-secondary px-4 py-4 text-center text-sm font-semibold leading-6 text-secondary-foreground">
          استخدم بيانات حسابك الحالية في نظام المدرسة. سيتم تفعيل الاتصال عند ربط الخادم.
        </p>
      </main>
    </div>
  );
}