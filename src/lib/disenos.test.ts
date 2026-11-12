import { describe, expect, it } from "vitest";
import { addDesign, countDesigns, designCombos, emptyFingers, emptySet, nailsDecorated, removeDesign, toggleDesign, totalPrice } from "./nails";

describe("varios diseños por uña", () => {
  it("una uña puede llevar French + piedras y se cobran los dos: 200 + 150", () => {
    let f = toggleDesign(emptyFingers(), 2, "french");
    f = toggleDesign(f, 2, "piedras");
    expect(f[2]).toEqual(["piedras", "french"]);
    expect(nailsDecorated(f)).toBe(1);
    expect(totalPrice({ ...emptySet, designs: countDesigns(f) })).toBe(350);
  });

  it("tocar otra vez un diseño en la uña solo quita ese diseño", () => {
    let f = toggleDesign(toggleDesign(emptyFingers(), 0, "french"), 0, "flores");
    f = toggleDesign(f, 0, "french");
    expect(f[0]).toEqual(["flores"]);
  });

  it("+ añade el diseño a la siguiente uña que no lo tenga, aunque ya tenga otro diseño", () => {
    let f = toggleDesign(emptyFingers(), 0, "sencillo");
    f = addDesign(f, "piedras");
    expect(f[0]).toEqual(["sencillo", "piedras"]);
    f = removeDesign(f, "piedras");
    expect(f[0]).toEqual(["sencillo"]);
  });

  it("el resumen agrupa las uñas con la misma combinación", () => {
    let f = emptyFingers();
    for (const i of [2, 7]) f = toggleDesign(toggleDesign(f, i, "french"), i, "piedras");
    f = toggleDesign(f, 0, "sencillo");
    const combos = designCombos(f);
    expect(combos[0]).toMatchObject({ name: "Uña piedra completa + French", fingers: [2, 7], perNail: 350, price: 700 });
    expect(combos[1]).toMatchObject({ name: "Nailart simple", fingers: [0], price: 200 });
  });
});
