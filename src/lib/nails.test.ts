import { describe, it, expect } from "vitest";
import { totalPrice, systemPrice, emptySet, shapes, designPerNail, systemsByPrice, cheapestSystem, selectSystem } from "./nails";

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
  it("Stiletto no tiene recargo: Builder Gel S con Stiletto sigue en 1,300", () => {
    expect(totalPrice({ ...emptySet, systems: ["builder-gel"], length: 1, shape: "stiletto" })).toBe(1300);
  });
  it("Ninguna forma tiene recargo", () => {
    for (const sh of shapes) expect(sh.price).toBe(0);
  });
  it("Uña piedra completa cuesta 150 por uña: 2 uñas = 300; con Soft gel S + French fino = 1,500", () => {
    expect(totalPrice({ ...emptySet, designs: { piedras: 2 } })).toBe(300);
    expect(totalPrice({ ...emptySet, systems: ["soft-gel"], length: 1, finishes: ["french-fino"], designs: { piedras: 2 } })).toBe(1500);
  });
  it("Precios por uña: Nailart simple 200, Piedra 150, Elaborado 500, Flores 200, French 200", () => {
    expect(designPerNail("sencillo")).toBe(200);
    expect(designPerNail("piedras")).toBe(150);
    expect(designPerNail("3d")).toBe(500);
    expect(designPerNail("flores")).toBe(200);
    expect(designPerNail("french")).toBe(200);
  });
  it("El largo cambia el precio del sistema, no se suma encima: Soft gel 1,000 en #1 y 1,100 en #4", () => {
    expect(totalPrice({ ...emptySet, systems: ["soft-gel"], length: 1 })).toBe(1000);
    expect(totalPrice({ ...emptySet, systems: ["soft-gel"], length: 4 })).toBe(1100);
  });
  it("Caso de la captura: Soft gel #4 + Stiletto + French fino + piedra en 2 uñas = 1,600", () => {
    expect(totalPrice({ ...emptySet, systems: ["soft-gel"], length: 4, shape: "stiletto", finishes: ["french-fino"], designs: { piedras: 2 } })).toBe(1600);
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
  it("Diseño elaborado en 1 uña cuesta 500: Cover S + 1 uña = 1,500", () => {
    expect(totalPrice({ ...emptySet, systems: ["cover"], length: 1, designs: { "3d": 1 } })).toBe(1500);
  });
  it("Diseño elaborado en las 10 uñas cuesta 5,000", () => {
    expect(totalPrice({ ...emptySet, designs: { "3d": 10 } })).toBe(5000);
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
