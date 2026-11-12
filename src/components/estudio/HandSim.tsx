import { useId } from "react";
import { designs, finishes, type NailSet } from "@/lib/nails";
import { FINGERS } from "./parts";

/** Qué capas mostrar en la simulación */
export type Layer = "todo" | "acabados" | "disenos";

type Finger = { px: number; py: number; len: number; w: number; rot: number };
// Mano izquierda vista por el dorso: meñique → pulgar (de izquierda a derecha)
const HAND: Finger[] = [
  { px: 46, py: 230, len: 100, w: 30, rot: -11 },
  { px: 86, py: 218, len: 146, w: 34, rot: -4 },
  { px: 128, py: 214, len: 166, w: 36, rot: 0 },
  { px: 169, py: 220, len: 146, w: 34, rot: 5 },
  { px: 192, py: 285, len: 104, w: 38, rot: 50 },
];
const W = 660;
const PALM = "M24 236 Q22 202 46 198 L186 202 Q208 208 210 256 L208 340 Q204 392 172 400 L60 400 Q26 392 24 340 Z";

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

function Nail({ uid, idx, shape, ext, w, fin, design }: { uid: string; idx: number; shape: string | null; ext: number; w: number; fin: string[]; design: string | null }) {
  const r = w * 0.37, bed = w * 0.8, h = bed + ext;
  const d = nailPath(shape, r, h);
  const clip = `${uid}c${idx}`;
  const has = (f: string) => fin.includes(f);
  const base = has("babyboomer") ? `url(#${uid}bb)` : has("cateye") ? v("nail-cateye") : has("gel") ? v("nail-pink") : v("nail-nude");
  const tipDepth = Math.max(5, ext * 0.65 + 4);
  const R = rand(idx + 3);
  return (
    <g transform={`translate(0 ${-0 + 0})`}>
      <path d={d} transform="translate(0.8 1.6)" style={{ fill: v("skin-shadow") }} opacity={0.6} />
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
  const ext = (set.length - 1) * 7;
  const fin = layer === "disenos" ? [] : set.finishes;
  const finNames = fin.map((f) => finishes.find((x) => x.id === f)?.name).filter(Boolean).join(", ");

  const hand = (side: 0 | 1) => (
    <g transform={side ? `translate(${W} 0) scale(-1 1)` : undefined}>
      {/* Contorno: primero en tono sombra y más grueso, luego la piel encima */}
      {[true, false].map((outline) => (
        <g key={String(outline)} style={{ fill: v(outline ? "skin-shadow" : "skin"), stroke: outline ? v("skin-shadow") : "none" }} strokeWidth={outline ? 3 : 0}>
          <path d={PALM} />
          {HAND.map((f, k) => (
            <rect key={k} x={-f.w / 2} y={-f.len} width={f.w} height={f.len + 40} rx={f.w / 2} transform={`translate(${f.px} ${f.py}) rotate(${f.rot})`} />
          ))}
        </g>
      ))}
      {HAND.map((f, k) => {
        const i = side ? 9 - k : k;
        const design = layer === "acabados" ? null : (fingers[i] ?? null);
        const dName = designs.find((x) => x.id === design)?.name;
        const bed = f.w * 0.8;
        return (
          <g key={k} transform={`translate(${f.px} ${f.py}) rotate(${f.rot})`}>
            <title>{`${FINGERS[i]} ${side ? "derecho" : "izquierdo"}: ${[finNames, dName].filter(Boolean).join(" + ") || "sin decoración"}`}</title>
            {[0.42, 0.7].slice(0, k === 4 ? 1 : 2).map((t) => (
              <path key={t} d={`M${-f.w * 0.22} ${-f.len * t} Q0 ${-f.len * t - 3} ${f.w * 0.22} ${-f.len * t}`} fill="none" style={{ stroke: v("skin-shadow") }} strokeWidth={1} strokeLinecap="round" opacity={0.7} />
            ))}
            <g transform={`translate(0 ${-f.len + bed + 3})`}>
              <Nail uid={uid} idx={i} shape={set.shape} ext={ext} w={f.w} fin={fin} design={design} />
            </g>
          </g>
        );
      })}
    </g>
  );

  return (
    <svg viewBox={`0 -24 ${W} 404`} className="h-auto w-full" role="img" aria-label="Simulación de tus manos con el set elegido">
      <defs>
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
