import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  PriceBreakdown,
  type PriceBreakdownLayout
} from "./price-breakdown";

const layouts: PriceBreakdownLayout[] = ["regular", "compact"];

const meta = {
  title: "Components/PriceBreakdown",
  component: PriceBreakdown,
  parameters: { layout: "centered" },
  args: { layout: "regular" },
  argTypes: {
    layout: { control: "inline-radio", options: layouts }
  }
} satisfies Meta<typeof PriceBreakdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const JourneyFormula: Story = {
  args: {
    cardFeeAmount: "R$ 20,00",
    cardFeeLabel: "Taxa do cartão (5%)",
    costAmount: "R$ 350,00",
    feeAmount: "R$ 60,00",
    helperText:
      "Transporte por participante: R$ 200,00 · lucro mínimo por participante: R$ 50,00.",
    profitAmount: "R$ 50,00",
    subtotalAmount: "R$ 400,00",
    subtitle: "Composição automática do valor de cada ingresso",
    title: "Preço estimado",
    totalAmount: "R$ 480,00"
  }
};

export const Matrix: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gap: 32,
        padding: 40
      }}
    >
      {layouts.map((layout) => (
        <PriceBreakdown key={layout} layout={layout} />
      ))}
    </div>
  ),
  parameters: { layout: "fullscreen" }
};
