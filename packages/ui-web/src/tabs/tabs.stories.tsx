import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs } from "./tabs";

const items = [
  { label: "Detalhes", value: "details" },
  { label: "Roteiro", value: "itinerary" },
  { label: "Avaliações", value: "reviews" }
];

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  parameters: { layout: "centered" },
  args: { items, variant: "underline" },
  argTypes: {
    variant: { control: "inline-radio", options: ["underline", "pill"] }
  }
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Underline: Story = {};
export const Pill: Story = { args: { variant: "pill" } };
export const Matrix: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 32, padding: 32 }}>
      <Tabs items={items} variant="underline" />
      <Tabs items={items} variant="pill" />
    </div>
  )
};
