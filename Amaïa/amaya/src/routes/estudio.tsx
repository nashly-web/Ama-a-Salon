import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { nailImg, lengthImg } from "@/lib/nail-images";
import { systems, lengths, shapes, finishes, designs, emptySet, totalPrice, systemPrice, nailsUsed, MAX_NAILS, rd, type NailSet } from "@/lib/nails";

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

const steps = ["Sistema", "Largo", "Forma", "Acabados", "Diseños", "Resumen"];

function Card({ active, onClick, children }: { active?: boolean; onClick?: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`rounded-3xl border-2 bg-card p-4 text-left shadow-soft transition hover:-translate-y-0.5 ${active ? "border-primary" : "border-transparent"}`}>
      {children}
    </button>
  );
}

function Estudio() {
  const [step, setStep] = useState(0);
  const [set, setSet] = useState<NailSet>(emptySet);
  const total = totalPrice(set);
  const used = nailsUsed(set);
  const items = (set.system ? 1 : 0) + 1 + (set.shape ? 1 : 0) + set.finishes.length + Object.values(set.designs).filter(Boolean).length;
  const canNext = step === 0 ? !!set.system : step === 2 ? !!set.shape : true;

  const setDesign = (id: string, d: number) =>
    setSet((s) => {
      const cur = s.designs[id] ?? 0;
      const n = Math.max(0, cur + d);
      if (d > 0 && nailsUsed(s) >= MAX_NAILS) return s;
      return { ...s, designs: { ...s.designs, [id]: n } };
    });

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
            <div className="text-xs"><p className="font-semibold">Tu set</p><p className="text-muted-foreground">{items} elementos</p></div>
            <span className="rounded-full bg-primary px-4 py-2 font-display text-xl text-primary-foreground">{rd(total)}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
          <section>
            {step === 0 && (<>
              <Title t="Elige tu sistema" s="La base de tu set. El precio varía según el largo." />
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {systems.map((x) => (
                  <Card key={x.id} active={set.system === x.id} onClick={() => setSet({ ...set, system: x.id })}>
                    <Photo src={nailImg("system", x.id)} alt={x.name} />
                    <p className="font-display text-2xl">{x.name}</p>
                    <p className="text-sm text-muted-foreground">Desde {rd(x.prices[0])}</p>
                  </Card>
                ))}
              </div>
            </>)}
            {step === 1 && (<>
              <Title t="Elige el largo" s="Desliza y compara; la vista previa cambia al instante." />
              <div className="grid grid-cols-4 gap-3">
                {lengths.map((l) => (
                  <Card key={l.id} active={set.length === l.id} onClick={() => setSet({ ...set, length: l.id })}>
                    <Photo src={lengthImg(l.id)} alt={`Uñas largo ${l.name}`} />
                    <p className="mt-2 font-semibold">#{l.id}</p>
                    <p className="text-xs text-muted-foreground">{l.name} · {l.size}</p>
                    {set.system && <p className="text-xs text-primary">{rd(systemPrice(set.system, l.id))}</p>}
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
                      <p className="text-sm text-muted-foreground">{rd(x.price)}</p>
                      <p className="mt-2 text-xs font-medium text-primary">{on ? "✓ Añadido" : "+ Añadir"}</p>
                    </Card>
                  );
                })}
              </div>
            </>)}
            {step === 4 && (<>
              <Title t="Diseños por uña" s={`Reparte tus diseños: ${used} de ${MAX_NAILS} uñas.`} />
              <div className="grid gap-3 sm:grid-cols-2">
                {designs.map((d) => (
                  <div key={d.id} className="flex items-center justify-between gap-3 rounded-3xl bg-card p-4 shadow-soft">
                    <img src={nailImg("design", d.id)} alt={d.name} loading="lazy" width={80} height={80} className="h-20 w-20 shrink-0 rounded-2xl object-cover" />
                    <div className="min-w-0 flex-1"><p className="font-display text-xl">{d.name}</p><p className="text-xs text-muted-foreground">{rd(d.price)} por uña</p></div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button onClick={() => setDesign(d.id, -1)} className="h-9 w-9 rounded-full bg-secondary text-lg">−</button>
                      <span className="w-14 text-center text-sm">{set.designs[d.id] ?? 0} uñas</span>
                      <button onClick={() => setDesign(d.id, 1)} disabled={used >= MAX_NAILS} className="h-9 w-9 rounded-full bg-primary text-lg text-primary-foreground disabled:opacity-40">+</button>
                    </div>
                  </div>
                ))}
              </div>
            </>)}
            {step === 5 && <Resumen set={set} total={total} goTo={setStep} />}
          </section>

          <aside className="space-y-4">
            <Preview set={set} step={step} />
          </aside>
        </div>

        <div className="mt-10 flex items-center justify-between">
          <button onClick={() => setStep(Math.max(0, step - 1))} className="text-sm underline disabled:opacity-30" disabled={step === 0}>◂ Volver</button>
          {step < 5 && <button disabled={!canNext} onClick={() => setStep(step + 1)} className="rounded-full bg-primary px-7 py-3 font-medium text-primary-foreground shadow-soft disabled:opacity-40">Siguiente ▸</button>}
        </div>
      </main>
    </div>
  );
}

function Preview({ set, step }: { set: NailSet; step: number }) {
  const src = step === 1 || !set.shape ? lengthImg(set.length) : nailImg("shape", set.shape);
  const l = lengths.find((x) => x.id === set.length);
  const sh = shapes.find((x) => x.id === set.shape);
  const sys = systems.find((x) => x.id === set.system);
  return (
    <div className="sticky top-4 overflow-hidden rounded-3xl bg-secondary shadow-soft">
      <img src={src} alt="Vista previa de tus uñas" width={640} height={640} className="aspect-square w-full object-cover" />
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

function Photo({ src, alt }: { src?: string | undefined; alt: string }) {
  return <img src={src} alt={alt} loading="lazy" width={640} height={640} className="mb-3 aspect-square w-full rounded-2xl bg-secondary object-cover" />;
}

function Title({ t, s }: { t: string; s: string }) {
  return (<div className="mb-6"><h1 className="text-5xl text-primary">{t}</h1><p className="text-sm text-muted-foreground">{s}</p></div>);
}

function Resumen({ set, total, goTo }: { set: NailSet; total: number; goTo: (n: number) => void }) {
  const [sent, setSent] = useState(false);
  const rows: { label: string; tag: string; price: number; step: number; img?: string | undefined }[] = [];
  const sys = systems.find((s) => s.id === set.system);
  if (sys) rows.push({ label: sys.name, tag: "Sistema", price: systemPrice(sys.id, set.length), step: 0, img: nailImg("system", sys.id) });
  rows.push({ label: `Largo #${set.length}`, tag: "Largo", price: 0, step: 1, img: lengthImg(set.length) });
  const sh = shapes.find((s) => s.id === set.shape);
  if (sh) rows.push({ label: sh.name, tag: "Forma", price: sh.price, step: 2, img: nailImg("shape", sh.id) });
  set.finishes.forEach((f) => { const x = finishes.find((y) => y.id === f)!; rows.push({ label: x.name, tag: "Acabado", price: x.price, step: 3, img: nailImg("finish", x.id) }); });
  Object.entries(set.designs).filter(([, n]) => n).forEach(([id, n]) => { const d = designs.find((x) => x.id === id)!; rows.push({ label: d.name, tag: `${n} uñas`, price: d.price * n, step: 4, img: nailImg("design", d.id) }); });

  return (<>
    <Title t="Tu colección" s="Todo lo que has elegido para tu set, siempre a la mano." />
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {rows.map((r) => (
        <div key={r.label} className="rounded-3xl bg-card p-4 shadow-soft">
          {r.img && <Photo src={r.img} alt={r.label} />}
          <p className="font-semibold">{r.label}</p>
          <div className="mt-2 flex items-center justify-between text-sm"><span className="rounded-full bg-secondary px-3 py-1 text-secondary-foreground">{r.tag}</span><span>{r.price ? rd(r.price) : "Incluido"}</span></div>
          <button onClick={() => goTo(r.step)} className="mt-3 text-sm underline">Editar</button>
        </div>
      ))}
    </div>
    <div className="mt-6 rounded-3xl bg-secondary p-6 shadow-soft">
      <div className="flex items-center justify-between"><span className="font-semibold">Total estimado</span><span className="font-display text-4xl text-primary">{rd(total)}</span></div>
      {sent
        ? <p className="mt-4 text-center text-primary">¡Gracias! Te contactaremos para confirmar tu cita. ✦</p>
        : <button onClick={() => setSent(true)} className="mt-4 w-full rounded-full bg-primary py-3 font-medium text-primary-foreground">Solicitar cotización</button>}
      <p className="mt-2 text-center text-xs text-muted-foreground">Precio aproximado; se confirma en el salón.</p>
    </div>
  </>);
}
