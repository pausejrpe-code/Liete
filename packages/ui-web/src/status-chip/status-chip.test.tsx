import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusChip } from "./status-chip";

describe("StatusChip", () => {
  it("renders the label mapped to its intent", () => {
    render(<StatusChip intent="pending" />);

    expect(screen.getByText("Pendente")).toHaveAttribute(
      "data-intent",
      "pending"
    );
  });

  it("supports custom labels and medium density", () => {
    render(
      <StatusChip intent="verified" label="Parceiro verificado" size="medium" />
    );

    expect(screen.getByText("Parceiro verificado")).toHaveAttribute(
      "data-size",
      "medium"
    );
  });

  it("keeps the exported status dot decorative", () => {
    render(<StatusChip intent="soldOut" />);

    expect(screen.getByRole("presentation", { hidden: true })).toHaveAttribute(
      "aria-hidden",
      "true"
    );
  });
});
