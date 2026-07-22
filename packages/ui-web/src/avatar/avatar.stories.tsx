import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "./avatar";

const meta = {
  title: "Components/Avatar",
  component: Avatar,
  parameters: { layout: "centered" },
  args: { initials: "MC", name: "Marina Costa", size: "md", type: "initials" },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    type: { control: "inline-radio", options: ["initials", "photo"] }
  }
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Initials: Story = {};
export const PhotoPlaceholder: Story = { args: { type: "photo" } };
export const Verified: Story = { args: { verified: true } };
export const Matrix: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 32, padding: 32 }}>
      {(["sm", "md", "lg"] as const).flatMap((size) =>
        (["initials", "photo"] as const).flatMap((type) =>
          [false, true].map((verified) => (
            <Avatar key={`${size}-${type}-${verified}`} size={size} type={type} verified={verified} />
          ))
        )
      )}
    </div>
  ),
  parameters: { layout: "fullscreen" }
};
