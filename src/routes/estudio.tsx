import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { nailImg, lengthImg } from "@/lib/nail-images";
import { systems, lengths, shapes, finishes, emptySet, totalPrice, systemPrice, retiroPrice, chosenSystems, MAX_NAILS, rd, type NailSet, type Option } from "@/lib/nails";
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
  const [fingers, setFingersState] = useState(emptyFingers);
  const [datos, setDatos] = useState<Datos>(emptyDatos);
  const [sent, setSent] = useState(false);
  const [count, setCount] = useState(0);
  useEffect(() => { setCount(Number(localStorage.getItem(QUOTE_KEY) ?? 0) || 0); }, []);
  const quote = String(count + 1).padStart(3, "0");

  const total = totalPrice(set);
  const items = set.systems.length + (set.retiro && retiroPrice(set) ? 1 : 0) + 1 + (set.shape ? 1 : 0) + set.finishes.length + Object.values(set.designs).filter(Boolean).length;
  const canNext = step === 0 ? set.systems.length > 0 : step === 2 ? !!set.shape : true;

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
    setSet(emptySet); setFingersState(emptyFingers()); setDatos(emptyDatos); setSent(false); setStep(0);
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
              <button key={s} onClick={() => setStep(i)} className={`rounded-full px-3 py-1.5 text-sm ${i === step ? "bg-primary text-primary-foreground" : "bg-card"}`}>{s}</button>
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
              <Title t="Elige tu sistema" s="La base de tu set. Puedes elegir uno o varios; se suman al total. El precio varía según el largo." />
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {systems.map((x) => {
                  const on = set.systems.includes(x.id);
                  return (
                    <Card key={x.id} active={on} onClick={() => setSet((s) => ({ ...s, systems: on ? s.systems.filter((id) => id !== x.id) : [...s.systems, x.id] }))}>
                      <Photo src={nailImg("system", x.id)} alt={x.name} />
                      <p className="font-display text-2xl">{x.name}</p>
                      <p className="text-sm text-muted-foreground">Desde {rd(x.prices[0])}</p>
                      {x.list && <p className="text-xs text-muted-foreground">Precio de lista {rd(x.list)}</p>}
                      <p className="mt-2 text-xs font-medium text-primary">{on ? "✓ Añadido" : "+ Añadir"}</p>
                    </Card>
                  );
                })}
              </div>
              <Mantenimiento set={set} setSet={setSet} />
            </>)}
            {step === 1 && (<>
              <Title t="Elige el largo" s={set.retoque ? "Estás cotizando un retoque: el precio no cambia con el largo." : "Cada 2 largos es un tamaño: S, M, L y SL. El precio cambia según el tamaño."} />
              <div className="grid grid-cols-4 gap-3">
                {lengths.map((l) => (
                  <Card key={l.id} active={set.length === l.id} onClick={() => setSet({ ...set, length: l.id })}>
                    <Photo src={lengthImg(l.id)} alt={`Uñas largo ${l.name}`} />
                    <p className="mt-2 font-semibold">#{l.id}</p>
                    <p className="text-xs text-muted-foreground">{l.name} · {l.size}</p>
                    {set.systems.length > 0 && !set.retoque && <p className="text-xs text-primary">{rd(set.systems.reduce((a, id) => a + systemPrice(id, l.id), 0))}</p>}
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
              <Preview set={set} step={step} />
            </aside>
          )}
        </div>

        <div className="mt-10 flex items-center justify-between">
          <button onClick={() => setStep(Math.max(0, step - 1))} className="rounded-full bg-secondary px-6 py-3 font-medium text-secondary-foreground shadow-soft transition hover:bg-accent disabled:opacity-30" disabled={step === 0}>{back}</button>
          {step < 5 && <button disabled={!canNext} onClick={() => setStep(step + 1)} className="rounded-full bg-primary px-7 py-3 font-medium text-primary-foreground shadow-soft disabled:opacity-40">Siguiente ▸</button>}
          {step === 5 && <button disabled={!set.systems.length} onClick={() => setStep(6)} className="rounded-full bg-primary px-7 py-3 font-medium text-primary-foreground shadow-soft disabled:opacity-40">Continuar con mis datos ▸</button>}
          {step === 6 && <button type="submit" form="envio-form" disabled={!set.systems.length} className="rounded-full bg-primary px-7 py-3 font-medium text-primary-foreground shadow-soft disabled:opacity-40">Enviar mi cotización ✦</button>}
        </div>
        {step >= 5 && !set.systems.length && <p className="mt-2 text-right text-xs text-muted-foreground">Elige un sistema primero para poder continuar.</p>}
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

function Preview({ set, step }: { set: NailSet; step: number }) {
  const src = step === 1 || !set.shape ? lengthImg(set.length) : nailImg("shape", set.shape);
  const l = lengths.find((x) => x.id === set.length);
  const sh = shapes.find((x) => x.id === set.shape);
  const sys = chosenSystems(set);
  return (
    <div className="sticky top-4 overflow-hidden rounded-3xl bg-secondary shadow-soft">
      <img src={src} alt="Vista previa de tus uñas" width={640} height={640} className="aspect-square w-full object-cover" />
      <div className="space-y-2 p-4">
        <div className="flex flex-wrap gap-2 text-xs">
          {sys.map((x) => <span key={x.id} className="rounded-full bg-card px-3 py-1">{x.name}</span>)}
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
  const sys = chosenSystems(set);
  if (!sys.length) return null;
  const conRetoque = sys.filter((x) => x.retoque != null);
  const conRetiro = sys.filter((x) => x.retiro != null);
  const sinPrecio = sys.filter((x) => x.retoque == null);
  const retoque = conRetoque.reduce((a, x) => a + (x.retoque ?? 0), 0);
  const retiro = conRetiro.reduce((a, x) => a + (x.retiro ?? 0), 0);
  const pill = (on: boolean) => `rounded-full px-4 py-2 text-sm transition ${on ? "bg-primary text-primary-foreground" : "bg-card"} disabled:opacity-40`;
  return (
    <div className="mt-6 rounded-3xl bg-secondary p-5 shadow-soft">
      <p className="font-display text-2xl">¿Qué necesitas?</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button onClick={() => setSet({ ...set, retoque: false })} className={pill(!set.retoque)}>Set nuevo · según tamaño</button>
        <button disabled={!conRetoque.length} onClick={() => setSet({ ...set, retoque: true })} className={pill(!!set.retoque)}>
          Retoque · {conRetoque.length ? rd(retoque) : "Consultar"}
        </button>
        <button disabled={!conRetiro.length} onClick={() => setSet({ ...set, retiro: !set.retiro })} className={pill(!!set.retiro)}>
          {set.retiro ? "✓ " : "+ "}Retiro · {conRetiro.length ? rd(retiro) : "Consultar"}
        </button>
      </div>
      {sinPrecio.length > 0 && <p className="mt-2 text-xs text-muted-foreground">Retoque y retiro de {sinPrecio.map((x) => x.name).join(" y ")}: consultar en el salón.</p>}
    </div>
  );
}
