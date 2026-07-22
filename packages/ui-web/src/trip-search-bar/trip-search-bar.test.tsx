import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TripSearchBar } from "./trip-search-bar";

describe("TripSearchBar", () => {
  it("renders four labeled native fields", () => {
    render(<TripSearchBar />);
    expect(screen.getByRole("form", { name: "Buscar viagens" })).toHaveAttribute(
      "data-layout",
      "desktop"
    );
    expect(screen.getByRole("textbox", { name: "Destino" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Data" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Saída" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Viajantes" })).toBeInTheDocument();
  });

  it("submits the filled design state", async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();
    render(<TripSearchBar onSearch={onSearch} state="filled" />);
    await user.click(screen.getByRole("button", { name: "Buscar" }));
    expect(onSearch).toHaveBeenCalledWith({
      date: "00/00/0000",
      departure: "Capitólio bate-volta",
      destination: "Capitólio bate-volta",
      travelers: "2"
    });
  });

  it("exposes mobile and focused variants", () => {
    render(<TripSearchBar layout="mobile" state="focused" />);
    const form = screen.getByRole("form", { name: "Buscar viagens" });
    expect(form).toHaveAttribute("data-layout", "mobile");
    expect(form).toHaveAttribute("data-state", "focused");
  });
});
