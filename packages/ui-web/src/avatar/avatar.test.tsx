import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar } from "./avatar";

describe("Avatar", () => {
  it("names an initials avatar", () => {
    render(<Avatar initials="MC" name="Marina Costa" />);
    expect(screen.getByRole("img", { name: "Marina Costa" })).toHaveTextContent("MC");
  });

  it("announces verified status", () => {
    render(<Avatar name="Marina Costa" verified />);
    expect(screen.getByRole("img", { name: "Marina Costa, verificado" })).toBeInTheDocument();
  });

  it("renders the official photo placeholder when no photo is supplied", () => {
    const { container } = render(<Avatar size="lg" type="photo" />);
    expect(container.querySelectorAll("img")).toHaveLength(2);
    expect(screen.getByRole("img", { name: "Marina Costa" })).toHaveAttribute("data-size", "lg");
  });
});
