import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DataTable } from "./data-table";

describe("DataTable", () => {
  it("renders a semantic desktop table with status and actions", () => {
    render(<DataTable layout="desktop" />);

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Excursão" })
    ).toBeInTheDocument();
    expect(screen.getByText("Capitólio bate-volta")).toBeInTheDocument();
    expect(screen.getByText("Publicada")).toHaveAttribute(
      "data-intent",
      "available"
    );
    expect(
      screen.getByRole("columnheader", { name: "Destino" })
    ).toBeInTheDocument();
    expect(screen.getByText("Capitólio, MG")).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: "Detalhes" })
    ).toHaveLength(3);
  });

  it("runs toolbar, row and pagination actions", async () => {
    const onPageChange = vi.fn();
    const onPrimaryAction = vi.fn();
    const onRowAction = vi.fn();
    const user = userEvent.setup();
    render(
      <DataTable
        layout="desktop"
        onPageChange={onPageChange}
        onPrimaryAction={onPrimaryAction}
        onRowAction={onRowAction}
      />
    );

    await user.click(screen.getByRole("button", { name: "Nova excursão" }));
    await user.click(screen.getAllByRole("button", { name: "Detalhes" })[0]);
    await user.click(screen.getByRole("button", { name: "Próxima página" }));

    expect(onPrimaryAction).toHaveBeenCalledOnce();
    expect(onRowAction).toHaveBeenCalledWith(
      expect.objectContaining({ id: "capitolio" })
    );
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("renders the compact card list in mobile layout", () => {
    render(<DataTable layout="mobile" />);

    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByText("40/40")).toBeInTheDocument();
  });

  it("renders empty and loading states independently", () => {
    const { container, rerender } = render(
      <DataTable layout="desktop" state="empty" />
    );

    expect(
      screen.getByText("Nenhuma excursão publicada")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Publicar excursão" })
    ).toBeInTheDocument();

    rerender(<DataTable layout="mobile" state="loading" />);

    expect(
      screen.getByRole("status", { name: "Carregando excursões" })
    ).toBeInTheDocument();
    expect(
      container.querySelectorAll('[data-type="table-row"]')
    ).toHaveLength(3);
  });
});
