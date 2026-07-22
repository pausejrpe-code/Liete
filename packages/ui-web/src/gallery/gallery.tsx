import type { HTMLAttributes } from "react";
import styles from "./gallery.module.css";

export type GalleryLayout = "hero" | "grid";
export type GalleryImage = { alt: string; src: string };

export type GalleryProps = HTMLAttributes<HTMLDivElement> & {
  images?: GalleryImage[];
  label?: string;
  layout?: GalleryLayout;
  remainingCount?: number;
};

export function Gallery({
  className,
  images = [],
  label = "Galeria da viagem",
  layout = "hero",
  remainingCount = 8,
  ...props
}: GalleryProps) {
  const total = layout === "hero" ? 5 : 4;
  const items = Array.from({ length: total }, (_, index) => images[index]);
  const classes = [styles.root, styles[layout], className].filter(Boolean).join(" ");

  function renderCell(image: GalleryImage | undefined, index: number, extraClass?: string) {
    const isLastHeroCell = layout === "hero" && index === total - 1;
    const text = index === 0 && layout === "hero" ? "Foto principal" : `Foto ${index + 1}`;
    return (
      <div className={[styles.cell, extraClass].filter(Boolean).join(" ")} key={index} role="listitem">
        {image ? <img alt={image.alt} src={image.src} /> : <span>{text}</span>}
        {isLastHeroCell && remainingCount > 0 ? (
          <span className={styles.more}>+ {remainingCount} fotos</span>
        ) : null}
      </div>
    );
  }

  if (layout === "hero") {
    return (
      <div {...props} aria-label={label} className={classes} data-layout={layout} role="list">
        {renderCell(items[0], 0, styles.main)}
        <div className={styles.side} role="presentation">
          {items.slice(1).map((image, index) => renderCell(image, index + 1))}
        </div>
      </div>
    );
  }

  return (
    <div {...props} aria-label={label} className={classes} data-layout={layout} role="list">
      {items.map((image, index) => renderCell(image, index))}
    </div>
  );
}
