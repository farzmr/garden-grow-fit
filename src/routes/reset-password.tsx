import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { currentAccount, updatePassword } from "@/lib/auth";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Choose a new password — Bloom" },
      {
        name: "description",
        content: "Set a new password for your Bloom account.",
      },
      { property: "og:title", content: "Choose a new password — Bloom" },
      {
        property: "og:description",
        content: "Set a new password so you can get back to your garden.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const nav = useNavigate();
  const [ready, setReady] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [again, setAgain] = useState("");
  const [note, setNote] = useState<{ kind: "error" | "ok"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    void currentAccount().then((account) => {
      if (alive) setReady(Boolean(account));
    });
    return () => {
      alive = false;
    };
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < 6) {
      setNote({ kind: "error", text: "Use at least 6 characters." });
      return;
    }
    if (password !== again) {
      setNote({ kind: "error", text: "The two passwords don't match." });
      return;
    }
    setBusy(true);
    setNote(null);
    const result = await updatePassword(password);
    setBusy(false);
    if (result.error) {
      setNote({ kind: "error", text: result.error });
      return;
    }
    setNote({ kind: "ok", text: "Your new password is set. Opening your garden…" });
    setTimeout(() => void nav({ to: "/" }), 1200);
  };

  if (ready === null) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-5">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="mx-auto max-w-md space-y-5 px-5 pt-10">
        <h1 className="font-display text-4xl">Open your email</h1>
        <p className="text-sm text-muted-foreground">
          This page needs the reset link from your inbox. Tap the link in the email we sent, then come back here.
        </p>
        <Button asChild className="h-12 w-full">
          <Link to="/auth">
            Back to sign in
            <ArrowRight />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md space-y-5 px-5 pt-10">
      <div>
        <p className="text-sm text-muted-foreground">One last step</p>
        <h1 className="font-display text-4xl">New password</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose a password you'll remember — you'll use it to sign in on any phone.
        </p>
      </div>
      <form className="space-y-4" onSubmit={(e) => void submit(e)}>
        <label className="block text-sm text-muted-foreground">
          New password
          <input
            type="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border border-input bg-card px-3 py-3 text-base text-foreground outline-none focus:border-primary"
          />
        </label>
        <label className="block text-sm text-muted-foreground">
          Confirm password
          <input
            type="password"
            required
            autoComplete="new-password"
            value={again}
            onChange={(e) => setAgain(e.target.value)}
            className="mt-1 w-full rounded-xl border border-input bg-card px-3 py-3 text-base text-foreground outline-none focus:border-primary"
          />
        </label>
        {note && (
          <p
            className={
              "rounded-xl px-3 py-3 text-sm " +
              (note.kind === "error" ? "bg-destructive/10 text-destructive" : "bg-accent text-accent-foreground")
            }
          >
            {note.text}
          </p>
        )}
        <Button type="submit" disabled={busy} className="h-12 w-full text-base">
          {busy ? <Loader2 className="animate-spin" /> : <ShieldCheck />}
          {busy ? "Saving…" : "Set my password"}
        </Button>
      </form>
    </div>
  );
}
