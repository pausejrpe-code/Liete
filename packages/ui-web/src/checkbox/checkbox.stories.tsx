import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox, type ChoiceState } from "./checkbox";

const states: ChoiceState[] = ["default", "focus", "disabled"];

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  parameters: { layout: "centered" },
  args: { label: "Aceito a política de cancelamento" }
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Matrix: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, max-content)", gap: 32, padding: 32 }}>
      {states.flatMap((state) =>
        [false, true].map((checked) => (
          <Checkbox
            defaultChecked={checked}
            key={`${state}-${checked}`}
            state={state}
          />
        ))
      )}
    </div>
  ),
  parameters: { layout: "fullscreen" }
};
