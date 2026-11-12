import { describe, expect, it } from "vitest";
import { priceRows } from "@/components/estudio/Resumen";
import { emptySet, totalPrice } from "@/lib/nails";

describe("resumen de cotización", () => {
  it("las líneas del resumen suman el total estimado", () => {
    const set = { ...emptySet, systems: ["builder-gel"], length: 4, shape: "stiletto", finishes: ["chrome", "french-fino"], designs: { sencillo: 4, piedras: 2 }, retiro: true };
    const sum = priceRows(set).reduce((a, r) => a + r.price, 0);
    expect(sum).toBe(totalPrice(set));
    // Builder Gel M 1350 + stiletto 1000 + retiro 250 + 500 + 200 + 4×200 + 2×150
    expect(sum).toBe(4400);
  });
});
