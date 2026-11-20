import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BackButton } from "@/components/BackButton";
import { nailImg, lengthImg } from "@/lib/nail-images";
import { systems, selectSystem, lengths, shapes, finishes, designs, emptySet, totalPrice, systemPrice, retiroPrice, chosenSystems, emptyFingers, countDesigns, addDesign, removeDesign, rd, type NailSet, type Option, type Fingers } from "@/lib/nails";
import { Photo, Title } from "@/components/estudio/parts";
import { Disenos } from "@/components/estudio/Disenos";
import { Resumen } from "@/components/estudio/Resumen";
import { Envio, emptyDatos, type Datos } from "@/components/estudio/Envio";
import { Confirmacion } from "@/components/estudio/Confirmacion";
import { takeHandoff } from "@/lib/scan";
import { STEPS, canReach, missingBefore } from "@/lib/estudio-steps";
import { quoteMessage, whatsappLink } from "@/lib/whatsapp";
import { hasOdooProduct, odooName, odooPrice, useOdooCatalog, type OdooCatalog } from "@/lib/odoo-catalog";
import { OdooConnection } from "@/components/OdooConnection";

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

function Estudio() {
  const catalogQuery = useOdooCatalog();
  const [step, setStep] = useState(0);
  const [set, setSet] = useState<NailSet>(emptySet);
  const [fingers, setFingersState] = useState(emptyFingers);
  const [datos, setDatos] = useState<Datos>(emptyDatos);
  const [sent, setSent] = useState(false);
  const [, setFromScan] = useState(false);
  // Diseño que llega desde el escáner: se abre directo en el Resumen.
  useEffect(() => {
    if (!catalogQuery.data) return;
    const scanned = takeHandoff();
    if (scanned) {
      const synced = { ...scanned.set, finishes: scanned.set.finishes.filter((id) => hasOdooProduct(catalogQuery.data!, finishes.find((item) => item.id === id)?.odooCode)) };
      setSet(synced);
      setFingersState(scanned.fingers.map((ids) => ids.filter((id) => hasOdooProduct(catalogQuery.data!, designs.find((item) => item.id === id)?.odooCode))));
      setFromScan(true);
      setStep(5);
    }
  }, [catalogQuery.data]);

  const catalog = catalogQuery.data;
  const total = totalPrice(set, catalog);
  const items = set.systems.length + (set.retiro && catalog && retiroPrice(set, catalog) ? 1 : 0) + 1 + (set.shape ? 1 : 0) + set.finishes.length + Object.values(set.designs).filter(Boolean).length;
  const canNext = canReach(step + 1, set);
  const missing = missingBefore(step + 1, set).map((i) => (i === 0 ? "tu sistema" : "la forma")).join(" y ");

  const setFingers = (f: Fingers) => {
    setFingersState(f);
    setSet((s) => ({ ...s, designs: countDesigns(f) }));
  };
  const plus = (id: string) => setFingers(addDesign(fingers, id));
  const minus = (id: string) => setFingers(removeDesign(fingers, id));

  const waLink = whatsappLink(quoteMessage(set, fingers, datos, total, catalog), datos.telefono);
  // Abre WhatsApp con la cotización dirigida al teléfono del formulario (enlace gratuito, sin API de pago).
  const send = () => {
    window.open(waLink, "_blank", "noopener,noreferrer");
    setSent(true);
  };
  const reset = () => {
    setSet(emptySet); setFingersState(emptyFingers()); setDatos(emptyDatos); setSent(false); setFromScan(false); setStep(0);
  };

  if (catalogQuery.isLoading || !catalog) return <OdooConnection loading={catalogQuery.isLoading} error={catalogQuery.error} onRetry={() => void catalogQuery.refetch()} />;
  if (sent) return <Confirmacion whatsappLink={waLink} onNew={reset} />;

  const wide = step >= 4;
  const back = step === 5 ? "◂ Editar set" : step === 6 ? "◂ Volver al resumen" : "◂ Volver";

  return (
    <div className="min-h-screen">
      <header className="bg-secondary">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <BackButton />
            <span className="mr-3 font-display text-3xl">Amaïa</span>
            {STEPS.map((s, i) => {
              const locked = !canReach(i, set);
              return (
                <button key={s} onClick={() => setStep(i)} disabled={locked} title={locked ? `Primero elige: ${missingBefore(i, set).map((k) => STEPS[k]).join(" y ")}` : undefined} className={`rounded-full px-3 py-1.5 text-sm transition disabled:cursor-not-allowed disabled:opacity-40 ${i === step ? "bg-primary text-primary-foreground" : "bg-card"}`}>{s}</button>
              );
            })}
          </div>
          <div className="flex shrink-0 items-center gap-3 rounded-full bg-card py-1.5 pl-4 pr-1.5 shadow-soft">
            <div className="text-xs"><p className="font-semibold">Cotización</p><p className="text-muted-foreground">{items} elementos</p></div>
            <span className="rounded-full bg-primary px-4 py-2 font-display text-xl text-primary-foreground">{rd(total)}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-32 pt-8">
        <div className={wide ? "" : "grid gap-8 lg:grid-cols-[1fr_280px]"}>
          <section>
            {step === 0 && (<>
              <Title t="Elige tu sistema" s="La base de tu set. Elige solo uno. El precio varía según el largo." />
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {systems.filter((x) => hasOdooProduct(catalog, x.odooCode)).map((x) => {
                  const on = set.systems.includes(x.id);
                  return (
                    <Card key={x.id} active={on} onClick={() => setSet((s) => ({ ...s, systems: selectSystem(x.id) }))}>
                      <Photo src={nailImg("system", x.id)} alt={x.name} />
                      <p className="font-display text-2xl">{odooName(catalog, x.odooCode, x.name)}</p>
                      <p className="text-sm text-muted-foreground">Desde {rd(systemPrice(x.id, 1, catalog))}</p>
                      <p className="mt-2 text-xs font-medium text-primary">{on ? "✓ Elegido" : "Elegir"}</p>
                    </Card>
                  );
                })}
              </div>
              <Mantenimiento set={set} setSet={setSet} catalog={catalog} />
            </>)}
            {step === 1 && (<>
              <Title t="Elige el largo" s={set.retoque ? "Estás cotizando un retoque: el precio no cambia con el largo." : "Cada 2 largos es un tamaño: S, M, L y SL. El precio cambia según el tamaño."} />
              <div className="grid grid-cols-4 gap-3">
                {lengths.map((l) => (
                  <Card key={l.id} active={set.length === l.id} onClick={() => setSet({ ...set, length: l.id })}>
                    <Photo src={lengthImg(l.id)} alt={`Uñas largo ${l.name}`} />
                    <p className="mt-2 font-semibold">#{l.id}</p>
                    <p className="text-xs text-muted-foreground">{l.name} · {l.size}</p>
                    {set.systems.length > 0 && !set.retoque && <p className="text-xs text-primary">{rd(set.systems.reduce((a, id) => a + systemPrice(id, l.id, catalog), 0))}</p>}
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
                    <p className="mt-2 text-center font-display text-2xl">{odooName(catalog, x.odooCode, x.name)}</p>
                    <p className="text-center text-xs text-muted-foreground">{(odooPrice(catalog, x.odooCode) ?? x.price) ? `Recargo ${rd(odooPrice(catalog, x.odooCode) ?? x.price)}` : "Sin recargo"}</p>
                  </Card>
                ))}
              </div>
            </>)}
            {step === 3 && (<>
              <Title t="Acabados" s="Añade o quita capas y efectos." />
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {finishes.filter((x) => hasOdooProduct(catalog, x.odooCode)).map((x) => {
                  const on = set.finishes.includes(x.id);
                  return (
                    <Card key={x.id} active={on} onClick={() => setSet({ ...set, finishes: on ? set.finishes.filter((f) => f !== x.id) : [...set.finishes, x.id] })}>
                      <Photo src={nailImg("finish", x.id)} alt={x.name} />
                      <p className="font-display text-xl">{odooName(catalog, x.odooCode, x.name)}</p>
                      <PriceLine o={x} catalog={catalog} />
                      <p className="mt-2 text-xs font-medium text-primary">{on ? "✓ Añadido" : "+ Añadir"}</p>
                    </Card>
                  );
                })}
              </div>
            </>)}
            {step === 4 && <Disenos set={set} onPlus={plus} onMinus={minus} catalog={catalog} />}
            {step === 5 && <Resumen set={set} total={total} catalog={catalog} />}
            {step === 6 && <Envio total={total} datos={datos} setDatos={setDatos} onSend={send} />}
          </section>

          {!wide && (
            <aside className="space-y-4">
              <Preview set={set} step={step} catalog={catalog} />
            </aside>
          )}
        </div>
      </main>

      {/* Navegación flotante: Volver y Siguiente siempre a la vista */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto max-w-6xl">
          {!canNext && missing && (
            <p className="mb-2 text-right text-xs font-medium text-primary">Elige {missing} para continuar.</p>
          )}
          <div className="flex items-center justify-between gap-3">
            <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="pointer-events-auto rounded-full bg-secondary px-6 py-3 font-medium text-secondary-foreground shadow-glow ring-1 ring-border backdrop-blur transition hover:bg-accent disabled:invisible">{back}</button>
            {step < 5 && <button disabled={!canNext} onClick={() => setStep(step + 1)} className="pointer-events-auto rounded-full bg-gradient-cta px-7 py-3 font-medium text-primary-foreground shadow-glow transition hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0">Siguiente ▸</button>}
            {step === 5 && <button disabled={!canNext} onClick={() => setStep(6)} className="pointer-events-auto rounded-full bg-gradient-cta px-7 py-3 font-medium text-primary-foreground shadow-glow transition hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0">Continuar con mis datos ▸</button>}
            {step === 6 && <button type="submit" form="envio-form" disabled={!canReach(6, set)} className="pointer-events-auto rounded-full bg-gradient-cta px-7 py-3 font-medium text-primary-foreground shadow-glow transition hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0">Enviar mi cotización ✦</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

function Preview({ set, step, catalog }: { set: NailSet; step: number; catalog: OdooCatalog }) {
  const src = step === 1 || !set.shape ? lengthImg(set.length) : nailImg("shape", set.shape);
  const l = lengths.find((x) => x.id === set.length);
  const sh = shapes.find((x) => x.id === set.shape);
  const sys = chosenSystems(set);
  const fin = set.finishes.map((id) => finishes.find((x) => x.id === id)).filter((x) => !!x && hasOdooProduct(catalog, x.odooCode));
  return (
    <div className="sticky top-4 overflow-hidden rounded-3xl bg-secondary shadow-soft">
      <img src={src} alt="Vista previa de tus uñas" width={640} height={640} className="aspect-square w-full object-cover" />
      <div className="space-y-2 p-4">
        <div className="flex flex-wrap gap-2 text-xs">
          {sys.map((x) => <span key={x.id} className="rounded-full bg-card px-3 py-1">{x.name}</span>)}
          <span className="rounded-full bg-card px-3 py-1">Largo #{set.length} · {l?.name}</span>
          {sh && <span className="rounded-full bg-card px-3 py-1">{odooName(catalog, sh.odooCode, sh.name)}</span>}
          {fin.map((x) => <span key={x.id} className="rounded-full bg-card px-3 py-1">{odooName(catalog, x.odooCode, x.name)}</span>)}
        </div>
        <p className="text-xs text-muted-foreground">Vista previa aproximada, no es el resultado exacto</p>
      </div>
    </div>
  );
}

function PriceLine({ o, suffix = "", catalog }: { o: Option; suffix?: string; catalog: OdooCatalog }) {
  const price = odooPrice(catalog, o.odooCode) ?? 0;
  return (
    <p className="text-sm text-muted-foreground">
      {o.note === "Desde" ? "Desde " : ""}{rd(price)}{suffix}
      {o.note && o.note !== "Desde" && <span className="block text-xs">{o.note}</span>}
    </p>
  );
}

function Mantenimiento({ set, setSet, catalog }: { set: NailSet; setSet: (s: NailSet) => void; catalog: OdooCatalog }) {
  const sys = chosenSystems(set);
  if (!sys.length) return null;
  const conRetoque = sys.filter((x) => hasOdooProduct(catalog, x.retouchCode));
  const conRetiro = sys.filter((x) => hasOdooProduct(catalog, x.removalCode));
  const sinPrecio = sys.filter((x) => !hasOdooProduct(catalog, x.retouchCode));
  const retoque = conRetoque.reduce((a, x) => a + (odooPrice(catalog, x.retouchCode) ?? 0), 0);
  const retiro = conRetiro.reduce((a, x) => a + (odooPrice(catalog, x.removalCode) ?? 0), 0);
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
