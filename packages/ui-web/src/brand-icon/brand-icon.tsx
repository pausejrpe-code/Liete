import type { CSSProperties, HTMLAttributes } from "react";
import defaultIcon from "./assets/default.svg";
import greenIcon from "./assets/green.svg";
import pinkIcon from "./assets/pink.svg";
import { type BrandTone, type BrandVisualProps, toCssLength } from "../brand/brand";
import { getAssetUrl, type AssetSource } from "../internal/asset-url";
import styles from "./brand-icon.module.css";

export type BrandIconProps = Omit<
  HTMLAttributes<HTMLSpanElement>,
  "aria-label" | "children"
> &
  BrandVisualProps & {
    size?: number | string;
  };

const assets: Record<BrandTone, AssetSource> = {
  default: defaultIcon,
  green: greenIcon,
  pink: pinkIcon
};

type BrandIconStyle = CSSProperties & { "--brand-icon-size"?: string };

export function BrandIcon({
  className,
  decorative = false,
  label = "Liete",
  size,
  style,
  tone = "default",
  ...props
}: BrandIconProps) {
  const classes = [styles.root, className].filter(Boolean).join(" ");
  const customStyle: BrandIconStyle = {
    ...style,
    ...(size === undefined ? {} : { "--brand-icon-size": toCssLength(size) })
  };

  return (
    <span
      {...props}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : label}
      className={classes}
      data-tone={tone}
      role={decorative ? undefined : "img"}
      style={customStyle}
    >
      <img alt="" aria-hidden="true" src={getAssetUrl(assets[tone])} />
    </span>
  );
}
