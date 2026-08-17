import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Textarea } from "./textarea";

describe("Textarea", () => {
  it("associates its persistent label and helper with the native control", () => {
    render(<Textarea />);

    const control = screen.getByRole("textbox", {
      name: "Descrição da excursão"
    });
    const helper = screen.getByText("Máximo de 1.000 caracteres.");

    expect(control).toHaveAttribute("aria-describedby", helper.id);
    expect(control).toHaveAttribute(
      "placeholder",
      "Conte os principais detalhes do passeio..."
    );
  });

  it("announces an error without discarding the entered value", () => {
    render(
      <Textarea
        defaultValue="Passeio com duas paradas."
        errorMessage="Revise a descrição antes de continuar."
      />
    );

    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("textbox")).toHaveValue(
      "Passeio com duas paradas."
    );
    expect(
      screen.getByText("Revise a descrição antes de continuar.")
    ).toBeInTheDocument();
  });

  it("uses native disabled semantics", () => {
    render(<Textarea disabled defaultValue="Conteúdo preservado" />);

    expect(screen.getByRole("textbox")).toBeDisabled();
    expect(screen.getByRole("textbox").parentElement).toHaveAttribute(
      "data-state",
      "disabled"
    );
  });

  it("supports documented visual states and optional helper content", () => {
    render(<Textarea showHelper={false} state="focus" />);

    expect(screen.getByRole("textbox").parentElement).toHaveAttribute(
      "data-state",
      "focus"
    );
    expect(
      screen.queryByText("Máximo de 1.000 caracteres.")
    ).not.toBeInTheDocument();
  });
});
