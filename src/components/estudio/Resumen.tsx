import { designs, designPerNail, finishes, chosenSystems, systemLinePrice, retiroPrice, shapes, sizeOf, rd, type NailSet } from "@/lib/nails";
import { setLabel } from "./parts";

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
  for (const { d, n } of ds) rows.push({ label: `Diseño ${d.name} · ${n} ${n === 1 ? "uña" : "uñas"} × ${rd(designPerNail(d.id))}`, price: designPerNail(d.id) * n });
  return rows;
}

export function Resumen({ set, total }: { set: NailSet; total: number }) {
  const complementos = set.finishes.map((f) => finishes.find((x) => x.id === f)?.name).filter(Boolean).join(", ") || "Ninguno";
  return (
    <div className="mx-auto max-w-3xl">
      <div className="space-y-4">
        <span className="inline-block rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground">Cotización</span>
        <h1 className="text-5xl text-primary">Tu cotización</h1>
        <div className="space-y-3 rounded-3xl border border-border bg-card p-5 shadow-soft">
          <Line k="Sistema · Largo · Forma" v={setLabel(set)} />
          <Line k="Diseños" v={chosenDesigns(set)} />
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

function chosenDesigns(set: NailSet) {
  const ds = Object.entries(set.designs).filter(([, n]) => n).map(([id]) => designs.find((d) => d.id === id)?.name).filter(Boolean);
  return ds.length ? ds.join(", ") : "Ninguno";
}
