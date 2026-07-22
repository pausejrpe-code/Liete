"use client";

import {
  Children,
  forwardRef,
  isValidElement,
  useId,
  useState,
  type ChangeEvent,
  type ReactNode,
  type SelectHTMLAttributes
} from "react";
import caretDefault from "./assets/caret-default.svg";
import caretDisabled from "./assets/caret-disabled.svg";
import caretError from "./assets/caret-error.svg";
import { getAssetUrl } from "../internal/asset-url";
import type { FormFieldState } from "../field/field";
import styles from "./select.module.css";

type NativeSelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "size">;

export type SelectProps = NativeSelectProps & {
  errorMessage?: string;
  helperText?: string;
  hideHelperText?: boolean;
  label?: string;
  placeholder?: string;
  state?: FormFieldState;
};

function optionText(children: ReactNode, selectedValue: string) {
  const option = Children.toArray(children).find(
    (child) =>
      isValidElement<{ value?: string | number; children?: ReactNode }>(child) &&
      child.type === "option" &&
      String(child.props.value ?? "") === selectedValue
  );

  return isValidElement<{ children?: ReactNode }>(option) ? option.props.children : selectedValue;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      "aria-describedby": ariaDescribedBy,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      children,
      className,
      defaultValue,
      disabled = false,
      errorMessage,
      helperText = "Escolha uma opção",
      hideHelperText = false,
      id,
      label = "Tipo de passeio",
      onChange,
      placeholder = "Selecione",
      state,
      value,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const helperId = `${selectId}-helper`;
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState(String(defaultValue ?? ""));
    const selectedValue = String(isControlled ? (value ?? "") : internalValue);
    const inferredState: FormFieldState = disabled
      ? "disabled"
      : errorMessage
        ? "error"
        : selectedValue
          ? "filled"
          : "default";
    const resolvedState = state ?? inferredState;
    const isDisabled = disabled || resolvedState === "disabled";
    const isError = resolvedState === "error";
    const showHelper = !hideHelperText && Boolean(errorMessage ?? helperText);
    const describedBy = [ariaDescribedBy, showHelper ? helperId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;
    const floating = resolvedState !== "default" || Boolean(selectedValue);
    const icon = isDisabled ? caretDisabled : isError ? caretError : caretDefault;
    const classes = [styles.root, styles[resolvedState], className]
      .filter(Boolean)
      .join(" ");

    function handleChange(event: ChangeEvent<HTMLSelectElement>) {
      if (!isControlled) setInternalValue(event.currentTarget.value);
      onChange?.(event);
    }

    return (
      <div className={classes} data-floating={floating} data-state={resolvedState}>
        <label className={styles.control} htmlFor={selectId}>
          <span className={styles.content} aria-hidden="true">
            <span className={styles.label}>{label}</span>
            <span className={styles.value}>
              {selectedValue ? optionText(children, selectedValue) : placeholder}
            </span>
          </span>
          <img alt="" aria-hidden="true" className={styles.icon} src={getAssetUrl(icon)} />
          <select
            {...props}
            ref={ref}
            aria-describedby={describedBy}
            aria-invalid={isError || undefined}
            aria-label={ariaLabel ?? (ariaLabelledBy ? undefined : label)}
            aria-labelledby={ariaLabelledBy}
            className={styles.select}
            defaultValue={defaultValue}
            disabled={isDisabled}
            id={selectId}
            onChange={handleChange}
            value={value}
          >
            <option value="">{placeholder}</option>
            {children}
          </select>
        </label>

        {showHelper ? (
          <span className={styles.helper} id={helperId}>
            {errorMessage ?? helperText}
          </span>
        ) : null}
      </div>
    );
  }
);

Select.displayName = "Select";
