import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-6">
      <Link to="/" className="flex min-w-0 items-baseline gap-2">
        <span className="font-display text-3xl text-foreground">Amaïa</span>
        <span className="hidden text-xs tracking-[0.25em] text-muted-foreground sm:inline">BEAUTY STUDIO</span>
      </Link>
      <nav className="flex shrink-0 gap-2 text-sm">
        <Link to="/servicios" className="rounded-full bg-card px-4 py-2 shadow-soft" activeProps={{ className: "bg-primary text-primary-foreground" }}>Servicios</Link>
        <Link to="/estudio" className="rounded-full bg-card px-4 py-2 shadow-soft" activeProps={{ className: "bg-primary text-primary-foreground" }}>Estudio de uñas</Link>
      </nav>
    </header>
  );
}
