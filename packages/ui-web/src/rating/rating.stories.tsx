import type { Meta, StoryObj } from "@storybook/react-vite";
import { Rating } from "./rating";

const meta = {
  title: "Components/Rating",
  component: Rating,
  parameters: { layout: "centered" },
  args: { count: 128, labelMode: "score-count", size: "sm", value: 4.8 },
  argTypes: {
    labelMode: { control: "inline-radio", options: ["none", "score", "score-count"] },
    size: { control: "inline-radio", options: ["sm", "md"] }
  }
} satisfies Meta<typeof Rating>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {};
export const Medium: Story = { args: { size: "md" } };
export const Matrix: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 24, padding: 32 }}>
      {(["sm", "md"] as const).flatMap((size) =>
        (["none", "score", "score-count"] as const).map((labelMode) => (
          <Rating key={`${size}-${labelMode}`} labelMode={labelMode} size={size} />
        ))
      )}
    </div>
  )
};
