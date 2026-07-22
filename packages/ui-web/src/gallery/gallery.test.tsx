import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Gallery } from "./gallery";

describe("Gallery", () => {
  it("renders the hero anatomy and remaining count", () => {
    render(<Gallery remainingCount={8} />);
    expect(screen.getByRole("list", { name: "Galeria da viagem" })).toHaveAttribute(
      "data-layout",
      "hero"
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(5);
    expect(screen.getByText("+ 8 fotos")).toBeInTheDocument();
  });

  it("renders four cells in grid layout", () => {
    render(<Gallery layout="grid" />);
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    expect(screen.queryByText(/\+ 8 fotos/)).not.toBeInTheDocument();
  });

  it("uses supplied image alternatives", () => {
    render(<Gallery images={[{ alt: "Cachoeira em Capitólio", src: "/cachoeira.jpg" }]} />);
    expect(screen.getByRole("img", { name: "Cachoeira em Capitólio" })).toBeInTheDocument();
  });
});
