"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  FlowStepper,
  Input,
  JourneyNavigation,
  Select,
  StatusChip,
  Tabs,
  ToastAlert,
  type FlowStepperStep
} from "@liete/ui-web";
import { withBasePath } from "../../lib/site-path";
import { AuthShell } from "./auth-shell";
import {
  formatBrazilianDocument,
  isCompleteBrazilianDocument,
  type LegalType
} from "./brazilian-document";
import styles from "./auth-experience.module.css";

type AccountRole = "organizer" | "traveler";

const roleItems = [
  { label: "Aventureiro", value: "traveler" },
  { label: "Organizador", value: "organizer" }
];

const onboardingSteps: readonly FlowStepperStep[] = [
  { id: "profile", label: "Perfil" },
  { id: "documents", label: "Endereço e fiscal" },
  { id: "payments", label: "Recebimentos" },
  { id: "review", label: "Revisão" }
];

function navigate(path: string) {
  window.location.assign(withBasePath(path));
}

function isSafeInternalPath(value: string) {
  return value.startsWith("/") && !value.startsWith("//");
}

export function LoginExperience() {
  const [role, setRole] = useState<AccountRole>("traveler");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [returnTo, setReturnTo] = useState("");

  useEffect(() => {
    const next = new URLSearchParams(window.location.search).get("returnTo") ?? "";
    setReturnTo(isSafeInternalPath(next) ? next : "");
  }, []);

  const changeRole = (value: string) => {
    const nextRole = value as AccountRole;
    setRole(nextRole);
    setError("");
  };

  const submit = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password.trim()) {
      setError("Informe e-mail e senha para continuar.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(withBasePath("/api/auth/login"), {
        body: JSON.stringify({ email: normalizedEmail, password, role }),
        headers: { "Content-Type": "application/json" },
        method: "POST"
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Não foi possível realizar login.");
        setLoading(false);
        return;
      }

      navigate(role === "organizer" ? "/organizador/" : returnTo || "/minhas-excursoes/");
    } catch {
      setError("Erro de conexão ao servidor.");
      setLoading(false);
    }
  };

  return (
    <AuthShell
      asideDescription="Aventureiros acompanham reservas. Organizadores gerenciam excursões, vendas e recebimentos."
      asideTitle="O acesso certo para cada objetivo"
      description="O mesmo e-mail pertence a apenas um tipo de conta. Escolha como você se cadastrou."
      eyebrow="Boas-vindas"
      title="Entre na sua conta"
    >
      <div className={styles.stack}>
        <Tabs items={roleItems} label="Tipo de acesso" onValueChange={changeRole} value={role} variant="pill" />
        {error ? <ToastAlert format="inline" message={error} title="Não foi possível entrar" tone="error" /> : null}
        <Input autoComplete="email" errorMessage={error && !email.trim() ? "Informe seu e-mail." : undefined} hideHelperText={!error} inputType="email" label="E-mail" onChange={(event) => { setEmail(event.currentTarget.value); setError(""); }} placeholder="seu@email.com" value={email} />
        <Input autoComplete="current-password" errorMessage={error && !password.trim() ? "Informe sua senha." : undefined} helperText="Mínimo de 8 caracteres." inputType="password" label="Senha" onChange={(event) => { setPassword(event.currentTarget.value); setError(""); }} placeholder="Sua senha" value={password} />
        <a className={styles.textLink} href={withBasePath(`/recuperar-senha/?role=${role}`)}>Esqueci minha senha</a>
        <Button className={styles.fullButton} disabled={loading} onClick={submit} size="lg">
          {loading ? "Entrando..." : "Entrar"}
        </Button>
        <p className={styles.switchCopy}>Ainda não tem conta? <a href={withBasePath("/cadastro/")}>Cadastre-se</a></p>
      </div>
    </AuthShell>
  );
}

export function ProfileChoiceExperience() {
  const [role, setRole] = useState<AccountRole>("traveler");
  return (
    <AuthShell
      asideDescription="Cada tipo de conta possui dados, permissões e uma área própria. Um mesmo e-mail não pode ocupar os dois perfis."
      asideTitle="Viajar ou organizar: você escolhe o caminho"
      description="Essa escolha define sua área e não poderá ser alterada usando o mesmo e-mail."
      eyebrow="Criar conta"
      title="Como você quer usar a Liete?"
    >
      <div className={styles.stack}>
        <div className={styles.roleGrid} role="group" aria-label="Escolha do tipo de conta">
          <button aria-pressed={role === "traveler"} className={styles.roleCard} data-selected={role === "traveler" || undefined} onClick={() => setRole("traveler")} type="button">
            <span aria-hidden="true">🧭</span><strong>Quero viajar</strong><small>Encontrar excursões, comprar ingressos e acompanhar reservas.</small>
          </button>
          <button aria-pressed={role === "organizer"} className={styles.roleCard} data-selected={role === "organizer" || undefined} onClick={() => setRole("organizer")} type="button">
            <span aria-hidden="true">🚌</span><strong>Quero organizar excursões</strong><small>Criar roteiros, vender ingressos e acompanhar o financeiro.</small>
          </button>
        </div>
        <ToastAlert format="inline" message="Por segurança e clareza, cada e-mail pode ser usado em apenas um tipo de conta." title="Perfis separados" tone="info" />
        <Button className={styles.fullButton} onClick={() => navigate(`/cadastro/${role === "traveler" ? "aventureiro" : "organizador"}/`)} size="lg">Continuar</Button>
        <p className={styles.switchCopy}>Já possui uma conta? <a href={withBasePath("/entrar/")}>Entrar</a></p>
      </div>
    </AuthShell>
  );
}

export function TravelerRegistrationExperience() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (![name, email, password, confirmation].every((value) => value.trim())) {
      setError("Preencha todos os dados obrigatórios.");
      return;
    }
    if (password.length < 8 || password !== confirmation) {
      setError("Use uma senha de ao menos 8 caracteres e repita a mesma senha.");
      return;
    }
    if (!accepted) {
      setError("Aceite os Termos de Uso e a Política de Privacidade para continuar.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(withBasePath("/api/auth/register"), {
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          fullName: name.trim(),
          password,
          role: "traveler"
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST"
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Não foi possível criar a conta.");
        setLoading(false);
        return;
      }

      navigate("/minhas-excursoes/");
    } catch {
      setError("Erro de comunicação com o servidor.");
      setLoading(false);
    }
  };

  return (
    <AuthShell description="Crie seu acesso agora. Os dados dos participantes são informados somente quando você reservar." eyebrow="Conta de aventureiro" title="Prepare-se para sua próxima viagem">
      <div className={styles.stack}>
        {error ? <ToastAlert format="inline" message={error} title="Revise o cadastro" tone="error" /> : null}
        <Input autoComplete="name" hideHelperText label="Nome completo" onChange={(event) => { setName(event.currentTarget.value); setError(""); }} value={name} />
        <Input autoComplete="email" hideHelperText inputType="email" label="E-mail" onChange={(event) => { setEmail(event.currentTarget.value); setError(""); }} value={email} />
        <div className={styles.twoColumns}>
          <Input autoComplete="new-password" helperText="Use ao menos 8 caracteres." inputType="password" label="Crie uma senha" onChange={(event) => { setPassword(event.currentTarget.value); setError(""); }} value={password} />
          <Input autoComplete="new-password" hideHelperText inputType="password" label="Repita a senha" onChange={(event) => { setConfirmation(event.currentTarget.value); setError(""); }} value={confirmation} />
        </div>
        <Checkbox checked={accepted} label="Li e aceito os Termos de Uso e a Política de Privacidade" onChange={(event) => { setAccepted(event.currentTarget.checked); setError(""); }} />
        <Button className={styles.fullButton} disabled={loading} onClick={submit} size="lg">
          {loading ? "Criando conta..." : "Criar conta de aventureiro"}
        </Button>
        <a className={styles.backLink} href={withBasePath("/cadastro/")}>← Escolher outro tipo de conta</a>
      </div>
    </AuthShell>
  );
}

export function OrganizerRegistrationExperience() {
  const [legalType, setLegalType] = useState<LegalType>("person");
  const [document, setDocument] = useState("");
  const [documentError, setDocumentError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (![name, document, email, password, confirmation].every((value) => value.trim())) {
      setError("Preencha todos os dados obrigatórios.");
      if (!document.trim()) {
        setDocumentError(`Informe o ${legalType === "person" ? "CPF" : "CNPJ"}.`);
      }
      return;
    }
    if (!isCompleteBrazilianDocument(document, legalType)) {
      setDocumentError(
        `Informe um ${legalType === "person" ? "CPF" : "CNPJ"} completo.`
      );
      setError("Revise o documento informado.");
      return;
    }
    if (password.length < 8 || password !== confirmation) {
      setError("Use uma senha de ao menos 8 caracteres e repita a mesma senha.");
      return;
    }
    if (!accepted) {
      setError("Aceite os Termos de Uso e a Política de Privacidade para continuar.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(withBasePath("/api/auth/register"), {
        body: JSON.stringify({
          businessName: name.trim(),
          document,
          email: email.trim().toLowerCase(),
          fullName: name.trim(),
          legalType: legalType === "company" ? "pj" : "pf",
          password,
          role: "organizer"
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST"
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Não foi possível criar a conta.");
        setLoading(false);
        return;
      }

      navigate("/organizador/onboarding/");
    } catch {
      setError("Erro de comunicação com o servidor.");
      setLoading(false);
    }
  };

  return (
    <AuthShell
      asideDescription="Você poderá explorar o painel e criar rascunhos imediatamente. A identidade será validada somente quando você solicitar a primeira publicação."
      asideTitle="Transforme bons roteiros em experiências rentáveis"
      description="Escolha o tipo de conta e informe os dados essenciais, incluindo CPF ou CNPJ."
      eyebrow="Conta de organizador"
      title="Crie seu acesso profissional"
    >
      <div className={styles.stack}>
        <Tabs items={[{ label: "Pessoa física", value: "person" }, { label: "Pessoa jurídica", value: "company" }]} label="Tipo de organizador" onValueChange={(value) => { setLegalType(value as LegalType); setDocument(""); setDocumentError(""); setError(""); }} value={legalType} variant="pill" />
        {error ? <ToastAlert format="inline" message={error} title="Revise o cadastro" tone="error" /> : null}
        <Input autoComplete="name" hideHelperText label={legalType === "person" ? "Nome completo" : "Nome do responsável"} onChange={(event) => { setName(event.currentTarget.value); setError(""); }} value={name} />
        <Input
          errorMessage={documentError || undefined}
          helperText="O documento será validado somente antes da primeira publicação."
          inputMode="numeric"
          label={legalType === "person" ? "CPF" : "CNPJ"}
          maxLength={legalType === "person" ? 14 : 18}
          onChange={(event) => {
            setDocument(formatBrazilianDocument(event.currentTarget.value, legalType));
            setDocumentError("");
            setError("");
          }}
          placeholder={legalType === "person" ? "000.000.000-00" : "00.000.000/0000-00"}
          value={document}
        />
        <Input autoComplete="email" hideHelperText inputType="email" label="E-mail profissional" onChange={(event) => { setEmail(event.currentTarget.value); setError(""); }} value={email} />
        <div className={styles.twoColumns}>
          <Input autoComplete="new-password" helperText="Use ao menos 8 caracteres." inputType="password" label="Crie uma senha" onChange={(event) => { setPassword(event.currentTarget.value); setError(""); }} value={password} />
          <Input autoComplete="new-password" hideHelperText inputType="password" label="Repita a senha" onChange={(event) => { setConfirmation(event.currentTarget.value); setError(""); }} value={confirmation} />
        </div>
        <Checkbox checked={accepted} label="Li e aceito os Termos de Uso e a Política de Privacidade" onChange={(event) => { setAccepted(event.currentTarget.checked); setError(""); }} />
        <Button className={styles.fullButton} disabled={loading} onClick={submit} size="lg">
          {loading ? "Criando conta..." : "Criar conta de organizador"}
        </Button>
        <a className={styles.backLink} href={withBasePath("/cadastro/")}>← Escolher outro tipo de conta</a>
      </div>
    </AuthShell>
  );
}

export function RecoveryExperience() {
  const [role, setRole] = useState<AccountRole>("traveler");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const queryRole = new URLSearchParams(window.location.search).get("role");
    if (queryRole === "organizer") setRole("organizer");
  }, []);

  const submit = async () => {
    if (!email.trim()) { setError("Informe o e-mail usado no cadastro."); return; }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(withBasePath("/api/auth/recover"), {
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
        headers: { "Content-Type": "application/json" },
        method: "POST"
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Não foi possível solicitar recuperação.");
        setLoading(false);
        return;
      }

      setSent(true);
      setLoading(false);
    } catch {
      setError("Erro ao enviar solicitação.");
      setLoading(false);
    }
  };

  return (
    <AuthShell description="Enviaremos instruções para o e-mail vinculado ao tipo de conta escolhido." eyebrow="Recuperar acesso" title="Esqueceu sua senha?">
      <div className={styles.stack}>
        {sent ? (
          <>
            <ToastAlert format="inline" message={`As instruções de recuperação foram enviadas para ${email}.`} title="Confira seu e-mail" tone="success" />
            <Button className={styles.fullButton} onClick={() => navigate("/entrar/")} size="lg">Voltar para o login</Button>
          </>
        ) : (
          <>
            <Tabs items={roleItems} label="Tipo de conta" onValueChange={(value) => { setRole(value as AccountRole); setError(""); }} value={role} variant="pill" />
            {error ? <ToastAlert format="inline" message={error} title="Não foi possível continuar" tone="error" /> : null}
            <Input autoComplete="email" hideHelperText inputType="email" label="E-mail da conta" onChange={(event) => { setEmail(event.currentTarget.value); setError(""); }} value={email} />
            <Button className={styles.fullButton} disabled={loading} onClick={submit} size="lg">
              {loading ? "Enviando..." : "Enviar instruções"}
            </Button>
            <a className={styles.backLink} href={withBasePath("/entrar/")}>← Voltar para o login</a>
          </>
        )}
      </div>
    </AuthShell>
  );
}

export function EmailVerificationExperience() {
  const [role, setRole] = useState<AccountRole>("traveler");
  const [legalType, setLegalType] = useState<LegalType>("person");
  const [email, setEmail] = useState("seu e-mail");
  const [verified, setVerified] = useState(false);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("role") === "organizer") setRole("organizer");
    if (query.get("type") === "company") setLegalType("company");
    setEmail(query.get("email") || "seu e-mail");
  }, []);

  const continuePath = role === "organizer" ? `/organizador/onboarding/?type=${legalType}` : "/minhas-excursoes/";
  const laterPath = role === "organizer" ? "/organizador/" : "/excursoes/";

  return (
    <AuthShell description="A confirmação protege o acesso à sua conta. A validação de identidade é uma etapa separada, solicitada antes da primeira publicação." eyebrow="Verificação de segurança" title={verified ? "E-mail verificado" : "Confirme seu e-mail"}>
      <div className={styles.stack}>
        <div className={styles.emailIcon} aria-hidden="true">✉</div>
        {verified ? (
          <ToastAlert format="inline" message="Sua conta está verificada e pronta para continuar." title="Verificação concluída" tone="success" />
        ) : (
          <>
            <p className={styles.centerCopy}>Enviamos um link para <strong>{email}</strong>.</p>
            {resent ? <ToastAlert format="inline" message="Um novo link foi enviado." title="E-mail reenviado" tone="info" /> : null}
            <ToastAlert format="inline" message={role === "organizer" ? "Você já pode explorar o painel e criar rascunhos. A identidade será solicitada somente quando você tentar publicar." : "Você pode continuar explorando. A confirmação será exigida antes do pagamento."} title="Enquanto isso" tone="info" />
          </>
        )}
        <Button className={styles.fullButton} onClick={() => verified ? navigate(continuePath) : setVerified(true)} size="lg">{verified ? "Continuar" : "Confirmar e-mail"}</Button>
        {!verified ? <Button className={styles.fullButton} onClick={() => setResent(true)} variant="secondary">Reenviar e-mail</Button> : null}
        {!verified ? <a className={styles.backLink} href={withBasePath(laterPath)}>Continuar sem verificar por enquanto</a> : null}
      </div>
    </AuthShell>
  );
}

export function OrganizerOnboardingExperience() {
  const [step, setStep] = useState(1);
  const [legalType, setLegalType] = useState<LegalType>("person");

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("type") === "company") setLegalType("company");
  }, []);

  const advance = () => {
    if (step === 4) { navigate("/organizador/#dashboard"); return; }
    setStep((current) => Math.min(4, current + 1));
  };
  const back = () => {
    if (step === 1) { navigate("/organizador/#dashboard"); return; }
    setStep((current) => Math.max(1, current - 1));
  };

  return (
    <AuthShell accountHref="/organizador/perfil/" accountInitials="RS" accountName="Rota Serra" authenticatedHeader description="Complete no seu ritmo. Você pode explorar o painel e criar rascunhos sem validar sua identidade agora." eyebrow="Configuração da conta" title="Prepare seu perfil de organizador" wide>
      <div className={styles.onboardingLayout}>
        <div className={styles.onboardingProgress}>
          <FlowStepper current={step} layout="responsive" mobileTitle="Configurar perfil" onBack={back} steps={onboardingSteps} title="Seu progresso" />
        </div>
        <section aria-labelledby={`onboarding-step-${step}`} className={styles.onboardingForm}>
          {step === 1 ? (
            <div className={styles.stack}>
              <div><span className={styles.stepEyebrow}>Etapa 1</span><h2 id="onboarding-step-1">Perfil do organizador</h2><p className={styles.muted}>Essas informações serão exibidas para os aventureiros.</p></div>
              <Tabs items={[{ label: "Pessoa física", value: "person" }, { label: "Pessoa jurídica", value: "company" }]} label="Natureza do organizador" onValueChange={(value) => setLegalType(value as LegalType)} value={legalType} variant="pill" />
              <Input hideHelperText label={legalType === "person" ? "Nome público" : "Nome fantasia"} placeholder={legalType === "person" ? "Seu nome ou marca" : "Nome da agência"} />
              <Input helperText="Resumo exibido no seu perfil público." label="Apresentação" placeholder="Conte um pouco sobre suas viagens e roteiros." />
              <ToastAlert format="inline" message="O perfil poderá criar e salvar excursões como rascunho desde já." title="Rascunhos liberados" tone="success" />
            </div>
          ) : null}
          {step === 2 ? (
            <div className={styles.stack}>
              <div><span className={styles.stepEyebrow}>Etapa 2</span><h2 id="onboarding-step-2">Endereço e dados fiscais</h2><p className={styles.muted}>Complete os dados usados na operação e na emissão fiscal.</p></div>
              {legalType === "company" ? <Input hideHelperText label="Razão social" placeholder="Razão social da empresa" /> : null}
              <div className={styles.twoColumns}><Input hideHelperText inputMode="numeric" label="CEP" placeholder="00000-000" /><Input hideHelperText label="Cidade e estado" placeholder="São Paulo, SP" /></div>
              <Input hideHelperText label="Endereço" placeholder="Rua, número e complemento" />
              <ToastAlert format="inline" message="O CPF ou CNPJ já foi informado no cadastro. A validação da identidade será solicitada somente antes da primeira publicação." title="Validação para depois" tone="info" />
            </div>
          ) : null}
          {step === 3 ? (
            <div className={styles.stack}>
              <div><span className={styles.stepEyebrow}>Etapa 3</span><h2 id="onboarding-step-3">Dados para recebimento</h2><p className={styles.muted}>A titularidade deverá corresponder ao CPF ou CNPJ cadastrado.</p></div>
              <Select defaultValue="" hideHelperText label="Banco"><option value="">Selecione o banco</option><option value="001">Banco do Brasil</option><option value="260">Nubank</option><option value="341">Itaú</option><option value="033">Santander</option><option value="104">Caixa Econômica</option><option value="237">Bradesco</option><option value="077">Inter</option></Select>
              <div className={styles.twoColumns}><Input hideHelperText inputMode="numeric" label="Agência" placeholder="0001" /><Input hideHelperText inputMode="numeric" label="Conta" placeholder="12345-6" /></div>
              <Input helperText="Chave Pix para repasses bancários." label="Chave Pix" placeholder="sua-chave-pix" />
              <ToastAlert format="inline" message="Recebimentos serão processados via Stripe Connect após validação da conta." title="Stripe Connect" tone="info" />
            </div>
          ) : null}
          {step === 4 ? (
            <div className={styles.stack}>
              <div><span className={styles.stepEyebrow}>Etapa 4</span><h2 id="onboarding-step-4">Revise a configuração</h2><p className={styles.muted}>Você poderá editar estas informações no perfil gerencial.</p></div>
              <div className={styles.reviewList}>
                <div><span><strong>E-mail</strong><small>Verificação concluída</small></span><StatusChip intent="verified" label="Verificado" /></div>
                <div><span><strong>{legalType === "person" ? "CPF" : "CNPJ"}</strong><small>Documento informado no cadastro</small></span><StatusChip intent="confirmed" label="Informado" /></div>
                <div><span><strong>Validação de identidade</strong><small>Habilitada via Stripe Connect</small></span><StatusChip intent="pending" label="Pendente" /></div>
                <div><span><strong>Dados bancários</strong><small>Configurados</small></span><StatusChip intent="confirmed" label="Informado" /></div>
              </div>
              <ToastAlert format="inline" message="Você já pode acessar o painel e criar rascunhos. Ao publicar pela primeira vez, conecte sua conta Stripe." title="Conta pronta para explorar" tone="success" />
            </div>
          ) : null}
          <JourneyNavigation backLabel={step === 1 ? "Salvar e continuar depois" : "Voltar"} onBack={back} onPrimaryAction={advance} primaryLabel={step === 4 ? "Concluir onboarding" : "Continuar"} />
        </section>
        <aside className={styles.onboardingStatus}>
          <span>Liberação da conta</span>
          <h2>O que já está disponível?</h2>
          <ul><li><strong>✓</strong> Explorar a plataforma</li><li><strong>✓</strong> Criar rascunhos</li><li><strong>○</strong> Conectar Stripe Connect</li><li><strong>○</strong> Publicar e receber repasses</li></ul>
          <Button onClick={() => navigate("/organizador/#dashboard")} variant="ghost">Ir para o painel</Button>
        </aside>
      </div>
    </AuthShell>
  );
}
