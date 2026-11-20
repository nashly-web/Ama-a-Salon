import { useState } from "react";
import { designPriceLabel, designs, finishes, lengths, MAX_NAILS, rd, shapes, systemPrice, systemsByPrice } from "@/lib/nails";
import { nailImg } from "@/lib/nail-images";
import type { ScanResult } from "@/lib/scan";
import { Hands } from "@/components/estudio/parts";
import { Chip, Pill, Section, confidenceLabel } from "./Chips";
import type { useDraft } from "./useDraft";
import { PhotoFrame } from "./PhotoFrame";
import { PriceGuide } from "./PriceGuide";
import { hasOdooProduct, odooName, odooPrice, type OdooCatalog } from "@/lib/odoo-catalog";

type Props = { scan: ScanResult; image: string; q: ReturnType<typeof useDraft>; onChange: () => void; onUse: () => void; catalog: OdooCatalog };

export function Resultado({ scan, image, q, onChange, onUse, catalog }: Props) {
  const { draft, state, total } = q;
  const detected = scan.detectedElements.filter((e) => e.mappedId);
  const unmapped = scan.detectedElements.filter((e) => !e.mappedId);
  const availableFinishes = finishes.filter((f) => hasOdooProduct(catalog, f.odooCode));
  const availableDesigns = designs.filter((d) => hasOdooProduct(catalog, d.odooCode));
  const otherFinishes = availableFinishes.filter((f) => !draft.finishes.includes(f.id));
  const [touched, setTouched] = useState(false);

  return (
    <div className="grid gap-6 pb-28 lg:grid-cols-[minmax(0,1fr)_420px] lg:pb-32">
      <div className="space-y-6">
        <div className="overflow-hidden rounded-3xl bg-card shadow-soft">
          <PhotoFrame src={image} alt="Tu foto de inspiración" />
          <div className="flex flex-wrap items-center justify-between gap-3 p-4">
            <p className="text-xs text-muted-foreground">Tu foto solo se usó para analizar el diseño; no la guardamos.</p>
            <button type="button" onClick={onChange} className="rounded-full bg-secondary px-5 py-2.5 text-sm font-medium text-secondary-foreground shadow-soft transition hover:bg-accent">Cambiar foto</button>
          </div>
        </div>

        <div className="rounded-3xl bg-card p-5 shadow-soft">
          <Section title="Lo que vimos en tu foto" hint="Cada elemento está unido a un servicio de nuestra lista oficial.">
            {detected.length ? (
              <ul className="flex flex-wrap gap-2">
                {detected.map((e, i) => (
                  <li key={i}><Chip><span className="font-medium">{e.label}</span><span className="pr-2 text-xs text-muted-foreground">· {confidenceLabel(e.confidence)}</span></Chip></li>
                ))}
              </ul>
            ) : <p className="text-sm text-muted-foreground">No reconocimos acabados ni diseños de la lista; puedes añadirlos a la derecha.</p>}
          </Section>
          {(unmapped.length > 0 || scan.notes) && (
            <div className="mt-5 rounded-2xl bg-secondary p-4">
              <p className="font-display text-xl">Consultar en el salón</p>
              {unmapped.length > 0 && <p className="mt-1 text-sm">{unmapped.map((e) => e.label).join(" · ")}</p>}
              {scan.notes && <p className="mt-1 text-sm text-muted-foreground">{scan.notes}</p>}
              <p className="mt-2 text-xs text-muted-foreground">Esto no está incluido en el precio; el salón te lo confirma.</p>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-secondary p-6">
          <Hands fingers={draft.fingers} small />
          <p className="text-xs text-muted-foreground">Diseños por uña · Mano izquierda · Mano derecha</p>
        </div>
      </div>

      <div className="space-y-6 rounded-3xl bg-card p-5 shadow-soft md:p-6">
        <div className="rounded-2xl bg-secondary p-4">
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-display text-2xl">Total estimado</p>
            <p className="font-display text-3xl text-primary">{rd(total)}</p>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Estimado según tu foto; el salón confirma el precio final.</p>
        </div>

        <Section title="Tu sistema" hint="No se ve en una foto: marcamos el más económico. Toca otro para cambiarlo.">
          <PriceGuide active={!touched}>
            <div className="flex flex-wrap gap-2">
              {systemsByPrice(draft.length, catalog).map((s) => (
                <Pill key={s.id} on={draft.systems.includes(s.id)} onClick={() => { setTouched(true); q.selectSystem(s.id); }}>{s.name} · <span data-price>{rd(systemPrice(s.id, draft.length, catalog))}</span></Pill>
              ))}
            </div>
          </PriceGuide>
          {!touched && <p className="text-center text-xs font-medium text-primary motion-safe:animate-pulse">Toca para elegir el sistema que desees</p>}
        </Section>

        <Section title="Largo" hint={scan.lengthEstimate ? "Sugerido según tu foto; cámbialo si quieres." : "No pudimos estimarlo; elige el tuyo."}>
          <div className="flex flex-wrap gap-2">
            {lengths.map((l) => <Pill key={l.id} on={draft.length === l.id} onClick={() => q.setLength(l.id)} tag={scan.lengthEstimate === l.id ? "sugerido" : undefined}>#{l.id} {l.name}</Pill>)}
          </div>
        </Section>

        <Section title="Forma" hint={scan.shape ? "Sugerida según tu foto." : "No pudimos estimarla; elige la tuya."}>
          <div className="flex flex-wrap gap-2">
            {shapes.map((s) => (
              <Pill key={s.id} on={draft.shape === s.id} onClick={() => q.setShape(draft.shape === s.id ? null : s.id)} tag={scan.shape === s.id ? "sugerida" : undefined}>
                {odooName(catalog, s.odooCode, s.name)}{(odooPrice(catalog, s.odooCode) ?? s.price) ? ` · +${rd(odooPrice(catalog, s.odooCode) ?? s.price)}` : ""}
              </Pill>
            ))}
          </div>
        </Section>

        <Section title="Acabados">
          <div className="flex flex-wrap gap-2">
            {draft.finishes.length === 0 && <p className="text-sm text-muted-foreground">Sin acabados detectados.</p>}
            {draft.finishes.map((id) => {
              const f = availableFinishes.find((x) => x.id === id)!;
              return f ? <Chip key={id} label={odooName(catalog, f.odooCode, f.name)} onRemove={() => q.toggleFinish(id)}><span className="font-medium">{odooName(catalog, f.odooCode, f.name)}</span><span className="text-xs text-muted-foreground">{rd(odooPrice(catalog, f.odooCode) ?? 0)}</span></Chip> : null;
            })}
          </div>
          {otherFinishes.length > 0 && (
            <details className="group">
              <summary className="cursor-pointer list-none text-sm font-medium text-primary">+ Añadir otro acabado</summary>
              <div className="mt-2 flex flex-wrap gap-2">
                {otherFinishes.map((f) => <Pill key={f.id} on={false} onClick={() => q.toggleFinish(f.id)}>{odooName(catalog, f.odooCode, f.name)} · {rd(odooPrice(catalog, f.odooCode) ?? 0)}</Pill>)}
              </div>
            </details>
          )}
        </Section>

        <Section title="Diseños por uña" hint="Cada diseño se cobra por uña. Podrás elegir en qué dedos van en el Estudio.">          <ul className="divide-y divide-border">
            {availableDesigns.map((d) => {
              const n = state.set.designs[d.id] ?? 0;
              return (
                <li key={d.id} className="flex items-center gap-3 py-2.5">
                  <img src={nailImg("design", d.id)} alt="" loading="lazy" width={40} height={40} className={`h-10 w-10 shrink-0 rounded-full object-cover ${n ? "ring-2 ring-primary" : ""}`} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium leading-tight">{odooName(catalog, d.odooCode, d.name)}</span>
                    <span className="block text-xs text-muted-foreground">{designPriceLabel(d, catalog)}</span>
                  </span>
                  <div className="flex shrink-0 items-center rounded-full bg-secondary text-sm">
                    <button type="button" aria-label={`Quitar ${d.name}`} onClick={() => q.minusDesign(d.id)} disabled={!n} className="h-10 w-10 rounded-full disabled:opacity-30">−</button>
                    <span className="min-w-14 text-center">{n} {n === 1 ? "uña" : "uñas"}</span>
                    <button type="button" aria-label={`Añadir ${d.name}`} onClick={() => q.plusDesign(d.id)} disabled={n >= MAX_NAILS} className="h-10 w-10 rounded-full disabled:opacity-30">+</button>
                  </div>
                </li>
              );
            })}
          </ul>
        </Section>

      </div>

      {/* CTA flotante: siempre a la vista mientras se revisa el resultado */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="pointer-events-auto w-full max-w-md">
          {!draft.systems.length && (
            <p className="mb-2 text-center text-xs font-medium text-primary">Elige tu sistema para continuar.</p>
          )}
          <div className="relative">
            <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full bg-gradient-cta opacity-60 blur-xl motion-safe:animate-cta-pulse" />
            <button
              type="button"
              onClick={onUse}
              disabled={!draft.systems.length}
              className="cta-shine relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-full bg-gradient-cta px-5 py-4 text-primary-foreground shadow-glow transition hover:-translate-y-0.5 disabled:opacity-50 disabled:after:hidden disabled:hover:translate-y-0 sm:px-7"
            >
              <span className="relative z-10 flex min-w-0 items-center gap-2 text-sm font-medium sm:text-base">
                <span aria-hidden className="shrink-0 text-highlight">✦</span>
                <span className="truncate">Usar este diseño en mi cotización</span>
              </span>
              <span className="relative z-10 shrink-0 font-display text-lg leading-none sm:text-xl">{rd(total)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
