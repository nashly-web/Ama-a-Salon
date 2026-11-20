import { designs, designPerNail, finishes, chosenSystems, systemLinePrice, retiroPrice, shapes, sizeOf, rd, type NailSet } from "@/lib/nails";
import { odooName, odooPrice, type OdooCatalog } from "@/lib/odoo-catalog";

export function priceRows(set: NailSet, catalog?: OdooCatalog) {
  const sh = shapes.find((s) => s.id === set.shape);
  const rows: { label: string; price: number }[] = [];
  const size = `#${set.length} · ${sizeOf(set.length)}`;
  for (const s of chosenSystems(set)) {
    const retoque = !!set.retoque && s.retoque != null;
    const name = catalog ? odooName(catalog, s.odooCode, s.name) : s.name;
    rows.push({ label: retoque ? `Retoque ${name}` : `${name} (largo ${size})`, price: systemLinePrice(s, set, catalog) });
  }
  // Las formas no tienen recargo: solo se muestra una línea si alguna llegara a tener precio
  const shapePrice = sh ? (catalog ? (odooPrice(catalog, sh.odooCode) ?? sh.price) : sh.price) : 0;
  if (sh && shapePrice) rows.push({ label: `Forma ${catalog ? odooName(catalog, sh.odooCode, sh.name) : sh.name}`, price: shapePrice });
  if (retiroPrice(set, catalog)) rows.push({ label: `Retiro ${chosenSystems(set).filter((s) => s.retiro).map((s) => catalog ? odooName(catalog, s.odooCode, s.name) : s.name).join(" + ")}`, price: retiroPrice(set, catalog) });
  const fs = set.finishes.map((f) => finishes.find((x) => x.id === f)).filter((f): f is NonNullable<typeof f> => !!f);
  if (fs.length) rows.push({ label: `Acabados: ${fs.map((f) => catalog ? odooName(catalog, f.odooCode, f.name) : f.name).join(", ")}`, price: fs.reduce((a, f) => a + (catalog ? (odooPrice(catalog, f.odooCode) ?? 0) : f.price), 0) });
  const ds = Object.entries(set.designs).filter(([, n]) => n).map(([id, n]) => ({ d: designs.find((x) => x.id === id)!, n }));
  for (const { d, n } of ds) rows.push({ label: `Diseño ${catalog ? odooName(catalog, d.odooCode, d.name) : d.name} · ${n} ${n === 1 ? "uña" : "uñas"} × ${rd(designPerNail(d.id, catalog))}`, price: designPerNail(d.id, catalog) * n });
  return rows;
}

export function Resumen({ set, total, catalog }: { set: NailSet; total: number; catalog?: OdooCatalog }) {
  const complementos = set.finishes.map((f) => finishes.find((x) => x.id === f)).filter((f): f is NonNullable<typeof f> => !!f).map((f) => catalog ? odooName(catalog, f.odooCode, f.name) : f.name).join(", ") || "Ninguno";
  return (
    <div className="mx-auto max-w-3xl">
      <div className="space-y-4">
        <span className="inline-block rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground">Cotización</span>
        <h1 className="text-5xl text-primary">Tu cotización</h1>
        <div className="space-y-3 rounded-3xl border border-border bg-card p-5 shadow-soft">
          <Line k="Sistema · Largo · Forma" v={setLabel(set, catalog)} />
          <Line k="Diseños" v={chosenDesigns(set, catalog)} />
          <Line k="Complementos" v={complementos} />
        </div>
        <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
          <ul className="divide-y divide-border">
            {priceRows(set, catalog).map((r) => (
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

function setLabel(set: NailSet, catalog?: OdooCatalog) {
  const sys = chosenSystems(set).map((x) => catalog ? odooName(catalog, x.odooCode, x.name) : x.name).join(" + ") || "Sin sistema";
  const shape = shapes.find((x) => x.id === set.shape);
  const sh = shape ? catalog ? odooName(catalog, shape.odooCode, shape.name) : shape.name : "Sin forma";
  return `${sys} · #${set.length} · ${sh}`;
}

function chosenDesigns(set: NailSet, catalog?: OdooCatalog) {
  const ds = Object.entries(set.designs).filter(([, n]) => n).map(([id]) => designs.find((d) => d.id === id)).filter((d): d is NonNullable<typeof d> => !!d).map((d) => catalog ? odooName(catalog, d.odooCode, d.name) : d.name);
  return ds.length ? ds.join(", ") : "Ninguno";
}
