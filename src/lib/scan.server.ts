// Llamada al modelo de visión (solo servidor). La clave nunca llega al navegador.
import { generateResponse, GatewayError, PaymentRequiredError, RateLimitError } from "@lovable.dev/ai-gateway";
import { designs, finishes, shapes } from "./nails";
import { designIds, finishIds, shapeIds } from "./scan";

const MODEL = "openai/gpt-6-astra";

const list = (o: { id: string; name: string }[]) => o.map((x) => `- ${x.id}: ${x.name}`).join("\n");

const INSTRUCTIONS = `Eres la asistente de un salón de uñas. Analiza la foto de uñas y describe SOLO lo que se ve, usando EXCLUSIVAMENTE los ids del catálogo.

FORMAS (shape):
${list(shapes)}

ACABADOS de mano completa (finishes):
${list(finishes)}

DISEÑOS por uña (designsPerFinger):
${list(designs)}

Reglas de mapeo:
- cat eye / ojo de gato / magnético → cateye
- french fino / punta fina recta → french-fino; french media luna / punta curva gruesa → french-luna (si el french está en todas las uñas es un ACABADO; si solo en algunas uñas como acento, es el diseño "french")
- efecto espejo / cromo / chrome / perla metálica → chrome
- mate / matte → matte
- uña con piedras / pedrería en toda la uña → diseño "piedras"; acabado de cristal / encapsulado transparente → cristal
- baby boomer / degradado blanco-nude → babyboomer
- flores pintadas → flores; dibujos, relieve, charms o 3D elaborado → 3d; nail art sencillo (puntos, líneas, corazoncitos) → sencillo
- color liso en gel → gel
- Cualquier efecto que no esté en el catálogo (aurora, aura, glitter, foil, sticker, etc.) NO se mapea: mappedId null y menciónalo en notes.

designsPerFinger: exactamente 10 listas, en este orden: 0 meñique izq., 1 anular izq., 2 medio izq., 3 índice izq., 4 pulgar izq., 5 pulgar der., 6 índice der., 7 medio der., 8 anular der., 9 meñique der. Si solo se ve una mano, repite el patrón en la otra. Si un diseño se ve en todas las uñas, ponlo en las 10. Si no se distingue, deja listas vacías.

lengthEstimate de 1 (muy corto) a 8 (muy extra largo). Forma y largo son estimaciones: si dudas, usa null.
No intentes adivinar el sistema (builder, soft gel, acrílico): no se ve en una foto.
Si la imagen no muestra uñas, valid=false, todo vacío y explica en notes con amabilidad.
notes: SOLO lo que viste y no existe en el catálogo (para consultar en el salón), o el motivo si valid=false. Si todo se pudo mapear, notes = "" (no describas la foto).
labels y notes en español, breves.`;

const nullableEnum = (ids: string[]) => ({ type: ["string", "null"], enum: [...ids, null] });

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["valid", "shape", "lengthEstimate", "finishes", "designsPerFinger", "detectedElements", "notes"],
  properties: {
    valid: { type: "boolean" },
    shape: nullableEnum(shapeIds),
    lengthEstimate: { type: ["integer", "null"] },
    finishes: { type: "array", items: { type: "string", enum: finishIds } },
    designsPerFinger: { type: "array", items: { type: "array", items: { type: "string", enum: designIds } } },
    detectedElements: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["label", "mappedId", "confidence"],
        properties: {
          label: { type: "string" },
          mappedId: nullableEnum([...finishIds, ...designIds, ...shapeIds]),
          confidence: { type: "number" },
        },
      },
    },
    notes: { type: "string" },
  },
} as const;

export type ScanCallResult = { ok: true; raw: unknown } | { ok: false; error: string };

function outputText(res: unknown): { text: string; refusal: string | null } {
  let text = "";
  let refusal: string | null = null;
  const out = (res as { output?: unknown[] }).output ?? [];
  for (const item of out) {
    const content = (item as { type?: string; content?: unknown[] }).content;
    if (!Array.isArray(content)) continue;
    for (const c of content as { type?: string; text?: string; refusal?: string }[]) {
      if (c.type === "output_text" && c.text) text += c.text;
      if (c.type === "refusal" && c.refusal) refusal = c.refusal;
    }
  }
  return { text, refusal };
}

export async function analyzeNailPhoto(imageDataUrl: string): Promise<ScanCallResult> {
  try {
    const res = await generateResponse({
      model: MODEL,
      instructions: INSTRUCTIONS,
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: "Analiza esta foto de uñas y devuelve el JSON." },
            { type: "input_image", image_url: imageDataUrl, detail: "high" },
          ],
        },
      ],
      reasoning: { effort: "low" },
      text: { format: { type: "json_schema", name: "nail_scan", strict: true, schema: SCHEMA as unknown as Record<string, unknown> } },
    });
    const { text, refusal } = outputText(res);
    if (refusal || !text) return { ok: false, error: "No pudimos leer tu foto. Prueba con otra imagen, por favor." };
    return { ok: true, raw: JSON.parse(text) };
  } catch (e) {
    if (e instanceof RateLimitError) return { ok: false, error: "Estamos recibiendo muchas fotos ahora mismo. Espera un momento y vuelve a intentarlo." };
    if (e instanceof PaymentRequiredError) return { ok: false, error: "El escáner no está disponible en este momento. Puedes diseñar tu set en el Estudio." };
    if (e instanceof GatewayError) console.error("scan gateway error", e.code, e.httpStatus, e.ids);
    else console.error("scan error", e);
    return { ok: false, error: "Algo no salió bien al analizar tu foto. Inténtalo de nuevo." };
  }
}
