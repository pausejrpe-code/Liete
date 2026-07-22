import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton, type SkeletonType } from "./skeleton";

const meta = {
  title: "Components/Skeleton",
  component: Skeleton,
  parameters: { layout: "centered" },
  args: { type: "text" },
  argTypes: {
    type: { control: "inline-radio", options: ["text", "trip-card", "avatar", "table-row"] }
  }
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {};
export const TripCard: Story = { args: { type: "trip-card" } };
export const Avatar: Story = { args: { type: "avatar" } };
export const TableRow: Story = { args: { type: "table-row" } };
export const Matrix: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 36, overflowX: "auto", padding: 32 }}>
      {(["text", "trip-card", "avatar", "table-row"] as SkeletonType[]).map((type) => (
        <Skeleton key={type} type={type} />
      ))}
    </div>
  ),
  parameters: { layout: "fullscreen" }
};
