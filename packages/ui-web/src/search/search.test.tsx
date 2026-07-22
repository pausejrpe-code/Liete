import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Search } from "./search";

describe("Search", () => {
  it("uses native search semantics and starts disabled", () => {
    render(<Search />);
    expect(screen.getByRole("search", { name: "Busca de destinos" })).toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: "Destino" })).toHaveAttribute(
      "placeholder",
      "Busque lugares para conhecer"
    );
    expect(screen.getByRole("button", { name: "Buscar" })).toBeDisabled();
  });

  it("enables and submits a trimmed query", async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();
    render(<Search onSearch={onSearch} />);
    await user.type(screen.getByRole("searchbox"), " Rio das Ostras ");
    await user.click(screen.getByRole("button", { name: "Buscar" }));
    expect(onSearch).toHaveBeenCalledWith("Rio das Ostras");
  });

  it("reports controlled value changes", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Search onValueChange={onValueChange} value="Rio" />);
    await user.type(screen.getByRole("searchbox"), " das Ostras");
    expect(onValueChange).toHaveBeenCalled();
  });
});
