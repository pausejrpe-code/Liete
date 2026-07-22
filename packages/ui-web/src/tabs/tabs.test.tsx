import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Tabs } from "./tabs";

const items = [
  { label: "Detalhes", value: "details" },
  { label: "Roteiro", value: "itinerary" },
  { label: "Avaliações", value: "reviews" }
];

describe("Tabs", () => {
  it("selects a tab in uncontrolled mode", async () => {
    const user = userEvent.setup();
    render(<Tabs items={items} />);

    await user.click(screen.getByRole("tab", { name: "Roteiro" }));
    expect(screen.getByRole("tab", { name: "Roteiro" })).toHaveAttribute("aria-selected", "true");
  });

  it("reports changes in controlled mode", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Tabs items={items} onValueChange={onValueChange} value="details" />);

    await user.click(screen.getByRole("tab", { name: "Avaliações" }));
    expect(onValueChange).toHaveBeenCalledWith("reviews");
  });

  it("supports roving focus with arrow keys", async () => {
    const user = userEvent.setup();
    render(<Tabs items={items} />);
    const first = screen.getByRole("tab", { name: "Detalhes" });
    first.focus();

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Roteiro" })).toHaveFocus();
  });
});
