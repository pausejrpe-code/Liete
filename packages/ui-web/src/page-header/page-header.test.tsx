import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PageHeader } from "./page-header";

describe("PageHeader", () => {
  it("renders the page context and reuses Button for every action", () => {
    render(<PageHeader />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Excursões" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Gerencie publicações, vendas e repasses.")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Voltar" })).toHaveAttribute(
      "data-size",
      "sm"
    );
    expect(screen.getByRole("button", { name: "Exportar" })).toHaveAttribute(
      "data-variant",
      "ghost"
    );
    expect(
      screen.getByRole("button", { name: "Nova excursão" })
    ).toHaveAttribute("data-variant", "primary");
  });

  it("runs the supplied page actions", async () => {
    const onBack = vi.fn();
    const onPrimaryAction = vi.fn();
    const onSecondaryAction = vi.fn();
    const user = userEvent.setup();

    render(
      <PageHeader
        onBack={onBack}
        onPrimaryAction={onPrimaryAction}
        onSecondaryAction={onSecondaryAction}
      />
    );

    await user.click(screen.getByRole("button", { name: "Voltar" }));
    await user.click(screen.getByRole("button", { name: "Exportar" }));
    await user.click(screen.getByRole("button", { name: "Nova excursão" }));

    expect(onBack).toHaveBeenCalledOnce();
    expect(onSecondaryAction).toHaveBeenCalledOnce();
    expect(onPrimaryAction).toHaveBeenCalledOnce();
  });

  it("supports optional context and actions without empty groups", () => {
    render(
      <PageHeader
        showBack={false}
        showPrimaryAction={false}
        showSecondaryAction={false}
        showSubtitle={false}
      />
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Gerencie publicações, vendas e repasses.")
    ).not.toBeInTheDocument();
  });

  it("exposes heading hierarchy and layout as explicit contracts", () => {
    const { container } = render(
      <PageHeader headingLevel={2} layout="mobile" title="Reservas" />
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "Reservas" })
    ).toBeInTheDocument();
    expect(container.firstChild).toHaveAttribute("data-layout", "mobile");
  });
});
