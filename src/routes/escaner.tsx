import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BackButton } from "@/components/BackButton";
import { useCallback, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Title } from "@/components/estudio/parts";
import { Uploader } from "@/components/escaner/Uploader";
import { CameraCapture } from "@/components/escaner/CameraCapture";
import { Analizando } from "@/components/escaner/Analizando";
import { Resultado } from "@/components/escaner/Resultado";
import { QuotePill } from "@/components/escaner/QuotePill";
import { draftFromScan, useDraft } from "@/components/escaner/useDraft";
import { resizeImage } from "@/lib/resize-image";
import { saveHandoff, type ScanResult } from "@/lib/scan";
import { scanNails } from "@/lib/scan.functions";
import { emptyFingers } from "@/lib/nails";
import { PhotoFrame } from "@/components/escaner/PhotoFrame";

export const Route = createFileRoute("/escaner")({
  head: () => ({
    meta: [
      { title: "Escáner de diseño — Amaïa" },
      { name: "description", content: "Sube o toma una foto de tus uñas favoritas y te cotizamos el diseño al instante." },
      { property: "og:title", content: "Escanea tu inspiración — Amaïa" },
      { property: "og:description", content: "Reconocemos cat eye, french, piedras y más, y te damos un precio estimado en RD$." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Escaner,
});

type Phase = "pick" | "camera" | "preview" | "loading" | "error" | "result";
const emptyDraft = { systems: [], length: 3, shape: null, finishes: [], fingers: emptyFingers() };
function Escaner() {
  const navigate = useNavigate();
  const analyze = useServerFn(scanNails);
  const [phase, setPhase] = useState<Phase>("pick");
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [scan, setScan] = useState<ScanResult | null>(null);
  const q = useDraft(emptyDraft);

  const onFile = async (file: Blob) => {
    if (!file.type.startsWith("image/")) { setError("Ese archivo no es una imagen. Elige una foto, por favor."); setPhase("error"); return; }
    try {
      const img = await resizeImage(file);
      setImage(img);
      void run(img);
    } catch {
      setError("No pudimos abrir esa imagen. Prueba con otra foto.");
      setPhase("error");
    }
  };
  const onCameraUnavailable = useCallback(() => {
    setError("No pudimos abrir la cámara. Puedes subir una foto desde tu galería.");
    setPhase("error");
  }, []);

  const run = async (img: string | null = image) => {
    if (!img) return;
    setPhase("loading");
    try {
      const res = await analyze({ data: { image: img } });
      if (!res.ok) { setError(res.error); setPhase("error"); return; }
      if (!res.result.valid) {
        setError(res.result.notes || "No logramos ver uñas en esta foto. Prueba con una imagen más cercana y con buena luz.");
        setPhase("error");
        return;
      }
      setScan(res.result);
      q.reset(draftFromScan(res.result));
      setPhase("result");
    } catch {
      setError("Se perdió la conexión al analizar tu foto. Inténtalo de nuevo.");
      setPhase("error");
    }
  };

  const restart = () => { setImage(null); setScan(null); setError(""); setPhase("pick"); };
  const use = () => {
    saveHandoff(q.state);
    navigate({ to: "/estudio" });
  };

  return (
    <div className="min-h-screen">
      <header className="bg-secondary">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <BackButton />
            <span className="font-display text-3xl">Amaïa</span>
          </div>
          {phase === "result" && <QuotePill items={q.items} total={q.total} />}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <Title t={phase === "result" ? "Así cotizamos tu inspiración" : "Escanea tu inspiración"} s={phase === "result" ? "Revisa lo que encontramos, elige tu sistema y ajusta lo que quieras." : "Sube o toma una foto y te cotizamos al instante."} />

        <div className={phase === "result" ? "" : "mx-auto max-w-2xl"}>
          {phase === "pick" && <Uploader onFile={onFile} onCamera={() => setPhase("camera")} />}
          {phase === "camera" && <CameraCapture onCapture={onFile} onCancel={() => setPhase("pick")} onUnavailable={onCameraUnavailable} />}
          {phase === "preview" && image && (
            <div className="overflow-hidden rounded-3xl bg-card shadow-soft">
              <PhotoFrame src={image} alt="Vista previa de tu foto" />
              <div className="flex flex-col gap-3 p-5 sm:flex-row sm:justify-between">
                <button type="button" onClick={restart} className="rounded-full bg-secondary px-6 py-3 font-medium text-secondary-foreground shadow-soft transition hover:bg-accent">Cambiar foto</button>
                <button type="button" onClick={() => run()} className="rounded-full bg-primary px-7 py-3 font-medium text-primary-foreground shadow-soft transition hover:-translate-y-0.5">Analizar mi diseño ✦</button>
              </div>
            </div>
          )}
          {phase === "loading" && image && <Analizando image={image} />}
          {phase === "error" && (
            <div className="flex flex-col items-center gap-4 rounded-3xl bg-card p-8 text-center shadow-soft" role="alert">
              <p className="font-display text-3xl text-primary">Ups, casi lo tenemos</p>
              <p className="max-w-md text-muted-foreground">{error}</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                {image && <button type="button" onClick={() => run()} className="rounded-full bg-primary px-7 py-3 font-medium text-primary-foreground shadow-soft transition hover:-translate-y-0.5">Reintentar</button>}
                <button type="button" onClick={restart} className="rounded-full border border-primary px-7 py-3 font-medium text-primary transition hover:bg-secondary">Elegir otra foto</button>
              </div>
            </div>
          )}
          {phase === "result" && scan && image && <Resultado scan={scan} image={image} q={q} onChange={restart} onUse={use} />}
        </div>

        {phase !== "result" && (
          <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-muted-foreground">
            Tu foto solo se usa para analizar el diseño; no la guardamos. El precio es un estimado y el salón confirma el final.
          </p>
        )}
      </main>
    </div>
  );
}
