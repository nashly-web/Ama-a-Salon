import { describe, expect, it } from "vitest";
import { emptyFingers, emptySet, toggleDesign, totalPrice } from "@/lib/nails";
import { emptyDatos } from "@/components/estudio/Envio";
import { quoteMessage, waNumber, whatsappLink } from "@/lib/whatsapp";

const set = { ...emptySet, systems: ["builder-gel"], length: 3, shape: "stiletto", designs: { french: 1 } };
const fingers = toggleDesign(emptyFingers(), 0, "french");
const datos = { ...emptyDatos, nombre: "Ana", telefono: "809-555-1234", modalidad: "domicilio" as const, direccion: "Calle 5, Santiago" };

describe("mensaje de WhatsApp", () => {
  it("incluye datos de la clienta, modalidad con dirección y el total en RD$", () => {
    const msg = quoteMessage(set, fingers, datos, totalPrice(set));
    expect(msg).toContain("Nombre: Ana");
    expect(msg).toContain("Teléfono: 809-555-1234");
    expect(msg).toContain("A domicilio — Calle 5, Santiago");
    expect(msg).toContain("Forma: Stiletto");
    expect(msg).toContain(`Total estimado: RD$ ${totalPrice(set).toLocaleString("en-US")}`);
    expect(msg).toContain("sujeta a confirmación en el salón");
  });

  it("el enlace de WhatsApp lleva el número del salón y codifica los saltos de línea", () => {
    const url = whatsappLink("Hola\nAmaïa", "+1 (809) 555-0000");
    expect(url).toBe("https://api.whatsapp.com/send?phone=18095550000&text=Hola%0AAma%C3%AFa");
  });

  it("un teléfono dominicano de 10 dígitos recibe el código +1", () => {
    expect(waNumber("809-555-1234")).toBe("18095551234");
    expect(waNumber("+1 829 555 1234")).toBe("18295551234");
  });

  it("sin número abre WhatsApp para elegir el contacto", () => {
    expect(whatsappLink("x", "")).toBe("https://api.whatsapp.com/send?text=x");
  });
});
