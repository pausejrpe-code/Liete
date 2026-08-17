"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  FlowStepper,
  Input,
  JourneyNavigation,
  Radio,
  Stepper,
  Tabs,
  ToastAlert,
  type FlowStepperStep
} from "@liete/ui-web";
import {
  formatTravelerCurrency,
  type TravelerExcursion
} from "../../_traveler/traveler-data";
import { TravelerShell } from "../../_traveler/traveler-shell";
import { withBasePath } from "../../../lib/site-path";
import { useAuth } from "../../../lib/auth-context";
import styles from "./checkout-flow.module.css";

type Participant = {
  birthDate: string;
  document: string;
  emergencyContact: string;
  fullName: string;
};

type PaymentMethod = "card" | "pix";
type AuthMode = "login" | "recover" | "register";

const steps: readonly FlowStepperStep[] = [
  { id: "seats", label: "Vagas" },
  { id: "participants", label: "Participantes" },
  { id: "account", label: "Identificação" },
  { id: "payment", label: "Pagamento" },
  { id: "review", label: "Revisão" }
];

export function CheckoutFlow({
  excursion,
  initialTravelers
}: {
  excursion: TravelerExcursion;
  initialTravelers: number;
}) {
  const { isAuthenticated, profile, user, refresh } = useAuth();

  const [step, setStep] = useState(1);
  const [travelers, setTravelers] = useState(initialTravelers);
  const [participants, setParticipants] = useState<Participant[]>([
    {
      birthDate: profile?.birth_date || "",
      document: profile?.document || "",
      emergencyContact: profile?.phone || "",
      fullName: profile?.full_name || ""
    }
  ]);
  const [participantError, setParticipantError] = useState("");
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [authError, setAuthError] = useState("");
  const [recoverySent, setRecoverySent] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [accountTermsAccepted, setAccountTermsAccepted] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const total = excursion.price * travelers;

  // Sync profile when loaded
  useEffect(() => {
    if (profile && participants.length > 0 && !participants[0].fullName) {
      setParticipants((current) => {
        const next = [...current];
        next[0] = {
          birthDate: profile.birth_date || next[0].birthDate,
          document: profile.document || next[0].document,
          emergencyContact: profile.phone || next[0].emergencyContact,
          fullName: profile.full_name || next[0].fullName
        };
        return next;
      });
    }
  }, [profile]);

  const updateTravelerCount = (value: number) => {
    setTravelers(value);
    setParticipants((current) =>
      Array.from({ length: value }, (_, index) => current[index] ?? {
        birthDate: "",
        document: "",
        emergencyContact: "",
        fullName: ""
      })
    );
  };

  useEffect(() => {
    const parsedTravelers = Number(
      new URLSearchParams(window.location.search).get("travelers") ??
        initialTravelers
    );
    if (Number.isFinite(parsedTravelers)) {
      updateTravelerCount(Math.min(5, Math.max(1, Math.round(parsedTravelers))));
    }
  }, [initialTravelers]);

  const updateParticipant = (
    index: number,
    key: keyof Participant,
    value: string
  ) => {
    setParticipants((current) => {
      const next = [...current];
      next[index] = { ...next[index]!, [key]: value };
      return next;
    });
    setParticipantError("");
  };

  const advance = async () => {
    if (step === 1) {
      setStep(2);
      return;
    }

    if (step === 2) {
      const missing = participants.some(
        (p) => !p.fullName.trim() || !p.document.trim()
      );
      if (missing) {
        setParticipantError("Preencha o nome e documento de todos os participantes.");
        return;
      }
      setStep(3);
      return;
    }

    if (step === 3) {
      if (authMode === "recover") {
        setRecoverySent(true);
        setAuthMode("login");
        return;
      }

      if (!isAuthenticated) {
        if (authMode === "login") {
          if (!loginEmail || !loginPassword) {
            setAuthError("Informe seu e-mail e senha para entrar.");
            return;
          }
          try {
            const res = await fetch(withBasePath("/api/auth/login"), {
              body: JSON.stringify({ email: loginEmail.trim().toLowerCase(), password: loginPassword, role: "traveler" }),
              headers: { "Content-Type": "application/json" },
              method: "POST"
            });
            if (!res.ok) {
              const d = await res.json();
              setAuthError(d.error || "Credenciais inválidas.");
              return;
            }
            await refresh();
          } catch {
            setAuthError("Erro de comunicação com o servidor.");
            return;
          }
        } else if (authMode === "register") {
          const finalName = registerName.trim() || participants[0]?.fullName?.trim();
          if (!loginEmail.trim() || !loginPassword.trim() || !finalName) {
            setAuthError("Preencha nome, e-mail e senha para criar sua conta.");
            return;
          }
          if (loginPassword.length < 8) {
            setAuthError("A senha deve ter no mínimo 8 caracteres.");
            return;
          }
          if (!accountTermsAccepted) {
            setAuthError("Aceite os Termos de Uso para continuar.");
            return;
          }
          try {
            const res = await fetch(withBasePath("/api/auth/register"), {
              body: JSON.stringify({
                email: loginEmail.trim().toLowerCase(),
                fullName: finalName,
                password: loginPassword,
                role: "traveler"
              }),
              headers: { "Content-Type": "application/json" },
              method: "POST"
            });
            if (!res.ok) {
              const d = await res.json();
              setAuthError(d.error || "Não foi possível criar a conta.");
              return;
            }
            await refresh();
          } catch {
            setAuthError("Erro ao criar conta no servidor.");
            return;
          }
        }
      }

      setStep(4);
      return;
    }

    if (step === 4) {
      setStep(5);
      return;
    }

    if (step === 5) {
      if (!termsAccepted || processing) return;
      setProcessing(true);
      setSubmitError("");
      try {
        const buyerEmail = profile?.email || user?.email || loginEmail || "cliente@liete.com.br";
        const buyerName = profile?.full_name || registerName || participants[0]?.fullName || "Viajante";

        const res = await fetch(withBasePath("/api/checkout/create-session"), {
          body: JSON.stringify({
            buyerEmail,
            buyerName,
            participants,
            paymentMethod,
            quantity: travelers,
            slug: excursion.slug
          }),
          headers: { "Content-Type": "application/json" },
          method: "POST"
        });

        const data = await res.json();
        if (!res.ok) {
          setSubmitError(data.error || "Não foi possível iniciar a sessão de pagamento.");
          setProcessing(false);
          return;
        }

        if (data.url) {
          window.location.href = data.url;
        } else {
          window.location.assign(
            withBasePath(`/checkout/${excursion.slug}/sucesso/?order_id=${data.orderId || "LIE-ORDER"}&voucher_code=${data.voucherCode || "LIE-VOUCHER"}`)
          );
        }
      } catch (err: any) {
        setSubmitError(err?.message || "Erro ao conectar com o gateway de pagamento.");
        setProcessing(false);
      }
      return;
    }
  };

  const goBack = () => {
    if (step === 1) {
      window.location.assign(withBasePath(`/excursoes/${excursion.slug}/`));
      return;
    }
    setStep((current) => Math.max(1, current - 1));
  };

  const primaryLabel =
    step === 5
      ? processing
        ? "Conectando à Stripe..."
        : "Ir para pagamento seguro na Stripe →"
      : "Continuar";

  const userEmail = profile?.email || user?.email || loginEmail;

  return (
    <TravelerShell compact>
      <div className={styles.checkoutPage}>
        <div className={styles.checkoutLayout}>
          {/* Coluna 1: Stepper Vertical Fixo à Esquerda */}
          <aside aria-label="Progresso da compra" className={styles.progressColumn}>
            <FlowStepper
              className={styles.stepper}
              current={step}
              layout="desktop"
              showHeader
              steps={steps}
              title="Finalizar reserva"
            />
          </aside>

          {/* Coluna 2: Formulário e Conteúdo da Etapa Ativa */}
          <section
            aria-labelledby={`checkout-step-${step}`}
            className={styles.stepCard}
          >
            {step === 1 ? (
              <div className={styles.stepContent}>
                <div className={styles.stepHeader}>
                  <span>Etapa 1</span>
                  <h1 id="checkout-step-1">Quantas vagas você quer reservar?</h1>
                  <p>Cada reserva inclui todos os benefícios informados no roteiro.</p>
                </div>
                <div className={styles.ticketSelector}>
                  <div>
                    <strong>Número de participantes</strong>
                    <span>Limite de até 5 ingressos por compra.</span>
                  </div>
                  <Stepper
                    aria-label="Quantidade de participantes"
                    label="Participantes"
                    max={5}
                    min={1}
                    onValueChange={updateTravelerCount}
                    value={travelers}
                  />
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div className={styles.stepContent}>
                <div className={styles.stepHeader}>
                  <span>Etapa 2</span>
                  <h1 id="checkout-step-2">Quem vai viajar com você?</h1>
                  <p>Esses dados são usados para a lista de presença e seguro da viagem.</p>
                </div>
                {participantError ? (
                  <ToastAlert
                    format="inline"
                    message={participantError}
                    title="Dados incompletos"
                    tone="error"
                  />
                ) : null}
                <div className={styles.participantsList}>
                  {participants.map((participant, index) => (
                    <fieldset className={styles.participantCard} key={index}>
                      <legend>Participante {index + 1}</legend>
                      <div className={styles.formGrid}>
                        <Input
                          className={styles.fullField}
                          hideHelperText
                          label="Nome completo"
                          onChange={(event) =>
                            updateParticipant(index, "fullName", event.currentTarget.value)
                          }
                          placeholder="Nome e sobrenome"
                          value={participant.fullName}
                        />
                        <Input
                          hideHelperText
                          label="CPF ou documento"
                          onChange={(event) =>
                            updateParticipant(index, "document", event.currentTarget.value)
                          }
                          placeholder="000.000.000-00"
                          value={participant.document}
                        />
                        <Input
                          hideHelperText
                          label="Data de nascimento"
                          onChange={(event) =>
                            updateParticipant(index, "birthDate", event.currentTarget.value)
                          }
                          placeholder="DD/MM/AAAA"
                          value={participant.birthDate}
                        />
                        <Input
                          className={styles.fullField}
                          hideHelperText
                          label="Contato de emergência"
                          onChange={(event) =>
                            updateParticipant(index, "emergencyContact", event.currentTarget.value)
                          }
                          placeholder="(DDD) 99999-9999"
                          value={participant.emergencyContact}
                        />
                      </div>
                    </fieldset>
                  ))}
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div className={styles.stepContent}>
                <div className={styles.stepHeader}>
                  <span>Etapa 3</span>
                  <h1 id="checkout-step-3">Identificação da conta</h1>
                  <p>Seus ingressos e comprovantes serão vinculados ao seu acesso.</p>
                </div>

                {isAuthenticated ? (
                  <ToastAlert
                    format="inline"
                    message={`Você está autenticado como ${userEmail || profile?.email || user?.email}.`}
                    title="Conta conectada"
                    tone="success"
                  />
                ) : (
                  <>
                    {authError ? (
                      <ToastAlert
                        format="inline"
                        message={authError}
                        title="Atenção"
                        tone="error"
                      />
                    ) : null}

                    {recoverySent ? (
                      <ToastAlert
                        format="inline"
                        message="Enviamos as instruções para o seu e-mail."
                        title="Recuperação solicitada"
                        tone="success"
                      />
                    ) : null}

                    <Tabs
                      items={[
                        { label: "Já tenho conta", value: "login" },
                        { label: "Criar conta", value: "register" }
                      ]}
                      label="Forma de acesso"
                      onValueChange={(value) => {
                        setAuthMode(value as AuthMode);
                        setAuthError("");
                      }}
                      value={authMode}
                      variant="pill"
                    />

                    {authMode === "login" ? (
                      <div className={styles.authForm}>
                        <Input
                          autoComplete="email"
                          hideHelperText
                          inputType="email"
                          label="E-mail"
                          onChange={(e) => {
                            setLoginEmail(e.currentTarget.value);
                            setAuthError("");
                          }}
                          placeholder="seu@email.com"
                          value={loginEmail}
                        />
                        <Input
                          autoComplete="current-password"
                          hideHelperText
                          inputType="password"
                          label="Senha"
                          onChange={(e) => {
                            setLoginPassword(e.currentTarget.value);
                            setAuthError("");
                          }}
                          placeholder="Sua senha"
                          value={loginPassword}
                        />
                        <Button
                          onClick={() =>
                            window.location.assign(
                              withBasePath(
                                `/recuperar-senha/?role=traveler&returnTo=${encodeURIComponent(`/checkout/${excursion.slug}/`)}`
                              )
                            )
                          }
                          size="sm"
                          variant="ghost"
                        >
                          Esqueci minha senha
                        </Button>
                      </div>
                    ) : null}

                    {authMode === "register" ? (
                      <div className={styles.authForm}>
                        <Input
                          hideHelperText
                          label="Nome completo"
                          onChange={(e) => {
                            setRegisterName(e.currentTarget.value);
                            setAuthError("");
                          }}
                          placeholder="Seu nome completo"
                          value={registerName || participants[0]?.fullName || ""}
                        />
                        <Input
                          hideHelperText
                          inputType="email"
                          label="E-mail"
                          onChange={(e) => {
                            setLoginEmail(e.currentTarget.value);
                            setAuthError("");
                          }}
                          placeholder="seu@email.com"
                          value={loginEmail}
                        />
                        <Input
                          helperText="Use ao menos 8 caracteres."
                          inputType="password"
                          label="Crie uma senha"
                          onChange={(e) => {
                            setLoginPassword(e.currentTarget.value);
                            setAuthError("");
                          }}
                          placeholder="Crie sua senha"
                          value={loginPassword}
                        />
                        <Checkbox
                          checked={accountTermsAccepted}
                          label="Li e aceito os Termos de Uso e a Política de Privacidade"
                          onChange={(event) =>
                            setAccountTermsAccepted(event.currentTarget.checked)
                          }
                        />
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            ) : null}

            {step === 4 ? (
              <div className={styles.stepContent}>
                <div className={styles.stepHeader}>
                  <span>Etapa 4</span>
                  <h1 id="checkout-step-4">Forma de Pagamento Segura</h1>
                  <p>Processamento certificado e antifraude oficial via Stripe.</p>
                </div>
                <fieldset className={styles.paymentOptions}>
                  <legend>Forma de pagamento</legend>
                  <Radio
                    checked={paymentMethod === "card"}
                    label="Cartão de Crédito (em até 12x), Pix ou Carteiras Digitais via Stripe"
                    name="payment"
                    onChange={() => setPaymentMethod("card")}
                  />
                  <Radio
                    checked={paymentMethod === "pix"}
                    label="Pix Direto com Confirmação Instantânea"
                    name="payment"
                    onChange={() => setPaymentMethod("pix")}
                  />
                </fieldset>

                <div style={{ marginTop: "1rem" }}>
                  <ToastAlert
                    format="inline"
                    message="Seus dados de pagamento são criptografados com padrão bancário PCI-DSS Nível 1. A Liete Turismo não armazena dados do seu cartão."
                    title="Segurança Garantida"
                    tone="success"
                  />
                </div>
              </div>
            ) : null}

            {step === 5 ? (
              <div className={styles.stepContent}>
                <div className={styles.stepHeader}>
                  <span>Etapa 5</span>
                  <h1 id="checkout-step-5">Revise sua compra</h1>
                  <p>Confirme os dados antes de ir para o pagamento.</p>
                </div>
                {submitError ? (
                  <ToastAlert
                    format="inline"
                    message={submitError}
                    title="Erro ao iniciar pagamento"
                    tone="error"
                  />
                ) : null}
                <div className={styles.reviewSections}>
                  <section>
                    <div>
                      <h2>Participantes</h2>
                      <Button onClick={() => setStep(2)} size="sm" variant="ghost">
                        Editar
                      </Button>
                    </div>
                    <ul>
                      {participants.map((participant, index) => (
                        <li key={index}>
                          {participant.fullName} • {participant.document}
                        </li>
                      ))}
                    </ul>
                  </section>
                  <section>
                    <div>
                      <h2>Acesso e pagamento</h2>
                      <Button onClick={() => setStep(4)} size="sm" variant="ghost">
                        Editar
                      </Button>
                    </div>
                    <p>
                      {userEmail || profile?.email || user?.email || "Viajante"} •{" "}
                      {paymentMethod === "pix" ? "Pix" : "Cartão / Stripe Checkout"}
                    </p>
                  </section>
                </div>
                <Checkbox
                  checked={termsAccepted}
                  label="Confirmo os dados e aceito a política de cancelamento da excursão"
                  onChange={(event) => setTermsAccepted(event.currentTarget.checked)}
                />
              </div>
            ) : null}

            <JourneyNavigation
              backLabel={step === 1 ? "Voltar à excursão" : "Voltar"}
              className={styles.navigation}
              onBack={goBack}
              onPrimaryAction={advance}
              primaryDisabled={
                (step === 3 && !isAuthenticated && authMode === "register" && !accountTermsAccepted) ||
                (step === 5 && !termsAccepted)
              }
              primaryLabel={primaryLabel}
              sticky
            />
          </section>

          {/* Coluna 3: Card de Resumo Fixo à Direita */}
          <aside aria-label="Resumo da compra" className={styles.summaryCard}>
            <img alt="" src={withBasePath(excursion.image)} />
            <div className={styles.summaryContent}>
              <span>
                {excursion.date} • {excursion.durationLabel}
              </span>
              <h2>{excursion.title}</h2>
              <p>Saída de {excursion.departureCity}</p>
              <dl>
                <div>
                  <dt>
                    {travelers} ingresso{travelers > 1 ? "s" : ""}
                  </dt>
                  <dd>{formatTravelerCurrency(total)}</dd>
                </div>
                <div>
                  <dt>Taxas</dt>
                  <dd>Incluídas</dd>
                </div>
                <div className={styles.summaryTotal}>
                  <dt>Total</dt>
                  <dd>{formatTravelerCurrency(total)}</dd>
                </div>
              </dl>
              <small>Ambiente de pagamento seguro SSL</small>
            </div>
          </aside>
        </div>
      </div>
    </TravelerShell>
  );
}
