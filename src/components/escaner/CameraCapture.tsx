import { useEffect, useRef, useState } from "react";

type Props = { onCapture: (blob: Blob) => void; onCancel: () => void; onUnavailable: () => void };

/** Vista de cámara en vivo (si el navegador lo permite). Si no, se usa la cámara del sistema. */
export function CameraCapture({ onCapture, onCancel, onUnavailable }: Props) {
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let off = false;
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: "environment", width: { ideal: 1920 } }, audio: false })
      .then((s) => {
        if (off) return s.getTracks().forEach((t) => t.stop());
        stream.current = s;
        if (video.current) video.current.srcObject = s;
      })
      .catch(onUnavailable) ?? onUnavailable();
    return () => {
      off = true;
      stream.current?.getTracks().forEach((t) => t.stop());
    };
  }, [onUnavailable]);

  const shoot = () => {
    const v = video.current;
    if (!v || !v.videoWidth) return;
    const c = document.createElement("canvas");
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    c.getContext("2d")?.drawImage(v, 0, 0);
    c.toBlob((b) => b && onCapture(b), "image/jpeg", 0.9);
  };

  return (
    <div className="overflow-hidden rounded-3xl bg-foreground/90 shadow-soft">
      <div className="relative">
        <video ref={video} autoPlay playsInline muted onLoadedData={() => setReady(true)} className="aspect-[4/3] w-full object-cover" aria-label="Vista de la cámara" />
        <div className="pointer-events-none absolute inset-6 rounded-3xl border-2 border-dashed border-primary-foreground/60" />
        {!ready && <p className="absolute inset-0 flex items-center justify-center text-sm text-primary-foreground">Abriendo la cámara…</p>}
      </div>
      <div className="flex items-center justify-between gap-3 bg-card p-4">
        <button type="button" onClick={onCancel} className="rounded-full bg-secondary px-6 py-3 font-medium text-secondary-foreground shadow-soft transition hover:bg-accent">Cancelar</button>
        <button type="button" onClick={shoot} disabled={!ready} className="rounded-full bg-primary px-7 py-3 font-medium text-primary-foreground shadow-soft transition hover:-translate-y-0.5 disabled:opacity-40">Tomar foto ✦</button>
      </div>
    </div>
  );
}
