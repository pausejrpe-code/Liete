import type { HTMLAttributes } from "react";
import styles from "./skeleton.module.css";

export type SkeletonType = "text" | "trip-card" | "avatar" | "table-row";

export type SkeletonProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  type?: SkeletonType;
};

function Block({ className }: { className: string }) {
  return <span className={[styles.block, className].join(" ")} />;
}

export function Skeleton({
  "aria-label": ariaLabel,
  className,
  type = "text",
  ...props
}: SkeletonProps) {
  const classes = [styles.root, styles[type], className].filter(Boolean).join(" ");

  return (
    <div
      {...props}
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
      className={classes}
      data-type={type}
      role={ariaLabel ? "status" : undefined}
    >
      {type === "text" ? (
        <>
          <Block className={styles.textLong} />
          <Block className={styles.textMedium} />
          <Block className={styles.textShort} />
        </>
      ) : null}

      {type === "trip-card" ? (
        <>
          <Block className={styles.tripMedia} />
          <Block className={styles.tripTitle} />
          <Block className={styles.tripDescription} />
          <Block className={styles.tripMeta} />
        </>
      ) : null}

      {type === "avatar" ? (
        <>
          <Block className={styles.avatarCircle} />
          <span className={styles.avatarLines}>
            <Block className={styles.avatarName} />
            <Block className={styles.avatarDescription} />
          </span>
        </>
      ) : null}

      {type === "table-row" ? (
        <>
          <Block className={styles.cellWide} />
          <Block className={styles.cellMedium} />
          <Block className={styles.cellCompact} />
          <Block className={styles.cellAction} />
          <Block className={styles.cellSmall} />
        </>
      ) : null}
    </div>
  );
}
