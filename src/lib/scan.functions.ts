import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { analyzeNailPhoto } from "./scan.server";
import { sanitizeScan, type ScanResult } from "./scan";

const input = z.object({
  // Imagen ya reducida en el navegador (JPEG ~1280 px). No se guarda en ningún sitio.
  image: z.string().max(6_000_000).regex(/^data:image\/(jpeg|png|webp);base64,/),
});

export type ScanResponse = { ok: true; result: ScanResult } | { ok: false; error: string };

export const scanNails = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => input.parse(data))
  .handler(async ({ data }): Promise<ScanResponse> => {
    const res = await analyzeNailPhoto(data.image);
    if (!res.ok) return res;
    const result = sanitizeScan(res.raw);
    if (!result) return { ok: false, error: "No pudimos leer tu foto. Prueba con otra imagen, por favor." };
    return { ok: true, result };
  });
