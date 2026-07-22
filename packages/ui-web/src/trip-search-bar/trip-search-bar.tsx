"use client";

import type { FormEvent, FormHTMLAttributes } from "react";
import { Button } from "../button/button";
import { DateInput, Input } from "../field/field";
import { Select } from "../select/select";
import styles from "./trip-search-bar.module.css";

export type TripSearchBarLayout = "desktop" | "mobile";
export type TripSearchBarState = "default" | "focused" | "filled";

export type TripSearchValues = {
  date: string;
  departure: string;
  destination: string;
  travelers: string;
};

export type TripSearchBarProps = Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit"> & {
  dateDefaultValue?: string;
  departureDefaultValue?: string;
  destinationDefaultValue?: string;
  layout?: TripSearchBarLayout;
  onSearch?: (values: TripSearchValues) => void;
  state?: TripSearchBarState;
  travelersDefaultValue?: string;
};

export function TripSearchBar({
  "aria-label": ariaLabel = "Buscar viagens",
  className,
  dateDefaultValue,
  departureDefaultValue,
  destinationDefaultValue,
  layout = "desktop",
  onSearch,
  state = "default",
  travelersDefaultValue,
  ...props
}: TripSearchBarProps) {
  const isFilled = state === "filled";
  const isFocused = state === "focused";
  const classes = [styles.root, styles[layout], className].filter(Boolean).join(" ");
  const destination = destinationDefaultValue ?? (isFilled || isFocused ? "Capitólio bate-volta" : "");
  const date = dateDefaultValue ?? (isFilled ? "00/00/0000" : "");
  const departure = departureDefaultValue ?? (isFilled ? "Capitólio bate-volta" : "");
  const travelers = travelersDefaultValue ?? (isFilled ? "2" : "");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    onSearch?.({
      date: String(data.get("date") ?? ""),
      departure: String(data.get("departure") ?? ""),
      destination: String(data.get("destination") ?? ""),
      travelers: String(data.get("travelers") ?? "")
    });
  }

  return (
    <form
      {...props}
      aria-label={ariaLabel}
      className={classes}
      data-layout={layout}
      data-state={state}
      onSubmit={handleSubmit}
    >
      <div className={styles.fields}>
        <Input
          className={styles.field}
          defaultValue={destination}
          hideHelperText
          label="Destino"
          name="destination"
          state={isFocused ? "focus" : isFilled ? "filled" : undefined}
        />
        <DateInput
          className={styles.field}
          defaultValue={date}
          hideHelperText
          label="Data"
          name="date"
          state={isFilled ? "filled" : undefined}
        />
        <Input
          className={styles.field}
          defaultValue={departure}
          hideHelperText
          kind="location"
          label="Saída"
          name="departure"
          state={isFilled ? "filled" : undefined}
        />
        <Select
          className={styles.field}
          defaultValue={travelers}
          hideHelperText
          label="Viajantes"
          name="travelers"
          state={isFilled ? "filled" : undefined}
        >
          <option value="1">1 pessoa</option>
          <option value="2">2 pessoas</option>
          <option value="3">3 pessoas</option>
          <option value="4">4 pessoas</option>
        </Select>
      </div>
      <Button className={styles.action} size="lg" type="submit">Buscar</Button>
    </form>
  );
}
