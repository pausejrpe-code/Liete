"use client";

import {
  forwardRef,
  useId,
  type TextareaHTMLAttributes
} from "react";
import styles from "./textarea.module.css";

export type TextareaState =
  | "default"
  | "filled"
  | "focus"
  | "error"
  | "disabled";

type NativeTextareaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "children"
>;

export type TextareaProps = NativeTextareaProps & {
  errorMessage?: string;
  helperText?: string;
  label?: string;
  showHelper?: boolean;
  state?: TextareaState;
};

function hasContent(
  value: NativeTextareaProps["value"] | NativeTextareaProps["defaultValue"]
) {
  return value !== undefined && value !== null && String(value).length > 0;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      "aria-describedby": ariaDescribedBy,
      className,
      defaultValue,
      disabled = false,
      errorMessage,
      helperText = "Máximo de 1.000 caracteres.",
      id,
      label = "Descrição da excursão",
      placeholder = "Conte os principais detalhes do passeio...",
      showHelper = true,
      state,
      value,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const textareaId = id ?? generatedId;
    const helperId = `${textareaId}-helper`;
    const inferredState: TextareaState = disabled
      ? "disabled"
      : errorMessage
        ? "error"
        : hasContent(value ?? defaultValue)
          ? "filled"
          : "default";
    const resolvedState = state ?? inferredState;
    const isDisabled = disabled || resolvedState === "disabled";
    const isError = resolvedState === "error";
    const helper = errorMessage ?? helperText;
    const helperVisible = showHelper && Boolean(helper);
    const describedBy =
      [ariaDescribedBy, helperVisible ? helperId : undefined]
        .filter(Boolean)
        .join(" ") || undefined;
    const classes = [styles.root, styles[resolvedState], className]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        className={classes}
        data-figma-node-id="234:31"
        data-state={resolvedState}
      >
        <label className={styles.label} htmlFor={textareaId}>
          {label}
        </label>
        <textarea
          {...props}
          ref={ref}
          aria-describedby={describedBy}
          aria-invalid={isError || undefined}
          className={styles.control}
          defaultValue={defaultValue}
          disabled={isDisabled}
          id={textareaId}
          placeholder={placeholder}
          value={value}
        />
        {helperVisible ? (
          <span className={styles.helper} id={helperId}>
            {helper}
          </span>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
