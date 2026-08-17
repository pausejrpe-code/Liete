import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  FlowStepper,
  type FlowStepperLayout
} from "./flow-stepper";

const layouts: FlowStepperLayout[] = [
  "responsive",
  "desktop",
  "mobile"
];

const meta = {
  title: "Patterns/FlowStepper",
  component: FlowStepper,
  parameters: { layout: "centered" },
  args: {
    current: 1,
    layout: "responsive",
    onBack: () => undefined
  },
  argTypes: {
    current: {
      control: { max: 5, min: 1, step: 1, type: "range" }
    },
    layout: {
      control: "inline-radio",
      options: layouts
    }
  }
} satisfies Meta<typeof FlowStepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Responsive: Story = {};

export const Desktop: Story = {
  args: { current: 3, layout: "desktop" }
};

export const Mobile: Story = {
  args: { current: 2, layout: "mobile" }
};

export const StateMatrix: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gap: 24,
        justifyItems: "start",
        padding: 24
      }}
    >
      {[1, 2, 3, 4, 5].map((current) => (
        <FlowStepper
          current={current}
          key={current}
          layout="desktop"
        />
      ))}
    </div>
  ),
  parameters: { layout: "fullscreen" }
};
