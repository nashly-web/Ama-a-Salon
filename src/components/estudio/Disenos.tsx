import { useState } from "react";
import { nailImg } from "@/lib/nail-images";
import { designs, designCombos, fingerName, MAX_NAILS, nailsDecorated, rd, type Fingers, type NailSet } from "@/lib/nails";
import { Hands, Title, setPhoto } from "./parts";

type Props = {
  set: NailSet;
  fingers: Fingers;
  onPlus: (id: string) => void;
  onMinus: (id: string) => void;
  onTap: (i: number, design: string | null) => void;
  onMore: () => void;
};

export function Disenos({ set, fingers, onPlus, onMinus, onTap, onMore }: Props) {
  const [active, setActive] = useState<string | null>(designs[0]?.id ?? null);
  const used = nailsDecorated(fingers);
  const combos = designCombos(fingers);
  const activeName = designs.find((d) => d.id === active)?.name;
  return (<>
    <Title t="Distribuye tus diseños" s="Elige un diseño a la derecha y toca los dedos donde lo quieres. Puedes combinar varios diseños en la misma uña; toca otra vez para quitar solo ese diseño." />
    <div className="grid gap-6 md:grid-cols-[1fr_380px]">
      <div className="flex flex-col items-center justify-center gap-6 rounded-3xl border border-border bg-secondary p-6">
        <img src={setPhoto(set)} alt="Foto de tu set" width={640} height={640} className="aspect-[4/3] w-full max-w-md rounded-2xl object-cover shadow-soft" />
        <Hands fingers={fingers} activeDesign={active} onTap={(i) => onTap(i, active)} />
        <p className="text-center text-xs text-muted-foreground">
          {activeName ? <>Tocando un dedo añades o quitas <span className="font-medium text-foreground">{activeName}</span> · </> : null}Mano izquierda · Mano derecha · Interpretación aproximada
        </p>
        {combos.length > 0 && (
          <ul className="w-full max-w-md space-y-1.5">
            {combos.map((c) => (
              <li key={c.ids.join("+")} className="flex items-baseline justify-between gap-3 rounded-2xl bg-card px-3 py-2 text-xs">
                <span className="min-w-0"><span className="font-medium">{c.name}</span> <span className="text-muted-foreground">· {c.fingers.map(fingerName).join(", ")}</span></span>
                <span className="shrink-0 text-muted-foreground">{rd(c.perNail)} por uña</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
        <h2 className="text-3xl">Diseños por uña</h2>
        <ul className="mt-3 divide-y divide-border">
          {designs.map((d) => {
            const n = set.designs[d.id] ?? 0;
            const on = active === d.id;
            return (
              <li key={d.id} className={`flex items-center gap-3 rounded-2xl px-2 py-3 transition ${on ? "bg-secondary" : ""}`}>
                <button type="button" onClick={() => setActive(d.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left" aria-pressed={on}>
                  <img src={nailImg("design", d.id)} alt="" loading="lazy" width={44} height={44} className={`h-11 w-11 shrink-0 rounded-full object-cover ${on ? "ring-2 ring-primary" : ""}`} />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium leading-tight">{d.name}</span>
                    <span className="block text-xs text-muted-foreground">{d.note === "Desde" ? "Desde " : ""}{rd(d.price)} por uña</span>
                  </span>
                </button>
                <div className="flex shrink-0 items-center rounded-full bg-secondary text-sm">
                  <button type="button" aria-label={`Quitar ${d.name}`} onClick={() => onMinus(d.id)} disabled={!n} className="h-8 w-8 rounded-full disabled:opacity-30">−</button>
                  <span className="min-w-12 text-center">{n} {n === 1 ? "uña" : "uñas"}</span>
                  <button type="button" aria-label={`Añadir ${d.name}`} onClick={() => onPlus(d.id)} disabled={n >= MAX_NAILS} className="h-8 w-8 rounded-full disabled:opacity-30">+</button>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="mt-3 border-t border-border pt-4">
          <div className="flex items-center justify-between text-sm font-semibold">
            <span>{used} de {MAX_NAILS} uñas decoradas{combos.some((c) => c.ids.length > 1) ? " · con combinaciones" : ""}</span>
            {used === MAX_NAILS && <span className="text-primary">✓</span>}
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(used / MAX_NAILS) * 100}%` }} />
          </div>
          <button type="button" onClick={onMore} className="mt-5 w-full rounded-full bg-primary py-3 font-medium text-primary-foreground shadow-soft">Seguir agregando</button>
        </div>
      </div>
    </div>
  </>);
}
