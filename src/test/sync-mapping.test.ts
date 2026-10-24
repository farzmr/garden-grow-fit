import { describe, expect, it } from "vitest";

import {
  isEmptyServer,
  mergeRemote,
  parseExercises,
  planFromRow,
  sessionFromRow,
  sessionRow,
  type ServerData,
} from "@/lib/sync";
import type { Session, State } from "@/lib/store";

const full: Session = {
  id: "s-1",
  date: "2026-10-20",
  activity: "Workout",
  minutes: 52,
  completedAt: "2026-10-20T18:30:00",
  flower: "🌹",
  planId: "oct-17-full-body",
  planName: "Full body · Oct 17 routine",
  exercises: [{ id: "e1", name: "Back Squat", sets: [{ weight: 30, reps: 8, done: true }] }],
};

const base: State = {
  flower: "🌷",
  mainGarden: "wild-meadow",
  sessions: [{ id: "sample-1", date: "2026-09-28", activity: "Workout", exercises: [], flower: "🌷", sample: true }],
  active: null,
  plans: [],
  plan: {},
};

const remote: ServerData = {
  flower: "🌹",
  mainGarden: "glasshouse",
  sessions: [full],
  plans: [{ id: "p1", name: "Leg day", items: [], difficulty: "Beginner" }],
  active: null,
};

describe("session mapping", () => {
  it("writes the columns the backup table has", () => {
    expect(sessionRow(full, "u-1")).toEqual({
      id: "s-1",
      user_id: "u-1",
      date: "2026-10-20",
      activity: "Workout",
      minutes: 52,
      completed_at: "2026-10-20T18:30:00",
      flower: "🌹",
      exercises: full.exercises,
      plan_id: "oct-17-full-body",
      plan_name: "Full body · Oct 17 routine",
    });
  });

  it("reads a row back into the shape the app uses", () => {
    expect(sessionFromRow(sessionRow(full, "u-1"))).toEqual(full);
  });

  it("keeps an unrecorded duration and finish time as 'not recorded'", () => {
    const bare: Session = { id: "s-2", date: "2026-10-21", activity: "Yoga", exercises: [], flower: "🌸" };
    const row = sessionRow(bare, "u-1");
    expect(row.minutes).toBeNull();
    expect(row.completed_at).toBeNull();
    const back = sessionFromRow(row);
    expect(back.minutes).toBeUndefined();
    expect(back.completedAt).toBeUndefined();
    expect(back.activity).toBe("Yoga");
  });

  it("preserves location, feelingEmoji, notes and intensity across sync rows", () => {
    const sessionWithMeta: Session = {
      id: "s-3",
      date: "2026-10-24",
      activity: "Pilates",
      minutes: 45,
      completedAt: "2026-10-24T12:00:00",
      exercises: [],
      flower: "🪻",
      location: "Equinox Studio",
      feelingEmoji: "💪",
      notes: "Felt amazing, great core workout",
      intensity: "Moderate",
    };
    const row = sessionRow(sessionWithMeta, "u-1");
    const restored = sessionFromRow(row);
    expect(restored).toEqual(sessionWithMeta);
  });
});

describe("stored values that arrive in a bad shape", () => {
  it("drops exercises without a name and reads numbers out of text", () => {
    const parsed = parseExercises([
      { name: "Leg Curl", sets: [{ weight: 12, reps: "10", done: true }] },
      { sets: [] },
      { name: "" },
      null,
      "nope",
    ]);
    expect(parsed).toHaveLength(1);
    expect(parsed[0]?.name).toBe("Leg Curl");
    expect(parsed[0]?.sets).toEqual([{ weight: 12, reps: 10, done: true }]);
  });

  it("falls back to a known difficulty and skips nameless plan entries", () => {
    expect(
      planFromRow({
        id: "p",
        name: "Mix",
        difficulty: "extreme",
        items: [
          { name: "Dumbbell Row", sets: 3, reps: 10, weight: 8 },
          { sets: 3 },
        ],
        position: 0,
      }),
    ).toEqual({
      id: "p",
      name: "Mix",
      items: [{ name: "Dumbbell Row", sets: 3, reps: 10, weight: 8 }],
      difficulty: "Intermediate",
    });
  });
});

describe("merging the backup with this device", () => {
  it("keeps the demo samples but otherwise follows the backup", () => {
    const merged = mergeRemote(base, remote);
    expect(merged.flower).toBe("🌹");
    expect(merged.mainGarden).toBe("glasshouse");
    expect(merged.sessions.map((s) => s.id)).toEqual(["sample-1", "s-1"]);
    expect(merged.plans).toHaveLength(1);
    expect(merged.active).toBeNull();
    expect(merged.activeStartedAt).toBeUndefined();
  });

  it("restores an unfinished workout with the flower and plan it started with", () => {
    const merged = mergeRemote(base, {
      ...remote,
      active: {
        exercises: [{ id: "e9", name: "Deadlift", sets: [{ weight: 40, reps: 5, done: false }] }],
        started_at: "2026-10-22T09:00:00",
        flower: "🌻",
        plan_id: "p1",
        plan_name: "Leg day",
      },
    });
    expect(merged.active?.[0]?.name).toBe("Deadlift");
    expect(merged.activeStartedAt).toBe("2026-10-22T09:00:00");
    expect(merged.activeFlower).toBe("🌻");
    expect(merged.activePlanId).toBe("p1");
    expect(merged.activePlanName).toBe("Leg day");
  });

  it("treats an account with nothing stored as needing a first backup", () => {
    expect(isEmptyServer({ sessions: [], plans: [], active: null })).toBe(true);
    expect(isEmptyServer({ sessions: [full], plans: [], active: null })).toBe(false);
    expect(isEmptyServer({ sessions: [], plans: [], active: { exercises: [], started_at: null, flower: null, plan_id: null, plan_name: null } })).toBe(false);
  });
});
