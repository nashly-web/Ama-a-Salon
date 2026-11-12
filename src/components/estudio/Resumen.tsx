import { designs, finishes, chosenSystems, systemLinePrice, retiroPrice, shapes, sizeOf, MAX_NAILS, nailsUsed, rd, type NailSet } from "@/lib/nails";
import { useState } from "react";
import { Hands, setLabel, setPhoto } from "./parts";
import { HandSim, type Layer } from "./HandSim";

export function priceRows(set: NailSet) {
  const sh = shapes.find((s) => s.id === set.shape);
  const rows: { label: string; price: number }[] = [];
  const size = `#${set.length} · ${sizeOf(set.length)}`;
  for (const s of chosenSystems(set)) {
    const retoque = !!set.retoque && s.retoque != null;
    rows.push({ label: retoque ? `Retoque ${s.name}` : `${s.name} (largo ${size})`, price: systemLinePrice(s, set) });
  }
  if (sh) rows.push({ label: `Forma ${sh.name}`, price: sh.price });
  if (retiroPrice(set)) rows.push({ label: `Retiro ${chosenSystems(set).filter((s) => s.retiro).map((s) => s.name).join(" + ")}`, price: retiroPrice(set) });
  const fs = set.finishes.map((f) => finishes.find((x) => x.id === f)!).filter(Boolean);
  if (fs.length) rows.push({ label: `Acabados: ${fs.map((f) => f.name).join(", ")}`, price: fs.reduce((a, f) => a + f.price, 0) });
  const ds = Object.entries(set.designs).filter(([, n]) => n).map(([id, n]) => ({ d: designs.find((x) => x.id === id)!, n }));
  if (ds.length) rows.push({ label: `Diseños: ${ds.map(({ d, n }) => `${d.name} ×${n}`).join(", ")}`, price: ds.reduce((a, { d, n }) => a + d.price * n, 0) });
  return rows;
}

export function Resumen({ set, fingers, total, quote }: { set: NailSet; fingers: (string | null)[]; total: number; quote: string }) {
  const [layer, setLayer] = useState<Layer>("todo");
  const complementos = set.finishes.map((f) => finishes.find((x) => x.id === f)?.name).filter(Boolean).join(", ") || "Ninguno";
  return (
    <div className="grid gap-6 md:grid-cols-[320px_1fr]">
      <div className="flex flex-col items-center gap-5 rounded-3xl border border-border bg-secondary p-6">
        <span className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground">Cotización #{quote}</span>
        <img src={setPhoto(set)} alt="Foto de tu set" width={640} height={640} className="aspect-square w-full rounded-2xl object-cover shadow-soft" />
        <Hands fingers={fingers} small />
        <p className="text-xs text-muted-foreground">Interpretación aproximada</p>
      </div>

      <div className="space-y-4">
        <h1 className="text-5xl text-primary">¡Tu set está tomando forma!</h1>
        <div className="rounded-3xl border border-border bg-secondary p-5 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-display text-2xl">Así va tu set</p>
            <div className="flex gap-2">
              {([["todo", "Todas las capas"], ["acabados", "Acabados"], ["disenos", "Diseños"]] as const).map(([id, t]) => (
                <button key={id} type="button" onClick={() => setLayer(id)} className={`rounded-full px-3 py-1.5 text-xs ${layer === id ? "bg-primary text-primary-foreground" : "bg-card"}`}>{t}</button>
              ))}
            </div>
          </div>
          <HandSim set={set} fingers={fingers} layer={layer} />
          <p className="text-center text-xs text-muted-foreground">Simulación con todos tus servicios · interpretación aproximada</p>
        </div>
        <div className="space-y-3 rounded-3xl border border-border bg-card p-5 shadow-soft">
          <Line k="Sistema · Largo · Forma" v={setLabel(set)} />
          <Line k="Uñas decoradas" v={`${nailsUsed(set)} de ${MAX_NAILS}`} />
          <Line k="Complementos" v={complementos} />
        </div>
        <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
          <ul className="divide-y divide-border">
            {priceRows(set).map((r) => (
              <li key={r.label} className="flex items-start justify-between gap-4 py-3">
                <span>{r.label}</span>
                <span className="shrink-0 text-sm text-muted-foreground">{r.price ? rd(r.price) : "Incluido"}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex items-center justify-between border-t border-border pt-4">
            <span className="font-semibold">Total estimado</span>
            <span className="font-display text-5xl text-primary">{rd(total)}</span>
          </div>
          <p className="mt-2 text-right text-xs text-muted-foreground">Precio aproximado; se confirma en el salón.</p>
        </div>
      </div>
    </div>
  );
}

function Line({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-sm text-muted-foreground">{k}</span>
      <span className="text-right text-lg">{v}</span>
    </div>
  );
}
