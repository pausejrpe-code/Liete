import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Sidebar, type SidebarItem } from "./sidebar";

const items: SidebarItem[] = [
  { href: "#overview", id: "overview", label: "Visão geral" },
  { href: "#trips", id: "trips", label: "Excursões" },
  { id: "reports", label: "Relatórios" },
  { href: "#account", id: "account", label: "Conta" }
];

describe("Sidebar", () => {
  it("uses navigation semantics and exposes the active destination", () => {
    render(
      <Sidebar
        activeItemId="trips"
        ariaLabel="Área do organizador"
        items={items}
        layout="expanded"
      />
    );

    expect(
      screen.getByRole("navigation", { name: "Área do organizador" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Excursões" })).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  it("keeps collapsed icon-only destinations accessible by name", () => {
    render(<Sidebar activeItemId="overview" items={items} />);

    expect(
      screen.getByRole("link", { name: "Visão geral" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Excursões" })).toBeInTheDocument();
    expect(screen.queryByText("Visão geral")).not.toBeInTheDocument();
  });

  it("overrides destination URLs without replacing the default items", () => {
    render(
      <Sidebar
        itemHrefs={{ analytics: "/organizador/financeiro/" }}
        layout="expanded"
      />
    );

    expect(screen.getByRole("link", { name: "Financeiro" })).toHaveAttribute(
      "href",
      "/organizador/financeiro/"
    );
  });

  it("renders only the active destination in the mobile bar", () => {
    render(
      <Sidebar activeItemId="account" items={items} layout="mobileBar" />
    );

    expect(screen.getByRole("link", { name: "Conta" })).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Excursões" })
    ).not.toBeInTheDocument();
  });

  it("supports button destinations and reports selection", async () => {
    const onItemSelect = vi.fn();
    const user = userEvent.setup();
    render(
      <Sidebar
        activeItemId="overview"
        items={items}
        layout="expanded"
        onItemSelect={onItemSelect}
      />
    );

    await user.click(screen.getByRole("button", { name: "Relatórios" }));
    expect(onItemSelect).toHaveBeenCalledWith("reports");
  });

  it.each(["collapsed", "expanded", "mobile", "mobileBar"] as const)(
    "exposes the %s layout for styling and QA",
    (layout) => {
      const { container } = render(
        <Sidebar items={items} layout={layout} />
      );

      expect(container.firstChild).toHaveAttribute("data-layout", layout);
    }
  );
});
