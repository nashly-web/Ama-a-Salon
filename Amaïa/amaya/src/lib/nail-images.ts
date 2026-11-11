const files = import.meta.glob("@/assets/nails/*.jpg", { eager: true, import: "default" }) as Record<string, string>;
const byName: Record<string, string> = {};
for (const [p, url] of Object.entries(files)) byName[p.split("/").pop()!.replace(".jpg", "")] = url;

const alias: Record<string, string> = {
  "system-cover": "shape-cuadrada",
  "finish-french-luna": "design-french",
  "finish-french-fino": "design-french",
};
export function nailImg(kind: "system" | "shape" | "finish" | "design" | "length", id: string): string | undefined {
  const key = `${kind}-${id}`;
  return byName[key] ?? byName[alias[key] ?? ""];
}

export function lengthImg(length: number) {
  return nailImg("length", String(length)) ?? nailImg("length", "4");
}
