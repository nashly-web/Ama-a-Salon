// Lista oficial de precios del salón (RD$). `list` = precio de lista (antes).
export type Option = { id: string; name: string; price: number; list?: number | undefined; note?: string | undefined };

export type System = {
  id: string;
  name: string;
  /** Precio por tamaño: S, M, L, SL */
  prices: [number, number, number, number];
  retoque?: number | undefined;
  retiro?: number | undefined;
  list?: number | undefined;
};

export const systems: System[] = [
  { id: "builder-cuccio", name: "Builder Cuccio", prices: [1350, 1450, 1500, 1500], retoque: 1200, retiro: 250, list: 1400 },
  { id: "builder-gel", name: "Builder Gel", prices: [1300, 1350, 1400, 1450], retoque: 1150, retiro: 250, list: 1400 },
  { id: "soft-gel", name: "Soft gel / Press on", prices: [1000, 1100, 1200, 1250], retoque: 800, retiro: 200, list: 1800 },
  { id: "cover", name: "Cover liso", prices: [1000, 1200, 1400, 1600], retoque: 900, retiro: 250 },
  // No aparece en la lista oficial; se mantiene con su precio anterior.
  { id: "acrigel", name: "Acrigel", prices: [1200, 1300, 1400, 1500] },
];

export const sizes = ["S", "M", "L", "SL"] as const;

export const lengths = [
  "Muy corto", "Corto", "Corto medio", "Medio", "Largo", "Extra largo", "Muy largo", "Muy extra largo",
].map((name, i) => ({ id: i + 1, name, size: sizes[Math.floor(i / 2)] }));

export const shapes: Option[] = [
  { id: "cuadrada", name: "Cuadrada", price: 0 },
  { id: "almendrada", name: "Almendrada", price: 0 },
  { id: "coffin", name: "Coffin", price: 0 },
  { id: "ovalada", name: "Ovalada", price: 0 },
  { id: "stiletto", name: "Stiletto", price: 1000 },
  { id: "redonda", name: "Redonda", price: 0 },
];

export const finishes: Option[] = [
  { id: "gel", name: "Esmaltado después del acrílico", price: 400 },
  { id: "french-luna", name: "French media luna gel", price: 300, list: 500 },
  { id: "french-fino", name: "French fino recto", price: 200, list: 400 },
  { id: "chrome", name: "Efecto espejo", price: 500 },
  { id: "cristal", name: "Cristal", price: 700 },
  { id: "babyboomer", name: "Baby Boomer", price: 1300 },
  { id: "efectos", name: "Efectos mano completa", price: 600, note: "Precio aproximado" },
  // No aparecen en la lista oficial; se mantienen con su precio anterior.
  { id: "cateye", name: "Cat eye", price: 500 },
  { id: "matte", name: "Matte", price: 200 },
];

/** Precios por uña */
export const designs: Option[] = [
  { id: "sencillo", name: "Nailart simple", price: 200, list: 300 },
  { id: "piedras", name: "Uña piedra completa", price: 150 },
  { id: "3d", name: "Diseño elaborado", price: 500, note: "Desde" },
  // No aparecen en la lista oficial; se mantienen con su precio anterior.
  { id: "flores", name: "Flores", price: 200 },
  { id: "french", name: "French", price: 200 },
];

export const EXTRA_NAIL_PRICE = 100;
export const MAX_NAILS = 10;

export type NailSet = {
  system: string | null;
  length: number;
  shape: string | null;
  finishes: string[];
  designs: Record<string, number>;
  /** Retoque (mantenimiento) en vez de set nuevo */
  retoque?: boolean;
  /** Retiro del sistema anterior */
  retiro?: boolean;
};

export const emptySet: NailSet = { system: null, length: 4, shape: null, finishes: [], designs: {}, retoque: false, retiro: false };

export function sizeOf(length: number) {
  return sizes[Math.floor((length - 1) / 2)] ?? "S";
}

export function systemPrice(systemId: string | null, length: number) {
  const s = systems.find((x) => x.id === systemId);
  return s?.prices[Math.floor((length - 1) / 2)] ?? 0;
}

/** Precio de la base: set nuevo según tamaño, o retoque si se eligió */
export function basePrice(set: NailSet) {
  const s = systems.find((x) => x.id === set.system);
  if (!s) return 0;
  if (set.retoque && s.retoque != null) return s.retoque;
  return systemPrice(s.id, set.length);
}

export function retiroPrice(set: NailSet) {
  if (!set.retiro) return 0;
  return systems.find((x) => x.id === set.system)?.retiro ?? 0;
}

export function nailsUsed(set: NailSet) {
  return Object.values(set.designs).reduce((a, b) => a + b, 0);
}

export function totalPrice(set: NailSet) {
  let t = basePrice(set) + retiroPrice(set);
  t += shapes.find((s) => s.id === set.shape)?.price ?? 0;
  for (const f of set.finishes) t += finishes.find((x) => x.id === f)?.price ?? 0;
  for (const [id, n] of Object.entries(set.designs)) t += (designs.find((d) => d.id === id)?.price ?? 0) * n;
  return t;
}

export const rd = (n = 0) => `RD$ ${n.toLocaleString("en-US")}`;
