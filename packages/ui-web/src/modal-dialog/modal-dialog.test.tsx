import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ModalDialog } from "./modal-dialog";

describe("ModalDialog", () => {
  it("labels the inline dialog from its title and description", () => {
    render(
      <ModalDialog presentation="inline" title="Confirmar reserva">
        Confira os dados da viagem.
      </ModalDialog>
    );

    expect(screen.getByRole("dialog", { name: "Confirmar reserva" })).toHaveAccessibleDescription(
      "Confira os dados da viagem."
    );
  });

  it("runs close and confirm actions", async () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    render(<ModalDialog onClose={onClose} onConfirm={onConfirm} presentation="inline" />);

    await user.click(screen.getByRole("button", { name: "Voltar" }));
    await user.click(screen.getByRole("button", { name: "Confirmar" }));
    expect(onClose).toHaveBeenCalledOnce();
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it("uses destructive button variants when requested", () => {
    render(<ModalDialog intent="destructive" presentation="inline" />);
    expect(screen.getByRole("button", { name: "Voltar" })).toHaveAttribute(
      "data-variant",
      "dangerGhost"
    );
    expect(screen.getByRole("button", { name: "Confirmar" })).toHaveAttribute(
      "data-variant",
      "danger"
    );
  });
});
