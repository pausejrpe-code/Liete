import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GoalProgress } from "./goal-progress";

describe("GoalProgress", () => {
  it("announces the current milestone and passenger ratio", () => {
    render(<GoalProgress progress={25} />);

    expect(
      screen.getByRole("progressbar", {
        name: "Meta mínima de passageiros"
      })
    ).toHaveAttribute("aria-valuenow", "25");
    expect(screen.getByText("8 de 30")).toBeInTheDocument();
  });

  it("uses completed copy and semantic progress at 100 percent", () => {
    render(<GoalProgress progress={100} />);

    expect(screen.getByText("30 de 30")).toBeInTheDocument();
    expect(
      screen.getByText("Meta mínima atingida. A excursão pode ser confirmada.")
    ).toBeInTheDocument();
  });

  it("supports compact density and optional content", () => {
    const { container } = render(
      <GoalProgress
        layout="compact"
        progress={50}
        showRatio={false}
        showSupporting={false}
      />
    );

    expect(container.firstChild).toHaveAttribute("data-layout", "compact");
    expect(screen.queryByText("15 de 30")).not.toBeInTheDocument();
    expect(screen.queryByText(/Acompanhe/)).not.toBeInTheDocument();
  });
});
