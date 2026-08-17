import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OrganizerAppShell } from "./organizer-app-shell";

describe("OrganizerAppShell", () => {
  it("composes the authenticated desktop structure", () => {
    const { container } = render(
      <OrganizerAppShell layout="desktop" navigation="expanded" />
    );

    expect(container.firstChild).toHaveAttribute("data-layout", "desktop");
    expect(container.firstChild).toHaveAttribute(
      "data-navigation",
      "expanded"
    );
    expect(
      screen.getByRole("navigation", { name: "Navegação institucional" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Área do organizador" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Abrir conta de Marina" }))
      .toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "Excursões" })
    ).toBeInTheDocument();
    expect(screen.getByText("Área de conteúdo")).toBeInTheDocument();
  });

  it("opens the public navigation below the mobile topbar", () => {
    render(<OrganizerAppShell layout="mobile" navigation="expanded" />);

    const navigation = screen.getByRole("navigation", {
      name: "Navegação mobile"
    });

    expect(
      within(navigation).getByRole("link", { name: "Descobrir" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("navigation", { name: "Área do organizador" })
    ).not.toBeInTheDocument();
  });

  it("removes the mobile navigation when collapsed", () => {
    render(<OrganizerAppShell layout="mobile" navigation="collapsed" />);

    expect(
      screen.queryByRole("navigation", { name: "Navegação mobile" })
    ).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Abrir conta de Marina" }))
      .toBeInTheDocument();
  });

  it("uses children as the content slot", () => {
    render(
      <OrganizerAppShell showPageHeader={false}>
        <article>Lista de excursões</article>
      </OrganizerAppShell>
    );

    expect(screen.getByText("Lista de excursões")).toBeInTheDocument();
    expect(screen.queryByText("Área de conteúdo")).not.toBeInTheDocument();
  });

  it("keeps persistent landmarks outside the scrolling page content", () => {
    const { container } = render(
      <OrganizerAppShell>
        <article>Conteúdo longo da jornada</article>
      </OrganizerAppShell>
    );

    const header = container.querySelector(
      '[data-figma-node-id="251:1067"] > header'
    );
    const sidebar = screen.getByRole("navigation", {
      name: "Área do organizador"
    });
    const main = screen.getByRole("main", { name: "Conteúdo principal" });

    expect(header).not.toBeNull();
    expect(header!.contains(main)).toBe(false);
    expect(sidebar.contains(main)).toBe(false);
    expect(main.contains(header!)).toBe(false);
    expect(main.contains(sidebar)).toBe(false);
  });

  it("supports optional shell regions", () => {
    render(
      <OrganizerAppShell
        showContentSlot={false}
        showHeader={false}
        showPageHeader={false}
      />
    );

    expect(screen.queryByRole("banner")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.queryByText("Área de conteúdo")).not.toBeInTheDocument();
  });
});
