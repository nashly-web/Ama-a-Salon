import { X } from "lucide-react";
import type { ReactNode } from "react";

/** Píldora seleccionable, mismo estilo que las del Estudio */
export function Pill({ on, onClick, children, tag }: { on: boolean; onClick: () => void; children: ReactNode; tag?: string | undefined }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={on} className={`relative rounded-full px-4 py-2.5 text-sm transition hover:-translate-y-0.5 ${on ? "bg-primary text-primary-foreground shadow-soft" : "bg-secondary text-secondary-foreground"}`}>
      {children}
      {tag && <span className={`ml-1.5 text-[10px] uppercase tracking-wider ${on ? "text-primary-foreground/80" : "text-primary"}`}>{tag}</span>}
    </button>
  );
}

/** Elemento detectado o elegido, que se puede quitar */
export function Chip({ children, onRemove, label }: { children: ReactNode; onRemove?: (() => void) | undefined; label?: string | undefined }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary py-1.5 pl-3.5 pr-1.5 text-sm text-secondary-foreground">
      {children}
      {onRemove && (
        <button type="button" onClick={onRemove} aria-label={`Quitar ${label ?? ""}`} className="flex h-7 w-7 items-center justify-center rounded-full bg-card transition hover:bg-accent">
          <X className="h-3.5 w-3.5" aria-hidden />
        </button>
      )}
    </span>
  );
}

export function confidenceLabel(c: number) {
  return c >= 0.75 ? "Seguro" : c >= 0.45 ? "Probable" : "Posible";
}

export function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="font-display text-2xl">{title}</h2>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
      {children}
    </section>
  );
}
