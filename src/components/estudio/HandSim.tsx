import { useId } from "react";
import { designs, finishes, type NailSet } from "@/lib/nails";
import { FINGERS } from "./parts";
import handPhoto from "@/assets/hand-sim.jpg";

/** Qué capas mostrar en la simulación */
export type Layer = "todo" | "acabados" | "disenos";

// Uñas sobre la foto de la mano izquierda (dorso): meñique → pulgar.
// cx/cy = cutícula en píxeles de la foto, r = medio ancho, bed = largo de la uña natural.
type Spot = { cx: number; cy: number; r: number; bed: number; rot: number };
const SPOTS: Spot[] = [
  { cx: 216, cy: 414, r: 12.5, bed: 41, rot: -2 },
  { cx: 306, cy: 324, r: 18, bed: 48, rot: -1 },
  { cx: 390, cy: 279, r: 19.5, bed: 48, rot: 0 },
  { cx: 471, cy: 326, r: 17.5, bed: 43, rot: 3 },
  { cx: 606, cy: 576, r: 14.5, bed: 46, rot: 27 },
];
const X0 = 170, HW = 490, GAP = 20, W = HW * 2 + GAP, Y0 = 130, H = 640;

const v = (t: string) => `var(--${t})`;

/** Silueta de la uña. Origen en la cutícula, crece hacia arriba (y negativa). */
export function nailPath(shape: string | null, r: number, h: number) {
  const cut = `M${-r} -1 Q0 5 ${r} -1`;
  switch (shape) {
    case "cuadrada":
      return `${cut} L${r} ${-h + 3} Q${r} ${-h} ${r - 3} ${-h} L${-r + 3} ${-h} Q${-r} ${-h} ${-r} ${-h + 3} Z`;
    case "coffin":
      return `${cut} L${r} ${-h * 0.62} L${r * 0.5} ${-h} L${-r * 0.5} ${-h} L${-r} ${-h * 0.62} Z`;
    case "almendrada":
      return `${cut} L${r} ${-h * 0.55} C${r} ${-h * 0.86} ${r * 0.3} ${-h} 0 ${-h} C${-r * 0.3} ${-h} ${-r} ${-h * 0.86} ${-r} ${-h * 0.55} Z`;
    case "stiletto":
      return `${cut} L${r} ${-h * 0.45} Q${r * 0.85} ${-h * 0.82} 0 ${-h} Q${-r * 0.85} ${-h * 0.82} ${-r} ${-h * 0.45} Z`;
    case "ovalada": {
      const ry = Math.min(r * 1.45, h - 2);
      return `${cut} L${r} ${-h + ry} A${r} ${ry} 0 0 0 ${-r} ${-h + ry} Z`;
    }
    default:
      return `${cut} L${r} ${-h + r} A${r} ${r} 0 0 0 ${-r} ${-h + r} Z`;
  }
}

/** Generador pseudoaleatorio estable para que el brillo no cambie al re-renderizar */
function rand(seed: number) {
  let s = seed * 9301 + 49297;
  return () => ((s = (s * 9301 + 49297) % 233280) / 233280);
}

function Nail({ uid, idx, shape, ext, r, bed, fin, design }: { uid: string; idx: number; shape: string | null; ext: number; r: number; bed: number; fin: string[]; design: string | null }) {
  const h = bed + ext;
  const d = nailPath(shape, r, h);
  const clip = `${uid}c${idx}`;
  const has = (f: string) => fin.includes(f);
  const base = has("babyboomer") ? `url(#${uid}bb)` : has("cateye") ? v("nail-cateye") : has("gel") ? v("nail-pink") : v("nail-nude");
  const tipDepth = Math.max(5, ext * 0.65 + 4);
  const R = rand(idx + 3);
  return (
    <g>
      <path d={d} transform="translate(1.5 2.5)" style={{ fill: v("nail-edge") }} opacity={0.25} />
      <clipPath id={clip}><path d={d} /></clipPath>
      <g clipPath={`url(#${clip})`}>
        <rect x={-r - 2} y={-h - 4} width={2 * r + 4} height={h + 10} style={{ fill: base }} />
        {has("cateye") && (<>
          <ellipse cx={0} cy={-h * 0.5} rx={r * 1.6} ry={h * 0.16} transform={`rotate(-32 0 ${-h * 0.5})`} style={{ fill: v("nail-chrome-a") }} opacity={0.3} />
          <ellipse cx={0} cy={-h * 0.5} rx={r * 1.6} ry={h * 0.06} transform={`rotate(-32 0 ${-h * 0.5})`} style={{ fill: v("nail-tip") }} opacity={0.7} />
        </>)}
        {has("chrome") && <rect x={-r - 2} y={-h - 4} width={2 * r + 4} height={h + 10} style={{ fill: `url(#${uid}chrome)` }} opacity={0.88} />}
        {(has("french-luna") || design === "french") && <ellipse cx={0} cy={-h} rx={r * 1.3} ry={tipDepth} style={{ fill: v("nail-tip") }} />}
        {has("french-fino") && <rect x={-r - 2} y={-h - 2} width={2 * r + 4} height={Math.max(4, ext * 0.3 + 3.5)} style={{ fill: v("nail-tip") }} />}
        {has("cristal") && (<>
          <rect x={-r - 2} y={-h - 4} width={2 * r + 4} height={h + 10} style={{ fill: v("nail-tip") }} opacity={0.22} />
          {[0.3, 0.55, 0.8].map((t, k) => <Star key={k} x={(k % 2 ? 0.35 : -0.3) * r} y={-h * t} s={2.6 - k * 0.4} />)}
        </>)}
        {has("efectos") && Array.from({ length: 22 }, (_, k) => (
          <circle key={k} cx={(R() * 2 - 1) * r} cy={-R() * h} r={0.5 + R() * 0.9} style={{ fill: v(k % 3 ? "nail-tip" : "nail-gold") }} opacity={0.9} />
        ))}
        <rect x={-r - 2} y={-h - 4} width={2 * r + 4} height={h + 10} style={{ fill: `url(#${uid}shade)` }} />
        {design && <Design id={design} r={r} h={h} uid={uid} />}
        {has("matte")
          ? <rect x={-r - 2} y={-h - 4} width={2 * r + 4} height={h + 10} style={{ fill: v("nail-tip") }} opacity={0.14} />
          : <rect x={-r * 0.62} y={-h * 0.86} width={r * 0.3} height={h * 0.58} rx={r * 0.15} style={{ fill: v("nail-tip") }} opacity={0.55} />}
      </g>
      <path d={d} fill="none" style={{ stroke: v("nail-edge") }} strokeWidth={0.7} opacity={0.55} />
    </g>
  );
}

function Star({ x, y, s }: { x: number; y: number; s: number }) {
  return <path d={`M${x} ${y - s} L${x + s * 0.3} ${y - s * 0.3} L${x + s} ${y} L${x + s * 0.3} ${y + s * 0.3} L${x} ${y + s} L${x - s * 0.3} ${y + s * 0.3} L${x - s} ${y} L${x - s * 0.3} ${y - s * 0.3}Z`} style={{ fill: v("nail-tip") }} />;
}

function Design({ id, r, h, uid }: { id: string; r: number; h: number; uid: string }) {
  const cy = -h * 0.5;
  if (id === "flores") {
    const pr = r * 0.34, dist = r * 0.42;
    return (
      <g>
        {[0, 72, 144, 216, 288].map((a) => (
          <circle key={a} cx={Math.sin((a * Math.PI) / 180) * dist} cy={cy - Math.cos((a * Math.PI) / 180) * dist} r={pr} style={{ fill: v("nail-tip") }} />
        ))}
        <circle cx={0} cy={cy} r={pr * 0.7} style={{ fill: v("nail-gold") }} />
      </g>
    );
  }
  if (id === "piedras") {
    const out = [];
    const step = 4.6;
    for (let y = -h + 2, row = 0; y < 2; y += step * 0.86, row++)
      for (let x = -r + (row % 2 ? step / 2 : 0); x <= r + 1; x += step)
        out.push(<circle key={`${x}-${y}`} cx={x} cy={y} r={2.1} style={{ fill: `url(#${uid}gem)`, stroke: v("nail-edge") }} strokeWidth={0.25} />);
    return <g>{out}</g>;
  }
  if (id === "3d") {
    const s = r * 0.8;
    const heart = `M0 ${s * 0.35} C${-s} ${-s * 0.3} ${-s * 0.45} ${-s} 0 ${-s * 0.45} C${s * 0.45} ${-s} ${s} ${-s * 0.3} 0 ${s * 0.35}Z`;
    return (
      <g transform={`translate(0 ${cy})`}>
        <path d={heart} transform="translate(0.9 1.3)" style={{ fill: v("nail-cateye") }} opacity={0.35} />
        <path d={heart} style={{ fill: v("primary"), stroke: v("nail-edge") }} strokeWidth={0.5} />
        <ellipse cx={-s * 0.3} cy={-s * 0.45} rx={s * 0.16} ry={s * 0.1} style={{ fill: v("nail-tip") }} opacity={0.8} />
      </g>
    );
  }
  if (id === "sencillo") {
    return (
      <g>
        <path d={`M${-r * 0.7} ${-h * 0.25} Q0 ${-h * 0.45} ${r * 0.6} ${-h * 0.8}`} fill="none" style={{ stroke: v("nail-tip") }} strokeWidth={1.1} strokeLinecap="round" />
        <circle cx={-r * 0.25} cy={-h * 0.5} r={1.7} style={{ fill: v("primary") }} />
        <circle cx={r * 0.25} cy={-h * 0.62} r={1.3} style={{ fill: v("nail-tip") }} />
        <circle cx={r * 0.45} cy={-h * 0.4} r={0.9} style={{ fill: v("nail-tip") }} />
      </g>
    );
  }
  return null; // "french" se dibuja como punta blanca
}

/** Simulación de ambas manos con forma, largo, acabados y diseños por uña */
export function HandSim({ set, fingers, layer = "todo" }: { set: NailSet; fingers: (string | null)[]; layer?: Layer }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const ext = (set.length - 1) * 10;
  const fin = layer === "disenos" ? [] : set.finishes;
  const finNames = fin.map((f) => finishes.find((x) => x.id === f)?.name).filter(Boolean).join(", ");

  const hand = (side: 0 | 1) => (
    <g transform={side ? `translate(${W + X0} 0) scale(-1 1)` : `translate(${-X0} 0)`}>
      <clipPath id={`${uid}tile${side}`}><rect x={X0} y={Y0} width={HW} height={H} rx={28} /></clipPath>
      <image href={handPhoto} x={0} y={0} width={768} height={1024} clipPath={`url(#${uid}tile${side})`} preserveAspectRatio="none" />
      {SPOTS.map((f, k) => {
        const i = side ? 9 - k : k;
        const design = layer === "acabados" ? null : (fingers[i] ?? null);
        const dName = designs.find((x) => x.id === design)?.name;
        return (
          <g key={k} transform={`translate(${f.cx} ${f.cy}) rotate(${f.rot})`}>
            <title>{`${FINGERS[i]} ${side ? "derecho" : "izquierdo"}: ${[finNames, dName].filter(Boolean).join(" + ") || "sin decoración"}`}</title>
            <Nail uid={uid} idx={i} shape={set.shape} ext={ext} r={f.r} bed={f.bed} fin={fin} design={design} />
          </g>
        );
      })}
    </g>
  );

  return (
    <svg viewBox={`0 ${Y0} ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Simulación de tus manos con el set elegido">
      <defs>
        <linearGradient id={`${uid}shade`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity={0.14} />
          <stop offset="0.25" stopColor="#000" stopOpacity={0} />
          <stop offset="0.75" stopColor="#000" stopOpacity={0} />
          <stop offset="1" stopColor="#000" stopOpacity={0.16} />
        </linearGradient>
        <linearGradient id={`${uid}bb`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" style={{ stopColor: v("nail-pink") }} />
          <stop offset="1" style={{ stopColor: v("nail-tip") }} />
        </linearGradient>
        <linearGradient id={`${uid}chrome`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" style={{ stopColor: v("nail-chrome-b") }} />
          <stop offset="0.4" style={{ stopColor: v("nail-chrome-a") }} />
          <stop offset="0.55" style={{ stopColor: v("nail-tip") }} />
          <stop offset="0.75" style={{ stopColor: v("nail-chrome-b") }} />
          <stop offset="1" style={{ stopColor: v("nail-chrome-a") }} />
        </linearGradient>
        <radialGradient id={`${uid}gem`} cx="0.35" cy="0.35" r="0.7">
          <stop offset="0" style={{ stopColor: v("nail-tip") }} />
          <stop offset="0.6" style={{ stopColor: v("nail-chrome-a") }} />
          <stop offset="1" style={{ stopColor: v("nail-chrome-b") }} />
        </radialGradient>
      </defs>
      {hand(0)}
      {hand(1)}
    </svg>
  );
}
