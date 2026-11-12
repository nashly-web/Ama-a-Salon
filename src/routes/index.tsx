import { createFileRoute, Link } from "@tanstack/react-router";
import hands from "@/assets/hands.jpg";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Amaïa Beauty Studio — Uñas, cabello y belleza" },
      { name: "description", content: "Salón de belleza boutique. Diseña tus uñas y cotiza al instante en nuestro estudio digital." },
      { property: "og:title", content: "Amaïa Beauty Studio" },
      { property: "og:description", content: "Diseña tus uñas y conoce tu precio al instante." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-secondary from-50% to-accent to-50%">
      <SiteHeader />
      <main className="mx-auto grid max-w-6xl items-center gap-10 px-6 pb-16 md:grid-cols-2">
        <section className="rounded-3xl bg-background p-8 shadow-soft md:p-12">
          <p className="text-xs tracking-[0.25em] text-muted-foreground">TU ESTUDIO DE UÑAS DIGITAL</p>
          <h1 className="mt-4 text-5xl leading-tight text-primary md:text-6xl">
            ¡Bienvenida a <span className="bg-[linear-gradient(transparent_60%,var(--highlight)_60%)]">Amaïa</span>!
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">Diseña las uñas que deseas y descubre cuánto costaría tu próximo set.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/estudio" className="rounded-full bg-primary px-7 py-3 font-medium text-primary-foreground shadow-soft transition hover:opacity-90">Comenzar a diseñar ✦</Link>
            <Link to="/servicios" className="rounded-full border border-primary px-7 py-3 font-medium text-primary transition hover:bg-secondary">Ver servicios y precios</Link>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Elige · Combina · Cotiza, en solo unos minutos</p>
        </section>
        <img src={hands} alt="Manos con uñas en tonos pastel" width={1024} height={1024} className="w-full rounded-3xl shadow-soft" />
      </main>
    </div>
  );
}
