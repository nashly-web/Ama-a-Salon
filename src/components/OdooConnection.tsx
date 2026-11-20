export function OdooConnection({
  loading,
  error,
  onRetry,
}: {
  loading?: boolean;
  error?: unknown;
  onRetry?: () => void;
}) {
  const message = error instanceof Error ? error.message : "No pudimos obtener los precios actuales de Odoo.";
  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-border bg-card p-8 text-center shadow-soft" role={error ? "alert" : "status"}>
      <h1 className="font-display text-3xl text-primary">{loading ? "Conectando con Odoo" : "No se pudo conectar con Odoo"}</h1>
      <p className="mt-3 text-muted-foreground">
        {loading ? "Estamos cargando los precios actuales del salón. No mostraremos tarifas guardadas en la web." : message}
      </p>
      {error && onRetry && (
        <button type="button" onClick={onRetry} className="mt-5 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground">
          Intentar de nuevo
        </button>
      )}
    </div>
  );
}
