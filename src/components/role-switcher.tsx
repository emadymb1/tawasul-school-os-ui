import { useNavigate } from "@tanstack/react-router";
import { useRole, type Role } from "@/lib/role-context";
import { PORTALS, PORTAL_BY_ROLE } from "@/lib/portals";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function RoleSwitcher() {
  const { role, setRole } = useRole();
  const navigate = useNavigate();
  const handlePick = (r: Role) => {
    setRole(r);
    navigate({ to: "/", replace: true });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition-opacity hover:opacity-90"
        >
          {PORTAL_BY_ROLE[role].title}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-2xl">
        <DropdownMenuLabel>تبديل البوابة</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {PORTALS.map((p) => (
          <DropdownMenuItem
            key={p.role}
            onClick={() => handlePick(p.role)}
            className={p.role === role ? "font-bold" : ""}
          >
            {p.title}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate({ to: "/welcome" })}>
          تسجيل الدخول
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
