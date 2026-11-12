import { describe, it, expect } from "vitest";
import { totalPrice, systemPrice, emptySet } from "./nails";

describe("cotizador", () => {
  it("Builder Cuccio: S 1,350 · M 1,450 · L 1,500 · SL 1,500", () => {
    expect(systemPrice("builder-cuccio", 1)).toBe(1350);
    expect(systemPrice("builder-cuccio", 3)).toBe(1450);
    expect(systemPrice("builder-cuccio", 5)).toBe(1500);
    expect(systemPrice("builder-cuccio", 8)).toBe(1500);
  });
  it("Cover liso SL cuesta 1,600", () => {
    expect(systemPrice("cover", 7)).toBe(1600);
  });
  it("Stiletto suma 1,000", () => {
    expect(totalPrice({ ...emptySet, systems: ["builder-gel"], length: 1, shape: "stiletto" })).toBe(2300);
  });
  it("Piedras cuestan 150 por uña y French fino 200", () => {
    expect(totalPrice({ ...emptySet, systems: ["soft-gel"], length: 1, finishes: ["french-fino"], designs: { piedras: 2 } })).toBe(1500);
  });
  it("Builder Gel M con Efecto espejo cuesta 1,850", () => {
    expect(totalPrice({ ...emptySet, systems: ["builder-gel"], length: 3, finishes: ["chrome"] })).toBe(1850);
  });
  it("Retoque de Builder Gel cuesta 1,150 sin importar el largo", () => {
    expect(totalPrice({ ...emptySet, systems: ["builder-gel"], length: 7, retoque: true })).toBe(1150);
  });
  it("Retiro de Soft gel suma 200", () => {
    expect(totalPrice({ ...emptySet, systems: ["soft-gel"], length: 1, retiro: true })).toBe(1200);
  });
  it("Diseño elaborado cuesta desde 500 por uña", () => {
    expect(totalPrice({ ...emptySet, systems: ["cover"], length: 1, designs: { "3d": 1 } })).toBe(1500);
  });
  it("Varios sistemas se suman: Builder Cuccio + Builder Gel en largo #1 = 2,650", () => {
    expect(totalPrice({ ...emptySet, systems: ["builder-cuccio", "builder-gel"], length: 1 })).toBe(2650);
  });
  it("Al elegir un sistema, el total empieza en su precio «Desde»", () => {
    expect(totalPrice({ ...emptySet, systems: ["builder-cuccio"] })).toBe(1350);
  });
  it("Retiro de dos sistemas suma ambos: Soft gel 200 + Builder Gel 250", () => {
    expect(totalPrice({ ...emptySet, systems: ["soft-gel", "builder-gel"], length: 1, retiro: true })).toBe(1000 + 1300 + 200 + 250);
  });
});
