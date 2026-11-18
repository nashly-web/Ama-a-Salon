import { describe, it, expect } from "vitest";
import { totalPrice, systemPrice, emptySet, systemsByPrice, cheapestSystem, selectSystem } from "./nails";

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
  it("Piedras: 150 las 10 uñas → 2 uñas cuestan 30; French fino 200", () => {
    expect(totalPrice({ ...emptySet, systems: ["soft-gel"], length: 1, finishes: ["french-fino"], designs: { piedras: 2 } })).toBe(1230);
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
  it("Diseño elaborado en 1 uña cuesta 50 (500 ÷ 10)", () => {
    expect(totalPrice({ ...emptySet, systems: ["cover"], length: 1, designs: { "3d": 1 } })).toBe(1050);
  });
  it("Diseño elaborado en las 10 uñas cuesta 500", () => {
    expect(totalPrice({ ...emptySet, designs: { "3d": 10 } })).toBe(500);
  });
  it("Nailart simple (200) en una sola uña cuesta 20", () => {
    expect(totalPrice({ ...emptySet, designs: { sencillo: 1 } })).toBe(20);
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
  it("Sistemas en largo medio (M) van de menor a mayor: Soft gel 1,100 primero, Builder Cuccio 1,450 al final", () => {
    const ids = systemsByPrice(3).map((s) => s.id);
    expect(ids).toEqual(["soft-gel", "cover", "acrigel", "builder-gel", "builder-cuccio"]);
  });
  it("El sistema por defecto es el más barato: Soft gel en largo M", () => {
    expect(cheapestSystem(3)).toBe("soft-gel");
  });
  it("En largo SL el más barato sigue siendo Soft gel (1,250)", () => {
    expect(cheapestSystem(7)).toBe("soft-gel");
  });
});

describe("selección única de sistema", () => {
  it("elegir Cover liso después de Acrigel deja solo Cover liso", () => {
    let sel = selectSystem("acrigel");
    sel = selectSystem("cover");
    expect(sel).toEqual(["cover"]);
  });
  it("nunca quedan dos sistemas a la vez", () => {
    expect(selectSystem("builder-gel")).toHaveLength(1);
  });
});
