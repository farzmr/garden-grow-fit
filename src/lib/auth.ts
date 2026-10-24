import { getSupabase } from "@/integrations/supabase/client";

export type AuthAccount = { id: string; email: string };
export type AuthResult = { error: string | null; needsConfirmation?: boolean };

const OFFLINE = "This device can't reach your backup right now.";

function accountOf(user: { id: string; email?: string | null } | null | undefined): AuthAccount | null {
  const email = user?.email;
  return user && email ? { id: user.id, email } : null;
}

function messageOf(error: unknown, fallback: string): string {
  if (error && typeof error === "object" && "message" in error) {
    const text = (error as { message?: unknown }).message;
    if (typeof text === "string" && text) return text;
  }
  return fallback;
}

/** One shared listener for sign-in / sign-out transitions. */
export function onAccountChange(listener: (account: AuthAccount | null) => void): () => void {
  const sb = getSupabase();
  if (!sb) return () => {};
  const { data } = sb.auth.onAuthStateChange((_event, session) => {
    listener(accountOf(session?.user));
  });
  return () => data.subscription.unsubscribe();
}

export async function currentAccount(): Promise<AuthAccount | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb.auth.getSession();
  if (error) return null;
  return accountOf(data.session?.user);
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  const sb = getSupabase();
  if (!sb) return { error: OFFLINE };
  const { error } = await sb.auth.signInWithPassword({ email: email.trim(), password });
  return { error: error ? messageOf(error, "We couldn't sign you in.") : null };
}

export async function createAccount(email: string, password: string): Promise<AuthResult> {
  const sb = getSupabase();
  if (!sb) return { error: OFFLINE };
  const { data, error } = await sb.auth.signUp({
    email: email.trim(),
    password,
    options: { emailRedirectTo: window.location.origin },
  });
  if (error) return { error: messageOf(error, "We couldn't create your account.") };
  // With email confirmation on, signUp returns no session — she must click the link first.
  return { error: null, needsConfirmation: !data.session };
}

export async function sendPasswordReset(email: string): Promise<AuthResult> {
  const sb = getSupabase();
  if (!sb) return { error: OFFLINE };
  const { error } = await sb.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  return { error: error ? messageOf(error, "We couldn't send a reset link.") : null };
}

export async function updatePassword(password: string): Promise<AuthResult> {
  const sb = getSupabase();
  if (!sb) return { error: OFFLINE };
  const { error } = await sb.auth.updateUser({ password });
  return { error: error ? messageOf(error, "We couldn't set your new password.") : null };
}

export async function signOut(): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  await sb.auth.signOut();
}
