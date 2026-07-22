import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ChoiceState } from "../checkbox/checkbox";
import { Radio } from "./radio";

const states: ChoiceState[] = ["default", "focus", "disabled"];

const meta = {
  title: "Components/Radio",
  component: Radio,
  parameters: { layout: "centered" },
  args: { label: "Pix", name: "payment" }
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Matrix: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, max-content)", gap: 32, padding: 32 }}>
      {states.flatMap((state) =>
        [false, true].map((checked) => (
          <Radio
            defaultChecked={checked}
            key={`${state}-${checked}`}
            name={`${state}-${checked}`}
            state={state}
          />
        ))
      )}
    </div>
  ),
  parameters: { layout: "fullscreen" }
};
