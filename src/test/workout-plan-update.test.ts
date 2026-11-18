import { describe, expect, it } from "vitest";
import {
  ensureDefaultPlans,
  type Exercise,
  type WorkoutPlan,
} from "@/lib/store";

describe("Workout plan update and creation logic", () => {
  it("deduplicates custom plans by id in ensureDefaultPlans", () => {
    const custom: WorkoutPlan = {
      id: "custom-abc",
      name: "Leg Day Special",
      difficulty: "Intermediate",
      items: [{ name: "Back Squat", sets: 3, reps: 10, weight: 100 }],
    };

    const duplicateList = [custom, custom];
    const resolved = ensureDefaultPlans(duplicateList);

    const matches = resolved.filter((p) => p.id === "custom-abc");
    expect(matches).toHaveLength(1);
  });

  it("retains custom plans alongside standard starter plans", () => {
    const custom: WorkoutPlan = {
      id: "custom-xyz",
      name: "Arm Blast",
      difficulty: "Intermediate",
      items: [{ name: "Dumbbell Bicep Curl", sets: 3, reps: 12, weight: 15 }],
    };

    const resolved = ensureDefaultPlans([custom]);
    expect(resolved.length).toBeGreaterThanOrEqual(4);
    expect(resolved.some((p) => p.id === "plan-full-body")).toBe(true);
    expect(resolved.some((p) => p.id === "custom-xyz")).toBe(true);
  });
});
