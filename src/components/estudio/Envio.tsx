import { useState } from "react";
import { rd } from "@/lib/nails";
import { Title } from "./parts";

export type Datos = { nombre: string; telefono: string; modalidad: "salon" | "domicilio"; direccion: string; fecha: string; notas: string };
export const emptyDatos: Datos = { nombre: "", telefono: "", modalidad: "salon", direccion: "", fecha: "", notas: "" };

const input = "mt-1 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30";

export function Envio({ total, quote, datos, setDatos, onSend }: { total: number; quote: string; datos: Datos; setDatos: (d: Datos) => void; onSend: () => void }) {
  const [error, setError] = useState("");
  const set = <K extends keyof Datos>(k: K, v: Datos[K]) => setDatos({ ...datos, [k]: v });
  const domicilio = datos.modalidad === "domicilio";
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!datos.nombre.trim() || !datos.telefono.trim()) return setError("Escribe tu nombre y teléfono para enviarte la cotización.");
    if (domicilio && !datos.direccion.trim()) return setError("Escribe la dirección para el servicio a domicilio.");
    setError("");
    onSend();
  };
  const pill = (on: boolean) => `rounded-full px-4 py-2 text-sm transition ${on ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`;
  return (<>
    <Title t="Casi lista" s="Déjanos tus datos para enviar tu cotización" />
    <div className="grid gap-6 md:grid-cols-[1fr_300px]">
      <form id="envio-form" onSubmit={submit} className="grid gap-4 rounded-3xl border border-border bg-card p-6 shadow-soft sm:grid-cols-2">
        <label className="text-sm">Nombre<input className={input} value={datos.nombre} onChange={(e) => set("nombre", e.target.value)} maxLength={80} autoComplete="name" /></label>
        <label className="text-sm">Teléfono<input className={input} type="tel" value={datos.telefono} onChange={(e) => set("telefono", e.target.value)} maxLength={20} autoComplete="tel" /></label>
        <div className="sm:col-span-2">
          <p className="text-sm">Modalidad</p>
          <div className="mt-2 flex gap-2">
            <button type="button" onClick={() => set("modalidad", "salon")} className={pill(!domicilio)}>En el salón</button>
            <button type="button" onClick={() => set("modalidad", "domicilio")} className={pill(domicilio)}>A domicilio</button>
          </div>
        </div>
        <label className={`text-sm sm:col-span-2 ${domicilio ? "" : "opacity-50"}`}>Dirección (solo a domicilio)
          <input className={input} value={datos.direccion} disabled={!domicilio} onChange={(e) => set("direccion", e.target.value)} maxLength={200} autoComplete="street-address" />
        </label>
        <label className="text-sm">Fecha deseada (opcional)<input className={input} type="date" value={datos.fecha} onChange={(e) => set("fecha", e.target.value)} /></label>
        <label className="text-sm">Observaciones<input className={input} value={datos.notas} onChange={(e) => set("notas", e.target.value)} maxLength={300} /></label>
        {error && <p role="alert" className="text-sm text-destructive sm:col-span-2">{error}</p>}
      </form>

      <aside className="h-fit rounded-3xl border border-border bg-secondary p-6 shadow-soft">
        <p className="text-lg font-semibold">Cotización #{quote}</p>
        <div className="mt-3 space-y-2 text-sm text-muted-foreground">
          <div className="flex justify-between"><span>Set estimado</span><span>{rd(total)}</span></div>
          <div className="flex justify-between"><span>Cargo a domicilio</span><span>{domicilio ? "Por confirmar" : "No aplica"}</span></div>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <span className="font-semibold">Total</span>
          <span className="font-display text-4xl text-primary">{rd(total)}</span>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Es una cotización, no una reserva ni un pago.</p>
      </aside>
    </div>
  </>);
}
