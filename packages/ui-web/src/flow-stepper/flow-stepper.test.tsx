import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FlowStepper } from "./flow-stepper";

describe("FlowStepper", () => {
  it("presents the five desktop stages and their states", () => {
    const { container } = render(
      <FlowStepper current={3} layout="desktop" />
    );

    expect(
      screen.getByRole("navigation", { name: "Progresso da publicação" })
    ).toHaveAttribute("data-current", "3");
    expect(screen.getByText("Seu progresso")).toBeInTheDocument();
    expect(screen.getByText("Etapa 3 de 5")).toBeInTheDocument();
    expect(
      container.querySelectorAll('[data-state="complete"]')
    ).toHaveLength(2);
    expect(
      container.querySelectorAll('[data-state="upcoming"]')
    ).toHaveLength(2);
    expect(
      container.querySelector('[aria-current="step"]')
    ).toHaveTextContent("3");
  });

  it("uses semantic progress and current stage copy on mobile", () => {
    render(<FlowStepper current={2} layout="mobile" />);

    expect(
      screen.getByRole("progressbar", {
        name: "Destino, roteiro e fotos, etapa 2 de 5"
      })
    ).toHaveAttribute("aria-valuenow", "2");
    expect(screen.getByText("Destino, roteiro e fotos")).toBeInTheDocument();
    expect(screen.getByText("Etapa 2 de 5")).toBeInTheDocument();
  });

  it("supports the mobile back action with an accessible name", () => {
    const onBack = vi.fn();
    render(
      <FlowStepper
        backLabel="Voltar para excursões"
        layout="mobile"
        onBack={onBack}
      />
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Voltar para excursões" })
    );

    expect(onBack).toHaveBeenCalledOnce();
  });

  it("accepts custom stage labels and clamps the current value", () => {
    render(
      <FlowStepper
        current={8}
        layout="mobile"
        steps={[
          { id: "one", label: "Primeira" },
          { id: "two", label: "Segunda" }
        ]}
      />
    );

    expect(
      screen.getByRole("progressbar", {
        name: "Segunda, etapa 2 de 2"
      })
    ).toHaveAttribute("aria-valuenow", "2");
  });
});
