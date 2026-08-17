import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  PayoutStatusCard,
  type PayoutStage,
  type PayoutStatusCardLayout
} from "./payout-status-card";

const layouts: PayoutStatusCardLayout[] = ["regular", "compact"];
const stages: PayoutStage[] = [
  "collecting",
  "minimumReached",
  "afterTrip",
  "paid"
];

const meta = {
  title: "Components/PayoutStatusCard",
  component: PayoutStatusCard,
  parameters: { layout: "centered" },
  args: { layout: "regular", stage: "collecting" },
  argTypes: {
    layout: { control: "inline-radio", options: layouts },
    stage: { control: "inline-radio", options: stages }
  }
} satisfies Meta<typeof PayoutStatusCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Matrix: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 24, padding: 24 }}>
      {layouts.map((layout) => (
        <div
          key={layout}
          style={{ display: "flex", alignItems: "flex-start", gap: 24 }}
        >
          {stages.map((stage) => (
            <PayoutStatusCard key={stage} layout={layout} stage={stage} />
          ))}
        </div>
      ))}
    </div>
  ),
  parameters: { layout: "fullscreen" }
};
