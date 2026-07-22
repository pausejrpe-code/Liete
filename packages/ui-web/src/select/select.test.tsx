import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Select } from "./select";

function renderSelect(props: Partial<React.ComponentProps<typeof Select>> = {}) {
  return render(
    <Select label="Tipo de passeio" {...props}>
      <option value="bate-volta">Bate-volta</option>
      <option value="excursao">Excursão</option>
    </Select>
  );
}

describe("Select", () => {
  it("uses a native select with its visible label", async () => {
    const user = userEvent.setup();
    renderSelect();
    const select = screen.getByRole("combobox", { name: "Tipo de passeio" });

    await user.selectOptions(select, "bate-volta");

    expect(select).toHaveValue("bate-volta");
  });

  it("connects the corrective message to the invalid field", () => {
    renderSelect({ errorMessage: "Escolha um tipo de passeio" });
    const select = screen.getByRole("combobox");

    expect(select).toHaveAttribute("aria-invalid", "true");
    expect(select).toHaveAccessibleDescription("Escolha um tipo de passeio");
  });

  it("supports the documented disabled state", () => {
    renderSelect({ state: "disabled" });

    expect(screen.getByRole("combobox")).toBeDisabled();
  });
});
