"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import styles from "./checkbox.module.css";

export type ChoiceState = "default" | "focus" | "disabled";

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
  state?: ChoiceState;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked,
      className,
      defaultChecked,
      disabled = false,
      label = "Aceito a política de cancelamento",
      state = "default",
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || state === "disabled";
    const classes = [styles.root, styles[state], className].filter(Boolean).join(" ");

    return (
      <label className={classes} data-state={state}>
        <input
          {...props}
          ref={ref}
          checked={checked}
          className={styles.input}
          defaultChecked={defaultChecked}
          disabled={isDisabled}
          type="checkbox"
        />
        <span aria-hidden="true" className={styles.control} />
        <span className={styles.label}>{label}</span>
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
