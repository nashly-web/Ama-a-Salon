import { useMemo, useState } from "react";
import { addDesign, cheapestSystem, removeDesign, retiroPrice, selectSystem, totalPrice, type Fingers } from "@/lib/nails";
import { scanToState, type ScanResult } from "@/lib/scan";

export type Draft = { systems: string[]; length: number; shape: string | null; finishes: string[]; fingers: Fingers };

const DEFAULT_LENGTH = 3;

/** El sistema no se ve en la foto: arrancamos con el más económico para ese largo */
export const draftFromScan = (s: ScanResult): Draft => {
  const length = s.lengthEstimate ?? DEFAULT_LENGTH;
  return {
  systems: [cheapestSystem(length)],
  length,
  shape: s.shape,
  finishes: s.finishes,
  fingers: s.designsPerFinger,
  };
};

/** Estado editable del resultado y su cotización (siempre con totalPrice del catálogo) */
export function useDraft(initial: Draft) {
  const [d, setD] = useState(initial);
  const state = useMemo(
    () => scanToState({ shape: d.shape, finishes: d.finishes, designsPerFinger: d.fingers }, { systems: d.systems, length: d.length, shape: d.shape }),
    [d],
  );
  const set = state.set;
  const total = totalPrice(set);
  const items = set.systems.length + (set.retiro && retiroPrice(set) ? 1 : 0) + 1 + (set.shape ? 1 : 0) + set.finishes.length + Object.values(set.designs).filter(Boolean).length;

  const toggle = (list: string[], id: string) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  return {
    draft: d,
    state,
    total,
    items,
    reset: (x: Draft) => setD(x),
    selectSystem: (id: string) => setD((p) => ({ ...p, systems: selectSystem(id) })),
    setLength: (length: number) => setD((p) => ({ ...p, length })),
    setShape: (shape: string | null) => setD((p) => ({ ...p, shape })),
    toggleFinish: (id: string) => setD((p) => ({ ...p, finishes: toggle(p.finishes, id) })),
    plusDesign: (id: string) => setD((p) => ({ ...p, fingers: addDesign(p.fingers, id) })),
    minusDesign: (id: string) => setD((p) => ({ ...p, fingers: removeDesign(p.fingers, id) })),
  };
}
