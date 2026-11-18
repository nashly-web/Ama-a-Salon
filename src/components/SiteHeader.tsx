import type { ReactNode } from "react";
import { BackButton } from "@/components/BackButton";

/** Encabezado del sitio; `action` se muestra en la esquina superior derecha (solo donde se pase). */
export function SiteHeader({ back = false, action }: { back?: boolean; action?: ReactNode }) {
  return (
    <header className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-6">
      {back && <BackButton />}
      <div className="flex min-w-0 items-baseline gap-2">
        <span className="font-display text-3xl text-foreground">Amaïa</span>
        <span className="hidden text-xs tracking-[0.25em] text-muted-foreground sm:inline">BEAUTY STUDIO</span>
      </div>
      {action && <div className="ml-auto shrink-0">{action}</div>}
    </header>
  );
}
