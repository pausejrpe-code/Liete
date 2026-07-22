import type { Meta, StoryObj } from "@storybook/react-vite";
import { BannerHero } from "./banner-hero";

const meta = {
  title: "Components/BannerHero",
  component: BannerHero,
  parameters: { layout: "centered" },
  args: { layout: "responsive" },
  argTypes: {
    headingLevel: { control: "inline-radio", options: [1, 2, 3] },
    layout: { control: "inline-radio", options: ["responsive", "desktop", "mobile"] }
  }
} satisfies Meta<typeof BannerHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Responsive: Story = {};
export const Desktop: Story = { args: { layout: "desktop" } };
export const Mobile: Story = { args: { layout: "mobile" } };
export const CustomDestination: Story = {
  args: {
    actionLabel: "Explorar roteiros",
    description: "Descubra novas paisagens e encontre a viagem ideal para o seu próximo fim de semana.",
    heading: "Encontre uma experiência para lembrar"
  }
};
