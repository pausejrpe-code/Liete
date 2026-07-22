import type { Meta, StoryObj } from "@storybook/react-vite";
import type { FormFieldState } from "../field/field";
import { Select } from "./select";

const states: FormFieldState[] = ["default", "focus", "error", "disabled", "filled"];

const options = (
  <>
    <option value="bate-volta">Bate-volta</option>
    <option value="excursao">Excursão</option>
  </>
);

const meta = {
  title: "Components/Select",
  component: Select,
  parameters: { layout: "centered" },
  args: {
    children: options,
    helperText: "Escolha uma opção",
    label: "Tipo de passeio"
  }
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Matrix: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 263px)", gap: 40, padding: 32 }}>
      {states.map((state) => (
        <Select
          defaultValue={state === "default" ? "" : "bate-volta"}
          errorMessage={state === "error" ? "Escolha uma opção" : undefined}
          key={state}
          state={state}
        >
          {options}
        </Select>
      ))}
    </div>
  ),
  parameters: { layout: "fullscreen" }
};
