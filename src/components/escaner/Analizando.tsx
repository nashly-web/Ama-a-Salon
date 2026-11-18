import { useEffect, useState } from "react";
import { PhotoFrame } from "./PhotoFrame";

const MENSAJES = ["Mirando tus uñas…", "Reconociendo la forma y el largo…", "Buscando cat eye, french y más…", "Preparando tu cotización…"];

/** Estado de carga suave mientras la IA analiza la foto */
export function Analizando({ image }: { image: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % MENSAJES.length), 2200);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="overflow-hidden rounded-3xl bg-card shadow-soft" role="status" aria-live="polite">
      <div className="relative">
        <PhotoFrame src={image} alt="Tu foto, analizándose" className="opacity-90" />
        <div className="absolute inset-x-0 h-1/3 animate-scan bg-gradient-to-b from-transparent via-primary/35 to-transparent" />
      </div>
      <div className="flex items-center justify-center gap-3 p-6">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary" />
        <p key={i} className="animate-in fade-in font-display text-2xl text-primary">{MENSAJES[i]}</p>
      </div>
    </div>
  );
}
