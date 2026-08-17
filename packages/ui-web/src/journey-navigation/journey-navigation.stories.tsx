import type { Meta, StoryObj } from "@storybook/react-vite";
import { JourneyNavigation } from "./journey-navigation";

const meta = {
  title: "Patterns/JourneyNavigation",
  component: JourneyNavigation,
  parameters: { layout: "centered" },
  args: {
    onBack: () => undefined,
    onPrimaryAction: () => undefined,
    primaryLabel: "Reservar agora"
  }
} satisfies Meta<typeof JourneyNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ExcursionDraft: Story = {
  args: {
    primaryLabel: "Salvar e continuar"
  }
};

export const FinalStep: Story = {
  args: {
    primaryLabel: "Publicar excursão",
    sticky: true
  }
};

export const FirstStep: Story = {
  args: {
    backDisabled: true,
    primaryLabel: "Salvar e continuar"
  }
};
