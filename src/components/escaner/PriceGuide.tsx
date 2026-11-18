import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Pointer } from "lucide-react";

const STEP_MS = 1500;
/** Punta del dedo dentro del icono (28px): así el dedito toca justo el precio */
const TIP = { x: 9, y: 2 };

/**
 * Dedito animado que va de precio en precio por las opciones de sistema.
 * Busca los elementos marcados con `data-price` dentro de sus hijos.
 */
export function PriceGuide({ active, children }: { active: boolean; children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const [spots, setSpots] = useState<{ x: number; y: number }[]>([]);
  const [i, setI] = useState(0);

  useLayoutEffect(() => {
    if (!active || !box.current) return;
    const el = box.current;
    const measure = () => {
      const r = el.getBoundingClientRect();
      const all = [...el.querySelectorAll<HTMLElement>("[data-price]")];
      const free = all.filter((p) => p.closest("[aria-pressed='false']"));
      setSpots((free.length ? free : all).map((p) => {
        const b = p.getBoundingClientRect();
        return { x: b.left - r.left + b.width / 2, y: b.top - r.top + b.height * 0.7 };
      }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [active, children]);

  useEffect(() => {
    if (!active || spots.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % spots.length), STEP_MS);
    return () => clearInterval(t);
  }, [active, spots.length]);

  const spot = spots[i % Math.max(spots.length, 1)];
  return (
    <div ref={box} className="relative">
      {children}
      {active && spot && (
        <span
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 transition-transform duration-700 ease-in-out"
          style={{ transform: `translate(${spot.x - TIP.x}px, ${spot.y - TIP.y}px)` }}
        >
          <span key={i} className="absolute -left-1.5 -top-2.5 h-6 w-6 rounded-full bg-primary/40 motion-safe:animate-tap-ring" />
          <Pointer key={`p${i}`} className="relative h-7 w-7 fill-card text-primary drop-shadow motion-safe:animate-finger-tap" strokeWidth={1.75} />
        </span>
      )}
    </div>
  );
}
