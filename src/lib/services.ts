import { systems, rd, EXTRA_NAIL_PRICE } from "./nails";
import { odooName, odooPrice, type OdooCatalog } from "./odoo-catalog";

// Catálogo oficial del salón (RD$). `list` = precio de lista (antes).
export type Service = { name: string; price: number | string; list?: number | undefined; extra?: string | undefined; odooCode?: string | undefined; removalCode?: string | undefined; retouchCode?: string | undefined };
export type Category = { title: string; rows: Service[] };

const r = (retiro?: number, retoque?: number) =>
  [retoque != null && `Retoque ${rd(retoque)}`, retiro != null && `Retiro ${rd(retiro)}`].filter(Boolean).join(" · ") || undefined;

export const categories: Category[] = [
  {
    title: "Manos",
    rows: [
      { name: "Pintura regular", price: 300, list: 350, extra: r(50), odooCode: "NAIL-004", removalCode: "NAIL-ADD-004-R" },
      { name: "Pintado natural", price: 300, extra: r(50), odooCode: "NAIL-005", removalCode: "NAIL-ADD-005-R" },
      { name: "Encapsulado (und)", price: 130, odooCode: "NAIL-006" },
      { name: "Esmaltado en gel", price: 500, list: 800, extra: r(100), odooCode: "NAIL-007", removalCode: "NAIL-ADD-007-R" },
      { name: "Manicura", price: 500, list: 550, odooCode: "NAIL-008" },
      { name: "Manicura + gel", price: 1000, list: 1250, odooCode: "NAIL-009" },
      { name: "Mini manicura", price: 250, list: 400, odooCode: "NAIL-010" },
      { name: "ManiSpa Cuccio", price: 1500, odooCode: "NAIL-011" },
      { name: "Manicura hombres", price: 600, list: 700, odooCode: "NAIL-012" },
      { name: "Manicura + gel hombres", price: 900, list: 1100, odooCode: "NAIL-013" },
    ],
  },
  {
    title: "Pies",
    rows: [
      { name: "Pintura regular", price: 300, list: 350, odooCode: "NAIL-015" },
      { name: "Pintura en gel", price: 500, list: 800, extra: r(100), odooCode: "NAIL-016", removalCode: "NAIL-ADD-016-R" },
      { name: "Todas pies", price: 1300, odooCode: "NAIL-017" },
      { name: "Todas pies resina", price: 1500, odooCode: "NAIL-018" },
      { name: "Dos uñas grandes (acrílicas)", price: 500, extra: r(250, 400), odooCode: "NAIL-019", removalCode: "NAIL-ADD-019-R", retouchCode: "NAIL-ADD-019-T-S" },
      { name: "Pedicura", price: 600, list: 800, odooCode: "NAIL-020" },
      { name: "Pedicura spa Cuccio", price: 1600, list: 1700, odooCode: "NAIL-021" },
      { name: "Pedicura hombres", price: 700, list: 900, odooCode: "NAIL-022" },
      { name: "Mini pedicure", price: 400, odooCode: "NAIL-023" },
      { name: "Pedigel", price: 1000, list: 1450, extra: r(100), odooCode: "NAIL-024", removalCode: "NAIL-ADD-024-R" },
    ],
  },
  {
    title: "Extensiones y sistemas",
    rows: [
      ...systems
        .filter((s) => s.retoque != null)
        .map((s) => ({
          name: s.name,
          price: `${rd(s.prices[0])} – ${s.prices[3].toLocaleString("en-US")}`,
          extra: [`S ${rd(s.prices[0])} · M ${rd(s.prices[1])} · L ${rd(s.prices[2])} · SL ${rd(s.prices[3])}`, r(s.retiro, s.retoque), s.list && `Precio de lista ${rd(s.list)}`]
            .filter(Boolean)
            .join("\n"),
        })),
      { name: "Una uña (adicional)", price: EXTRA_NAIL_PRICE, list: 200, odooCode: "NAIL-030" },
    ],
  },
  {
    title: "Arte y acabados",
    rows: [
      { name: "French media luna gel", price: 300, list: 500, odooCode: "NAIL-032" },
      { name: "French fino recto", price: 200, list: 400, odooCode: "NAIL-033" },
      { name: "Nailart simple", price: 200, list: 300, odooCode: "NAIL-034" },
      { name: "Una uña piedra completa", price: 150, odooCode: "NAIL-037" },
      { name: "Efecto espejo", price: 500, odooCode: "NAIL-038" },
      { name: "Stiletto", price: 1000, odooCode: "NAIL-039" },
      { name: "Cristal", price: 700, odooCode: "NAIL-040" },
      { name: "Esmaltado después del acrílico", price: 400, odooCode: "NAIL-041" },
      { name: "Baby Boomer", price: 1300, odooCode: "NAIL-042" },
      { name: "Efectos mano completa", price: 600, extra: "Precio aproximado", odooCode: "NAIL-035" },
      { name: "Diseños elaborados", price: "Desde RD$ 500", odooCode: "NAIL-036" },
    ],
  },
  { title: "Cabello", rows: [{ name: "Lacios", price: "Consultar" }, { name: "Rizos", price: "Consultar" }, { name: "Pelucas", price: "Consultar" }, { name: "Otros productos", price: "Consultar" }] },
];

export const priceLabel = (p: number | string) => (typeof p === "number" ? rd(p) : p);

/** Los precios publicados se leen del catálogo real; un código ausente no usa el precio local antiguo. */
export function categoriesFromOdoo(catalog: OdooCatalog): Category[] {
  const fixed = categories.filter((category) => category.title !== "Extensiones y sistemas");
  const synced = fixed.map((category) => ({
    ...category,
    rows: category.rows.map((row) => {
      if (!row.odooCode) return row;
      const price = odooPrice(catalog, row.odooCode);
      if (price == null) return { ...row, price: "No está en Odoo", list: undefined, extra: undefined };
      const extras = [
        row.retouchCode && odooPrice(catalog, row.retouchCode) != null && `Retoque ${rd(odooPrice(catalog, row.retouchCode)!)}`,
        row.removalCode && odooPrice(catalog, row.removalCode) != null && `Retiro ${rd(odooPrice(catalog, row.removalCode)!)}`,
      ].filter(Boolean).join(" · ");
      return { ...row, name: odooName(catalog, row.odooCode, row.name), price, list: undefined, extra: extras || (row.extra === "Precio aproximado" ? row.extra : undefined) };
    }),
  }));

  const systemsCategory: Category = {
    title: "Extensiones y sistemas",
    rows: systems.filter((system) => odooPrice(catalog, system.odooCode, "S") != null).map((system) => {
      const values = ["S", "M", "L", "SL"].map((size) => odooPrice(catalog, system.odooCode, size));
      const present = values.filter((value): value is number => value != null);
      const extras = [
        system.retouchCode && odooPrice(catalog, system.retouchCode) != null && `Retoque ${rd(odooPrice(catalog, system.retouchCode)!)}`,
        system.removalCode && odooPrice(catalog, system.removalCode) != null && `Retiro ${rd(odooPrice(catalog, system.removalCode)!)}`,
      ].filter(Boolean).join(" · ");
      return {
        name: odooName(catalog, system.odooCode, system.name),
        price: `${rd(present[0] ?? 0)} – ${rd(present[present.length - 1] ?? 0)}`,
        extra: [`S ${rd(values[0] ?? 0)} · M ${rd(values[1] ?? 0)} · L ${rd(values[2] ?? 0)} · SL ${rd(values[3] ?? 0)}`, extras].filter(Boolean).join("\n"),
      };
    }),
  };
  const additionalNail = categories.find((category) => category.title === "Extensiones y sistemas")?.rows.find((row) => row.odooCode === "NAIL-030");
  if (additionalNail) {
    const price = odooPrice(catalog, additionalNail.odooCode);
    systemsCategory.rows.push({ ...additionalNail, name: odooName(catalog, additionalNail.odooCode, additionalNail.name), price: price ?? "No está en Odoo", list: undefined, extra: undefined });
  }
  return [...synced, systemsCategory];
}
