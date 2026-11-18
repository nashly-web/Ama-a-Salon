import { describe, expect, it } from "vitest";
import { canReach, missingBefore } from "./estudio-steps";
import { emptySet } from "./nails";

describe("pasos obligatorios del Estudio", () => {
  it("sin sistema no se puede pasar del paso Sistema", () => {
    expect(canReach(0, emptySet)).toBe(true);
    expect(canReach(1, emptySet)).toBe(false);
    expect(canReach(4, emptySet)).toBe(false);
  });

  it("con sistema se llega a Largo y Forma, pero no más allá sin forma", () => {
    const set = { ...emptySet, systems: ["cover"] };
    expect(canReach(2, set)).toBe(true);
    expect(canReach(3, set)).toBe(false);
    expect(missingBefore(6, set)).toEqual([2]);
  });

  it("acabados y diseños se pueden saltar: con sistema y forma se llega al Envío", () => {
    const set = { ...emptySet, systems: ["cover"], shape: "cuadrada" };
    expect(set.finishes).toEqual([]);
    expect(canReach(5, set)).toBe(true);
    expect(canReach(6, set)).toBe(true);
  });
});
