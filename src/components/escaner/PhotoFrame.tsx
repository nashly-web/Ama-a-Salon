/** Muestra la foto completa y centrada (sin recortes), con un fondo difuminado de la misma foto */
export function PhotoFrame({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`relative aspect-[4/3] w-full overflow-hidden bg-secondary ${className}`}>
      <img src={src} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-2xl" />
      <img src={src} alt={alt} className="relative h-full w-full object-contain object-center" />
    </div>
  );
}
