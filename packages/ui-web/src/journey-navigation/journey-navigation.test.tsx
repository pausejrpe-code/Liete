import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { JourneyNavigation } from "./journey-navigation";

describe("JourneyNavigation", () => {
  it("composes native back and primary actions", () => {
    const onBack = vi.fn();
    const onPrimaryAction = vi.fn();

    render(
      <JourneyNavigation
        onBack={onBack}
        onPrimaryAction={onPrimaryAction}
        primaryLabel="Salvar e continuar"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Voltar" }));
    fireEvent.click(
      screen.getByRole("button", { name: "Salvar e continuar" })
    );

    expect(onBack).toHaveBeenCalledOnce();
    expect(onPrimaryAction).toHaveBeenCalledOnce();
  });

  it("supports form submission and disabled navigation", () => {
    render(
      <JourneyNavigation
        backDisabled
        primaryDisabled
        primaryLabel="Publicar excursão"
        primaryType="submit"
        sticky
      />
    );

    expect(screen.getByRole("button", { name: "Voltar" })).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Publicar excursão" })
    ).toHaveAttribute("type", "submit");
    expect(
      screen.getByRole("contentinfo", { name: "Navegação da etapa" })
    ).toHaveAttribute("data-sticky", "true");
  });
});
