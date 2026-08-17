import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PriceBreakdown } from "./price-breakdown";

describe("PriceBreakdown", () => {
  it("presents the complete per-passenger calculation", () => {
    render(<PriceBreakdown />);

    expect(
      screen.getByRole("heading", { name: "Composição do preço" })
    ).toBeInTheDocument();
    expect(screen.getByText("Custos por passageiro")).toBeInTheDocument();
    expect(screen.getByText("R$ 115,00")).toBeInTheDocument();
    expect(screen.getByText("Taxa da plataforma (15%)")).toBeInTheDocument();
    expect(screen.getByText("Viajante paga").tagName).toBe("SPAN");
  });

  it("supports compact layout and custom amounts", () => {
    const { container } = render(
      <PriceBreakdown
        costAmount="R$ 80,00"
        layout="compact"
        totalAmount="R$ 130,00"
      />
    );

    expect(container.firstChild).toHaveAttribute("data-layout", "compact");
    expect(screen.getByText("R$ 80,00")).toBeInTheDocument();
    expect(screen.getByText("R$ 130,00")).toBeInTheDocument();
  });

  it("shows the payment fee separately when provided", () => {
    render(
      <PriceBreakdown
        cardFeeAmount="R$ 20,00"
        cardFeeLabel="Taxa do cartão (5%)"
      />
    );

    expect(screen.getByText("Taxa do cartão (5%)")).toBeInTheDocument();
    expect(screen.getByText("R$ 20,00")).toBeInTheDocument();
    expect(screen.getByText("Taxa da plataforma (15%)")).toBeInTheDocument();
  });

  it("keeps the Figma content order when the card fee is present", () => {
    const { container } = render(
      <PriceBreakdown
        cardFeeAmount="R$ 20,00"
        feeAmount="R$ 60,00"
        subtotalAmount="R$ 400,00"
        totalAmount="R$ 480,00"
      />
    );

    const terms = Array.from(container.querySelectorAll("dt")).map(
      (term) => term.textContent
    );

    expect(terms).toEqual([
      "Custos por passageiro",
      "Seu ganho por ingresso",
      "Subtotal do organizador",
      "Taxa do cartão",
      "Taxa da plataforma (15%)"
    ]);
  });

  it("composes StatusChip and optional helper content", () => {
    const { rerender } = render(
      <PriceBreakdown showHelper={false} showStatus />
    );

    expect(screen.getByText("Confirmado")).toHaveAttribute(
      "data-intent",
      "confirmed"
    );
    expect(
      screen.queryByText("Valor final disponível para publicação.")
    ).not.toBeInTheDocument();

    rerender(<PriceBreakdown />);
    expect(
      screen.getByText("Valor final disponível para publicação.")
    ).toBeInTheDocument();
  });
});
