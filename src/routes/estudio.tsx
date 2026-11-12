import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { nailImg, lengthImg } from "@/lib/nail-images";
import { systems, lengths, shapes, finishes, emptySet, totalPrice, systemPrice, retiroPrice, MAX_NAILS, rd, type NailSet, type Option } from "@/lib/nails";
import { Photo, Title } from "@/components/estudio/parts";
import { Disenos } from "@/components/estudio/Disenos";
import { Resumen, priceRows } from "@/components/estudio/Resumen";
import { Envio, emptyDatos, type Datos } from "@/components/estudio/Envio";
import { Confirmacion } from "@/components/estudio/Confirmacion";

export const Route = createFileRoute("/estudio")({
  head: () => ({
    meta: [
      { title: "Estudio de uñas digital — Amaïa" },
      { name: "description", content: "Diseña tu set de uñas paso a paso y conoce el precio estimado al instante." },
      { property: "og:title", content: "Estudio de uñas digital — Amaïa" },
      { property: "og:description", content: "Elige sistema, largo, forma y diseños, y cotiza en minutos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Estudio,
});

function Card({ active, onClick, children }: { active?: boolean; onClick?: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`rounded-3xl border-2 bg-card p-4 text-left shadow-soft transition hover:-translate-y-0.5 ${active ? "border-primary" : "border-transparent"}`}>
      {children}
    </button>
  );
}

const steps = ["Sistema", "Largo", "Forma", "Acabados", "Diseños", "Resumen", "Envío"];
const emptyFingers = (): (string | null)[] => Array(MAX_NAILS).fill(null);
const QUOTE_KEY = "amaia-cotizaciones";

function countDesigns(f: (string | null)[]) {
  const out: Record<string, number> = {};
  for (const id of f) if (id) out[id] = (out[id] ?? 0) + 1;
  return out;
}

function Estudio() {
  const [step, setStep] = useState(0);
  const [set, setSet] = useState<NailSet>(emptySet);
  const [lengthSelected, setLengthSelected] = useState(false);
  const [fingers, setFingersState] = useState(emptyFingers);
  const [datos, setDatos] = useState<Datos>(emptyDatos);
  const [sent, setSent] = useState(false);
  const [count, setCount] = useState(0);
  useEffect(() => { setCount(Number(localStorage.getItem(QUOTE_KEY) ?? 0) || 0); }, []);
  const quote = String(count + 1).padStart(3, "0");

  const total = totalPrice(set);
  const items = (set.system ? 1 : 0) + (set.retiro && retiroPrice(set) ? 1 : 0) + 1 + (set.shape ? 1 : 0) + set.finishes.length + Object.values(set.designs).filter(Boolean).length;
  const requiredSetComplete = !!set.system && lengthSelected && !!set.shape;
  const canNext = step === 0 ? !!set.system : step === 1 ? lengthSelected : step === 2 ? !!set.shape : true;
  const canAccessStep = (target: number) => {
    if (target <= 0) return true;
    if (target === 1) return !!set.system;
    if (target === 2) return !!set.system && lengthSelected;
    return requiredSetComplete;
  };

  const setFingers = (f: (string | null)[]) => {
    setFingersState(f);
    setSet((s) => ({ ...s, designs: countDesigns(f) }));
  };
  const plus = (id: string) => { const i = fingers.indexOf(null); if (i < 0) return; const f = [...fingers]; f[i] = id; setFingers(f); };
  const minus = (id: string) => { const i = fingers.lastIndexOf(id); if (i < 0) return; const f = [...fingers]; f[i] = null; setFingers(f); };
  const tap = (i: number, id: string | null) => { const f = [...fingers]; f[i] = f[i] === id ? null : id; setFingers(f); };

  const send = () => {
    localStorage.setItem(QUOTE_KEY, String(count + 1));
    setSent(true);
  };
  const reset = () => {
    setCount((c) => c + 1);
    setSet(emptySet); setLengthSelected(false); setFingersState(emptyFingers()); setDatos(emptyDatos); setSent(false); setStep(0);
  };

  if (sent) return <Confirmacion quote={quote} whatsappText={whatsappText(set, datos, total, quote)} onNew={reset} />;

  const wide = step >= 4;
  const back = step === 5 ? "◂ Editar set" : step === 6 ? "◂ Volver al resumen" : "◂ Volver";

  return (
    <div className="min-h-screen">
      <header className="bg-secondary">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <Link to="/" className="mr-3 font-display text-3xl">Amaïa</Link>
            {steps.map((s, i) => (
              <button key={s} onClick={() => { if (canAccessStep(i)) setStep(i); }} disabled={!canAccessStep(i)} aria-current={i === step ? "step" : undefined} className={`rounded-full px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40 ${i === step ? "bg-primary text-primary-foreground" : "bg-card"}`}>{s}</button>
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-3 rounded-full bg-card py-1.5 pl-4 pr-1.5 shadow-soft">
            <div className="text-xs"><p className="font-semibold">Cotización #{quote}</p><p className="text-muted-foreground">{items} elementos</p></div>
            <span className="rounded-full bg-primary px-4 py-2 font-display text-xl text-primary-foreground">{rd(total)}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className={wide ? "" : "grid gap-8 lg:grid-cols-[1fr_280px]"}>
          <section>
            {step === 0 && (<>
              <Title t="Elige tu sistema" s="La base de tu set. El precio varía según el largo." />
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {systems.map((x) => (
                  <Card key={x.id} active={set.system === x.id} onClick={() => setSet({ ...set, system: x.id })}>
                    <Photo src={nailImg("system", x.id)} alt={x.name} />
                    <p className="font-display text-2xl">{x.name}</p>
                    <p className="text-sm text-muted-foreground">Desde {rd(x.prices[0])}</p>
                    {x.list && <p className="text-xs text-muted-foreground">Precio de lista {rd(x.list)}</p>}
                  </Card>
                ))}
              </div>
              <Mantenimiento set={set} setSet={setSet} />
            </>)}
            {step === 1 && (<>
              <Title t="Elige el largo" s={set.retoque ? "Estás cotizando un retoque: el precio no cambia con el largo." : "Cada 2 largos es un tamaño: S, M, L y SL. El precio cambia según el tamaño."} />
              <div className="grid grid-cols-4 gap-3">
                {lengths.map((l) => (
                  <Card key={l.id} active={lengthSelected && set.length === l.id} onClick={() => { setSet({ ...set, length: l.id }); setLengthSelected(true); }}>
                    <Photo src={lengthImg(l.id)} alt={`Uñas largo ${l.name}`} />
                    <p className="mt-2 font-semibold">#{l.id}</p>
                    <p className="text-xs text-muted-foreground">{l.name} · {l.size}</p>
                    {set.system && !set.retoque && <p className="text-xs text-primary">{rd(systemPrice(set.system, l.id))}</p>}
                  </Card>
                ))}
              </div>
            </>)}
            {step === 2 && (<>
              <Title t="Ahora elige la forma" s="Compara siluetas; la vista previa cambia al instante." />
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {shapes.map((x) => (
                  <Card key={x.id} active={set.shape === x.id} onClick={() => setSet({ ...set, shape: x.id })}>
                    <Photo src={nailImg("shape", x.id)} alt={`Uñas forma ${x.name}`} />
                    <p className="mt-2 text-center font-display text-2xl">{x.name}</p>
                    <p className="text-center text-xs text-muted-foreground">{x.price ? `Recargo ${rd(x.price)}` : "Sin recargo"}</p>
                  </Card>
                ))}
              </div>
            </>)}
            {step === 3 && (<>
              <Title t="Acabados" s="Añade o quita capas y efectos." />
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {finishes.map((x) => {
                  const on = set.finishes.includes(x.id);
                  return (
                    <Card key={x.id} active={on} onClick={() => setSet({ ...set, finishes: on ? set.finishes.filter((f) => f !== x.id) : [...set.finishes, x.id] })}>
                      <Photo src={nailImg("finish", x.id)} alt={x.name} />
                      <p className="font-display text-xl">{x.name}</p>
                      <PriceLine o={x} />
                      <p className="mt-2 text-xs font-medium text-primary">{on ? "✓ Añadido" : "+ Añadir"}</p>
                    </Card>
                  );
                })}
              </div>
            </>)}
            {step === 4 && <Disenos set={set} fingers={fingers} onPlus={plus} onMinus={minus} onTap={tap} onMore={() => setStep(3)} />}
            {step === 5 && <Resumen set={set} fingers={fingers} total={total} quote={quote} />}
            {step === 6 && <Envio total={total} quote={quote} datos={datos} setDatos={setDatos} onSend={send} />}
          </section>

          {!wide && (
            <aside className="space-y-4">
              <Preview set={set} />
            </aside>
          )}
        </div>

        <div className="mt-10 flex items-center justify-between">
          <button onClick={() => setStep(Math.max(0, step - 1))} className="rounded-full bg-primary px-7 py-3 font-medium text-primary-foreground shadow-soft transition hover:-translate-y-0.5 disabled:opacity-40" disabled={step === 0}>{back}</button>
          {step < 5 && <button disabled={!canNext} onClick={() => { if (canNext) setStep(step + 1); }} className="rounded-full bg-primary px-7 py-3 font-medium text-primary-foreground shadow-soft disabled:opacity-40">Siguiente ▸</button>}
          {step === 5 && <button disabled={!requiredSetComplete} onClick={() => { if (requiredSetComplete) setStep(6); }} className="rounded-full bg-primary px-7 py-3 font-medium text-primary-foreground shadow-soft disabled:opacity-40">Continuar con mis datos ▸</button>}
          {step === 6 && <button type="submit" form="envio-form" disabled={!requiredSetComplete} className="rounded-full bg-primary px-7 py-3 font-medium text-primary-foreground shadow-soft disabled:opacity-40">Enviar mi cotización ✦</button>}
        </div>
        {step >= 5 && !set.system && <p className="mt-2 text-right text-xs text-muted-foreground">Elige un sistema primero para poder continuar.</p>}
      </main>
    </div>
  );
}

function whatsappText(set: NailSet, d: Datos, total: number, quote: string) {
  const lines = [
    `Hola Amaïa, soy ${d.nombre}. Esta es mi cotización Cliente #${quote}:`,
    ...priceRows(set).map((r) => `• ${r.label}: ${r.price ? rd(r.price) : "Incluido"}`),
    `Total estimado: ${rd(total)}`,
    `Modalidad: ${d.modalidad === "domicilio" ? `A domicilio (${d.direccion})` : "En el salón"}`,
  ];
  if (d.fecha) lines.push(`Fecha deseada: ${d.fecha}`);
  if (d.notas) lines.push(`Observaciones: ${d.notas}`);
  lines.push(`Teléfono: ${d.telefono}`);
  return lines.join("\n");
}

function Preview({ set }: { set: NailSet }) {
  const src = lengthImg(set.length);
  const l = lengths.find((x) => x.id === set.length);
  const sh = shapes.find((x) => x.id === set.shape);
  const sys = systems.find((x) => x.id === set.system);
  return (
    <div className="sticky top-4 overflow-hidden rounded-3xl bg-secondary shadow-soft">
      <div className="relative">
        <img src={src} alt={`Referencia para largo #${set.length}${sh ? ` y forma ${sh.name.toLowerCase()}` : ""}`} width={640} height={640} className="aspect-square w-full object-cover" />
        {set.shape && <div className="absolute bottom-3 right-3 w-24 overflow-hidden rounded-2xl border-2 border-card bg-card shadow-soft">
          <img src={nailImg("shape", set.shape)} alt="" width={160} height={160} className="aspect-square w-full object-cover" />
          <p className="px-1.5 py-1 text-center text-[10px] font-medium">Forma elegida</p>
        </div>}
      </div>
      <div className="space-y-2 p-4">
        <div className="flex flex-wrap gap-2 text-xs">
          {sys && <span className="rounded-full bg-card px-3 py-1">{sys.name}</span>}
          <span className="rounded-full bg-card px-3 py-1">Largo #{set.length} · {l?.name}</span>
          {sh && <span className="rounded-full bg-card px-3 py-1">{sh.name}</span>}
        </div>
        <p className="text-xs text-muted-foreground">Vista previa aproximada, no es el resultado exacto</p>
      </div>
    </div>
  );
}

function PriceLine({ o, suffix = "" }: { o: Option; suffix?: string }) {
  return (
    <p className="text-sm text-muted-foreground">
      {o.note === "Desde" ? "Desde " : ""}{rd(o.price)}{suffix}
      {o.list && <span className="ml-2 text-xs line-through">{rd(o.list)}</span>}
      {o.note && o.note !== "Desde" && <span className="block text-xs">{o.note}</span>}
    </p>
  );
}

function Mantenimiento({ set, setSet }: { set: NailSet; setSet: (s: NailSet) => void }) {
  const sys = systems.find((x) => x.id === set.system);
  if (!sys) return null;
  const hasRetoque = sys.retoque != null;
  const hasRetiro = sys.retiro != null;
  const pill = (on: boolean) => `rounded-full px-4 py-2 text-sm transition ${on ? "bg-primary text-primary-foreground" : "bg-card"} disabled:opacity-40`;
  return (
    <div className="mt-6 rounded-3xl bg-secondary p-5 shadow-soft">
      <p className="font-display text-2xl">¿Qué necesitas?</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button onClick={() => setSet({ ...set, retoque: false })} className={pill(!set.retoque)}>Set nuevo · según tamaño</button>
        <button disabled={!hasRetoque} onClick={() => setSet({ ...set, retoque: true })} className={pill(!!set.retoque)}>
          Retoque · {hasRetoque ? rd(sys.retoque) : "Consultar"}
        </button>
        <button disabled={!hasRetiro} onClick={() => setSet({ ...set, retiro: !set.retiro })} className={pill(!!set.retiro)}>
          {set.retiro ? "✓ " : "+ "}Retiro · {hasRetiro ? rd(sys.retiro) : "Consultar"}
        </button>
      </div>
      {!hasRetoque && <p className="mt-2 text-xs text-muted-foreground">Retoque y retiro de {sys.name}: consultar en el salón.</p>}
    </div>
  );
}
