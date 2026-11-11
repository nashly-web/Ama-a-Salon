import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/servicios")({
  head: () => ({
    meta: [
      { title: "Servicios y precios — Amaïa Beauty Studio" },
      { name: "description", content: "Tarifas de manos, pies, extensiones, arte y cabello en RD$." },
      { property: "og:title", content: "Servicios y precios — Amaïa" },
      { property: "og:description", content: "Manos, pies, extensiones y arte de uñas con precios en RD$." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Servicios,
});

type Row = [string, string, string?];
const cats: { title: string; rows: Row[] }[] = [
  { title: "Manos", rows: [["Pintura regular", "RD$ 300", "Retiro RD$ 50"], ["Pintado natural", "RD$ 300", "Retiro RD$ 50"], ["Encapsulado (und)", "RD$ 130"], ["Esmaltado en gel", "RD$ 500", "Retiro RD$ 100"], ["Manicura", "RD$ 500"], ["Manicura + gel", "RD$ 1,000"], ["Mini manicura", "RD$ 250"], ["ManiSpa Cuccio", "RD$ 1,500"], ["Manicura hombres", "RD$ 600"], ["Manicura + gel hombres", "RD$ 900"]] },
  { title: "Pies", rows: [["Pintura regular", "RD$ 300"], ["Pintura en gel", "RD$ 500", "Retiro RD$ 100"], ["Todas pies", "RD$ 1,300"], ["Todas pies resina", "RD$ 1,500"], ["Dos uñas grandes (acrílicas)", "RD$ 500", "Retoque RD$ 400 · Retiro RD$ 250"], ["Pedicura", "RD$ 600"], ["Pedicura spa Cuccio", "RD$ 1,600"], ["Pedicura hombres", "RD$ 700"], ["Mini pedicure", "RD$ 400"], ["Pedigel", "RD$ 1,000", "Retiro RD$ 100"]] },
  { title: "Extensiones y sistemas", rows: [["Builder Cuccio", "RD$ 1,350 – 1,500", "Retoque RD$ 1,200 · Retiro RD$ 250"], ["Builder Gel", "RD$ 1,300 – 1,450", "Retoque RD$ 1,150 · Retiro RD$ 250"], ["Soft gel / Press on", "RD$ 1,000 – 1,250", "Retoque RD$ 800 · Retiro RD$ 200"], ["Cover liso", "RD$ 1,000 – 1,600", "Retoque RD$ 900 · Retiro RD$ 250"], ["Uña adicional", "RD$ 100 – 200"]] },
  { title: "Arte y acabados", rows: [["French media luna gel", "RD$ 300"], ["French fino recto", "RD$ 200"], ["Nailart simple", "RD$ 200"], ["Una uña piedra completa", "RD$ 150"], ["Efecto espejo", "RD$ 500"], ["Stiletto", "RD$ 1,000"], ["Cristal", "RD$ 700"], ["Esmaltado después del acrílico", "RD$ 400"], ["Baby Boomer", "RD$ 1,300"]] },
  { title: "Cabello", rows: [["Lacios", "Consultar"], ["Rizos", "Consultar"], ["Pelucas", "Consultar"], ["Otros productos", "Consultar"]] },
];

function Servicios() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 pb-16">
        <h1 className="text-5xl text-primary">Servicios y precios</h1>
        <p className="mt-2 text-muted-foreground">Todo lo que ofrecemos, en un solo lugar.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {cats.map((c) => (
            <section key={c.title} className="rounded-3xl border bg-card p-6 shadow-soft">
              <h2 className="text-3xl text-primary">{c.title}</h2>
              <ul className="mt-4 divide-y">
                {c.rows.map(([n, p, extra]) => (
                  <li key={n} className="flex items-start justify-between gap-4 py-3">
                    <div className="min-w-0"><p className="font-medium">{n}</p>{extra && <p className="text-xs text-muted-foreground">{extra}</p>}</div>
                    <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">{p}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <div className="mt-10 text-center"><Link to="/estudio" className="rounded-full bg-primary px-7 py-3 font-medium text-primary-foreground shadow-soft">Diseña tus uñas ✦</Link></div>
      </main>
    </div>
  );
}
