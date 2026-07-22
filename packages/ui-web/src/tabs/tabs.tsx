"use client";

import { useId, useRef, useState, type HTMLAttributes, type KeyboardEvent } from "react";
import styles from "./tabs.module.css";

export type TabsVariant = "underline" | "pill";

export type TabItem = {
  disabled?: boolean;
  label: string;
  value: string;
};

export type TabsProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> & {
  defaultValue?: string;
  items: TabItem[];
  label?: string;
  onValueChange?: (value: string) => void;
  value?: string;
  variant?: TabsVariant;
};

export function Tabs({
  className,
  defaultValue,
  items,
  label = "Seções",
  onValueChange,
  value,
  variant = "underline",
  ...props
}: TabsProps) {
  const id = useId();
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const firstEnabled = items.find((item) => !item.disabled)?.value ?? "";
  const [internalValue, setInternalValue] = useState(defaultValue ?? firstEnabled);
  const currentValue = value ?? internalValue;
  const classes = [styles.root, styles[variant], className].filter(Boolean).join(" ");

  function select(nextValue: string) {
    if (value === undefined) setInternalValue(nextValue);
    onValueChange?.(nextValue);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const enabledIndexes = items
      .map((item, itemIndex) => (!item.disabled ? itemIndex : -1))
      .filter((itemIndex) => itemIndex >= 0);
    const position = enabledIndexes.indexOf(index);
    let nextIndex: number | undefined;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = enabledIndexes[(position + 1) % enabledIndexes.length];
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = enabledIndexes[(position - 1 + enabledIndexes.length) % enabledIndexes.length];
    } else if (event.key === "Home") {
      nextIndex = enabledIndexes[0];
    } else if (event.key === "End") {
      nextIndex = enabledIndexes.at(-1);
    }

    if (nextIndex === undefined) return;
    event.preventDefault();
    const nextItem = items[nextIndex];
    if (!nextItem) return;
    select(nextItem.value);
    refs.current[nextIndex]?.focus();
  }

  return (
    <div {...props} aria-label={label} className={classes} data-variant={variant} role="tablist">
      {items.map((item, index) => {
        const selected = item.value === currentValue;
        return (
          <button
            aria-selected={selected}
            className={styles.tab}
            disabled={item.disabled}
            id={`${id}-tab-${item.value}`}
            key={item.value}
            onClick={() => select(item.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            ref={(element) => {
              refs.current[index] = element;
            }}
            role="tab"
            tabIndex={selected ? 0 : -1}
            type="button"
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
