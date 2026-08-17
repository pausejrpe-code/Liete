import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  MetricCard,
  type MetricCardSize,
  type MetricCardTone
} from "./metric-card";

const sizes: MetricCardSize[] = ["regular", "compact"];
const tones: MetricCardTone[] = ["neutral", "positive", "warning"];

const meta = {
  title: "Components/MetricCard",
  component: MetricCard,
  parameters: { layout: "centered" },
  args: { size: "regular", tone: "neutral" },
  argTypes: {
    size: { control: "inline-radio", options: sizes },
    tone: { control: "inline-radio", options: tones }
  }
} satisfies Meta<typeof MetricCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Matrix: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 280px)",
        gap: 24,
        padding: 40
      }}
    >
      {sizes.flatMap((size) =>
        tones.map((tone) => (
          <MetricCard key={`${size}-${tone}`} size={size} tone={tone} />
        ))
      )}
    </div>
  ),
  parameters: { layout: "fullscreen" }
};
