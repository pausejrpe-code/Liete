"use client";

import {
  forwardRef,
  useId,
  type InputHTMLAttributes
} from "react";
import styles from "./field.module.css";

export type FormFieldState = "default" | "focus" | "error" | "disabled" | "filled";
export type InputKind = "text" | "location";
type FieldKind = InputKind | "date" | "money";

type NativeInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type">;

type BaseFieldProps = NativeInputProps & {
  errorMessage?: string;
  helperText?: string;
  hideHelperText?: boolean;
  kind: FieldKind;
  label: string;
  state?: FormFieldState;
};

function hasContent(value: NativeInputProps["value"] | NativeInputProps["defaultValue"]) {
  return value !== undefined && value !== null && String(value).length > 0;
}

const BaseField = forwardRef<HTMLInputElement, BaseFieldProps>(
  (
    {
      "aria-describedby": ariaDescribedBy,
      className,
      defaultValue,
      disabled = false,
      errorMessage,
      helperText = "Obrigatório",
      hideHelperText = false,
      id,
      kind,
      label,
      placeholder,
      state,
      value,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const helperId = `${inputId}-helper`;
    const inferredState: FormFieldState = disabled
      ? "disabled"
      : errorMessage
        ? "error"
        : hasContent(value ?? defaultValue)
          ? "filled"
          : "default";
    const resolvedState = state ?? inferredState;
    const isDisabled = disabled || resolvedState === "disabled";
    const isError = resolvedState === "error";
    const showHelper = !hideHelperText && Boolean(errorMessage ?? helperText);
    const describedBy = [ariaDescribedBy, showHelper ? helperId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;
    const floating =
      kind === "date" ||
      kind === "money" ||
      resolvedState !== "default" ||
      hasContent(value ?? defaultValue);
    const classes = [styles.root, styles[resolvedState], className]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        className={classes}
        data-floating={floating}
        data-kind={kind}
        data-state={resolvedState}
      >
        <label className={styles.control} htmlFor={inputId}>
          <span className={styles.label}>{label}</span>
          <input
            {...props}
            ref={ref}
            aria-describedby={describedBy}
            aria-invalid={isError || undefined}
            className={styles.input}
            defaultValue={defaultValue}
            disabled={isDisabled}
            id={inputId}
            placeholder={placeholder ?? (kind === "text" || kind === "location" ? " " : undefined)}
            type="text"
            value={value}
          />
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

BaseField.displayName = "BaseField";

export type InputProps = Omit<BaseFieldProps, "kind" | "label"> & {
  kind?: InputKind;
  label?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ kind = "text", label = "Nome do passeio", ...props }, ref) => (
    <BaseField {...props} ref={ref} kind={kind} label={label} />
  )
);

Input.displayName = "Input";

export type DateInputProps = Omit<
  BaseFieldProps,
  "kind" | "inputMode" | "label" | "placeholder"
> & {
  label?: string;
  placeholder?: string;
};

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ label = "Nome do passeio", placeholder = "00/00/0000", ...props }, ref) => (
    <BaseField
      {...props}
      ref={ref}
      inputMode="numeric"
      kind="date"
      label={label}
      placeholder={placeholder}
    />
  )
);

DateInput.displayName = "DateInput";

export type MoneyInputProps = Omit<
  BaseFieldProps,
  "kind" | "inputMode" | "label" | "placeholder"
> & {
  label?: string;
  placeholder?: string;
};

export const MoneyInput = forwardRef<HTMLInputElement, MoneyInputProps>(
  ({ label = "Label title", placeholder = "R$ 0.000,00", ...props }, ref) => (
    <BaseField
      {...props}
      ref={ref}
      inputMode="decimal"
      kind="money"
      label={label}
      placeholder={placeholder}
    />
  )
);

MoneyInput.displayName = "MoneyInput";
