import { describe, expect, it } from "vitest";
import { sanitizeScan, scanToState } from "./scan";
import { totalPrice } from "./nails";

const base = { valid: true, shape: null, lengthEstimate: null, finishes: [], designsPerFinger: [], detectedElements: [], notes: "" };

describe("escáner: mapeo al catálogo", () => {
  it("descarta ids que no existen en el catálogo", () => {
    const r = sanitizeScan({
      ...base,
      shape: "corazon",
      lengthEstimate: 12,
      finishes: ["cateye", "aurora"],
      designsPerFinger: [["french", "sticker"], [], [], [], [], [], [], [], [], [], ["piedras"]],
      detectedElements: [{ label: "Efecto aurora", mappedId: "aurora", confidence: 0.9 }],
    })!;
    expect(r.shape).toBeNull();
    expect(r.lengthEstimate).toBeNull();
    expect(r.finishes).toEqual(["cateye"]);
    expect(r.designsPerFinger).toHaveLength(10);
    expect(r.designsPerFinger[0]).toEqual(["french"]);
    expect(r.detectedElements[0]!.mappedId).toBeNull();
  });

  it("cat eye + french en 2 uñas, Builder Gel largo #3: 1350 + 500 + 2×20 = 1890", () => {
    const fingers = Array.from({ length: 10 }, (_, i) => (i === 1 || i === 8 ? ["french"] : []));
    const r = sanitizeScan({ ...base, shape: "almendrada", finishes: ["cateye"], designsPerFinger: fingers })!;
    const { set } = scanToState(r, { systems: ["builder-gel"], length: 3 });
    expect(set.designs).toEqual({ french: 2 });
    expect(totalPrice(set)).toBe(1890);
  });

  it("el total del escáner es exactamente el de totalPrice (stiletto suma su recargo)", () => {
    const r = sanitizeScan({ ...base, shape: "stiletto", lengthEstimate: 5, finishes: ["chrome", "matte"], designsPerFinger: Array(10).fill(["sencillo"]) })!;
    const { set } = scanToState(r, { systems: ["soft-gel"], length: r.lengthEstimate! });
    // Soft gel L 1200 + stiletto 1000 + espejo 500 + matte 200 + nailart simple en las 10 uñas 200
    expect(totalPrice(set)).toBe(3100);
  });

  it("respuesta con formato incorrecto se rechaza", () => {
    expect(sanitizeScan({ hola: 1 })).toBeNull();
  });
});
