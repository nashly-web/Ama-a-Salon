import { rd } from "@/lib/nails";

/** Mismo indicador de cotización que el encabezado del Estudio */
export function QuotePill({ items, total }: { items: number; total: number }) {
  return (
    <div className="flex shrink-0 items-center gap-3 rounded-full bg-card py-1.5 pl-4 pr-1.5 shadow-soft" aria-live="polite">
      <div className="text-xs"><p className="font-semibold">Cotización</p><p className="text-muted-foreground">{items} elementos</p></div>
      <span className="rounded-full bg-primary px-4 py-2 font-display text-xl text-primary-foreground">{rd(total)}</span>
    </div>
  );
}
