"use client";

import { TripSearchBar, type TripSearchValues } from "@liete/ui-web";
import { withBasePath } from "../lib/site-path";

export function HomeSearch({ className }: { className?: string }) {
  function handleSearch(values: TripSearchValues) {
    const params = new URLSearchParams();

    Object.entries(values).forEach(([key, value]) => {
      const normalizedValue = value.trim();
      if (normalizedValue) params.set(key, normalizedValue);
    });

    const query = params.toString();
    window.location.assign(`${withBasePath("/")}${query ? `?${query}` : ""}#viagens`);
  }

  return <TripSearchBar className={className} id="buscar" onSearch={handleSearch} />;
}
