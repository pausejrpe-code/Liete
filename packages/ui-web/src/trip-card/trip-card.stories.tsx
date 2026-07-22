import type { Meta, StoryObj } from "@storybook/react-vite";
import { TripCard } from "./trip-card";

const meta = {
  title: "Components/TripCard",
  component: TripCard,
  parameters: { layout: "centered" },
  args: { availability: "available", layout: "vertical" },
  argTypes: {
    availability: { control: "inline-radio", options: ["available", "sold-out"] },
    layout: { control: "inline-radio", options: ["vertical", "compact"] }
  }
} satisfies Meta<typeof TripCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const VerticalAvailable: Story = {};
export const VerticalSoldOut: Story = { args: { availability: "sold-out" } };
export const CompactAvailable: Story = { args: { layout: "compact" } };
export const CompactSoldOut: Story = { args: { availability: "sold-out", layout: "compact" } };
export const Matrix: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 48, padding: 32 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 52 }}>
        <TripCard />
        <TripCard availability="sold-out" />
      </div>
      <TripCard layout="compact" />
      <TripCard availability="sold-out" layout="compact" />
    </div>
  ),
  parameters: { layout: "fullscreen" }
};
