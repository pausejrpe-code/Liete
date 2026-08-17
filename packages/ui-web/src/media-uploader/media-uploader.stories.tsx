import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  MediaUploader,
  type MediaUploaderLayout,
  type MediaUploaderState
} from "./media-uploader";

const layouts: MediaUploaderLayout[] = ["regular", "compact"];
const states: MediaUploaderState[] = [
  "empty",
  "uploading",
  "success",
  "error"
];

const meta = {
  title: "Components/MediaUploader",
  component: MediaUploader,
  parameters: { layout: "centered" },
  args: { layout: "regular", state: "empty" },
  argTypes: {
    layout: { control: "inline-radio", options: layouts },
    state: { control: "inline-radio", options: states }
  }
} satisfies Meta<typeof MediaUploader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Matrix: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 560px)",
        columnGap: 24,
        rowGap: 40,
        padding: 32
      }}
    >
      {layouts.flatMap((layout) =>
        states.map((state) => (
          <MediaUploader
            key={`${layout}-${state}`}
            layout={layout}
            state={state}
          />
        ))
      )}
    </div>
  ),
  parameters: { layout: "fullscreen" }
};
