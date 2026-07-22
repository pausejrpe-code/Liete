export type AssetSource = string | { src: string };

export function getAssetUrl(asset: AssetSource) {
  return typeof asset === "string" ? asset : asset.src;
}
