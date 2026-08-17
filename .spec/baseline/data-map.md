# Data Map — Baseline de Estruturas de Dados e Modelos

Este documento descreve os modelos conceituais de dados, contratos de estado e esquemas presentes no código da **Liete Platform**.

---

## 1. Modelo de Excursão (`Excursion`)

Estrutura fundamental que representa uma viagem gerenciada pelo organizador.

```typescript
export type ExcursionStatus =
  | "available"   // Vagas abertas, ainda não atingiu o quórum mínimo
  | "confirmed"   // Quórum mínimo atingido, saída garantida
  | "soldOut"     // 100% da capacidade preenchida
  | "draft"       // Rascunho não publicado
  | "cancelled";  // Excursão cancelada

export type Excursion = {
  id: string;
  title: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  capacity: number;           // Lotação máxima do transporte
  minimumGroup: number;       // Quórum mínimo para confirmação
  soldSeats: number;          // Vagas vendidas até o momento
  pricePerSeat: number;       // Preço final calculado por ingresso (BRL)
  status: ExcursionStatus;
  organizerId: string;
  revenue: number;            // Faturamento acumulado (soldSeats * pricePerSeat)
};
```

---

## 2. Modelo de Rascunho e Precificação (`ExcursionDraft`)

Estrutura utilizada pelo wizard de criação de excursões (`apps/web/app/organizador/excursoes/nova/excursion-draft.ts`).

```typescript
export type ExcursionDraft = {
  step: number;               // Etapa atual (1 a 4)
  // Passo 1: Informações Gerais
  title: string;
  destination: string;
  summary: string;
  photos: string[];
  // Passo 2: Saídas
  departureDate: string;
  returnDate: string;
  capacity: number;
  minimumGroup: number;
  // Passo 3: Custos e Margem
  transportCost: number;      // Custo fixo de ônibus/van (BRL)
  guideCost: number;          // Custo fixo de guia/monitores (BRL)
  extraCost: number;          // Outros custos fixos (BRL)
  variableCostPerPerson: number; // Ingressos de atrações, lanches (BRL)
  desiredMargin: number;      // Lucro desejado pelo organizador (BRL)
  calculatedPrice: number;    // Preço sugerido por assento
};
```

### Regra de Cálculo de Preço:
$$\text{Preço Unitário} = \frac{\text{Custos Fixos Totais} + \text{Margem Total}}{\text{Mínimo de Passageiros}} + \text{Custo Variável por Pessoa}$$

---

## 3. Modelo de Repasses e Financeiro (`FinancialMetrics` & `PayoutSchedule`)

Estrutura financeira para gestão do organizador (`apps/web/app/organizador/financeiro/financial-dashboard-data.ts`).

```typescript
export type FinancialMetrics = {
  totalGrossSales: number;     // Faturamento bruto total
  receivableBalance: number;   // Saldo pendente a receber
  releasedPayouts: number;     // Valores já repassados e creditados
  retainedGuarantee: number;   // Valores retidos para o 2º repasse
};

export type PayoutSchedule = {
  payoutId: string;
  excursionId: string;
  stage: "first_payout" | "final_payout"; // 1º Repasse (Confirmação) vs 2º Repasse (Pós-viagem)
  amount: number;
  scheduledDate: string;
  status: "pending" | "processing" | "paid" | "retained";
  bankAccount: {
    bank: string;
    agency: string;
    account: string;
    pixKey?: string;
  };
};
```

---

## 4. Modelo de Documentos e Identificação (`BrazilianDocument`)

Validação e formatação tipada para pessoas físicas e jurídicas no Brasil (`apps/web/app/_auth/brazilian-document.ts`).

```typescript
export type BrazilianDocumentType = "cpf" | "cnpj";

export type BrazilianDocumentValidation = {
  isValid: boolean;
  type: BrazilianDocumentType | null;
  formatted: string;
  unmasked: string;
};
```
