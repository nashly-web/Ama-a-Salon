import { nailImg } from "@/lib/nail-images";
import { designs, designPriceLabel, MAX_NAILS, rd, designPerNail, type NailSet } from "@/lib/nails";
import { Title } from "./parts";

type Props = {
  set: NailSet;
  onPlus: (id: string) => void;
  onMinus: (id: string) => void;
};

/** Elige tus diseños: tarjetas con foto y cuántas uñas lo llevan. Es opcional. */
export function Disenos({ set, onPlus, onMinus }: Props) {
  return (<>
    <Title t="Elige tus diseños" s="Toca + en el diseño que te guste y elige en cuántas uñas lo quieres. Es opcional: puedes seguir sin diseños." />
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
      {designs.map((d) => {
        const n = set.designs[d.id] ?? 0;
        return (
          <div key={d.id} className={`flex flex-col rounded-3xl border-2 bg-card p-4 shadow-soft transition ${n ? "border-primary" : "border-transparent"}`}>
            <button type="button" onClick={() => onPlus(d.id)} disabled={n >= MAX_NAILS} className="text-left disabled:cursor-default" aria-label={`Añadir ${d.name}`}>
              <img src={nailImg("design", d.id)} alt={d.name} loading="lazy" width={640} height={640} className="mb-3 aspect-square w-full rounded-2xl bg-secondary object-cover" />
              <p className="font-display text-xl leading-tight">{d.name}</p>
              <p className="text-xs text-muted-foreground">{designPriceLabel(d)}</p>
            </button>
            <div className="mt-3 flex items-center justify-between rounded-full bg-secondary text-sm">
              <button type="button" aria-label={`Quitar ${d.name}`} onClick={() => onMinus(d.id)} disabled={!n} className="h-9 w-9 rounded-full disabled:opacity-30">−</button>
              <span className="text-center">{n} {n === 1 ? "uña" : "uñas"}</span>
              <button type="button" aria-label={`Añadir ${d.name} a otra uña`} onClick={() => onPlus(d.id)} disabled={n >= MAX_NAILS} className="h-9 w-9 rounded-full disabled:opacity-30">+</button>
            </div>
            {n > 0 && <p className="mt-2 text-center text-xs font-medium text-primary">✓ {rd(designPerNail(d.id) * n)}</p>}
          </div>
        );
      })}
    </div>
  </>);
}
