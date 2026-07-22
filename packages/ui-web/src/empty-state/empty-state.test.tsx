import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EmptyState } from "./empty-state";

describe("EmptyState", () => {
  it("renders search copy and an associated description", () => {
    render(<EmptyState />);
    expect(screen.getByRole("region", { name: "Nenhuma viagem encontrada" })).toHaveAccessibleDescription(
      "Tente mudar o destino, a data ou o tipo de passeio."
    );
    expect(screen.getByRole("button", { name: "Limpar filtros" })).toBeInTheDocument();
  });

  it("maps reservation context and runs its action", async () => {
    const onAction = vi.fn();
    const user = userEvent.setup();
    render(<EmptyState context="reservations" onAction={onAction} />);
    await user.click(screen.getByRole("button", { name: "Explorar viagens" }));
    expect(screen.getByText("Você ainda não tem reservas")).toBeInTheDocument();
    expect(onAction).toHaveBeenCalledOnce();
  });

  it("allows product copy overrides", () => {
    render(<EmptyState actionLabel="Criar viagem" description="Comece agora." title="Sem viagens" />);
    expect(screen.getByRole("region", { name: "Sem viagens" })).toHaveAccessibleDescription(
      "Comece agora."
    );
  });
});
