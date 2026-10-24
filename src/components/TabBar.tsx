import { Link, useRouterState } from "@tanstack/react-router";
import { House, ClipboardList, History, Trees, Dumbbell } from "lucide-react";

const tabs = [
  { to: "/gardens", label: "Gardens", icon: Trees },
  { to: "/plan", label: "Plans", icon: ClipboardList },
  { to: "/", label: "Home", icon: House },
  { to: "/history", label: "History", icon: History },
  { to: "/exercises", label: "Exercises", icon: Dumbbell },
] as const;

export function TabBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (pathname === "/auth" || pathname === "/reset-password") {
    return null;
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-md border-t border-border bg-card/90 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <div className="grid grid-cols-5">
        {tabs.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: true }}
            className="flex flex-col items-center gap-1 py-3 text-xs text-muted-foreground"
            activeProps={{ className: "text-primary font-semibold" }}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
