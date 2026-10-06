import { Link } from "@tanstack/react-router";
import { Flower2, ClipboardList, History, Play, Dumbbell } from "lucide-react";

const tabs = [
  { to: "/", label: "Garden", icon: Flower2 },
  { to: "/start", label: "Start", icon: Play },
  { to: "/plan", label: "Plans", icon: ClipboardList },
  { to: "/history", label: "History", icon: History },
  { to: "/exercises", label: "Exercises", icon: Dumbbell },
] as const;

export function TabBar() {
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
