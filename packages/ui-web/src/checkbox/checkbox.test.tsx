import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Checkbox } from "./checkbox";

describe("Checkbox", () => {
  it("toggles through native checkbox behavior", async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Aceito a política" />);
    const checkbox = screen.getByRole("checkbox", { name: "Aceito a política" });

    await user.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  it("preserves native disabled semantics", () => {
    render(<Checkbox label="Aceito a política" state="disabled" />);

    expect(screen.getByRole("checkbox")).toBeDisabled();
  });
});
