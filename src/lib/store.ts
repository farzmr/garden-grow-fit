import { useSyncExternalStore } from "react";
import squat from "@/assets/ex-squat.jpg";
import deadlift from "@/assets/ex-deadlift.jpg";
import lunge from "@/assets/ex-lunge.jpg";
import press from "@/assets/ex-press.jpg";
import row from "@/assets/ex-row.jpg";
import bridge from "@/assets/ex-bridge.jpg";
import bench from "@/assets/ex-bench.jpg";
import legPress from "@/assets/ex-leg-press.jpg";
import lat from "@/assets/ex-lat-pulldown.jpg";
import extension from "@/assets/ex-leg-extension.jpg";
import chest from "@/assets/ex-chest-press.jpg";
import adduction from "@/assets/ex-adduction.jpg";
import abduction from "@/assets/ex-abduction.jpg";
import back from "@/assets/ex-back-extension.jpg";
import stairs from "@/assets/ex-stairs.jpg";
import elliptical from "@/assets/ex-elliptical.jpg";
import cableRow from "@/assets/ex-cable-row.jpg";
import legCurl from "@/assets/ex-leg-curl.jpg";

export const EXERCISE_LIBRARY: { name: string; image?: string; tip: string }[] = [
  { name: "Back Squat", image: squat, tip: "Chest up, knees track over toes, sit back and down." },
  { name: "Deadlift", image: deadlift, tip: "Flat back, push the floor away, squeeze glutes at the top." },
  { name: "Walking Lunge", image: lunge, tip: "Long step, back knee hovers above the floor." },
  { name: "Shoulder Press", image: press, tip: "Ribs down, press straight up, don't arch your back." },
  { name: "Dumbbell Row", image: row, tip: "Hinge forward, pull elbows toward your hips." },
  { name: "Glute Bridge", image: bridge, tip: "Drive through heels, pause and squeeze at the top." },
  { name: "Bench Press", image: bench, tip: "Keep feet planted and lower the bar with control." },
  { name: "Incline Leg Press", image: legPress, tip: "Keep your back against the pad; avoid locking knees." },
  { name: "Lat Pulldown", image: lat, tip: "Pull toward your upper chest with a wide grip." },
  { name: "Leg Extension", image: extension, tip: "Extend smoothly without swinging." },
  { name: "Chest Press Machine", image: chest, tip: "Keep shoulders down and press with control." },
  { name: "Hip Adduction", image: adduction, tip: "Bring knees inward slowly, without momentum." },
  { name: "Hip Abduction", image: abduction, tip: "Push knees outward with a steady torso." },
  { name: "Back Extension", image: back, tip: "Hinge at the hips; stop when your body is straight." },
  { name: "StairMaster", image: stairs, tip: "Stay upright and step steadily." },
  { name: "Elliptical", image: elliptical, tip: "Keep a smooth rhythm and relaxed shoulders." },
  { name: "Seated Cable Row", image: cableRow, tip: "Pull elbows back without rocking your torso." },
  { name: "Leg Curl", image: legCurl, tip: "Keep hips against the pad and curl slowly." },
];

export const FLOWERS = ["🌷", "🌸", "🌻", "🌹", "🌼", "🪻", "🌺", "💐"];
export const CLASSES = ["Workout", "Yoga", "Pilates", "Spin", "Cardio", "Dance", "Stretching", "Swimming"];
export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export type SetEntry = { weight: number; reps: number; done: boolean };
export type Exercise = { id: string; name: string; sets: SetEntry[] };
export type Session = {
  id: string;
  date: string; // YYYY-MM-DD
  activity: string;
  minutes?: number | undefined;
  completedAt?: string;
  exercises: Exercise[];
  flower: string;
  sample?: boolean;
  planId?: string;
  planName?: string;
};
export type PlanItem = { name: string; sets: number; reps: number; weight: number };
export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type WorkoutPlan = { id: string; name: string; items: PlanItem[]; difficulty?: Difficulty };
export type State = {
  flower: string;
  sessions: Session[];
  plan: Record<number, PlanItem[]>;
  plans: WorkoutPlan[];
  active: Exercise[] | null;
  activeStartedAt?: string | undefined;
  activeFlower?: string | undefined;
  activePlanName?: string | undefined;
  activePlanId?: string | undefined;
  starterPlansVersion?: number;
};

const p = (name: string, sets = 3, reps = 10, weight = 10): PlanItem => ({ name, sets, reps, weight });
const STARTER_PLAN: WorkoutPlan = {
  id: "oct-17-full-body",
  name: "Full body · Oct 17 routine",
  difficulty: "Intermediate",
  items: [
    p("Back Squat", 3, 10, 0),
    p("Bench Press", 3, 7, 0),
    p("Incline Leg Press", 3, 8, 20),
    p("Lat Pulldown", 3, 10, 30),
    p("Leg Extension", 3, 10, 11),
    p("Lat Pulldown Machine", 3, 8, 11),
    p("Chest Press Machine", 3, 8, 0),
    p("Hip Adduction", 3, 10, 0),
    p("Hip Abduction", 3, 10, 0),
    p("Back Extension", 2, 10, 0),
    p("StairMaster", 1, 3, 0),
    p("Elliptical", 1, 5, 0),
  ],
};
const EXTRA_PLANS: WorkoutPlan[] = [
  { id: "bloom-lower-body", name: "Lower body & glutes", difficulty: "Beginner", items: [p("Incline Leg Press",3,10,0),p("Glute Bridge",3,12,0),p("Leg Curl",3,10,0),p("Hip Abduction",2,12,0),p("Walking Lunge",2,10,0)] },
  { id: "bloom-upper-body", name: "Upper body strength", difficulty: "Intermediate", items: [p("Bench Press",3,8,0),p("Lat Pulldown",3,10,0),p("Seated Cable Row",3,10,0),p("Shoulder Press",3,8,0),p("Dumbbell Row",3,10,0)] },
  { id: "bloom-gentle-full-body", name: "Gentle full body", difficulty: "Beginner", items: [p("Elliptical",1,10,0),p("Incline Leg Press",2,12,0),p("Chest Press Machine",2,10,0),p("Seated Cable Row",2,10,0),p("Glute Bridge",2,12,0)] },
];
const SAMPLE_SESSIONS: Session[] = [
  {
    id: "sample-session-1", date: "2026-09-28", completedAt: "2026-09-28T17:45:00", activity: "Workout", minutes: 52, flower: "🌷", sample: true,
    exercises: [
      { id:"sample-squat-1", name:"Back Squat", sets:[{weight:20,reps:10,done:true},{weight:25,reps:8,done:true},{weight:25,reps:8,done:true}] },
      { id:"sample-bench-1", name:"Bench Press", sets:[{weight:15,reps:8,done:true},{weight:17.5,reps:7,done:true},{weight:17.5,reps:7,done:true}] },
    ],
  },
  {
    id: "sample-session-2", date: "2026-10-03", completedAt: "2026-10-03T10:20:00", activity: "Workout", minutes: 48, flower: "🌸", sample: true,
    exercises: [
      { id:"sample-squat-2", name:"Back Squat", sets:[{weight:25,reps:10,done:true},{weight:30,reps:8,done:true},{weight:30,reps:8,done:true}] },
      { id:"sample-bench-2", name:"Bench Press", sets:[{weight:17.5,reps:8,done:true},{weight:20,reps:7,done:true},{weight:20,reps:6,done:true}] },
    ],
  },
];
const DEFAULT: State = {
  flower: "🌷",
  sessions: SAMPLE_SESSIONS,
  active: null,
  plans: [STARTER_PLAN, ...EXTRA_PLANS],
  starterPlansVersion: 1,
  plan: {
    0: [],
    1: [p("Back Squat", 4, 8, 30), p("Walking Lunge", 3, 12, 6), p("Glute Bridge", 3, 15, 20)],
    2: [p("Shoulder Press", 3, 10, 6), p("Dumbbell Row", 3, 10, 8)],
    3: [],
    4: [p("Deadlift", 4, 6, 40), p("Glute Bridge", 3, 12, 25)],
    5: [p("Shoulder Press", 3, 10, 6), p("Dumbbell Row", 3, 12, 8), p("Walking Lunge", 3, 10, 6)],
    6: [],
  },
};

const KEY = "bloomfit-v1";
let state: State = DEFAULT;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const saved = JSON.parse(raw) as Partial<State>;
      state = { ...DEFAULT, ...saved, plans: saved.plans?.length ? saved.plans : DEFAULT.plans };
      if (saved.starterPlansVersion !== 1) {
        const existing = saved.plans ?? [STARTER_PLAN];
        state.plans = [...existing, ...EXTRA_PLANS.filter(plan => !existing.some(p => p.id === plan.id))];
        state.starterPlansVersion = 1;
        localStorage.setItem(KEY, JSON.stringify(state));
      } else if (saved.plans) {
        state.plans = saved.plans;
      }
    }
  } catch {}
}
export function setState(fn: (s: State) => State) {
  load();
  state = fn(state);
  localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
}
export function useStore() {
  return useSyncExternalStore(
    (l) => {
      load();
      listeners.add(l);
      queueMicrotask(l);
      return () => listeners.delete(l);
    },
    () => (load(), state),
    () => DEFAULT,
  );
}

export const uid = () => Math.random().toString(36).slice(2, 10);
export const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
export const imageFor = (name: string) => EXERCISE_LIBRARY.find((e) => e.name === name);

export function lastUsedFor(sessions: Session[], plan: WorkoutPlan) {
  return sessions.filter(session => !session.sample && (session.planId === plan.id || (!session.planId && session.planName === plan.name)))
    .map(session => session.completedAt ?? `${session.date}T12:00:00`).sort().at(-1);
}

export function planToExercises(items: PlanItem[]): Exercise[] {
  return items.map((i) => ({
    id: uid(),
    name: i.name,
    sets: Array.from({ length: i.sets }, () => ({ weight: i.weight, reps: i.reps, done: false })),
  }));
}

export function streak(sessions: Session[]) {
  const dates = new Set(sessions.map((s) => s.date));
  const d = new Date();
  const fmt = (x: Date) =>
    `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
  if (!dates.has(fmt(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (dates.has(fmt(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export function lastFor(sessions: Session[], name: string) {
  for (let i = sessions.length - 1; i >= 0; i--) {
    const sess = sessions[i];
    if (!sess) continue;
    const ex = sess.exercises.find((e) => e.name === name);
    if (ex?.sets.length) return { date: sess.date, best: Math.max(...ex.sets.map((s) => s.weight)) };
  }
  return null;
}
