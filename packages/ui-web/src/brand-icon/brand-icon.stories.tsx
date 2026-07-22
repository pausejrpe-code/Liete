import type { Meta, StoryObj } from "@storybook/react-vite";
import { BrandIcon } from "./brand-icon";

const meta = {
  title: "Brand/BrandIcon",
  component: BrandIcon,
  parameters: { layout: "centered" },
  args: { size: 180, tone: "default" },
  argTypes: {
    tone: { control: "inline-radio", options: ["default", "green", "pink"] }
  }
} satisfies Meta<typeof BrandIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Green: Story = { args: { tone: "green" } };
export const Pink: Story = { args: { tone: "pink" } };
export const Matrix: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 40, padding: 40 }}>
      <BrandIcon size={180} />
      <BrandIcon size={180} tone="green" />
      <BrandIcon size={180} tone="pink" />
    </div>
  ),
  parameters: { layout: "fullscreen" }
};
