import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataTable } from "./data-table";

const meta = {
  title: "Components/DataTable",
  component: DataTable,
  parameters: { layout: "centered" },
  args: { layout: "responsive", state: "default" },
  argTypes: {
    headingLevel: { control: "inline-radio", options: [2, 3] },
    layout: {
      control: "inline-radio",
      options: ["responsive", "desktop", "mobile"]
    },
    state: {
      control: "inline-radio",
      options: ["default", "empty", "loading"]
    }
  }
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Responsive: Story = {};
export const Desktop: Story = { args: { layout: "desktop" } };
export const Mobile: Story = { args: { layout: "mobile" } };
export const Empty: Story = { args: { state: "empty" } };
export const Loading: Story = { args: { state: "loading" } };
export const WithoutActions: Story = {
  args: {
    showPrimaryAction: false,
    showRowActions: false
  }
};
