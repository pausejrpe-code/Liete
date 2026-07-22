import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { DateInput, Input, MoneyInput } from "./field";

describe("form fields", () => {
  it("associates the visible label and helper with the native input", () => {
    render(<Input helperText="Obrigatório" label="Nome do passeio" />);

    const input = screen.getByRole("textbox", { name: "Nome do passeio" });
    const helper = screen.getByText("Obrigatório");

    expect(input).toHaveAccessibleDescription("Obrigatório");
    expect(input).toHaveAttribute("aria-describedby", helper.id);
  });

  it("exposes error semantics and the corrective message", () => {
    render(
      <Input
        defaultValue="Capitólio bate-volta"
        errorMessage="Revise o nome informado"
        label="Nome do passeio"
      />
    );

    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("textbox")).toHaveAccessibleDescription(
      "Revise o nome informado"
    );
  });

  it("uses native disabled behavior", async () => {
    const user = userEvent.setup();
    render(<Input disabled label="Nome do passeio" />);

    const input = screen.getByRole("textbox");
    await user.click(input);

    expect(input).toBeDisabled();
    expect(input).not.toHaveFocus();
  });

  it("configures date and money keyboards", () => {
    render(
      <>
        <DateInput aria-label="Data" />
        <MoneyInput aria-label="Valor" />
      </>
    );

    expect(screen.getByRole("textbox", { name: "Data" })).toHaveAttribute(
      "inputmode",
      "numeric"
    );
    expect(screen.getByRole("textbox", { name: "Valor" })).toHaveAttribute(
      "inputmode",
      "decimal"
    );
  });
});
