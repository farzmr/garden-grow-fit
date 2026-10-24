import { useSyncExternalStore } from "react";

import { onAccountChange, type AuthAccount } from "@/lib/auth";
import { getSupabase } from "@/integrations/supabase/client";
import {
  applyRemoteState,
  readState,
  subscribeStore,
  uid,
  type Exercise,
  type GardenId,
  type PlanItem,
  type Session,
  type SetEntry,
  type State,
  type WorkoutPlan,
} from "@/lib/store";

const PUSH_DELAY = 900;
const GARDEN_IDS: string[] = ["wild-meadow", "moon-orchard", "glasshouse"];

type SessionRow = {
  id: string;
  date: string;
  activity: string;
  minutes: number | null;
  completed_at: string | null;
  flower: string;
  exercises: unknown;
  plan_id: string | null;
  plan_name: string | null;
};
type PlanRow = { id: string; name: string; difficulty: string; items: unknown; position: number };
type ActiveRow = {
  exercises: unknown;
  started_at: string | null;
  flower: string | null;
  plan_id: string | null;
  plan_name: string | null;
};
export type ServerData = {
  flower: string | null;
  mainGarden: GardenId | null;
  sessions: Session[];
  plans: WorkoutPlan[];
  active: ActiveRow | null;
};

/* ---------------------------------- status --------------------------------- */

export type SyncPhase = "signed-out" | "loading" | "syncing" | "synced" | "error";
export type SyncStatus = { phase: SyncPhase; email: string | null; at: number | null; message: string | null };

const SIGNED_OUT: SyncStatus = { phase: "signed-out", email: null, at: null, message: null };

let status: SyncStatus = SIGNED_OUT;
const statusListeners = new Set<(next: SyncStatus) => void>();

export function getSyncStatus(): SyncStatus {
  return status;
}

export function subscribeSyncStatus(listener: (next: SyncStatus) => void): () => void {
  statusListeners.add(listener);
  return () => {
    statusListeners.delete(listener);
  };
}

function setStatus(patch: Partial<SyncStatus>) {
  status = { ...status, ...patch };
  statusListeners.forEach((l) => l(status));
}

export function useSyncStatus(): SyncStatus {
  return useSyncExternalStore(subscribeSyncStatus, getSyncStatus, () => SIGNED_OUT);
}

/* ------------------------------ value parsing ------------------------------ */

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const num = (value: unknown, fallback = 0) =>
  typeof value === "number" && Number.isFinite(value)
    ? value
    : typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))
      ? Number(value)
      : fallback;

const str = (value: unknown, fallback = "") => (typeof value === "string" ? value : fallback);

const gardenOf = (value: unknown): GardenId | null =>
  typeof value === "string" && GARDEN_IDS.includes(value) ? (value as GardenId) : null;

function messageOf(error: unknown, fallback: string): string {
  if (error && typeof error === "object" && "message" in error) {
    const text = (error as { message?: unknown }).message;
    if (typeof text === "string" && text) return text;
  }
  return fallback;
}

export function parseSets(value: unknown): SetEntry[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(isRecord)
    .map((set) => ({ weight: num(set["weight"]), reps: num(set["reps"]), done: set["done"] === true }));
}

export function parseExercises(value: unknown): Exercise[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(isRecord)
    .map((ex) => ({ id: str(ex["id"]) || uid(), name: str(ex["name"]), sets: parseSets(ex["sets"]) }))
    .filter((ex) => ex.name !== "");
}

export function parsePlanItems(value: unknown): PlanItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(isRecord)
    .map((item) => ({
      name: str(item["name"]),
      sets: Math.max(1, Math.round(num(item["sets"], 3))),
      reps: Math.max(1, Math.round(num(item["reps"], 10))),
      weight: Math.max(0, num(item["weight"])),
    }))
    .filter((item) => item.name !== "");
}

/* -------------------------------- mapping --------------------------------- */

export function sessionRow(session: Session, userId: string) {
  return {
    id: session.id,
    user_id: userId,
    date: session.date,
    activity: session.activity,
    minutes: session.minutes ?? null,
    completed_at: session.completedAt ?? null,
    flower: session.flower,
    exercises: session.exercises,
    plan_id: session.planId ?? null,
    plan_name: session.planName ?? null,
  };
}

export function sessionFromRow(row: SessionRow): Session {
  const session: Session = {
    id: row.id,
    date: row.date,
    activity: row.activity,
    minutes: row.minutes ?? undefined,
    exercises: parseExercises(row.exercises),
    flower: row.flower || "🌷",
    planId: row.plan_id ?? undefined,
    planName: row.plan_name ?? undefined,
  };
  if (row.completed_at) session.completedAt = row.completed_at;
  return session;
}

export function planRow(plan: WorkoutPlan, userId: string, position: number) {
  return {
    id: plan.id,
    user_id: userId,
    name: plan.name,
    difficulty: plan.difficulty ?? "Beginner",
    items: plan.items,
    position,
  };
}

export function planFromRow(row: PlanRow): WorkoutPlan {
  const difficulty = row.difficulty === "Advanced" || row.difficulty === "Beginner" ? row.difficulty : "Intermediate";
  return { id: row.id, name: row.name, items: parsePlanItems(row.items), difficulty };
}

export function isEmptyServer(data: Pick<ServerData, "sessions" | "plans" | "active">): boolean {
  return data.sessions.length === 0 && data.plans.length === 0 && !data.active;
}

/** Local samples stay device-only; everything else the server holds wins. */
export function mergeRemote(local: State, remote: ServerData): State {
  const samples = local.sessions.filter((s) => s.sample);
  const active = remote.active;
  return {
    ...local,
    flower: remote.flower || local.flower,
    mainGarden: remote.mainGarden ?? local.mainGarden,
    sessions: [...samples, ...remote.sessions],
    plans: remote.plans,
    active: active ? parseExercises(active.exercises) : null,
    activeStartedAt: active?.started_at ?? undefined,
    activeFlower: active?.flower ?? undefined,
    activePlanId: active?.plan_id ?? undefined,
    activePlanName: active?.plan_name ?? undefined,
  };
}

/* -------------------------------- fetching -------------------------------- */

async function fetchServer(account: AuthAccount): Promise<{ data: ServerData } | { error: string }> {
  const sb = getSupabase();
  if (!sb) return { error: "This device can't reach your backup right now." };

  const [profile, plans, sessions, active] = await Promise.all([
    sb.from("profiles").select("flower, main_garden").eq("id", account.id).maybeSingle(),
    sb
      .from("plans")
      .select("id, name, difficulty, items, position")
      .eq("user_id", account.id)
      .order("position", { ascending: true }),
    sb
      .from("sessions")
      .select("id, date, activity, minutes, completed_at, flower, exercises, plan_id, plan_name")
      .eq("user_id", account.id)
      .order("date", { ascending: true })
      .order("completed_at", { ascending: true }),
    sb
      .from("active_workouts")
      .select("exercises, started_at, flower, plan_id, plan_name")
      .eq("user_id", account.id)
      .maybeSingle(),
  ]);

  const failure = profile.error ?? plans.error ?? sessions.error ?? active.error;
  if (failure) return { error: messageOf(failure, "Your backup couldn't be reached.") };

  return {
    data: {
      flower: typeof profile.data?.flower === "string" ? profile.data.flower : null,
      mainGarden: gardenOf(profile.data?.main_garden),
      sessions: (sessions.data ?? []).map((row) => sessionFromRow(row as SessionRow)),
      plans: (plans.data ?? []).map((row) => planFromRow(row as PlanRow)),
      active: (active.data ?? null) as ActiveRow | null,
    },
  };
}

/* -------------------------------- pushing --------------------------------- */

async function removeMissing(
  table: "sessions" | "plans",
  keepIds: string[],
  userId: string,
): Promise<{ error: unknown }> {
  const sb = getSupabase();
  if (!sb) return { error: null };
  const { data, error } = await sb.from(table).select("id").eq("user_id", userId);
  if (error) return { error };
  const keep = new Set(keepIds);
  const stale = (data ?? [])
    .map((row) => (row as { id: string }).id)
    .filter((id) => !keep.has(id));
  if (!stale.length) return { error: null };
  const deleted = await sb.from(table).delete().eq("user_id", userId).in("id", stale);
  return { error: deleted.error ?? null };
}

async function push(account: AuthAccount, state: State): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) {
    setStatus({ phase: "error", message: "This device can't reach your backup right now." });
    return false;
  }
  setStatus({ phase: "syncing", email: account.email, message: null });

  const personal = state.sessions.filter((s) => !s.sample);
  const results = await Promise.all([
    personal.length
      ? sb.from("sessions").upsert(personal.map((s) => sessionRow(s, account.id)), { onConflict: "id" })
      : Promise.resolve({ error: null }),
    removeMissing("sessions", personal.map((s) => s.id), account.id),
    state.plans.length
      ? sb.from("plans").upsert(state.plans.map((plan, i) => planRow(plan, account.id, i)), { onConflict: "id" })
      : Promise.resolve({ error: null }),
    removeMissing("plans", state.plans.map((plan) => plan.id), account.id),
    sb
      .from("profiles")
      .upsert({ id: account.id, flower: state.flower, main_garden: state.mainGarden }, { onConflict: "id" }),
    state.active === null
      ? sb.from("active_workouts").delete().eq("user_id", account.id)
      : sb.from("active_workouts").upsert(
          {
            user_id: account.id,
            exercises: state.active,
            started_at: state.activeStartedAt ?? null,
            flower: state.activeFlower ?? null,
            plan_id: state.activePlanId ?? null,
            plan_name: state.activePlanName ?? null,
          },
          { onConflict: "user_id" },
        ),
  ]);

  const failed = results.find((result) => result && "error" in result && result.error);
  if (failed) {
    setStatus({
      phase: "error",
      message: messageOf((failed as { error: unknown }).error, "Your changes couldn't be saved to the backup."),
    });
    return false;
  }
  setStatus({ phase: "synced", at: Date.now(), message: null });
  return true;
}

/* --------------------------------- driver --------------------------------- */

let account: AuthAccount | null = null;
let baseline: string | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;
let pulling = false;

async function adopt(target: AuthAccount) {
  if (pulling) return;
  pulling = true;
  setStatus({ phase: "loading", email: target.email, message: null });
  const result = await fetchServer(target);
  pulling = false;
  if ("error" in result) {
    setStatus({ phase: "error", message: result.error });
    return;
  }
  const local = readState();
  if (isEmptyServer(result.data)) {
    // Nothing stored yet: keep this device's records and upload them as the first backup.
    baseline = JSON.stringify(local);
    await push(target, local);
    return;
  }
  const next = mergeRemote(local, result.data);
  applyRemoteState(next);
  baseline = JSON.stringify(next);
  setStatus({ phase: "synced", at: Date.now(), message: null });
}

function schedulePush() {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    timer = null;
    void pushAndRemember();
  }, PUSH_DELAY);
}

async function pushAndRemember() {
  const target = account;
  if (!target || !baseline) return;
  const snapshot = readState();
  const pushed = JSON.stringify(snapshot);
  if (pushed === baseline) return;
  const ok = await push(target, snapshot);
  if (!ok) return;
  baseline = pushed;
  // Edits made while the upload was in flight still need sending.
  if (JSON.stringify(readState()) !== baseline) schedulePush();
}

/** Wire the store to the backup. Call once, from the browser only. */
export function startSync(): () => void {
  if (typeof window === "undefined") return () => {};

  const stopStore = subscribeStore(() => {
    if (!account || !baseline) return;
    if (JSON.stringify(readState()) === baseline) return;
    schedulePush();
  });

  const stopAuth = onAccountChange((next) => {
    if (next?.id === account?.id) return;
    account = next;
    if (!next) {
      baseline = null;
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      setStatus(SIGNED_OUT);
      return;
    }
    void adopt(next);
  });

  const refresh = () => {
    // Only pull when there is nothing waiting to upload, so local edits win.
    if (!account || !baseline) return;
    if (JSON.stringify(readState()) !== baseline) return;
    void adopt(account);
  };
  window.addEventListener("focus", refresh);

  return () => {
    stopStore();
    stopAuth();
    window.removeEventListener("focus", refresh);
    if (timer) clearTimeout(timer);
  };
}
