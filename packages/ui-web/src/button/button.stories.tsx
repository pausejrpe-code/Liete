import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered"
  },
  args: {
    children: "Reservar agora",
    size: "sm",
    variant: "primary"
  },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg"]
    },
    variant: {
      control: "inline-radio",
      options: ["primary", "secondary", "ghost", "danger", "dangerGhost"]
    }
  }
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: { variant: "secondary" }
};

export const Ghost: Story = {
  args: { variant: "ghost" }
};

export const Danger: Story = {
  args: { variant: "danger" }
};

export const DangerGhost: Story = {
  args: { variant: "dangerGhost" }
};

export const Disabled: Story = {
  args: { disabled: true }
};

export const Matrix: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, max-content)",
        gap: "40px 42px",
        alignItems: "center",
        padding: 40,
        background: "var(--color-background-surface-muted)",
        borderRadius: 12
      }}
    >
      {(["sm", "md", "lg"] as const).flatMap((size) =>
        (["primary", "secondary", "ghost", "danger", "dangerGhost"] as const).map(
          (variant) => (
          <div key={`${size}-${variant}`} style={{ display: "flex", gap: 24 }}>
            <Button size={size} variant={variant}>
              Reservar agora
            </Button>
            <Button disabled size={size} variant={variant}>
              Reservar agora
            </Button>
          </div>
          )
        )
      )}
    </div>
  ),
  parameters: {
    layout: "fullscreen"
  }
};
