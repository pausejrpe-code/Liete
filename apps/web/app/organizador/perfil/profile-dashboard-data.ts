import type { StatusChipIntent } from "@liete/ui-web";

export type OrganizerProfile = {
  account: string;
  accountHolder: string;
  address: string;
  bank: string;
  cancellationPolicy: string;
  city: string;
  description: string;
  email: string;
  emergencyContact: string;
  instagram: string;
  legalName: string;
  managerName: string;
  municipalRegistration: string;
  number: string;
  personType: "pj" | "pf";
  phone: string;
  pixKey: string;
  postalCode: string;
  publicName: string;
  state: string;
  supportHours: string;
  taxId: string;
  website: string;
  whatsapp: string;
};

export type OrganizerPreferenceKey =
  | "pendingExcursions"
  | "payouts"
  | "refunds"
  | "sales";

export type OrganizerPreferences = Record<OrganizerPreferenceKey, boolean>;

export type VerificationDocument = {
  complete: boolean;
  description: string;
  id: string;
  statusIntent: StatusChipIntent;
  statusLabel: string;
  title: string;
};

export const initialOrganizerProfile: OrganizerProfile = {
  account: "",
  accountHolder: "",
  address: "",
  bank: "",
  cancellationPolicy:
    "Cancelamentos solicitados em até 7 dias antes do embarque recebem reembolso integral. Após esse prazo, aplicam-se as taxas operacionais.",
  city: "",
  description: "",
  email: "",
  emergencyContact: "",
  instagram: "",
  legalName: "",
  managerName: "",
  municipalRegistration: "",
  number: "",
  personType: "pj",
  phone: "",
  pixKey: "",
  postalCode: "",
  publicName: "",
  state: "",
  supportHours: "Segunda a sexta, das 9h às 18h",
  taxId: "",
  website: "",
  whatsapp: ""
};

export const initialPreferences: OrganizerPreferences = {
  pendingExcursions: true,
  payouts: true,
  refunds: true,
  sales: true
};

export const initialDocuments: VerificationDocument[] = [
  {
    complete: false,
    description: "Documento oficial da pessoa responsável pela conta (RG ou CNH).",
    id: "identity",
    statusIntent: "pending",
    statusLabel: "Pendente",
    title: "Identidade do responsável"
  },
  {
    complete: false,
    description: "Comprovante de inscrição e situação cadastral do CNPJ.",
    id: "company",
    statusIntent: "pending",
    statusLabel: "Pendente",
    title: "Cartão CNPJ / Registro MEI"
  },
  {
    complete: false,
    description: "Comprovante de endereço emitido há no máximo 90 dias.",
    id: "address",
    statusIntent: "pending",
    statusLabel: "Pendente",
    title: "Comprovante de endereço"
  },
  {
    complete: false,
    description: "Titularidade da conta usada para os repasses.",
    id: "bank",
    statusIntent: "pending",
    statusLabel: "Pendente",
    title: "Dados bancários"
  }
];
