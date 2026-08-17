import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sidebar, type SidebarLayout } from "./sidebar";

const layouts: SidebarLayout[] = [
  "collapsed",
  "expanded",
  "mobile",
  "mobileBar"
];

const meta = {
  title: "Components/Sidebar",
  component: Sidebar,
  parameters: { layout: "centered" },
  args: { layout: "collapsed" },
  argTypes: {
    layout: { control: "inline-radio", options: layouts }
  }
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Matrix: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 36,
        minHeight: 860,
        padding: 16
      }}
    >
      {layouts.map((layout) => (
        <Sidebar key={layout} layout={layout} />
      ))}
    </div>
  ),
  parameters: { layout: "fullscreen" }
};
