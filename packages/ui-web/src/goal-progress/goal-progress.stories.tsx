import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  GoalProgress,
  type GoalProgressLayout,
  type GoalProgressValue
} from "./goal-progress";

const layouts: GoalProgressLayout[] = ["regular", "compact"];
const milestones: GoalProgressValue[] = [25, 50, 75, 100];

const meta = {
  title: "Components/GoalProgress",
  component: GoalProgress,
  parameters: { layout: "centered" },
  args: { layout: "regular", progress: 25 },
  argTypes: {
    layout: { control: "inline-radio", options: layouts },
    progress: { control: "inline-radio", options: milestones }
  }
} satisfies Meta<typeof GoalProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Matrix: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 24, padding: 24 }}>
      {layouts.map((layout) => (
        <div key={layout} style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
          {milestones.map((progress) => (
            <GoalProgress key={progress} layout={layout} progress={progress} />
          ))}
        </div>
      ))}
    </div>
  ),
  parameters: { layout: "fullscreen" }
};
