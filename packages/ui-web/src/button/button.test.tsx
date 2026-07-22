import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("renders a native button with an accessible name", () => {
    render(<Button>Reservar agora</Button>);

    expect(screen.getByRole("button", { name: "Reservar agora" })).toHaveAttribute(
      "type",
      "button"
    );
  });

  it("exposes variant and size as stable data attributes", () => {
    render(
      <Button size="lg" variant="secondary">
        Criar viagem
      </Button>
    );

    expect(screen.getByRole("button")).toHaveAttribute("data-size", "lg");
    expect(screen.getByRole("button")).toHaveAttribute("data-variant", "secondary");
  });

  it("does not run the action while disabled", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Button disabled onClick={onClick}>
        Reservar agora
      </Button>
    );

    await user.click(screen.getByRole("button"));

    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("exposes destructive variants for confirmation flows", () => {
    const { rerender } = render(<Button variant="danger">Excluir</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("data-variant", "danger");

    rerender(<Button variant="dangerGhost">Voltar</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("data-variant", "dangerGhost");
  });
});
