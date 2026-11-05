import { describe, expect, it } from "vitest";
import {
  DEFAULT_PLANS,
  EXERCISE_LIBRARY,
  MANDATORY_COOL_DOWNS,
  ensureDefaultPlans,
  imageFor,
  isMandatoryCoolDown,
  type WorkoutPlan,
} from "@/lib/store";

describe("Mandatory Cool-Down Exercises", () => {
  const coolDownNames = ["Child's Pose", "Figure-4 Stretch", "Cat-Cow", "Pigeon Pose"];

  it("includes all 4 cool-down exercises in EXERCISE_LIBRARY with images and links", () => {
    for (const name of coolDownNames) {
      const ex = EXERCISE_LIBRARY.find((e) => e.name === name);
      expect(ex).toBeDefined();
      expect(ex?.image).toBeTruthy();
      expect(ex?.trackingType).toBe("duration");
      expect(ex?.timeUnit).toBe("sec");
      expect(ex?.tip).toBeTruthy();
      expect(ex?.avoid).toBeTruthy();
      expect(ex?.myoAtlasLinks && ex.myoAtlasLinks.length > 0).toBe(true);
    }
  });

  it("marks all 4 exercises as mandatory cool downs", () => {
    for (const name of coolDownNames) {
      expect(isMandatoryCoolDown(name)).toBe(true);
    }
    expect(isMandatoryCoolDown("Back Squat")).toBe(false);
  });

  it("ensures all 3 DEFAULT_PLANS include all 4 mandatory cool downs", () => {
    expect(DEFAULT_PLANS.length).toBeGreaterThanOrEqual(3);
    for (const plan of DEFAULT_PLANS) {
      for (const name of coolDownNames) {
        const item = plan.items.find((it) => it.name === name);
        expect(item, `${plan.name} should include ${name}`).toBeDefined();
      }
    }
  });

  it("appends mandatory cool downs to custom plans in ensureDefaultPlans", () => {
    const customPlan: WorkoutPlan = {
      id: "custom-1",
      name: "My Custom Routine",
      difficulty: "Intermediate",
      items: [{ name: "Deadlift", sets: 3, reps: 5, weight: 135 }],
    };

    const resolved = ensureDefaultPlans([customPlan]);
    const foundCustom = resolved.find((p) => p.id === "custom-1");
    expect(foundCustom).toBeDefined();

    for (const name of coolDownNames) {
      const item = foundCustom?.items.find((it) => it.name === name);
      expect(item, `Custom plan should include mandatory ${name}`).toBeDefined();
    }
  });
});
