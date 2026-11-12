import { nailImg, lengthImg } from "@/lib/nail-images";
import { chosenSystems, designs, lengths, shapes, FINGER_NAMES, comboName, type NailSet, type Fingers } from "@/lib/nails";

export const FINGERS = FINGER_NAMES;
const HEIGHTS = [44, 54, 60, 54, 40, 40, 54, 60, 54, 44];

export function Photo({ src, alt }: { src?: string | undefined; alt: string }) {
  return <img src={src} alt={alt} loading="lazy" width={640} height={640} className="mb-3 aspect-square w-full rounded-2xl bg-secondary object-cover" />;
}

export function Title({ t, s }: { t: string; s?: string }) {
  return (<div className="mb-6"><h1 className="text-5xl text-primary">{t}</h1>{s && <p className="text-sm text-muted-foreground">{s}</p>}</div>);
}

export function setPhoto(set: NailSet) {
  return set.shape ? nailImg("shape", set.shape) : lengthImg(set.length);
}

export function setLabel(set: NailSet) {
  const sys = chosenSystems(set).map((x) => x.name).join(" + ") || "Sin sistema";
  const sh = shapes.find((x) => x.id === set.shape)?.name ?? "Sin forma";
  return `${sys} · #${set.length} · ${sh}`;
}

export const lengthName = (n: number) => lengths.find((l) => l.id === n)?.name ?? "";

/** Una uña de la mano: muestra las fotos de todos los diseños combinados en ella, o queda vacía */
export function NailTile({ ids, index, active, onClick, small }: { ids: string[]; index: number; active?: boolean | undefined; onClick?: (() => void) | undefined; small?: boolean | undefined }) {
  const ds = ids.map((id) => designs.find((x) => x.id === id)).filter((d) => !!d);
  const h = small ? Math.round(HEIGHTS[index]! * 0.6) : HEIGHTS[index]!;
  const label = `${FINGERS[index]} ${index < 5 ? "izquierdo" : "derecho"}: ${ds.length ? comboName(ids) : "sin diseño"}`;
  const cls = `relative ${small ? "w-6" : "w-10"} shrink-0 overflow-hidden rounded-t-full rounded-b-lg border-2 transition ${ds.length ? "border-primary" : "border-dashed border-primary/40 bg-card"} ${active ? "ring-2 ring-primary ring-offset-2 ring-offset-secondary" : ""}`;
  const inner = ds.length ? (<>
    <span className="flex h-full w-full flex-col">
      {ds.map((d) => <img key={d.id} src={nailImg("design", d.id)} alt="" className="min-h-0 w-full flex-1 object-cover" />)}
    </span>
    {ds.length > 1 && (
      <span className={`absolute inset-x-0 bottom-0 bg-primary text-center font-semibold leading-tight text-primary-foreground ${small ? "text-[8px]" : "text-[10px]"}`}>×{ds.length}</span>
    )}
  </>) : null;
  if (!onClick) return <div title={label} aria-label={label} className={cls} style={{ height: h }}>{inner}</div>;
  return <button type="button" onClick={onClick} title={label} aria-label={label} className={`${cls} hover:-translate-y-0.5`} style={{ height: h }}>{inner}</button>;
}

export function Hands({ fingers, onTap, small, activeDesign }: { fingers: Fingers; onTap?: ((i: number) => void) | undefined; small?: boolean | undefined; activeDesign?: string | null | undefined }) {
  const hand = (from: number) => (
    <div className={`flex items-end ${small ? "gap-1" : "gap-2"}`}>
      {fingers.slice(from, from + 5).map((ids, k) => (
        <NailTile key={from + k} index={from + k} ids={ids} small={small} active={!!activeDesign && ids.includes(activeDesign)} onClick={onTap ? () => onTap(from + k) : undefined} />
      ))}
    </div>
  );
  return (
    <div className={`flex items-end justify-center ${small ? "gap-4" : "gap-10"}`}>
      {hand(0)}
      {hand(5)}
    </div>
  );
}
