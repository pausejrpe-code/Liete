import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./badge";

describe("Badge", () => {
  it("renders its label and semantic tone", () => {
    render(<Badge label="Pagamento pendente" tone="attention" />);

    expect(screen.getByText("Pagamento pendente")).toHaveAttribute(
      "data-tone",
      "attention"
    );
  });

  it("keeps the status dot decorative", () => {
    render(<Badge label="Cancelado" tone="error" />);

    expect(screen.getByRole("presentation", { hidden: true })).toHaveAttribute(
      "aria-hidden",
      "true"
    );
  });

  it("can hide the optional dot", () => {
    render(<Badge label="Disponível" showDot={false} />);

    expect(screen.queryByRole("presentation", { hidden: true })).not.toBeInTheDocument();
  });
});
