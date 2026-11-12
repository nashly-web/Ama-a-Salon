import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { categories, priceLabel } from "@/lib/services";
import { rd } from "@/lib/nails";

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

function Servicios() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 pb-16">
        <h1 className="text-5xl text-primary">Servicios y precios</h1>
        <p className="mt-2 text-muted-foreground">Todo lo que ofrecemos, en un solo lugar.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {categories.map((c) => (
            <section key={c.title} className="rounded-3xl border bg-card p-6 shadow-soft">
              <h2 className="text-3xl text-primary">{c.title}</h2>
              <ul className="mt-4 divide-y">
                {c.rows.map((row) => (
                  <li key={row.name} className="flex items-start justify-between gap-4 py-3">
                    <div className="min-w-0"><p className="font-medium">{row.name}</p>{row.extra && <p className="whitespace-pre-line text-xs text-muted-foreground">{row.extra}</p>}</div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">{priceLabel(row.price)}</span>
                      {row.list && <span className="text-xs text-muted-foreground line-through">{rd(row.list)}</span>}
                    </div>
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
