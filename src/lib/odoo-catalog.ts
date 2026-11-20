import { useQuery } from "@tanstack/react-query";

export type OdooVariantPrice = { size: string | null; price: number };
export type OdooProductPrice = {
  code: string;
  name: string;
  price: number;
  variants: OdooVariantPrice[];
};
export type OdooCatalog = {
  currency: "DOP";
  symbol: string;
  updated_at: string;
  products: Record<string, OdooProductPrice>;
};

type OdooCatalogResponse = {
  currency?: unknown;
  symbol?: unknown;
  updated_at?: unknown;
  products?: unknown;
  error?: unknown;
};

const catalogUrl = () => {
  const base = import.meta.env.VITE_ODOO_URL?.trim().replace(/\/+$/, "");
  if (!base) throw new Error("Falta configurar VITE_ODOO_URL para conectar Amaïa con Odoo.");
  return `${base}/api/amaia/catalog`;
};

async function fetchOdooCatalog(): Promise<OdooCatalog> {
  const response = await fetch(catalogUrl(), { headers: { Accept: "application/json" } });
  const payload = (await response.json()) as OdooCatalogResponse;
  if (!response.ok) {
    throw new Error(typeof payload.error === "string" ? payload.error : `Odoo respondió ${response.status}.`);
  }
  if (payload.currency !== "DOP" || !Array.isArray(payload.products)) {
    throw new Error("Odoo devolvió un catálogo incompleto o con una moneda distinta a RD$.");
  }

  const products: Record<string, OdooProductPrice> = {};
  for (const item of payload.products) {
    if (!item || typeof item !== "object") continue;
    const product = item as OdooProductPrice;
    if (
      typeof product.code === "string" &&
      typeof product.name === "string" &&
      Number.isFinite(product.price) &&
      Array.isArray(product.variants)
    ) {
      products[product.code] = product;
    }
  }
  return {
    currency: "DOP",
    symbol: typeof payload.symbol === "string" ? payload.symbol : "RD$",
    updated_at: typeof payload.updated_at === "string" ? payload.updated_at : "",
    products,
  };
}

export function useOdooCatalog() {
  return useQuery({
    queryKey: ["odoo", "public-catalog"],
    queryFn: fetchOdooCatalog,
    staleTime: 0,
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
    retry: 2,
  });
}

export function odooProduct(catalog: OdooCatalog, code: string | undefined) {
  return code ? catalog.products[code] : undefined;
}

export function odooName(catalog: OdooCatalog, code: string | undefined, fallback: string) {
  return odooProduct(catalog, code)?.name ?? fallback;
}

export function odooPrice(catalog: OdooCatalog, code: string | undefined, size?: string) {
  const product = odooProduct(catalog, code);
  if (!product) return undefined;
  if (size) return product.variants.find((variant) => variant.size === size)?.price;
  return product.price;
}

export function hasOdooProduct(catalog: OdooCatalog, code: string | undefined) {
  return !!odooProduct(catalog, code);
}
