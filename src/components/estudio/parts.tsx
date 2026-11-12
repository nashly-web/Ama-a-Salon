import { nailImg, lengthImg } from "@/lib/nail-images";
import { chosenSystems, designs, lengths, shapes, type NailSet } from "@/lib/nails";

export const FINGERS = ["Meñique", "Anular", "Medio", "Índice", "Pulgar", "Pulgar", "Índice", "Medio", "Anular", "Meñique"];
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

/** Una uña de la mano: muestra la foto del diseño asignado o queda vacía */
export function NailTile({ design, index, active, onClick, small }: { design: string | null; index: number; active?: boolean | undefined; onClick?: (() => void) | undefined; small?: boolean | undefined }) {
  const d = designs.find((x) => x.id === design);
  const h = small ? Math.round(HEIGHTS[index]! * 0.6) : HEIGHTS[index]!;
  const label = `${FINGERS[index]} ${index < 5 ? "izquierdo" : "derecho"}: ${d ? d.name : "sin diseño"}`;
  const cls = `${small ? "w-6" : "w-10"} shrink-0 overflow-hidden rounded-t-full rounded-b-lg border-2 transition ${d ? "border-primary" : "border-dashed border-primary/40 bg-card"} ${active ? "ring-2 ring-primary ring-offset-2 ring-offset-secondary" : ""}`;
  const inner = d ? <img src={nailImg("design", d.id)} alt="" className="h-full w-full object-cover" /> : null;
  if (!onClick) return <div title={label} aria-label={label} className={cls} style={{ height: h }}>{inner}</div>;
  return <button type="button" onClick={onClick} title={label} aria-label={label} className={`${cls} hover:-translate-y-0.5`} style={{ height: h }}>{inner}</button>;
}

export function Hands({ fingers, onTap, small }: { fingers: (string | null)[]; onTap?: ((i: number) => void) | undefined; small?: boolean | undefined }) {
  const hand = (from: number) => (
    <div className={`flex items-end ${small ? "gap-1" : "gap-2"}`}>
      {fingers.slice(from, from + 5).map((f, k) => (
        <NailTile key={from + k} index={from + k} design={f} small={small} onClick={onTap ? () => onTap(from + k) : undefined} />
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
