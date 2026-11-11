import { describe, it, expect } from "vitest";
import { totalPrice, systemPrice, emptySet } from "./nails";

describe("cotizador", () => {
  it("Builder Cuccio talla S cuesta 1,350 y SL 1,500", () => {
    expect(systemPrice("builder-cuccio", 1)).toBe(1350);
    expect(systemPrice("builder-cuccio", 8)).toBe(1500);
  });
  it("Stiletto suma 1,000", () => {
    expect(totalPrice({ ...emptySet, system: "builder-gel", length: 1, shape: "stiletto" })).toBe(2300);
  });
  it("Piedras cuestan 150 por uña y French fino 200", () => {
    expect(totalPrice({ ...emptySet, system: "soft-gel", length: 1, finishes: ["french-fino"], designs: { piedras: 2 } })).toBe(1500);
  });
});
