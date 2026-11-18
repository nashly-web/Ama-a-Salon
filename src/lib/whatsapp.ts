import { chosenSystems, designCombos, finishes, fingerName, lengths, rd, shapes, sizeOf, type Fingers, type NailSet } from "@/lib/nails";
import { priceRows } from "@/components/estudio/Resumen";
import type { Datos } from "@/components/estudio/Envio";

/**
 * Convierte el teléfono escrito en el formulario al formato de WhatsApp (solo dígitos con código de país).
 * Los números dominicanos de 10 dígitos (809/829/849) reciben el código +1.
 */
export function waNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 ? `1${digits}` : digits;
}

/** Mensaje de la cotización, ordenado y decorado para WhatsApp (*negrita*, _cursiva_). */
export function quoteMessage(set: NailSet, fingers: Fingers, d: Datos, total: number) {
  const sys = chosenSystems(set).map((s) => s.name).join(" + ") || "Por definir";
  const largo = lengths.find((l) => l.id === set.length);
  const forma = shapes.find((s) => s.id === set.shape)?.name ?? "Por definir";
  const acabados = set.finishes.map((f) => finishes.find((x) => x.id === f)?.name).filter(Boolean).join(", ") || "Ninguno";
  const combos = designCombos(fingers);
  const domicilio = d.modalidad === "domicilio";

  const lines = [
    "💅 *Cotización · Amaïa Beauty Studio* ✨",
    "",
    `¡Hola, ${d.nombre.trim()}! 🌸 Esta es tu cotización de uñas en Amaïa Beauty Studio:`,
    "",
    "👤 *Datos de la clienta*",
    `• Nombre: ${d.nombre.trim()}`,
    `• Teléfono: ${d.telefono.trim()}`,
    "",
    "📍 *Modalidad*",
    `• ${domicilio ? `A domicilio — ${d.direccion.trim()}` : "En el salón"}`,
    ...(d.fecha ? [`• Fecha deseada: ${d.fecha}`] : []),
    "",
    "📋 *Detalle del set*",
    `• Sistema: ${sys}`,
    `• Largo: #${set.length} · ${largo?.name ?? ""} (${sizeOf(set.length)})`,
    `• Forma: ${forma}`,
    `• Complementos: ${acabados}`,
    ...(set.retiro ? ["• Incluye retiro del set anterior"] : []),
    `• Diseños: ${combos.length ? "" : "Sin diseños"}`.trimEnd(),
    ...combos.map((c) => `   ◦ ${c.name} — ${c.fingers.map(fingerName).join(", ")}`),
    "",
    "🧾 *Desglose*",
    ...priceRows(set).map((r) => `• ${r.label}: ${r.price ? rd(r.price) : "Incluido"}`),
    "",
    `💰 *Total estimado: ${rd(total)}*`,
    ...(domicilio ? ["_(Cargo a domicilio por confirmar)_"] : []),
    ...(d.notas.trim() ? ["", `📝 *Observaciones:* ${d.notas.trim()}`] : []),
    "",
    "📝 _Esta es una cotización estimada, sujeta a confirmación en el salón._",
    "¡Gracias por elegirnos! 💖",
  ];
  return lines.join("\n");
}

/**
 * Enlace gratuito de WhatsApp con el mensaje listo para enviar.
 * Si no hay número, WhatsApp deja elegir a quién compartirlo.
 * Se usa api.whatsapp.com/send directo: la redirección de wa.me convierte los emojis en "�".
 */
export function whatsappLink(text: string, phone = "") {
  const to = waNumber(phone);
  return `https://api.whatsapp.com/send?${to ? `phone=${to}&` : ""}text=${encodeURIComponent(text)}`;
}
