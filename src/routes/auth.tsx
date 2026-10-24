import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, CloudUpload, KeyRound, Loader2, LogOut, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  createAccount,
  currentAccount,
  sendPasswordReset,
  signIn,
  signOut,
  type AuthAccount,
} from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Bloom" },
      {
        name: "description",
        content: "Sign in so your garden, plans and workouts are kept in your own account.",
      },
      { property: "og:title", content: "Sign in — Bloom" },
      {
        property: "og:description",
        content: "Your workouts, plans and garden, stored safely so a new phone can pick them up.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Auth,
});

type Note = { kind: "error" | "ok"; text: string };

function Auth() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [note, setNote] = useState<Note | null>(null);
  const [busy, setBusy] = useState(false);
  const [signedIn, setSignedIn] = useState<AuthAccount | null>(null);

  useEffect(() => {
    let alive = true;
    void currentAccount().then((account) => {
      if (alive) setSignedIn(account);
    });
    return () => {
      alive = false;
    };
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < 6) {
      setNote({ kind: "error", text: "Use at least 6 characters for your password." });
      return;
    }
    setBusy(true);
    setNote(null);
    const result = mode === "in" ? await signIn(email, password) : await createAccount(email, password);
    setBusy(false);
    if (result.error) {
      setNote({ kind: "error", text: result.error });
      return;
    }
    if (result.needsConfirmation) {
      setMode("in");
      setNote({ kind: "ok", text: "Almost there — open the email we just sent to confirm your address, then sign in." });
      return;
    }
    void nav({ to: "/" });
  };

  const remind = async () => {
    setNote(null);
    const result = await sendPasswordReset(email);
    setNote(
      result.error
        ? { kind: "error", text: result.error }
        : { kind: "ok", text: "If that address has an account, a reset link is on its way." },
    );
  };

  if (signedIn) {
    return (
      <div className="mx-auto max-w-md space-y-5 px-5 pt-10">
        <h1 className="font-display text-4xl">You're signed in</h1>
        <p className="break-words text-sm text-muted-foreground">
          Your garden is being kept in <span className="font-semibold text-foreground">{signedIn.email}</span>.
        </p>
        <Button asChild className="h-12 w-full">
          <Link to="/">
            Back to your garden
            <ArrowRight />
          </Link>
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={async () => {
            await signOut();
            setSignedIn(null);
          }}
        >
          <LogOut />
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md space-y-5 px-5 pt-10">
      <div>
        <p className="text-sm text-muted-foreground">Your backup</p>
        <h1 className="font-display text-4xl">{mode === "in" ? "Welcome back" : "Create your account"}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "in"
            ? "Sign in to load the garden, plans and workouts you saved."
            : "Your workouts, plans and garden are kept in your own account, private to you."}
        </p>
      </div>

      <form className="space-y-4" onSubmit={(e) => void submit(e)}>
        <label className="block text-sm text-muted-foreground">
          Email
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-input bg-card px-3 py-3 text-base text-foreground outline-none focus:border-primary"
          />
        </label>
        <label className="block text-sm text-muted-foreground">
          Password
          <input
            type="password"
            required
            autoComplete={mode === "in" ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          {busy ? <Loader2 className="animate-spin" /> : mode === "in" ? <KeyRound /> : <CloudUpload />}
          {busy ? "One moment…" : mode === "in" ? "Sign in" : "Create account"}
        </Button>
      </form>

      <div className="space-y-2">
        {mode === "in" && (
          <Button variant="ghost" className="w-full" onClick={() => void remind()} disabled={!email.trim()}>
            <MailCheck />
            Email me a new password
          </Button>
        )}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            setNote(null);
            setMode(mode === "in" ? "up" : "in");
          }}
        >
          {mode === "in" ? "I need a new account" : "I already have an account"}
        </Button>
        <Button asChild variant="ghost" className="w-full">
          <Link to="/">Keep training without an account</Link>
        </Button>
      </div>
    </div>
  );
}
