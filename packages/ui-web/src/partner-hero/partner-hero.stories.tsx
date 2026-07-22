import type { Meta, StoryObj } from "@storybook/react-vite";
import { PartnerHero } from "./partner-hero";

const meta = {
  title: "Components/PartnerHero",
  component: PartnerHero,
  parameters: { layout: "centered" },
  args: { layout: "responsive" },
  argTypes: {
    headingLevel: { control: "inline-radio", options: [1, 2, 3] },
    layout: { control: "inline-radio", options: ["responsive", "desktop", "mobile"] }
  }
} satisfies Meta<typeof PartnerHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Responsive: Story = {};
export const Desktop: Story = { args: { layout: "desktop" } };
export const Mobile: Story = { args: { layout: "mobile" } };
export const LongContent: Story = {
  args: {
    description:
      "Cadastre sua operação, publique roteiros completos e receba reservas de viajantes diretamente pela plataforma.",
    heading: "Transforme seus roteiros em experiências.",
    highlightedHeading: "Leve mais pessoas."
  }
};
