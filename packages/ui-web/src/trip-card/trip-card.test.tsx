import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TripCard } from "./trip-card";

describe("TripCard", () => {
  it("renders the available vertical trip anatomy", () => {
    render(<TripCard />);
    const card = screen.getByRole("article", { name: "Capitólio bate-volta" });
    expect(card).toHaveAttribute("data-layout", "vertical");
    expect(card).toHaveAttribute("data-availability", "available");
    expect(screen.getByText("12 vagas")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reservar" })).toBeEnabled();
  });

  it("disables reservation when sold out", async () => {
    const onReserve = vi.fn();
    const user = userEvent.setup();
    render(<TripCard availability="sold-out" onReserve={onReserve} />);
    await user.click(screen.getByRole("button", { name: "Esgotado" }));
    expect(screen.getByRole("button", { name: "Esgotado" })).toBeDisabled();
    expect(onReserve).not.toHaveBeenCalled();
  });

  it("supports compact layout and product copy", () => {
    render(<TripCard layout="compact" title="Serra do Cipó" verified={false} />);
    expect(screen.getByRole("article", { name: "Serra do Cipó" })).toHaveAttribute(
      "data-layout",
      "compact"
    );
    expect(screen.queryByText("Verificado")).not.toBeInTheDocument();
  });
});
