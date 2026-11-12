import { Check, MessageCircle } from "lucide-react";

const sparkles = [
  { top: "14%", left: "12%", size: "text-4xl" },
  { top: "10%", left: "82%", size: "text-3xl" },
  { top: "68%", left: "15%", size: "text-2xl" },
  { top: "74%", left: "78%", size: "text-5xl" },
];

export function Confirmacion({ quote, whatsappText, onNew }: { quote: string; whatsappText: string; onNew: () => void }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-soft px-6 py-16">
      {sparkles.map((s, i) => (
        <span key={i} aria-hidden className={`absolute ${s.size} text-card`} style={{ top: s.top, left: s.left }}>✦</span>
      ))}
      <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-8 text-center shadow-soft">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="h-8 w-8" />
        </div>
        <h1 className="mt-4 text-5xl text-primary">¡Solicitud enviada!</h1>
        <p className="mt-2 text-sm">Tu número de solicitud es</p>
        <div className="mt-4 rounded-2xl bg-secondary py-3 font-display text-4xl">Cliente #{quote}</div>
        <p className="mt-4 text-xs text-muted-foreground">La manicurista revisará tu cotización y podría confirmarla o ajustarla. Te contactaremos al teléfono que indicaste.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href={`https://wa.me/?text=${encodeURIComponent(whatsappText)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-soft">
            <MessageCircle className="h-4 w-4" /> Compartir por WhatsApp
          </a>
          <button type="button" onClick={onNew} className="rounded-full border-2 border-primary px-6 py-3 text-sm font-medium text-primary">Nueva cotización</button>
        </div>
      </div>
    </div>
  );
}
