import type { Meta, StoryObj } from "@storybook/react-vite";
import { TripSearchBar, type TripSearchBarState } from "./trip-search-bar";

const meta = {
  title: "Patterns/TripSearchBar",
  component: TripSearchBar,
  parameters: { layout: "centered" },
  args: { layout: "desktop", state: "default" },
  argTypes: {
    layout: { control: "inline-radio", options: ["desktop", "mobile"] },
    state: { control: "inline-radio", options: ["default", "focused", "filled"] }
  }
} satisfies Meta<typeof TripSearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};
export const Mobile: Story = { args: { layout: "mobile" } };
export const Filled: Story = { args: { state: "filled" } };
export const Matrix: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 32, padding: 32 }}>
      {(["default", "focused", "filled"] as TripSearchBarState[]).map((state) => (
        <TripSearchBar key={`desktop-${state}`} state={state} />
      ))}
      {(["default", "focused", "filled"] as TripSearchBarState[]).map((state) => (
        <TripSearchBar key={`mobile-${state}`} layout="mobile" state={state} />
      ))}
    </div>
  ),
  parameters: { layout: "fullscreen" }
};
