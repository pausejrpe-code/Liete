import type { Meta, StoryObj } from "@storybook/react-vite";
import { ToastAlert } from "./toast-alert";

const meta = {
  title: "Components/ToastAlert",
  component: ToastAlert,
  parameters: { layout: "centered" },
  args: { format: "toast", tone: "info" },
  argTypes: {
    format: { control: "inline-radio", options: ["toast", "inline"] },
    tone: { control: "inline-radio", options: ["info", "success", "warning", "error"] }
  }
} satisfies Meta<typeof ToastAlert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Toast: Story = {};
export const Inline: Story = { args: { format: "inline" } };
export const Matrix: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 24, padding: 32 }}>
      {(["toast", "inline"] as const).map((format) => (
        <div key={format} style={{ display: "grid", gap: 16 }}>
          {(["info", "success", "warning", "error"] as const).map((tone) => (
            <ToastAlert format={format} key={tone} tone={tone} />
          ))}
        </div>
      ))}
    </div>
  ),
  parameters: { layout: "fullscreen" }
};
