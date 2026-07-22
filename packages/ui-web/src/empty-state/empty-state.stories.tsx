import type { Meta, StoryObj } from "@storybook/react-vite";
import { EmptyState, type EmptyStateContext } from "./empty-state";

const meta = {
  title: "Components/EmptyState",
  component: EmptyState,
  parameters: { layout: "centered" },
  args: { context: "search" },
  argTypes: { context: { control: "inline-radio", options: ["search", "reservations", "admin"] } }
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Search: Story = {};
export const Reservations: Story = { args: { context: "reservations" } };
export const Admin: Story = { args: { context: "admin" } };
export const Matrix: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 24, padding: 32 }}>
      {(["search", "reservations", "admin"] as EmptyStateContext[]).map((context) => (
        <EmptyState context={context} key={context} />
      ))}
    </div>
  ),
  parameters: { layout: "fullscreen" }
};
