import type { Meta, StoryObj } from "@storybook/react-vite";
import { Textarea, type TextareaState } from "./textarea";

const states: TextareaState[] = [
  "default",
  "filled",
  "focus",
  "error",
  "disabled"
];

const meta = {
  title: "Components/Textarea",
  component: Textarea,
  parameters: { layout: "centered" },
  args: {
    label: "Descrição da excursão",
    helperText: "Máximo de 1.000 caracteres."
  },
  argTypes: {
    state: { control: "inline-radio", options: states }
  }
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Matrix: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 360px)",
        gap: 24,
        padding: 40
      }}
    >
      {states.map((state) => (
        <Textarea
          key={state}
          defaultValue={state === "default" ? undefined : "Conte os principais detalhes do passeio..."}
          errorMessage={
            state === "error" ? "Máximo de 1.000 caracteres." : undefined
          }
          state={state}
        />
      ))}
    </div>
  ),
  parameters: { layout: "fullscreen" }
};
