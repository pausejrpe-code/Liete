import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pagination } from "./pagination";

const meta = {
  title: "Components/Pagination",
  component: Pagination,
  parameters: { layout: "centered" },
  args: { currentPage: 1, layout: "responsive", totalPages: 10 },
  argTypes: {
    layout: {
      control: "inline-radio",
      options: ["responsive", "desktop", "mobile"]
    }
  }
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const First: Story = {};
export const Middle: Story = { args: { currentPage: 5 } };
export const Last: Story = { args: { currentPage: 10 } };
export const Mobile: Story = { args: { layout: "mobile" } };
export const WithoutResults: Story = { args: { showResults: false } };
