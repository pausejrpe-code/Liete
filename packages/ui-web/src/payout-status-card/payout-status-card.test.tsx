import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PayoutStatusCard } from "./payout-status-card";

describe("PayoutStatusCard", () => {
  it("presents the collecting stage without relying on color", () => {
    render(<PayoutStatusCard />);

    expect(screen.getByText("Pendente")).toBeInTheDocument();
    expect(screen.getByText("R$ 0,00")).toBeInTheDocument();
    expect(screen.getByText("Aguardando meta")).toBeInTheDocument();
  });

  it.each([
    ["minimumReached", "Disponível", "R$ 8.500,00"],
    ["afterTrip", "Verificado", "R$ 2.400,00"],
    ["paid", "Confirmado", "R$ 10.900,00"]
  ] as const)("maps %s to its semantic status and amount", (stage, status, amount) => {
    render(<PayoutStatusCard stage={stage} />);

    expect(screen.getByText(status)).toBeInTheDocument();
    expect(screen.getByText(amount)).toBeInTheDocument();
  });

  it("exposes layout and stage as stable attributes", () => {
    const { container } = render(
      <PayoutStatusCard layout="compact" stage="paid" />
    );

    expect(container.firstChild).toHaveAttribute("data-layout", "compact");
    expect(container.firstChild).toHaveAttribute("data-stage", "paid");
  });

  it("uses the shared Button for the details action", async () => {
    const onDetailsClick = vi.fn();
    const user = userEvent.setup();
    render(<PayoutStatusCard onDetailsClick={onDetailsClick} />);

    const action = screen.getByRole("button", { name: "Ver detalhes" });
    expect(action).toHaveAttribute("data-variant", "ghost");

    await user.click(action);
    expect(onDetailsClick).toHaveBeenCalledOnce();
  });
});
