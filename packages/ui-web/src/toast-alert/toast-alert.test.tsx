import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ToastAlert } from "./toast-alert";

describe("ToastAlert", () => {
  it("uses polite status semantics for informational feedback", () => {
    render(<ToastAlert tone="success" />);
    expect(screen.getByRole("status")).toHaveTextContent("Reserva confirmada");
  });

  it("uses assertive alert semantics for errors", () => {
    render(<ToastAlert tone="error" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Pagamento recusado");
  });

  it("exposes dismissal only in toast format", async () => {
    const onDismiss = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(<ToastAlert onDismiss={onDismiss} />);
    await user.click(screen.getByRole("button", { name: "Fechar aviso" }));
    expect(onDismiss).toHaveBeenCalledOnce();

    rerender(<ToastAlert format="inline" />);
    expect(screen.queryByRole("button", { name: "Fechar aviso" })).not.toBeInTheDocument();
  });
});
