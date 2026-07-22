import type { HTMLAttributes } from "react";
import headSm from "./assets/head-sm.svg";
import shouldersSm from "./assets/shoulders-sm.svg";
import headMd from "./assets/head-md.svg";
import shouldersMd from "./assets/shoulders-md.svg";
import headLg from "./assets/head-lg.svg";
import shouldersLg from "./assets/shoulders-lg.svg";
import { getAssetUrl, type AssetSource } from "../internal/asset-url";
import styles from "./avatar.module.css";

export type AvatarSize = "sm" | "md" | "lg";
export type AvatarType = "initials" | "photo";

const placeholders: Record<AvatarSize, { head: AssetSource; shoulders: AssetSource }> = {
  sm: { head: headSm, shoulders: shouldersSm },
  md: { head: headMd, shoulders: shouldersMd },
  lg: { head: headLg, shoulders: shouldersLg }
};

export type AvatarProps = HTMLAttributes<HTMLSpanElement> & {
  alt?: string;
  initials?: string;
  name?: string;
  size?: AvatarSize;
  src?: AssetSource;
  type?: AvatarType;
  verified?: boolean;
};

export function Avatar({
  alt,
  className,
  initials = "MC",
  name = "Marina Costa",
  size = "md",
  src,
  type = "initials",
  verified = false,
  ...props
}: AvatarProps) {
  const classes = [styles.root, styles[size], className].filter(Boolean).join(" ");
  const placeholder = placeholders[size];

  return (
    <span
      {...props}
      aria-label={`${alt ?? name}${verified ? ", verificado" : ""}`}
      className={classes}
      data-size={size}
      data-type={type}
      role="img"
    >
      <span className={styles.clip}>
        {type === "initials" ? <span className={styles.initials}>{initials}</span> : null}
        {type === "photo" && src ? (
          <img alt="" className={styles.image} src={getAssetUrl(src)} />
        ) : null}
        {type === "photo" && !src ? (
          <span aria-hidden="true" className={styles.placeholder}>
            <img alt="" className={styles.head} src={getAssetUrl(placeholder.head)} />
            <img alt="" className={styles.shoulders} src={getAssetUrl(placeholder.shoulders)} />
          </span>
        ) : null}
      </span>
      {verified ? (
        <span aria-hidden="true" className={styles.verified}>
          ✓
        </span>
      ) : null}
      {verified ? <span className={styles.srOnly}>Verificado</span> : null}
    </span>
  );
}
