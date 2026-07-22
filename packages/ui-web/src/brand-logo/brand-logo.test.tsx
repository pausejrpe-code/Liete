import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BrandLogo } from "./brand-logo";

describe("BrandLogo", () => {
  it("renders the official seven-part lockup with an accessible name", () => {
    render(<BrandLogo />);
    const logo = screen.getByRole("img", { name: "Liete" });
    expect(logo).toHaveAttribute("data-tone", "default");
    expect(logo.querySelectorAll("img")).toHaveLength(7);
  });

  it("supports the official color variants and responsive width", () => {
    render(<BrandLogo tone="green" width="24rem" />);
    const logo = screen.getByRole("img", { name: "Liete" });
    expect(logo).toHaveAttribute("data-tone", "green");
    expect(logo).toHaveStyle({ "--brand-logo-width": "24rem" });
  });

  it("supports a custom accessible label or decorative use", () => {
    const { rerender } = render(<BrandLogo label="Página inicial da Liete" tone="pink" />);
    expect(screen.getByRole("img", { name: "Página inicial da Liete" })).toBeInTheDocument();
    rerender(<BrandLogo decorative />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
