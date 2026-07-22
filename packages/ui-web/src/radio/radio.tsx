"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import checkedDefault from "./assets/checked-default.svg";
import checkedDisabled from "./assets/checked-disabled.svg";
import checkedFocus from "./assets/checked-focus.svg";
import uncheckedDefault from "./assets/unchecked-default.svg";
import uncheckedDisabled from "./assets/unchecked-disabled.svg";
import uncheckedFocus from "./assets/unchecked-focus.svg";
import { getAssetUrl } from "../internal/asset-url";
import type { ChoiceState } from "../checkbox/checkbox";
import styles from "./radio.module.css";

export type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
  state?: ChoiceState;
};

const assets = {
  checkedDefault: getAssetUrl(checkedDefault),
  checkedDisabled: getAssetUrl(checkedDisabled),
  checkedFocus: getAssetUrl(checkedFocus),
  uncheckedDefault: getAssetUrl(uncheckedDefault),
  uncheckedDisabled: getAssetUrl(uncheckedDisabled),
  uncheckedFocus: getAssetUrl(uncheckedFocus)
};

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      checked,
      className,
      defaultChecked,
      disabled = false,
      label = "Pix",
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
          type="radio"
        />
        <span aria-hidden="true" className={styles.control}>
          {Object.entries(assets).map(([name, source]) => (
            <img alt="" className={styles[name]} key={name} src={source} />
          ))}
        </span>
        <span className={styles.label}>{label}</span>
      </label>
    );
  }
);

Radio.displayName = "Radio";
