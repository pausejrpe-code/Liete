import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PartnerHero } from "./partner-hero";

describe("PartnerHero", () => {
  it("renders the organizer message and reuses the primary action", () => {
    render(<PartnerHero />);

    expect(screen.getByRole("heading", { name: /anuncie suas viagens/i })).toBeInTheDocument();
    expect(screen.getByText("Para organizadores")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reservar agora" })).toHaveAttribute(
      "data-variant",
      "primary"
    );
  });

  it("runs the supplied action", async () => {
    const onAction = vi.fn();
    const user = userEvent.setup();
    render(<PartnerHero onAction={onAction} />);

    await user.click(screen.getByRole("button", { name: "Reservar agora" }));
    expect(onAction).toHaveBeenCalledOnce();
  });

  it("exposes the selected responsive contract", () => {
    const { container } = render(<PartnerHero layout="mobile" />);
    expect(container.firstChild).toHaveAttribute("data-layout", "mobile");
  });

  it("keeps the decorative illustration out of the accessibility tree", () => {
    render(<PartnerHero />);
    expect(screen.queryAllByRole("img")).toHaveLength(0);
  });
});
