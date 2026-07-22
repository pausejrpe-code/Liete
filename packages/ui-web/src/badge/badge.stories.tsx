import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, type BadgeTone } from "./badge";

const tones: BadgeTone[] = [
  "success",
  "attention",
  "error",
  "disabled",
  "pure",
  "secondary",
  "dark"
];

const meta = {
  title: "Components/Badge",
  component: Badge,
  parameters: { layout: "centered" },
  args: { label: "Disponível", showDot: true, tone: "success" },
  argTypes: { tone: { control: "inline-radio", options: tones } }
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Matrix: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 24, padding: 40 }}>
      {tones.map((tone) => (
        <Badge key={tone} tone={tone} />
      ))}
    </div>
  ),
  parameters: { layout: "fullscreen" }
};
