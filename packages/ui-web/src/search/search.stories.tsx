import type { Meta, StoryObj } from "@storybook/react-vite";
import { Search } from "./search";

const meta = {
  title: "Components/Search",
  component: Search,
  parameters: { layout: "centered" },
  args: { defaultValue: "" }
} satisfies Meta<typeof Search>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
export const Filled: Story = { args: { defaultValue: "Rio das Ostras" } };
export const Matrix: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 64, width: "min(631px, calc(100vw - 40px))" }}>
      <Search />
      <Search defaultValue="Rio das Ostras" />
    </div>
  )
};
