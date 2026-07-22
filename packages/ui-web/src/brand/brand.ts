export type BrandTone = "default" | "green" | "pink";

export type BrandVisualProps = {
  decorative?: boolean;
  label?: string;
  tone?: BrandTone;
};

export function toCssLength(value: number | string) {
  return typeof value === "number" ? `${value}px` : value;
}
