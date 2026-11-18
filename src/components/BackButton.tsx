import { useCanGoBack, useRouter } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

/** Flecha para regresar a la pantalla anterior; si no hay historial, vuelve al inicio. */
export function BackButton({ onBack }: { onBack?: () => void }) {
  const router = useRouter();
  const canGoBack = useCanGoBack();
  const go = () => {
    if (onBack) return onBack();
    if (canGoBack) router.history.back();
    else void router.navigate({ to: "/" });
  };
  return (
    <button
      type="button"
      onClick={go}
      aria-label="Regresar"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-card text-foreground shadow-soft transition hover:-translate-y-0.5 hover:bg-accent"
    >
      <ChevronLeft className="h-5 w-5" aria-hidden />
    </button>
  );
}
