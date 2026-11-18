import { useRef, useState } from "react";
import { Camera, ImageUp, ScanLine } from "lucide-react";

type Props = { onFile: (file: Blob) => void; onCamera: () => void };

/** Zona grande de carga: tomar foto, subir imagen o arrastrar y soltar */
export function Uploader({ onFile, onCamera }: Props) {
  const pick = useRef<HTMLInputElement>(null);
  const snap = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  const take = () => {
    // En el celular la cámara del sistema es la mejor experiencia; en escritorio, vista en vivo.
    if (window.matchMedia("(pointer: coarse)").matches || !navigator.mediaDevices?.getUserMedia) snap.current?.click();
    else onCamera();
  };
  const fromInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onFile(f);
    e.target.value = "";
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const f = e.dataTransfer.files[0];
        if (f) onFile(f);
      }}
      className={`flex flex-col items-center gap-6 rounded-3xl border-2 border-dashed bg-card px-6 py-12 text-center shadow-soft transition md:py-16 ${over ? "border-primary bg-secondary" : "border-primary/40"}`}
    >
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary text-primary">
        <ScanLine className="h-9 w-9" aria-hidden />
      </span>
      <div>
        <p className="font-display text-3xl">Tu foto de inspiración</p>
        <p className="mt-1 text-sm text-muted-foreground">Una foto clara de las uñas, con buena luz. También puedes arrastrarla aquí.</p>
      </div>
      <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
        <button type="button" onClick={take} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 font-medium text-primary-foreground shadow-soft transition hover:-translate-y-0.5">
          <Camera className="h-5 w-5" aria-hidden /> Tomar foto
        </button>
        <button type="button" onClick={() => pick.current?.click()} className="flex flex-1 items-center justify-center gap-2 rounded-full border border-primary px-7 py-4 font-medium text-primary transition hover:-translate-y-0.5 hover:bg-secondary">
          <ImageUp className="h-5 w-5" aria-hidden /> Subir imagen
        </button>
      </div>
      <input ref={snap} type="file" accept="image/*" capture="environment" className="sr-only" onChange={fromInput} tabIndex={-1} aria-hidden />
      <input ref={pick} type="file" accept="image/*" className="sr-only" onChange={fromInput} tabIndex={-1} aria-hidden />
    </div>
  );
}
