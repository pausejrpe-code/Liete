import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Pagination } from "./pagination";

describe("Pagination", () => {
  it("exposes the first page and disabled previous action", () => {
    render(<Pagination />);

    expect(screen.getByText("Página 1 de 10")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Página anterior" })
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Próxima página" })
    ).toBeEnabled();
  });

  it("requests adjacent pages", async () => {
    const onPageChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Pagination
        currentPage={5}
        onPageChange={onPageChange}
        totalPages={10}
      />
    );

    await user.click(screen.getByRole("button", { name: "Página anterior" }));
    await user.click(screen.getByRole("button", { name: "Próxima página" }));

    expect(onPageChange).toHaveBeenNthCalledWith(1, 4);
    expect(onPageChange).toHaveBeenNthCalledWith(2, 6);
  });

  it("clamps invalid page values and supports compact content", () => {
    const { container } = render(
      <Pagination
        currentPage={99}
        layout="mobile"
        showResults={false}
        totalPages={3}
      />
    );

    expect(screen.getByText("Página 3 de 3")).toBeInTheDocument();
    expect(container.firstChild).toHaveAttribute("data-position", "last");
    expect(screen.queryByText(/excursões/)).not.toBeInTheDocument();
  });
});
