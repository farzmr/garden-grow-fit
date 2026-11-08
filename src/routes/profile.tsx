import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { usePostHog } from "posthog-js/react";
import { ArrowLeft, Check, Loader2, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { currentAccount, signOut, updateUserProfile, type AuthAccount } from "@/lib/auth";
import { useSyncStatus } from "@/lib/sync";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [{ title: "Your Profile — Bloom" }],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const nav = useNavigate();
  const posthog = usePostHog();
  const syncStatus = useSyncStatus();
  const [account, setAccount] = useState<AuthAccount | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    void currentAccount().then((acc) => {
      if (!alive) return;
      if (!acc) {
        void nav({ to: "/auth", replace: true });
        return;
      }
      setAccount(acc);
      setFirstName(acc.firstName ?? "");
      setLastName(acc.lastName ?? "");
    });
    return () => {
      alive = false;
    };
  }, [nav]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    const res = await updateUserProfile({ firstName, lastName });
    setSaving(false);
    if (res.error) {
      setError(res.error);
    } else {
      posthog?.capture?.("profile_updated");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      const updated = await currentAccount();
      if (updated) setAccount(updated);
    }
  };

  const handleSignOut = async () => {
    posthog?.capture?.("user_signed_out");
    await signOut();
    void nav({ to: "/auth", replace: true });
  };

  if (!account) {
    return <div className="min-h-screen" />;
  }

  const displayName = account.fullName || [firstName, lastName].filter(Boolean).join(" ") || "Gardener";

  return (
    <div className="mx-auto max-w-md space-y-6 px-5 pt-8">
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="icon" className="h-9 w-9">
          <Link to="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="font-display text-xl">Your Profile</h1>
        <div className="w-9" />
      </div>

      <div className="flex flex-col items-center gap-3 pt-2 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
          <User className="h-10 w-10" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">{displayName}</h2>
          <p className="text-sm text-muted-foreground">{account.email}</p>
        </div>
      </div>

      <form onSubmit={(e) => void handleSave(e)} className="space-y-4 rounded-2xl border border-border bg-card p-5">
        <h3 className="font-semibold">Personal details</h3>

        <label className="block text-sm text-muted-foreground">
          First name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
            className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-base text-foreground outline-none focus:border-primary"
          />
        </label>

        <label className="block text-sm text-muted-foreground">
          Last name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
            className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-base text-foreground outline-none focus:border-primary"
          />
        </label>

        {error && <p className="text-sm text-destructive">{error}</p>}
        {saved && (
          <p className="flex items-center gap-1.5 text-sm text-primary">
            <Check className="h-4 w-4" /> Name updated successfully
          </p>
        )}

        <Button type="submit" disabled={saving} className="h-11 w-full">
          {saving ? <Loader2 className="animate-spin" /> : "Save changes"}
        </Button>
      </form>

      <section className="space-y-3 rounded-2xl border border-border bg-card p-5">
        <h3 className="font-semibold">Connected account</h3>
        <div className="text-sm">
          <p className="text-muted-foreground">Signed in as</p>
          <p className="font-medium text-foreground">{account.email}</p>
        </div>
        {syncStatus.phase === "synced" && (
          <p className="text-xs text-muted-foreground">
            Garden backup is active and synced.
          </p>
        )}
      </section>

      <Button
        type="button"
        variant="outline"
        className="h-12 w-full gap-2 border-destructive/30 text-destructive hover:bg-destructive/10"
        onClick={() => void handleSignOut()}
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </Button>
    </div>
  );
}
