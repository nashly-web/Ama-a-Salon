export type Option = { id: string; name: string; price: number; note?: string };

export const systems = [
  { id: "acrigel", name: "Acrigel", prices: [1200, 1300, 1400, 1500] },
  { id: "builder-cuccio", name: "Builder Cuccio", prices: [1350, 1400, 1450, 1500] },
  { id: "builder-gel", name: "Builder Gel", prices: [1300, 1350, 1400, 1450] },
  { id: "soft-gel", name: "Soft gel / Press on", prices: [1000, 1100, 1200, 1250] },
  { id: "cover", name: "Cover liso", prices: [1000, 1200, 1400, 1600] },
];

export const lengths = [
  "Muy corto", "Corto", "Corto medio", "Medio", "Largo", "Extra largo", "Muy largo", "Muy extra largo",
].map((name, i) => ({ id: i + 1, name, size: (["S", "M", "L", "SL"] as const)[Math.floor(i / 2)] }));

export const shapes: Option[] = [
  { id: "cuadrada", name: "Cuadrada", price: 0 },
  { id: "almendrada", name: "Almendrada", price: 0 },
  { id: "coffin", name: "Coffin", price: 0 },
  { id: "ovalada", name: "Ovalada", price: 0 },
  { id: "stiletto", name: "Stiletto", price: 1000 },
  { id: "redonda", name: "Redonda", price: 0 },
];

export const finishes: Option[] = [
  { id: "gel", name: "Esmaltado en gel", price: 400 },
  { id: "french-luna", name: "French media luna", price: 300 },
  { id: "french-fino", name: "French fino recto", price: 200 },
  { id: "chrome", name: "Chrome / Espejo", price: 500 },
  { id: "cateye", name: "Cat eye", price: 500 },
  { id: "matte", name: "Matte", price: 200 },
  { id: "cristal", name: "Cristal", price: 700 },
  { id: "babyboomer", name: "Baby Boomer", price: 1300 },
];

export const designs: Option[] = [
  { id: "sencillo", name: "Sencillo", price: 200 },
  { id: "flores", name: "Flores", price: 200 },
  { id: "piedras", name: "Piedras", price: 150 },
  { id: "french", name: "French", price: 200 },
  { id: "3d", name: "Diseño 3D", price: 300 },
];

export const MAX_NAILS = 10;

export type NailSet = {
  system: string | null;
  length: number;
  shape: string | null;
  finishes: string[];
  designs: Record<string, number>;
};

export const emptySet: NailSet = { system: null, length: 4, shape: null, finishes: [], designs: {} };

export function systemPrice(systemId: string | null, length: number) {
  const s = systems.find((x) => x.id === systemId);
  return s?.prices[Math.floor((length - 1) / 2)] ?? 0;
}

export function nailsUsed(set: NailSet) {
  return Object.values(set.designs).reduce((a, b) => a + b, 0);
}

export function totalPrice(set: NailSet) {
  let t = systemPrice(set.system, set.length);
  t += shapes.find((s) => s.id === set.shape)?.price ?? 0;
  for (const f of set.finishes) t += finishes.find((x) => x.id === f)?.price ?? 0;
  for (const [id, n] of Object.entries(set.designs)) t += (designs.find((d) => d.id === id)?.price ?? 0) * n;
  return t;
}

export const rd = (n = 0) => `RD$ ${n.toLocaleString("en-US")}`;
