export function NailShape({ shape, len, className = "" }: { shape: string | null; len: number; className?: string }) {
  const h = 14 + len * 5, w = 16;
  const top: Record<string, string> = {
    cuadrada: `M0 ${h} L0 0 L${w} 0 L${w} ${h}Z`,
    coffin: `M0 ${h} L3 0 L${w - 3} 0 L${w} ${h}Z`,
    almendrada: `M0 ${h} L0 ${h * 0.4} Q${w / 2} -${h * 0.15} ${w} ${h * 0.4} L${w} ${h}Z`,
    stiletto: `M0 ${h} L0 ${h * 0.5} L${w / 2} 0 L${w} ${h * 0.5} L${w} ${h}Z`,
    ovalada: `M0 ${h} L0 ${w / 2} A${w / 2} ${w / 1.6} 0 0 1 ${w} ${w / 2} L${w} ${h}Z`,
    redonda: `M0 ${h} L0 ${w / 2} A${w / 2} ${w / 2} 0 0 1 ${w} ${w / 2} L${w} ${h}Z`,
  };
  return (
    <svg viewBox={`-1 -1 ${w + 2} ${h + 2}`} width={w * 2} height={h * 2} className={className}>
      <path d={top[shape ?? "cuadrada"] ?? top["cuadrada"]} className="fill-current" />
      <rect x={3} y={h * 0.4} width={2} height={h * 0.4} rx={1} className="fill-background opacity-60" />
    </svg>
  );
}

export function HandPreview({ shape, len }: { shape: string | null; len: number }) {
  const fingers = [{ x: 30, y: 80, h: 70 }, { x: 62, y: 40, h: 110 }, { x: 94, y: 30, h: 120 }, { x: 126, y: 42, h: 108 }, { x: 156, y: 70, h: 80 }];
  return (
    <div className="flex flex-col items-center rounded-3xl bg-secondary p-6">
      <div className="relative h-72 w-56">
        <div className="absolute bottom-0 left-6 h-36 w-44 rounded-[3rem] bg-skin" />
        {fingers.map((f, i) => (
          <div key={i} className="absolute flex flex-col items-center" style={{ left: f.x, top: f.y }}>
            <NailShape shape={shape} len={len} className={i % 2 ? "text-nail-lilac" : "text-nail-pink"} />
            <div className="-mt-3 w-7 rounded-b-xl bg-skin" style={{ height: f.h }} />
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">Vista previa aproximada, no es el resultado exacto</p>
    </div>
  );
}
