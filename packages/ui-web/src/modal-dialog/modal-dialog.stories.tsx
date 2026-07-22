import type { Meta, StoryObj } from "@storybook/react-vite";
import { ModalDialog } from "./modal-dialog";

const meta = {
  title: "Components/ModalDialog",
  component: ModalDialog,
  parameters: { layout: "centered" },
  args: {
    children: "Revise as informações antes de continuar.",
    presentation: "inline",
    size: "sm",
    title: "Confirmar ação"
  },
  argTypes: {
    intent: { control: "inline-radio", options: ["default", "destructive"] },
    size: { control: "inline-radio", options: ["sm", "md"] }
  }
} satisfies Meta<typeof ModalDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {};
export const Medium: Story = { args: { size: "md" } };
export const Destructive: Story = { args: { intent: "destructive" } };
export const Matrix: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 24, padding: 32 }}>
      <ModalDialog presentation="inline" size="sm" />
      <ModalDialog presentation="inline" size="md" />
      <ModalDialog intent="destructive" presentation="inline" size="sm" />
      <ModalDialog intent="destructive" presentation="inline" size="md" />
    </div>
  ),
  parameters: { layout: "fullscreen" }
};
