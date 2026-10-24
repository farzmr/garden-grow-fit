import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { CloudUpload, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth";
import { useSyncStatus } from "@/lib/sync";

/** Session-driven backup card: asks for sign in, or shows what's stored and signs out. */
export function AccountCard() {
  const status = useSyncStatus();
  const queryClient = useQueryClient();
  const nav = useNavigate();

  const leave = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await signOut();
    void nav({ to: "/auth", replace: true });
  };

  if (status.phase === "signed-out") {
    return null;
  }

  const at = status.at
    ? new Date(status.at).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
    : null;
  const detail =
    status.phase === "loading"
      ? "Loading what you saved…"
      : status.phase === "syncing"
        ? "Saving your changes…"
        : status.phase === "synced"
          ? at
            ? `Backed up at ${at}`
            : "Backed up"
          : (status.message ?? "Your backup couldn't be reached.");

  return (
    <section className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 font-semibold">
            <CloudUpload className="h-4 w-4 text-primary" />
            Your backup
          </h2>
          <p className="mt-1 break-words text-sm text-muted-foreground">{status.email}</p>
          <p className={"mt-2 text-xs " + (status.phase === "error" ? "text-destructive" : "text-muted-foreground")}>
            {detail}
          </p>
        </div>
        <Button variant="ghost" size="icon" aria-label="Sign out" onClick={() => void leave()}>
          <LogOut />
        </Button>
      </div>
    </section>
  );
}
