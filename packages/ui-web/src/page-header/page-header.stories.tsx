import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageHeader } from "./page-header";

const meta = {
  title: "Components/PageHeader",
  component: PageHeader,
  parameters: {
    layout: "centered"
  },
  args: {
    layout: "responsive"
  },
  argTypes: {
    headingLevel: {
      control: "inline-radio",
      options: [1, 2, 3]
    },
    layout: {
      control: "inline-radio",
      options: ["responsive", "desktop", "mobile"]
    }
  }
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Responsive: Story = {};

export const Desktop: Story = {
  args: {
    layout: "desktop"
  }
};

export const Mobile: Story = {
  args: {
    layout: "mobile"
  }
};

export const WithoutBack: Story = {
  args: {
    showBack: false
  }
};

export const SingleAction: Story = {
  args: {
    primaryActionLabel: "Criar excursão",
    showSecondaryAction: false
  }
};

export const LongContent: Story = {
  args: {
    primaryActionLabel: "Nova excursão",
    subtitle:
      "Acompanhe publicações, disponibilidade, vendas confirmadas e repasses das próximas excursões.",
    title: "Gestão de excursões e roteiros"
  }
};
