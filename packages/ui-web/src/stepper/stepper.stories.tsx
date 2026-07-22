import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stepper } from "./stepper";

const meta = {
  title: "Components/Stepper",
  component: Stepper,
  parameters: { layout: "centered" },
  args: { defaultValue: 2, label: "Passageiros", size: "sm" }
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {};
export const Medium: Story = { args: { size: "md" } };
export const Disabled: Story = { args: { disabled: true } };

export const Matrix: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 64, padding: 32 }}>
      <Stepper size="sm" />
      <Stepper disabled size="sm" />
      <Stepper size="md" />
      <Stepper disabled size="md" />
    </div>
  ),
  parameters: { layout: "fullscreen" }
};
