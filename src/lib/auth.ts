import { getSupabase } from "@/integrations/supabase/client";

export type AuthAccount = {
  id: string;
  email: string;
  firstName?: string | undefined;
  lastName?: string | undefined;
  fullName?: string | undefined;
};
export type AuthResult = { error: string | null; needsConfirmation?: boolean };

const OFFLINE = "This device can't reach your backup right now.";
const SKIPPED_KEY = "bloomfit_auth_skipped";

export function hasSkippedAuth(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(SKIPPED_KEY) === "true";
  } catch {
    return false;
  }
}

export function setSkippedAuth(skipped: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (skipped) {
      localStorage.setItem(SKIPPED_KEY, "true");
    } else {
      localStorage.removeItem(SKIPPED_KEY);
    }
  } catch {}
}

function accountOf(
  user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> } | null | undefined,
): AuthAccount | null {
  const email = user?.email;
  if (!user || !email) return null;
  const meta = user.user_metadata ?? {};
  const firstName =
    (typeof meta["first_name"] === "string" ? meta["first_name"] : undefined) ||
    (typeof meta["given_name"] === "string" ? meta["given_name"] : undefined) ||
    "";
  const lastName =
    (typeof meta["last_name"] === "string" ? meta["last_name"] : undefined) ||
    (typeof meta["family_name"] === "string" ? meta["family_name"] : undefined) ||
    "";
  let fullName =
    (typeof meta["full_name"] === "string" ? meta["full_name"] : undefined) ||
    (typeof meta["name"] === "string" ? meta["name"] : undefined) ||
    "";
  if (!fullName && (firstName || lastName)) {
    fullName = [firstName, lastName].filter(Boolean).join(" ");
  }
  const derivedFirstName = firstName || (fullName ? fullName.split(" ")[0] : undefined);
  const derivedLastName =
    lastName || (fullName && fullName.split(" ").length > 1 ? fullName.split(" ").slice(1).join(" ") : undefined);

  return {
    id: user.id,
    email,
    firstName: derivedFirstName,
    lastName: derivedLastName,
    fullName: fullName || (derivedFirstName ? [derivedFirstName, derivedLastName].filter(Boolean).join(" ") : undefined),
  };
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

export async function signInWithGoogle(): Promise<AuthResult> {
  const sb = getSupabase();
  if (!sb) return { error: OFFLINE };
  setSkippedAuth(false);
  const { error } = await sb.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/`,
    },
  });
  return { error: error ? messageOf(error, "We couldn't connect to Google.") : null };
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

export async function updateUserProfile(profile: { firstName: string; lastName: string }): Promise<AuthResult> {
  const sb = getSupabase();
  if (!sb) return { error: OFFLINE };
  const trimmedFirst = profile.firstName.trim();
  const trimmedLast = profile.lastName.trim();
  const fullName = [trimmedFirst, trimmedLast].filter(Boolean).join(" ");
  const { error } = await sb.auth.updateUser({
    data: {
      first_name: trimmedFirst,
      last_name: trimmedLast,
      full_name: fullName,
      name: fullName,
    },
  });
  return { error: error ? messageOf(error, "We couldn't update your name.") : null };
}

export async function signOut(): Promise<void> {
  setSkippedAuth(false);
  const sb = getSupabase();
  if (!sb) return;
  await sb.auth.signOut();
}
