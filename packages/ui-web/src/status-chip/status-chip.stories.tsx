import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  StatusChip,
  type StatusChipIntent,
  type StatusChipSize
} from "./status-chip";

const intents: StatusChipIntent[] = [
  "available",
  "pending",
  "confirmed",
  "cancelled",
  "soldOut",
  "verified"
];
const sizes: StatusChipSize[] = ["small", "medium"];

const meta = {
  title: "Components/StatusChip",
  component: StatusChip,
  parameters: { layout: "centered" },
  args: { intent: "available", size: "small" },
  argTypes: {
    intent: { control: "inline-radio", options: intents },
    size: { control: "inline-radio", options: sizes }
  }
} satisfies Meta<typeof StatusChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Matrix: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 24, padding: 40 }}>
      {sizes.map((size) => (
        <div key={size} style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          {intents.map((intent) => (
            <StatusChip intent={intent} key={intent} size={size} />
          ))}
        </div>
      ))}
    </div>
  ),
  parameters: { layout: "fullscreen" }
};
