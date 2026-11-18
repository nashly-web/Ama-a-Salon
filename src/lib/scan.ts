// Escáner de diseño: tipos, validación de la respuesta de la IA y paso al Estudio.
// Los precios NUNCA salen de aquí: se calculan con las funciones de nails.ts.
import { z } from "zod";
import { designs, emptyFingers, emptySet, finishes, MAX_NAILS, shapes, systems, countDesigns, type Fingers, type NailSet } from "./nails";

export const shapeIds = shapes.map((s) => s.id);
export const finishIds = finishes.map((f) => f.id);
export const designIds = designs.map((d) => d.id);

/** Lo que pedimos a la IA (formato estricto). Se valida con zod y se filtra contra el catálogo. */
const rawSchema = z.object({
  valid: z.boolean(),
  shape: z.string().nullable().catch(null),
  lengthEstimate: z.number().nullable().catch(null),
  finishes: z.array(z.string()).catch([]),
  designsPerFinger: z.array(z.array(z.string()).catch([])).catch([]),
  detectedElements: z
    .array(z.object({ label: z.string(), mappedId: z.string().nullable().catch(null), confidence: z.number().catch(0.5) }))
    .catch([]),
  notes: z.string().catch(""),
});

export type ScanElement = { label: string; mappedId: string | null; confidence: number };
export type ScanResult = {
  valid: boolean;
  shape: string | null;
  lengthEstimate: number | null;
  finishes: string[];
  /** Siempre 10 listas (una por uña), solo con ids de diseños del catálogo */
  designsPerFinger: Fingers;
  detectedElements: ScanElement[];
  notes: string;
};

const inCatalog = (id: string | null | undefined): id is string =>
  !!id && (finishIds.includes(id) || designIds.includes(id) || shapeIds.includes(id));

/** Ordena según el catálogo y quita repetidos */
const sortBy = (catalog: string[], ids: string[]) => catalog.filter((id) => ids.includes(id));

/**
 * Valida la respuesta de la IA y descarta todo id que no exista en el catálogo.
 * Devuelve null si la respuesta no tiene la forma esperada.
 */
export function sanitizeScan(raw: unknown): ScanResult | null {
  const parsed = rawSchema.safeParse(raw);
  if (!parsed.success) return null;
  const r = parsed.data;

  const shape = r.shape && shapeIds.includes(r.shape) ? r.shape : null;
  const len = r.lengthEstimate == null ? null : Math.round(r.lengthEstimate);
  const lengthEstimate = len != null && len >= 1 && len <= 8 ? len : null;
  const fins = sortBy(finishIds, r.finishes);

  let fingers: Fingers = emptyFingers().map((_, i) => sortBy(designIds, r.designsPerFinger[i] ?? []));

  const detectedElements: ScanElement[] = r.detectedElements
    .filter((e) => e.label.trim())
    .map((e) => ({
      label: e.label.trim().slice(0, 80),
      mappedId: inCatalog(e.mappedId) ? e.mappedId : null,
      confidence: Math.min(1, Math.max(0, e.confidence)),
    }));

  // Si la IA vio diseños pero no supo en qué uñas, se ponen como acento en los anulares.
  if (!fingers.some((f) => f.length)) {
    const seen = sortBy(designIds, detectedElements.map((e) => e.mappedId ?? ""));
    if (seen.length) fingers = fingers.map((f, i) => (i === 1 || i === 8 ? seen : f));
  }

  return {
    valid: r.valid,
    shape,
    lengthEstimate,
    finishes: fins,
    designsPerFinger: fingers.slice(0, MAX_NAILS),
    detectedElements,
    notes: r.notes.trim().slice(0, 400),
  };
}

/** Convierte el resultado del escáner en el estado del Estudio (NailSet + Fingers). */
export function scanToState(
  scan: Pick<ScanResult, "shape" | "finishes" | "designsPerFinger">,
  choice: { systems: string[]; length: number; shape?: string | null },
): { set: NailSet; fingers: Fingers } {
  const fingers = emptyFingers().map((_, i) => sortBy(designIds, scan.designsPerFinger[i] ?? []));
  return {
    fingers,
    set: {
      ...emptySet,
      systems: choice.systems,
      length: choice.length,
      shape: choice.shape !== undefined ? choice.shape : scan.shape,
      finishes: sortBy(finishIds, scan.finishes),
      designs: countDesigns(fingers),
    },
  };
}

// ——— Paso al Estudio: solo el diseño (nunca la foto), en sessionStorage ———
const HANDOFF_KEY = "amaia-escaner-set";

export function saveHandoff(state: { set: NailSet; fingers: Fingers }) {
  try {
    sessionStorage.setItem(HANDOFF_KEY, JSON.stringify(state));
  } catch {
    /* sin almacenamiento: el Estudio abre vacío */
  }
}

/** Lee y borra el diseño que dejó el escáner, si existe y es válido */
export function takeHandoff(): { set: NailSet; fingers: Fingers } | null {
  try {
    const raw = sessionStorage.getItem(HANDOFF_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(HANDOFF_KEY);
    const data = JSON.parse(raw) as { set?: NailSet; fingers?: unknown };
    if (!data.set || !Array.isArray(data.fingers)) return null;
    const scan = sanitizeScan({ valid: true, shape: data.set.shape, lengthEstimate: data.set.length, finishes: data.set.finishes, designsPerFinger: data.fingers, detectedElements: [], notes: "" });
    if (!scan) return null;
    const state = scanToState(scan, { systems: (data.set.systems ?? []).filter((s) => systems.some((x) => x.id === s)).slice(0, 1), length: scan.lengthEstimate ?? emptySet.length });
    return { ...state, set: { ...state.set, retoque: !!data.set.retoque, retiro: !!data.set.retiro } };
  } catch {
    return null;
  }
}
