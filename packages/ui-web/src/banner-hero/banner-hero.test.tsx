import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { BannerHero } from "./banner-hero";

describe("BannerHero", () => {
  it("renders the message, meaningful image and primary action", () => {
    render(<BannerHero />);

    expect(screen.getByRole("heading", { name: "Sua próxima aventura começa aqui" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Montanhas acima de um campo florido" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reservar agora" })).toHaveAttribute(
      "data-variant",
      "primary"
    );
  });

  it("accepts a decorative image when its alternative is empty", () => {
    render(<BannerHero imageAlt="" />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("runs the supplied action", async () => {
    const onAction = vi.fn();
    const user = userEvent.setup();
    render(<BannerHero onAction={onAction} />);

    await user.click(screen.getByRole("button", { name: "Reservar agora" }));
    expect(onAction).toHaveBeenCalledOnce();
  });

  it("exposes the selected layout", () => {
    const { container } = render(<BannerHero layout="desktop" />);
    expect(container.firstChild).toHaveAttribute("data-layout", "desktop");
  });
});
