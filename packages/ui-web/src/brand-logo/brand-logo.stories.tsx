import type { Meta, StoryObj } from "@storybook/react-vite";
import { BrandLogo } from "./brand-logo";

const meta = {
  title: "Brand/BrandLogo",
  component: BrandLogo,
  parameters: { layout: "centered" },
  args: { tone: "default", width: 520 },
  argTypes: {
    tone: { control: "inline-radio", options: ["default", "green", "pink"] }
  }
} satisfies Meta<typeof BrandLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Green: Story = { args: { tone: "green" } };
export const Pink: Story = { args: { tone: "pink" } };
export const Matrix: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 32, padding: 40 }}>
      <BrandLogo width={520} />
      <BrandLogo tone="green" width={520} />
      <BrandLogo tone="pink" width={520} />
    </div>
  ),
  parameters: { layout: "fullscreen" }
};
