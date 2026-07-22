import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BrandIcon } from "./brand-icon";

describe("BrandIcon", () => {
  it("renders the institutional symbol with an accessible name", () => {
    render(<BrandIcon />);
    const icon = screen.getByRole("img", { name: "Liete" });
    expect(icon).toHaveAttribute("data-tone", "default");
    expect(icon.querySelector("img")).toHaveAttribute("aria-hidden", "true");
  });

  it("supports the documented tones and scalable size", () => {
    render(<BrandIcon size={96} tone="pink" />);
    expect(screen.getByRole("img", { name: "Liete" })).toHaveAttribute("data-tone", "pink");
    expect(screen.getByRole("img", { name: "Liete" })).toHaveStyle({
      "--brand-icon-size": "96px"
    });
  });

  it("can be decorative when the surrounding content already names the brand", () => {
    const { container } = render(<BrandIcon decorative tone="green" />);
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
