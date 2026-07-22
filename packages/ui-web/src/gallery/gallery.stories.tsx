import type { Meta, StoryObj } from "@storybook/react-vite";
import { Gallery } from "./gallery";

const meta = {
  title: "Components/Gallery",
  component: Gallery,
  parameters: { layout: "centered" },
  args: { layout: "hero", remainingCount: 8 },
  argTypes: { layout: { control: "inline-radio", options: ["hero", "grid"] } }
} satisfies Meta<typeof Gallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Hero: Story = {};
export const Grid: Story = { args: { layout: "grid" } };
export const Matrix: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 32, width: "min(724px, calc(100vw - 64px))" }}>
      <Gallery />
      <Gallery layout="grid" />
    </div>
  ),
  parameters: { layout: "centered" }
};
