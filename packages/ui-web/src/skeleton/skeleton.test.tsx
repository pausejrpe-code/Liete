import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Skeleton } from "./skeleton";

describe("Skeleton", () => {
  it("is decorative by default", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
    expect(container.firstChild).toHaveAttribute("data-type", "text");
  });

  it("can announce a loading label", () => {
    render(<Skeleton aria-label="Carregando viagens" type="trip-card" />);
    expect(screen.getByRole("status", { name: "Carregando viagens" })).toHaveAttribute(
      "data-type",
      "trip-card"
    );
  });

  it("renders every documented variant", () => {
    const { rerender } = render(<Skeleton type="avatar" />);
    expect(document.querySelector('[data-type="avatar"]')).toBeInTheDocument();
    rerender(<Skeleton type="table-row" />);
    expect(document.querySelector('[data-type="table-row"]')).toBeInTheDocument();
  });
});
