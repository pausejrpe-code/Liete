import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  DateInput,
  Input,
  MoneyInput,
  type FormFieldState
} from "./field";

const states: FormFieldState[] = ["default", "focus", "error", "disabled", "filled"];

const meta = {
  title: "Components/Form fields",
  component: Input,
  parameters: { layout: "centered" },
  args: { helperText: "Obrigatório", label: "Nome do passeio" }
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {};

export const TextMatrix: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 200px)", gap: 48, padding: 32 }}>
      {states.map((state) => (
        <Input
          defaultValue={state === "default" ? undefined : "Capitólio bate-volta"}
          key={state}
          state={state}
        />
      ))}
    </div>
  ),
  parameters: { layout: "fullscreen" }
};

export const DateMatrix: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 200px)", gap: 48, padding: 32 }}>
      {states.map((state) => (
        <DateInput defaultValue={state === "filled" ? "20/07/2026" : undefined} key={state} state={state} />
      ))}
    </div>
  ),
  parameters: { layout: "fullscreen" }
};

export const MoneyMatrix: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 200px)", gap: 48, padding: 32 }}>
      {states.map((state) => (
        <MoneyInput defaultValue={state === "filled" ? "R$ 480,00" : undefined} key={state} state={state} />
      ))}
    </div>
  ),
  parameters: { layout: "fullscreen" }
};
