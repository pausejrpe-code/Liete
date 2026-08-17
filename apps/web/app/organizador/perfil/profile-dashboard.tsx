"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import {
  Avatar,
  Button,
  Checkbox,
  GoalProgress,
  Input,
  OrganizerAppShell,
  Select,
  StatusChip,
  Textarea,
  ToastAlert
} from "@liete/ui-web";
import { withBasePath } from "../../../lib/site-path";
import { organizerSidebarItemHrefs } from "../organizer-navigation";
import {
  initialDocuments,
  initialOrganizerProfile,
  initialPreferences,
  type OrganizerPreferenceKey,
  type OrganizerProfile,
  type VerificationDocument
} from "./profile-dashboard-data";
import styles from "./profile-dashboard.module.css";

function ProfileSection({
  children,
  description,
  id,
  title
}: {
  children: ReactNode;
  description: string;
  id: string;
  title: string;
}) {
  const titleId = `${id}-title`;

  return (
    <section aria-labelledby={titleId} className={styles.sectionCard} id={id}>
      <div className={styles.sectionHeader}>
        <h2 id={titleId}>{title}</h2>
        <p>{description}</p>
      </div>
      {children}
    </section>
  );
}

function DocumentCard({
  document,
  onSimulateUpload
}: {
  document: VerificationDocument;
  onSimulateUpload: (id: string) => void;
}) {
  return (
    <article className={styles.documentCard}>
      <div className={styles.documentHeader}>
        <div>
          <h3>{document.title}</h3>
          <p>{document.description}</p>
        </div>
        <StatusChip
          intent={document.statusIntent}
          label={document.statusLabel}
        />
      </div>
      {!document.complete && document.id !== "bank" ? (
        <Button
          onClick={() => onSimulateUpload(document.id)}
          size="sm"
          variant="ghost"
        >
          Enviar documento
        </Button>
      ) : null}
    </article>
  );
}

export function ProfileDashboard() {
  const [profile, setProfile] = useState<OrganizerProfile>(initialOrganizerProfile);
  const [preferences, setPreferences] = useState(initialPreferences);
  const [documents, setDocuments] = useState(initialDocuments);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stripeStatus, setStripeStatus] = useState<{
    chargesEnabled: boolean;
    connected: boolean;
    dashboardUrl: string | null;
    onboardingCompleted: boolean;
    payoutsEnabled: boolean;
  }>({
    chargesEnabled: false,
    connected: false,
    dashboardUrl: null,
    onboardingCompleted: false,
    payoutsEnabled: false
  });
  const [connectingStripe, setConnectingStripe] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [profileRes, stripeRes] = await Promise.all([
          fetch(withBasePath("/api/organizer/profile")),
          fetch(withBasePath("/api/organizer/stripe/status"))
        ]);

        if (profileRes.ok) {
          const { organizer } = await profileRes.json();
          if (organizer) {
            const addr = (organizer.address as any) || {};
            setProfile((current) => ({
              ...current,
              account: organizer.bank_account?.account || "",
              accountHolder: organizer.business_name || "",
              address: addr.address || "",
              bank: organizer.bank_account?.bank || "",
              city: addr.city || "",
              description: organizer.bio || "",
              email: organizer.email || current.email,
              instagram: organizer.instagram || "",
              legalName: organizer.business_name || "",
              number: addr.number || "",
              personType: organizer.legal_type === "pj" ? "pj" : "pf",
              phone: organizer.phone || "",
              pixKey: organizer.bank_account?.pixKey || "",
              postalCode: addr.postalCode || "",
              publicName: organizer.trade_name || organizer.business_name || "",
              state: addr.state || "",
              taxId: organizer.document_number || "",
              website: organizer.website || ""
            }));
          }
        }

        if (stripeRes.ok) {
          const status = await stripeRes.json();
          setStripeStatus(status);
        }
      } catch {
        // Fallback to initial state
      }
    }

    loadData();
  }, []);

  const markChanged = () => {
    setDirty(true);
    setSaved(false);
  };

  const updateField = <Key extends keyof OrganizerProfile>(
    key: Key,
    value: OrganizerProfile[Key]
  ) => {
    setProfile((current) => ({ ...current, [key]: value }));
    markChanged();
  };

  const updatePreference = (
    key: OrganizerPreferenceKey,
    checked: boolean
  ) => {
    setPreferences((current) => ({ ...current, [key]: checked }));
    markChanged();
  };

  const saveProfile = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(withBasePath("/api/organizer/profile"), {
        body: JSON.stringify({
          address: {
            address: profile.address,
            city: profile.city,
            number: profile.number,
            postalCode: profile.postalCode,
            state: profile.state
          },
          bankAccount: {
            account: profile.account,
            bank: profile.bank,
            pixKey: profile.pixKey
          },
          bio: profile.description,
          businessName: profile.legalName || profile.publicName,
          documentNumber: profile.taxId,
          instagram: profile.instagram,
          legalType: profile.personType,
          phone: profile.phone,
          tradeName: profile.publicName,
          website: profile.website
        }),
        headers: { "Content-Type": "application/json" },
        method: "PUT"
      });

      if (res.ok) {
        setDirty(false);
        setSaved(true);
      }
    } catch {
      // Error handling
    } finally {
      setLoading(false);
    }
  };

  const handleConnectStripe = async () => {
    setConnectingStripe(true);
    try {
      const res = await fetch(withBasePath("/api/organizer/stripe/connect"), {
        method: "POST"
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setConnectingStripe(false);
    }
  };

  const resetProfile = () => {
    setProfile(initialOrganizerProfile);
    setPreferences(initialPreferences);
    setDocuments(initialDocuments);
    setDirty(false);
    setSaved(false);
  };

  const simulateDocumentUpload = async (documentId: string) => {
    try {
      const formData = new FormData();
      formData.append("documentType", documentId);

      await fetch(withBasePath("/api/organizer/documents"), {
        body: formData,
        method: "POST"
      });

      setDocuments((current) =>
        current.map((document) =>
          document.id === documentId
            ? {
                ...document,
                complete: true,
                statusIntent: "available",
                statusLabel: "Em análise"
              }
            : document
        )
      );
      markChanged();
    } catch {
      // Fallback
    }
  };

  return (
    <div className={styles.page}>
      <OrganizerAppShell
        accountHref={organizerSidebarItemHrefs.account}
        accountInitials="RS"
        accountName={profile.publicName || "Organizador"}
        activeSidebarItemId="account"
        className={styles.shell}
        contentLabel="Gerenciamento do perfil"
        navigation="collapsed"
        pageHeaderProps={{
          onPrimaryAction: () => saveProfile(),
          primaryActionLabel: loading ? "Salvando..." : "Salvar alterações",
          showBack: false,
          showSecondaryAction: false,
          subtitle: "Atualize os dados públicos, fiscais, bancários e de acesso da sua conta.",
          title: "Perfil do parceiro"
        }}
      >
        <div className={styles.content}>
          <div className={styles.heroSection}>
            <div className={styles.heroSummary}>
              <Avatar
                initials="RS"
                name={profile.publicName}
                size="lg"
                verified={stripeStatus.onboardingCompleted}
              />
              <div className={styles.heroCopy}>
                <span>{profile.personType === "pj" ? "Pessoa jurídica" : "Pessoa física"}</span>
                <h1>{profile.publicName}</h1>
                <p>{profile.legalName} • {profile.taxId}</p>
              </div>
            </div>

            <div className={styles.statusPanel}>
              <div className={styles.statusHeader}>
                <strong>Status da conta</strong>
                <StatusChip
                  intent={stripeStatus.onboardingCompleted ? "verified" : "available"}
                  label={stripeStatus.onboardingCompleted ? "Verificada" : "Em configuração"}
                />
              </div>
              <p className={styles.statusMuted}>
                {stripeStatus.onboardingCompleted
                  ? "Sua conta está aprovada e habilitada para publicar e receber repasses."
                  : "Complete a conexão com a Stripe para habilitar repasses automáticos."}
              </p>
              <GoalProgress current={stripeStatus.onboardingCompleted ? 4 : 2} total={4} />
            </div>
          </div>

          {saved ? (
            <ToastAlert
              format="inline"
              message="As alterações no perfil foram salvas com sucesso no banco de dados."
              title="Perfil atualizado"
              tone="success"
            />
          ) : null}

          <form className={styles.formLayout} onSubmit={saveProfile}>
            <ProfileSection
              description="Informações visíveis na página das suas excursões e no material de divulgação."
              id="public-profile"
              title="Apresentação pública"
            >
              <div className={styles.fieldsGrid}>
                <Input
                  className={styles.fullWidth}
                  hideHelperText
                  label="Nome da agência ou marca"
                  onChange={(event) =>
                    updateField("publicName", event.currentTarget.value)
                  }
                  value={profile.publicName}
                />
                <Textarea
                  className={styles.fullWidth}
                  helperText="Até 240 caracteres sobre a proposta da sua operação."
                  label="Biografia ou resumo institucional"
                  maxLength={240}
                  onChange={(event) =>
                    updateField("description", event.currentTarget.value)
                  }
                  rows={3}
                  value={profile.description}
                />
                <Input
                  hideHelperText
                  label="Instagram"
                  onChange={(event) =>
                    updateField("instagram", event.currentTarget.value)
                  }
                  value={profile.instagram}
                />
                <Input
                  hideHelperText
                  label="Site institucional"
                  onChange={(event) =>
                    updateField("website", event.currentTarget.value)
                  }
                  value={profile.website}
                />
              </div>
            </ProfileSection>

            <ProfileSection
              description="Habilite o processamento seguro de pagamentos e repasses bancários automáticos."
              id="stripe-connect"
              title="Stripe Connect & Repasses"
            >
              <div className={styles.sectionStatus}>
                <StatusChip
                  intent={stripeStatus.chargesEnabled ? "verified" : "pending"}
                  label={stripeStatus.chargesEnabled ? "Stripe Ativa" : "Pendente"}
                />
                <span>
                  {stripeStatus.chargesEnabled
                    ? "Sua conta Stripe Express está conectada e apta a receber pagamentos."
                    : "Conecte sua conta para receber repasses das vendas de excursões."}
                </span>
              </div>
              <div style={{ marginTop: "1rem" }}>
                {stripeStatus.dashboardUrl ? (
                  <Button
                    onClick={() => window.open(stripeStatus.dashboardUrl!, "_blank")}
                    size="md"
                    type="button"
                    variant="secondary"
                  >
                    Abrir Painel Stripe Express ↗
                  </Button>
                ) : (
                  <Button
                    disabled={connectingStripe}
                    onClick={handleConnectStripe}
                    size="md"
                    type="button"
                  >
                    {connectingStripe ? "Conectando..." : "Conectar conta Stripe para recebimentos"}
                  </Button>
                )}
              </div>
            </ProfileSection>

            <ProfileSection
              description="Dados usados na emissão fiscal e na conferência de titularidade."
              id="legal-info"
              title="Dados cadastrais e fiscais"
            >
              <div className={styles.fieldsGrid}>
                <Select
                  hideHelperText
                  label="Tipo de cadastro"
                  onChange={(event) =>
                    updateField("personType", event.currentTarget.value as any)
                  }
                  value={profile.personType}
                >
                  <option value="pf">Pessoa física (PF)</option>
                  <option value="pj">Pessoa jurídica (PJ)</option>
                </Select>
                <Input
                  hideHelperText
                  label={profile.personType === "pj" ? "Razão social" : "Nome civil completo"}
                  onChange={(event) =>
                    updateField("legalName", event.currentTarget.value)
                  }
                  value={profile.legalName}
                />
                <Input
                  hideHelperText
                  label={profile.personType === "pj" ? "CNPJ" : "CPF"}
                  onChange={(event) =>
                    updateField("taxId", event.currentTarget.value)
                  }
                  value={profile.taxId}
                />
                <Input
                  hideHelperText
                  label="CEP"
                  onChange={(event) =>
                    updateField("postalCode", event.currentTarget.value)
                  }
                  value={profile.postalCode}
                />
                <Input
                  className={styles.fullWidth}
                  hideHelperText
                  label="Logradouro"
                  onChange={(event) =>
                    updateField("address", event.currentTarget.value)
                  }
                  value={profile.address}
                />
                <Input
                  hideHelperText
                  label="Número"
                  onChange={(event) =>
                    updateField("number", event.currentTarget.value)
                  }
                  value={profile.number}
                />
                <Input
                  hideHelperText
                  kind="location"
                  label="Cidade"
                  onChange={(event) =>
                    updateField("city", event.currentTarget.value)
                  }
                  value={profile.city}
                />
                <Select
                  hideHelperText
                  label="Estado"
                  onChange={(event) =>
                    updateField("state", event.currentTarget.value)
                  }
                  value={profile.state}
                >
                  <option value="MG">Minas Gerais</option>
                  <option value="PR">Paraná</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="SC">Santa Catarina</option>
                  <option value="SP">São Paulo</option>
                </Select>
              </div>
            </ProfileSection>

            <ProfileSection
              description="Canais usados pela plataforma e pelos viajantes quando necessário."
              id="contact"
              title="Contato e suporte"
            >
              <div className={styles.fieldsGrid}>
                <Input
                  hideHelperText
                  label="Responsável pela conta"
                  onChange={(event) =>
                    updateField("managerName", event.currentTarget.value)
                  }
                  value={profile.managerName}
                />
                <Input
                  autoComplete="email"
                  hideHelperText
                  inputMode="email"
                  label="E-mail"
                  onChange={(event) =>
                    updateField("email", event.currentTarget.value)
                  }
                  value={profile.email}
                />
                <Input
                  hideHelperText
                  inputMode="tel"
                  label="Telefone comercial"
                  onChange={(event) =>
                    updateField("phone", event.currentTarget.value)
                  }
                  value={profile.phone}
                />
                <Input
                  hideHelperText
                  inputMode="tel"
                  label="WhatsApp de atendimento"
                  onChange={(event) =>
                    updateField("whatsapp", event.currentTarget.value)
                  }
                  value={profile.whatsapp}
                />
              </div>
            </ProfileSection>

            <ProfileSection
              description="Conta de titularidade do organizador usada para receber pagamentos."
              id="payouts"
              title="Dados bancários para repasse"
            >
              <div className={styles.fieldsGrid}>
                <Input
                  hideHelperText
                  label="Titular da conta"
                  onChange={(event) =>
                    updateField("accountHolder", event.currentTarget.value)
                  }
                  value={profile.accountHolder}
                />
                <Input
                  hideHelperText
                  label="Instituição financeira / Banco"
                  onChange={(event) =>
                    updateField("bank", event.currentTarget.value)
                  }
                  value={profile.bank}
                />
                <Input
                  hideHelperText
                  label="Chave Pix"
                  onChange={(event) =>
                    updateField("pixKey", event.currentTarget.value)
                  }
                  value={profile.pixKey}
                />
                <Input
                  hideHelperText
                  label="Agência e conta"
                  onChange={(event) =>
                    updateField("account", event.currentTarget.value)
                  }
                  value={profile.account}
                />
              </div>
            </ProfileSection>

            <ProfileSection
              description="Acompanhe os comprovantes de regularidade da sua conta."
              id="documents"
              title="Documentos e verificação"
            >
              <div className={styles.documentsGrid}>
                {documents.map((document) => (
                  <DocumentCard
                    document={document}
                    key={document.id}
                    onSimulateUpload={simulateDocumentUpload}
                  />
                ))}
              </div>
            </ProfileSection>

            <div className={styles.actions}>
              <p aria-live="polite">
                {dirty ? "Você tem alterações ainda não salvas." : "Todas as alterações estão salvas."}
              </p>
              <div>
                <Button
                  disabled={!dirty || loading}
                  onClick={resetProfile}
                  size="md"
                  type="button"
                  variant="ghost"
                >
                  Descartar alterações
                </Button>
                <Button disabled={!dirty || loading} size="md" type="submit">
                  {loading ? "Salvando..." : "Salvar alterações"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </OrganizerAppShell>
    </div>
  );
}
