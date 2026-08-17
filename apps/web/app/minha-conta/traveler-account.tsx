"use client";

import { useEffect, useState } from "react";
import { Avatar, Button, Checkbox, Input, Tabs, ToastAlert } from "@liete/ui-web";
import { TravelerShell } from "../_traveler/traveler-shell";
import { withBasePath } from "../../lib/site-path";
import { useAuth } from "../../lib/auth-context";
import styles from "./traveler-account.module.css";

type AccountTab = "data" | "notifications" | "security";

function getInitials(name?: string | null): string {
  if (!name) return "AV";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function TravelerAccount() {
  const { profile, signOut, user } = useAuth();

  const [tab, setTab] = useState<AccountTab>("data");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [whatsappNotifications, setWhatsappNotifications] = useState(true);

  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [document, setDocument] = useState(profile?.document || "");
  const [email, setEmail] = useState(profile?.email || user?.email || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [birthDate, setBirthDate] = useState(profile?.birth_date || "");
  const [city, setCity] = useState(
    profile?.city ? `${profile.city}${profile.state ? `, ${profile.state}` : ""}` : ""
  );

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch(withBasePath("/api/traveler/profile"));
        if (res.ok) {
          const { profile: p } = await res.json();
          if (p) {
            if (p.full_name) setFullName(p.full_name);
            if (p.document) setDocument(p.document);
            if (p.email) setEmail(p.email);
            if (p.phone) setPhone(p.phone);
            if (p.birth_date) setBirthDate(p.birth_date);
            if (p.city) setCity(p.city + (p.state ? `, ${p.state}` : ""));
          }
        }
      } catch {
        // Fallback
      }
    }

    loadProfile();
  }, []);

  const save = async () => {
    setLoading(true);
    try {
      const cityPart = city.includes(",") ? city.split(",")[0]?.trim() : city;
      const statePart = city.includes(",") ? city.split(",")[1]?.trim() : "SP";

      await fetch(withBasePath("/api/traveler/profile"), {
        body: JSON.stringify({
          birthDate,
          city: cityPart,
          document,
          fullName,
          phone,
          state: statePart
        }),
        headers: { "Content-Type": "application/json" },
        method: "PUT"
      });

      setSaved(true);
      window.setTimeout(() => setSaved(false), 3500);
    } catch {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const updatePassword = async () => {
    if (!newPassword || newPassword.length < 8) {
      setPasswordError("A nova senha deve conter ao menos 8 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("A confirmação de senha não confere.");
      return;
    }

    setPasswordLoading(true);
    setPasswordError("");
    setPasswordMessage("");

    try {
      const res = await fetch(withBasePath("/api/auth/update-password"), {
        body: JSON.stringify({ password: newPassword }),
        headers: { "Content-Type": "application/json" },
        method: "POST"
      });
      const data = await res.json();
      if (!res.ok) {
        setPasswordError(data.error || "Não foi possível atualizar a senha.");
      } else {
        setPasswordMessage("Senha atualizada com sucesso!");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setPasswordError("Erro ao comunicar com o servidor.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const displayName = fullName || email.split("@")[0] || "Aventureiro";
  const userInitials = getInitials(displayName);

  return (
    <TravelerShell authenticated>
      <div className={styles.pageContent}>
        <header className={styles.header}>
          <Avatar initials={userInitials} name={displayName} size="lg" verified />
          <div>
            <span>Conta do aventureiro</span>
            <h1>{displayName}</h1>
            <p>Gerencie seus dados pessoais, segurança e preferências de comunicação.</p>
          </div>
        </header>

        {saved ? (
          <ToastAlert
            format="inline"
            message="Suas alterações foram salvas com sucesso."
            title="Dados atualizados"
            tone="success"
          />
        ) : null}

        <div className={styles.layout}>
          <Tabs
            className={styles.tabs}
            items={[
              { label: "Dados cadastrais", value: "data" },
              { label: "Notificações", value: "notifications" },
              { label: "Segurança", value: "security" }
            ]}
            label="Seções da conta"
            onValueChange={(value) => setTab(value as AccountTab)}
            value={tab}
            variant="pill"
          />

          {tab === "data" ? (
            <section aria-labelledby="personal-data-title" className={styles.card}>
              <h2 id="personal-data-title">Dados pessoais</h2>
              <p>Essas informações facilitam o preenchimento automático das suas reservas.</p>
              <div className={styles.formGrid}>
                <Input
                  className={styles.fullField}
                  hideHelperText
                  label="Nome completo"
                  onChange={(e) => setFullName(e.currentTarget.value)}
                  placeholder="Seu nome completo"
                  value={fullName}
                />
                <Input
                  hideHelperText
                  label="CPF"
                  onChange={(e) => setDocument(e.currentTarget.value)}
                  placeholder="000.000.000-00"
                  value={document}
                />
                <Input
                  disabled
                  helperText="O e-mail é o identificador único da conta."
                  inputType="email"
                  label="E-mail"
                  value={email}
                />
                <Input
                  hideHelperText
                  label="Telefone / WhatsApp"
                  onChange={(e) => setPhone(e.currentTarget.value)}
                  placeholder="(00) 00000-0000"
                  value={phone}
                />
                <Input
                  hideHelperText
                  label="Data de nascimento"
                  onChange={(e) => setBirthDate(e.currentTarget.value)}
                  placeholder="DD/MM/AAAA"
                  value={birthDate}
                />
                <Input
                  className={styles.fullField}
                  hideHelperText
                  label="Cidade e estado"
                  onChange={(e) => setCity(e.currentTarget.value)}
                  placeholder="São Paulo, SP"
                  value={city}
                />
              </div>
              <div className={styles.actions}>
                <Button disabled={loading} onClick={save} size="md">
                  {loading ? "Salvando..." : "Salvar alterações"}
                </Button>
              </div>
            </section>
          ) : null}

          {tab === "notifications" ? (
            <section aria-labelledby="notifications-title" className={styles.card}>
              <h2 id="notifications-title">Preferências de notificação</h2>
              <p>Escolha como você quer receber avisos sobre suas reservas e novidades.</p>
              <div className={styles.notificationOptions}>
                <Checkbox
                  checked={emailNotifications}
                  label="E-mails sobre confirmação de viagens e vouchers"
                  onChange={(e) => setEmailNotifications(e.currentTarget.checked)}
                />
                <Checkbox
                  checked={whatsappNotifications}
                  label="Avisos importantes de embarque via WhatsApp"
                  onChange={(e) => setWhatsappNotifications(e.currentTarget.checked)}
                />
              </div>
            </section>
          ) : null}

          {tab === "security" ? (
            <section aria-labelledby="security-title" className={styles.card}>
              <h2 id="security-title">Segurança e acesso</h2>
              <p>Gerencie sua senha de acesso e encerre sessões ativas.</p>

              {passwordMessage ? (
                <ToastAlert format="inline" message={passwordMessage} title="Sucesso" tone="success" />
              ) : null}
              {passwordError ? (
                <ToastAlert format="inline" message={passwordError} title="Atenção" tone="error" />
              ) : null}

              <div className={styles.formGrid} style={{ marginTop: "1rem" }}>
                <Input
                  helperText="Mínimo de 8 caracteres."
                  inputType="password"
                  label="Nova senha"
                  onChange={(e) => setNewPassword(e.currentTarget.value)}
                  placeholder="••••••••"
                  value={newPassword}
                />
                <Input
                  hideHelperText
                  inputType="password"
                  label="Confirmar nova senha"
                  onChange={(e) => setConfirmPassword(e.currentTarget.value)}
                  placeholder="••••••••"
                  value={confirmPassword}
                />
              </div>

              <div className={styles.actions} style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
                <Button disabled={passwordLoading} onClick={updatePassword} size="md">
                  {passwordLoading ? "Atualizando..." : "Atualizar senha"}
                </Button>
                <Button onClick={signOut} size="md" variant="dangerGhost">
                  Encerrar sessão (Sair)
                </Button>
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </TravelerShell>
  );
}
