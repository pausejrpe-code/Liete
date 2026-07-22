import type { CSSProperties, HTMLAttributes } from "react";
import defaultDot from "./assets/default-dot.svg";
import defaultPart1 from "./assets/default-part-1.svg";
import defaultPart2 from "./assets/default-part-2.svg";
import defaultPart3 from "./assets/default-part-3.svg";
import defaultPart4 from "./assets/default-part-4.svg";
import defaultPart5 from "./assets/default-part-5.svg";
import greenDot from "./assets/green-dot.svg";
import greenPart1 from "./assets/green-part-1.svg";
import greenPart2 from "./assets/green-part-2.svg";
import greenPart3 from "./assets/green-part-3.svg";
import greenPart4 from "./assets/green-part-4.svg";
import greenPart5 from "./assets/green-part-5.svg";
import pinkDot from "./assets/pink-dot.svg";
import pinkPart1 from "./assets/pink-part-1.svg";
import pinkPart2 from "./assets/pink-part-2.svg";
import pinkPart3 from "./assets/pink-part-3.svg";
import pinkPart4 from "./assets/pink-part-4.svg";
import pinkPart5 from "./assets/pink-part-5.svg";
import { type BrandTone, type BrandVisualProps, toCssLength } from "../brand/brand";
import { getAssetUrl, type AssetSource } from "../internal/asset-url";
import styles from "./brand-logo.module.css";

export type BrandLogoProps = Omit<
  HTMLAttributes<HTMLSpanElement>,
  "aria-label" | "children"
> &
  BrandVisualProps & {
    width?: number | string;
  };

type LogoAssets = readonly [
  AssetSource,
  AssetSource,
  AssetSource,
  AssetSource,
  AssetSource,
  AssetSource
];

const assets: Record<BrandTone, LogoAssets> = {
  default: [defaultPart1, defaultPart2, defaultPart3, defaultPart4, defaultPart5, defaultDot],
  green: [greenPart1, greenPart2, greenPart3, greenPart4, greenPart5, greenDot],
  pink: [pinkPart1, pinkPart2, pinkPart3, pinkPart4, pinkPart5, pinkDot]
};

const partClasses = [styles.part1, styles.part2, styles.part3, styles.part4, styles.part5];
type BrandLogoStyle = CSSProperties & { "--brand-logo-width"?: string };

export function BrandLogo({
  className,
  decorative = false,
  label = "Liete",
  style,
  tone = "default",
  width,
  ...props
}: BrandLogoProps) {
  const classes = [styles.root, className].filter(Boolean).join(" ");
  const toneAssets = assets[tone];
  const customStyle: BrandLogoStyle = {
    ...style,
    ...(width === undefined ? {} : { "--brand-logo-width": toCssLength(width) })
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
      {toneAssets.slice(0, 5).map((asset, index) => (
        <img
          alt=""
          aria-hidden="true"
          className={partClasses[index]}
          key={partClasses[index]}
          src={getAssetUrl(asset)}
        />
      ))}
      <img alt="" aria-hidden="true" className={styles.dot1} src={getAssetUrl(toneAssets[5])} />
      <img alt="" aria-hidden="true" className={styles.dot2} src={getAssetUrl(toneAssets[5])} />
    </span>
  );
}
