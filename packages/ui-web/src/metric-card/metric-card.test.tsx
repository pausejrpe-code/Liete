import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MetricCard } from "./metric-card";

describe("MetricCard", () => {
  it("renders the default KPI and mapped pending status", () => {
    render(<MetricCard />);

    expect(screen.getByText("Vendas confirmadas")).toBeInTheDocument();
    expect(screen.getByText("R$ 24.500")).toBeInTheDocument();
    expect(screen.getByText("Pendente")).toHaveAttribute(
      "data-intent",
      "pending"
    );
  });

  it("maps positive and warning tones to their semantic statuses", () => {
    const { rerender } = render(<MetricCard tone="positive" />);
    expect(screen.getByText("Confirmado")).toBeInTheDocument();

    rerender(<MetricCard tone="warning" />);
    expect(screen.getByText("Esgotado")).toBeInTheDocument();
  });

  it("exposes compact density and optional supporting content", () => {
    const { container } = render(
      <MetricCard
        showStatus={false}
        showSupporting={false}
        size="compact"
      />
    );

    expect(container.firstChild).toHaveAttribute("data-size", "compact");
    expect(screen.queryByText("+3%")).not.toBeInTheDocument();
    expect(screen.queryByText("Atualizado há 5 min")).not.toBeInTheDocument();
  });

  it("can hide the trend while preserving the supporting description", () => {
    render(<MetricCard showTrend={false} />);

    expect(screen.queryByText("+3%")).not.toBeInTheDocument();
    expect(screen.getByText("Atualizado há 5 min")).toBeInTheDocument();
  });
});
