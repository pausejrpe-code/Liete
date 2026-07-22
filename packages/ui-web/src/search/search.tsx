"use client";

import {
  useId,
  useState,
  type ChangeEvent,
  type FormEvent,
  type FormHTMLAttributes
} from "react";
import magnifyingGlass from "./assets/magnifying-glass.svg";
import { Button } from "../button/button";
import { getAssetUrl } from "../internal/asset-url";
import styles from "./search.module.css";

export type SearchProps = Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit"> & {
  buttonLabel?: string;
  defaultValue?: string;
  inputLabel?: string;
  onSearch?: (query: string) => void;
  onValueChange?: (query: string) => void;
  placeholder?: string;
  value?: string;
};

export function Search({
  "aria-label": ariaLabel = "Busca de destinos",
  buttonLabel = "Buscar",
  className,
  defaultValue = "",
  inputLabel = "Destino",
  onSearch,
  onValueChange,
  placeholder = "Busque lugares para conhecer",
  value,
  ...props
}: SearchProps) {
  const inputId = useId();
  const [internalValue, setInternalValue] = useState(defaultValue);
  const query = value ?? internalValue;
  const isEmpty = query.trim().length === 0;
  const classes = [styles.root, className].filter(Boolean).join(" ");

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const nextValue = event.currentTarget.value;
    if (value === undefined) setInternalValue(nextValue);
    onValueChange?.(nextValue);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isEmpty) onSearch?.(query.trim());
  }

  return (
    <form {...props} aria-label={ariaLabel} className={classes} onSubmit={handleSubmit} role="search">
      <label className={styles.field} htmlFor={inputId}>
        <span className={styles.iconContainer}>
          <img alt="" aria-hidden="true" src={getAssetUrl(magnifyingGlass)} />
        </span>
        <span className={styles.visuallyHidden}>{inputLabel}</span>
        <input
          className={styles.input}
          id={inputId}
          onChange={handleChange}
          placeholder={placeholder}
          type="search"
          value={query}
        />
      </label>
      <Button className={styles.action} disabled={isEmpty} size="lg" type="submit">
        {buttonLabel}
      </Button>
    </form>
  );
}
