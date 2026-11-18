import { BackButton } from "@/components/BackButton";

export function SiteHeader({ back = false }: { back?: boolean }) {
  return (
    <header className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-6">
      {back && <BackButton />}
      <div className="flex min-w-0 items-baseline gap-2">
        <span className="font-display text-3xl text-foreground">Amaïa</span>
        <span className="hidden text-xs tracking-[0.25em] text-muted-foreground sm:inline">BEAUTY STUDIO</span>
      </div>
    </header>
  );
}
