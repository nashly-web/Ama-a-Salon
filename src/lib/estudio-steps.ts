import type { NailSet } from "./nails";

export const STEPS = ["Sistema", "Largo", "Forma", "Acabados", "Diseños", "Resumen", "Envío"] as const;

/** Pasos obligatorios del Estudio. Acabados y diseños son opcionales y se pueden saltar. */
const REQUIRED: { step: number; done: (s: NailSet) => boolean }[] = [
  { step: 0, done: (s) => s.systems.length > 0 },
  { step: 2, done: (s) => !!s.shape },
];

/** Pasos obligatorios anteriores a `target` que aún faltan */
export const missingBefore = (target: number, set: NailSet) =>
  REQUIRED.filter((r) => r.step < target && !r.done(set)).map((r) => r.step);

/** Se puede ir a un paso solo si los obligatorios anteriores están listos */
export const canReach = (target: number, set: NailSet) => missingBefore(target, set).length === 0;
