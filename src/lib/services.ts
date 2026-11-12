import { systems, rd, EXTRA_NAIL_PRICE } from "./nails";

// Catálogo oficial del salón (RD$). `list` = precio de lista (antes).
export type Service = { name: string; price: number | string; list?: number | undefined; extra?: string | undefined };
export type Category = { title: string; rows: Service[] };

const r = (retiro?: number, retoque?: number) =>
  [retoque != null && `Retoque ${rd(retoque)}`, retiro != null && `Retiro ${rd(retiro)}`].filter(Boolean).join(" · ") || undefined;

export const categories: Category[] = [
  {
    title: "Manos",
    rows: [
      { name: "Pintura regular", price: 300, list: 350, extra: r(50) },
      { name: "Pintado natural", price: 300, extra: r(50) },
      { name: "Encapsulado (und)", price: 130 },
      { name: "Esmaltado en gel", price: 500, list: 800, extra: r(100) },
      { name: "Manicura", price: 500, list: 550 },
      { name: "Manicura + gel", price: 1000, list: 1250 },
      { name: "Mini manicura", price: 250, list: 400 },
      { name: "ManiSpa Cuccio", price: 1500 },
      { name: "Manicura hombres", price: 600, list: 700 },
      { name: "Manicura + gel hombres", price: 900, list: 1100 },
    ],
  },
  {
    title: "Pies",
    rows: [
      { name: "Pintura regular", price: 300, list: 350 },
      { name: "Pintura en gel", price: 500, list: 800, extra: r(100) },
      { name: "Todas pies", price: 1300 },
      { name: "Todas pies resina", price: 1500 },
      { name: "Dos uñas grandes (acrílicas)", price: 500, extra: r(250, 400) },
      { name: "Pedicura", price: 600, list: 800 },
      { name: "Pedicura spa Cuccio", price: 1600, list: 1700 },
      { name: "Pedicura hombres", price: 700, list: 900 },
      { name: "Mini pedicure", price: 400 },
      { name: "Pedigel", price: 1000, list: 1450, extra: r(100) },
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
      { name: "Una uña (adicional)", price: EXTRA_NAIL_PRICE, list: 200 },
    ],
  },
  {
    title: "Arte y acabados",
    rows: [
      { name: "French media luna gel", price: 300, list: 500 },
      { name: "French fino recto", price: 200, list: 400 },
      { name: "Nailart simple", price: 200, list: 300 },
      { name: "Una uña piedra completa", price: 150 },
      { name: "Efecto espejo", price: 500 },
      { name: "Stiletto", price: 1000 },
      { name: "Cristal", price: 700 },
      { name: "Esmaltado después del acrílico", price: 400 },
      { name: "Baby Boomer", price: 1300 },
      { name: "Efectos mano completa", price: 600, extra: "Precio aproximado" },
      { name: "Diseños elaborados", price: "Desde RD$ 500" },
    ],
  },
  { title: "Cabello", rows: [{ name: "Lacios", price: "Consultar" }, { name: "Rizos", price: "Consultar" }, { name: "Pelucas", price: "Consultar" }, { name: "Otros productos", price: "Consultar" }] },
];

export const priceLabel = (p: number | string) => (typeof p === "number" ? rd(p) : p);
