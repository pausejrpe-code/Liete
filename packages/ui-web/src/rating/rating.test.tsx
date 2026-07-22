import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Rating } from "./rating";

describe("Rating", () => {
  it("announces score and count", () => {
    render(<Rating count={128} value={4.8} />);
    expect(screen.getByRole("img", { name: "4,8 de 5 estrelas, 128 avaliações" })).toBeInTheDocument();
  });

  it("supports score-only labels", () => {
    render(<Rating labelMode="score" />);
    expect(screen.getByText("4,8")).toBeInTheDocument();
    expect(screen.queryByText(/avaliações/)).not.toBeInTheDocument();
  });

  it("hides every visual label in none mode while keeping the accessible name", () => {
    render(<Rating labelMode="none" />);
    expect(screen.getByRole("img")).toHaveAccessibleName("4,8 de 5 estrelas, 128 avaliações");
    expect(screen.queryByText("4,8")).not.toBeInTheDocument();
  });
});
