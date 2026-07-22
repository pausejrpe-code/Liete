"use client";

import { useId, useState, type HTMLAttributes } from "react";
import styles from "./stepper.module.css";

export type StepperSize = "sm" | "md";

export type StepperProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> & {
  defaultValue?: number;
  disabled?: boolean;
  label?: string;
  max?: number;
  min?: number;
  onValueChange?: (value: number) => void;
  size?: StepperSize;
  step?: number;
  value?: number;
};

export function Stepper({
  className,
  defaultValue = 2,
  disabled = false,
  label = "Passageiros",
  max = Number.POSITIVE_INFINITY,
  min = 0,
  onValueChange,
  size = "sm",
  step = 1,
  value,
  ...props
}: StepperProps) {
  const labelId = useId();
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(() =>
    Math.min(max, Math.max(min, defaultValue))
  );
  const currentValue = Math.min(max, Math.max(min, value ?? internalValue));
  const decrementDisabled = disabled || currentValue - step < min;
  const incrementDisabled = disabled || currentValue + step > max;
  const classes = [styles.root, styles[size], className].filter(Boolean).join(" ");

  function updateValue(nextValue: number) {
    const clampedValue = Math.min(max, Math.max(min, nextValue));
    if (!isControlled) setInternalValue(clampedValue);
    onValueChange?.(clampedValue);
  }

  return (
    <div {...props} className={classes} data-size={size}>
      <span className={styles.label} id={labelId}>
        {label}
      </span>
      <div aria-labelledby={labelId} className={styles.control} role="group">
        <button
          aria-label={`Diminuir ${label}`}
          className={styles.button}
          disabled={decrementDisabled}
          onClick={() => updateValue(currentValue - step)}
          type="button"
        >
          −
        </button>
        <output aria-live="polite" className={styles.value}>
          {currentValue}
        </output>
        <button
          aria-label={`Aumentar ${label}`}
          className={styles.button}
          disabled={incrementDisabled}
          onClick={() => updateValue(currentValue + step)}
          type="button"
        >
          +
        </button>
      </div>
    </div>
  );
}
