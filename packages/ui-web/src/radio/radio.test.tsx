import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Radio } from "./radio";

describe("Radio", () => {
  it("uses native single-selection behavior", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Radio defaultChecked label="Pix" name="payment" value="pix" />
        <Radio label="Cartão" name="payment" value="card" />
      </>
    );

    await user.click(screen.getByRole("radio", { name: "Cartão" }));

    expect(screen.getByRole("radio", { name: "Cartão" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Pix" })).not.toBeChecked();
  });

  it("preserves native disabled semantics", () => {
    render(<Radio label="Pix" state="disabled" />);

    expect(screen.getByRole("radio")).toBeDisabled();
  });
});
