import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Stepper } from "./stepper";

describe("Stepper", () => {
  it("increments and decrements its uncontrolled value", async () => {
    const user = userEvent.setup();
    render(<Stepper defaultValue={2} label="Passageiros" />);

    await user.click(screen.getByRole("button", { name: "Aumentar Passageiros" }));
    expect(screen.getByText("3")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Diminuir Passageiros" }));
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("reports changes in controlled mode", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Stepper onValueChange={onValueChange} value={2} />);

    await user.click(screen.getByRole("button", { name: "Aumentar Passageiros" }));

    expect(onValueChange).toHaveBeenCalledWith(3);
  });

  it("respects limits and the global disabled state", () => {
    const { rerender } = render(<Stepper max={2} min={2} value={2} />);

    screen.getAllByRole("button").forEach((button) => {
      expect(button).toBeDisabled();
    });

    rerender(<Stepper disabled value={2} />);
    screen.getAllByRole("button").forEach((button) => {
      expect(button).toBeDisabled();
    });
  });
});
