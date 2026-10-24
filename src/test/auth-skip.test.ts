import { beforeEach, describe, expect, it } from "vitest";
import { hasSkippedAuth, setSkippedAuth, signOut } from "@/lib/auth";

describe("Auth skip persistence", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("defaults to false when not set", () => {
    expect(hasSkippedAuth()).toBe(false);
  });

  it("persists skipped state when enabled", () => {
    setSkippedAuth(true);
    expect(hasSkippedAuth()).toBe(true);
    expect(localStorage.getItem("bloomfit_auth_skipped")).toBe("true");
  });

  it("clears skipped state when disabled", () => {
    setSkippedAuth(true);
    expect(hasSkippedAuth()).toBe(true);
    setSkippedAuth(false);
    expect(hasSkippedAuth()).toBe(false);
    expect(localStorage.getItem("bloomfit_auth_skipped")).toBeNull();
  });

  it("clears skipped state on signOut", async () => {
    setSkippedAuth(true);
    await signOut();
    expect(hasSkippedAuth()).toBe(false);
  });
});
