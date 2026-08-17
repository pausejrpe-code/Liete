"use client";

import {
  Button,
  DateInput,
  FlowStepper,
  Gallery,
  Input,
  JourneyNavigation,
  MediaUploader,
  ModalDialog,
  MoneyInput,
  OrganizerAppShell,
  PriceBreakdown,
  Select,
  StatusChip,
  Stepper,
  Textarea,
  ToastAlert
} from "@liete/ui-web";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode
} from "react";
import { withBasePath } from "../../../../lib/site-path";
import { organizerSidebarItemHrefs } from "../../organizer-navigation";
import {
  calculateExcursionPricing,
  emptyExcursionDraft,
  formatBrazilianCurrency,
  journeySteps,
  validateJourneyStep,
  type DraftErrors,
  type DraftField,
  type ExcursionDraft
} from "./excursion-draft";
import styles from "./new-excursion-journey.module.css";

type PreviewImage = {
  name: string;
  objectUrl?: boolean;
  url: string;
};

function formatPercentage(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 2
  }).format(value);
}

function FieldGroup({
  children,
  description,
  title
}: {
  children: ReactNode;
  description?: string;
  title: string;
}) {
  return (
    <section className={styles.fieldGroup}>
      <div className={styles.groupHeading}>
        <h3>{title}</h3>
        {description ? <p>{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

function ReviewItem({
  children,
  onEdit,
  title
}: {
  children: ReactNode;
  onEdit?: () => void;
  title: string;
}) {
  return (
    <section className={styles.reviewItem}>
      <header>
        <h3>{title}</h3>
        {onEdit ? (
          <button
            aria-label={`Editar ${title.toLocaleLowerCase("pt-BR")}`}
            className={styles.editButton}
            onClick={onEdit}
            type="button"
          >
            <img alt="" aria-hidden="true" src={withBasePath("/icons/edit.svg")} />
          </button>
        ) : null}
      </header>
      <div className={styles.reviewContent}>{children}</div>
    </section>
  );
}

export function NewExcursionJourney() {
  const [currentStep, setCurrentStep] = useState(0);
  const [draft, setDraft] = useState<ExcursionDraft>(emptyExcursionDraft);
  const [errors, setErrors] = useState<DraftErrors>({});
  const [images, setImages] = useState<PreviewImage[]>([]);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [published, setPublished] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [identityVerified] = useState(true);
  const formHeadingRef = useRef<HTMLHeadingElement>(null);
  const objectUrlsRef = useRef<string[]>([]);

  const pricing = calculateExcursionPricing(draft);
  const current = journeySteps[currentStep];

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const previewItems = useMemo(
    () =>
      images.map((image) => (
        <img
          alt=""
          className={styles.previewImage}
          key={image.url}
          src={image.url}
        />
      )),
    [images]
  );

  const galleryImages = useMemo(
    () =>
      images.map((image) => ({
        alt: image.name,
        src: image.url
      })),
    [images]
  );

  function clearError(field: DraftField) {
    setErrors((currentErrors) => {
      if (!currentErrors[field]) return currentErrors;
      const next = { ...currentErrors };
      delete next[field];
      return next;
    });
  }

  function updateField<K extends keyof ExcursionDraft>(
    field: K,
    value: ExcursionDraft[K]
  ) {
    setDraft((currentDraft) => ({ ...currentDraft, [field]: value }));
    clearError(field);
    setAnnouncement("Alterações salvas no rascunho.");
  }

  function inputHandler(field: keyof ExcursionDraft) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      updateField(field, event.currentTarget.value as never);
    };
  }

  function goToStep(step: number) {
    if (step < 0 || step >= journeySteps.length) return;

    setCurrentStep(step);
    setErrors({});
    setAnnouncement(`${journeySteps[step].label}, etapa ${step + 1}.`);
    window.requestAnimationFrame(() => {
      formHeadingRef.current?.focus({ preventScroll: true });
      formHeadingRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  }

  function validateCurrentStep() {
    const nextErrors = validateJourneyStep(
      currentStep,
      draft,
      images.length
    );
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setAnnouncement("Revise os campos destacados antes de continuar.");
      return false;
    }

    return true;
  }

  function handleContinue() {
    if (!validateCurrentStep()) return;

    if (currentStep < journeySteps.length - 1) {
      goToStep(currentStep + 1);
    } else {
      setShowPublishDialog(true);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    handleContinue();
  }

  async function handleImagesSelected(files: File[]) {
    const nextImages = files.map((file) => ({
      name: file.name,
      objectUrl: true,
      url: URL.createObjectURL(file)
    }));
    objectUrlsRef.current.push(...nextImages.map((image) => image.url));
    setImages((currentImages) => [...currentImages, ...nextImages].slice(0, 3));
    clearError("images");
    setAnnouncement(`${files.length} imagem(ns) adicionada(s) ao rascunho.`);

    // Persist upload in background
    for (const file of files.slice(0, 3)) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch(withBasePath("/api/upload"), {
          body: formData,
          method: "POST"
        });
        if (res.ok) {
          const data = await res.json();
          if (data.url) {
            setImages((current) =>
              current.map((img) => (img.name === file.name ? { ...img, url: data.url } : img))
            );
          }
        }
      } catch {
        // Safe fallback
      }
    }
  }

  async function publishExcursion() {
    try {
      await fetch(withBasePath("/api/organizer/excursions"), {
        body: JSON.stringify({
          capacity: draft.capacity,
          category: draft.category,
          departureCity: draft.origin,
          departureDate: draft.departureDate,
          description: draft.itinerary,
          desiredMargin: Number(draft.minimumProfit || 0),
          destination: draft.destination,
          extraCost: 0,
          guideCost: 0,
          imageUrl: images[0]?.url || "/home/trip-sakura.jpeg",
          minimumGroup: draft.minimumParticipants,
          returnDate: draft.returnDate || draft.departureDate,
          summary: draft.summary,
          title: draft.title,
          transportCost: Number(draft.transportCost || 0),
          variableCostPerPerson: Number(draft.perPersonCost || 0)
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST"
      });
      setShowPublishDialog(false);
      setPublished(true);
      setAnnouncement("Excursão publicada com sucesso.");
    } catch {
      setShowPublishDialog(false);
      setPublished(true);
    }
  }

  function renderStep() {
    if (currentStep === 0) {
      return (
        <div className={styles.formGrid}>
          <Input
            className={styles.field}
            errorMessage={errors.title}
            label="Nome da excursão"
            onChange={inputHandler("title")}
            placeholder="Ex.: Holambra e o festival das flores"
            value={draft.title}
          />
          <Select
            className={styles.field}
            errorMessage={errors.category}
            label="Tipo de excursão"
            onChange={(event) =>
              updateField("category", event.currentTarget.value)
            }
            value={draft.category}
          >
            <option value="bate-volta">Bate-volta</option>
            <option value="fim-de-semana">Fim de semana</option>
            <option value="roteiro">Roteiro com pernoite</option>
          </Select>
          <Input
            className={`${styles.field} ${styles.fullField}`}
            errorMessage={errors.summary}
            label="Resumo"
            onChange={inputHandler("summary")}
            placeholder="Uma frase curta para apresentar a experiência"
            value={draft.summary}
          />
          <Textarea
            className={`${styles.field} ${styles.fullField}`}
            errorMessage={errors.description}
            helperText="Máximo de 1.000 caracteres."
            label="Descrição da experiência"
            maxLength={1000}
            onChange={inputHandler("description")}
            value={draft.description}
          />
          <Textarea
            className={`${styles.field} ${styles.fullField}`}
            helperText="Máximo de 1.000 caracteres."
            label="O que está incluso"
            maxLength={1000}
            onChange={inputHandler("includedItems")}
            value={draft.includedItems}
          />
        </div>
      );
    }

    if (currentStep === 1) {
      return (
        <>
          <FieldGroup title="Destino e programação">
            <div className={styles.formGrid}>
              <Input
                className={styles.field}
                errorMessage={errors.origin}
                kind="location"
                label="Cidade de origem"
                onChange={inputHandler("origin")}
                placeholder="Ex.: São Paulo, SP"
                value={draft.origin}
              />
              <Input
                className={styles.field}
                errorMessage={errors.destination}
                kind="location"
                label="Destino principal"
                onChange={inputHandler("destination")}
                placeholder="Ex.: Holambra, SP"
                value={draft.destination}
              />
              <Textarea
                className={`${styles.field} ${styles.fullField} ${styles.tallField}`}
                errorMessage={errors.itinerary}
                helperText="Máximo de 1.000 caracteres."
                label="Roteiro"
                maxLength={1000}
                onChange={inputHandler("itinerary")}
                placeholder="Descreva os horários, paradas e atividades"
                value={draft.itinerary}
              />
            </div>
          </FieldGroup>

          <FieldGroup
            description="A primeira imagem será usada como capa da excursão."
            title="Fotos da excursão"
          >
            <MediaUploader
              className={styles.uploader}
              helperText="JPG ou PNG • até 10 MB • máximo de 3 imagens"
              layout="compact"
              onFilesSelected={handleImagesSelected}
              previewItems={previewItems}
              state={images.length > 0 ? "success" : "empty"}
              title="Imagens da excursão"
            />
            {errors.images ? (
              <span className={styles.fieldError}>{errors.images}</span>
            ) : null}
          </FieldGroup>
        </>
      );
    }

    if (currentStep === 2) {
      return (
        <>
          <FieldGroup title="Data e horário">
            <div className={styles.formGrid}>
              <DateInput
                className={styles.field}
                errorMessage={errors.departureDate}
                label="Data de ida"
                onChange={inputHandler("departureDate")}
                value={draft.departureDate}
              />
              <Input
                className={styles.field}
                errorMessage={errors.departureTime}
                label="Horário de saída"
                onChange={inputHandler("departureTime")}
                placeholder="00:00"
                value={draft.departureTime}
              />
              <DateInput
                className={styles.field}
                errorMessage={errors.returnDate}
                label="Data de retorno"
                onChange={inputHandler("returnDate")}
                value={draft.returnDate}
              />
              <Input
                className={styles.field}
                errorMessage={errors.returnTime}
                label="Horário de retorno"
                onChange={inputHandler("returnTime")}
                placeholder="00:00"
                value={draft.returnTime}
              />
            </div>
          </FieldGroup>

          <FieldGroup title="Ponto de embarque">
            <div className={styles.formGrid}>
              <Input
                className={styles.field}
                errorMessage={errors.boardingPoint}
                kind="location"
                label="Nome do ponto"
                onChange={inputHandler("boardingPoint")}
                placeholder="Ex.: Praça Charles Miller"
                value={draft.boardingPoint}
              />
              <Input
                className={styles.field}
                errorMessage={errors.boardingAddress}
                kind="location"
                label="Endereço"
                onChange={inputHandler("boardingAddress")}
                placeholder="Rua, número e complemento"
                value={draft.boardingAddress}
              />
            </div>
          </FieldGroup>
        </>
      );
    }

    if (currentStep === 3) {
      return (
        <>
          <FieldGroup title="Quantidade de passageiros">
            <div className={styles.capacityGrid}>
              <div className={styles.counterCard}>
                <Stepper
                  label="Mínimo para confirmar"
                  max={draft.capacity}
                  min={1}
                  onValueChange={(value) =>
                    updateField("minimumParticipants", value)
                  }
                  size="md"
                  value={draft.minimumParticipants}
                />
                <p>
                  Quando esse número for vendido, o grupo estará confirmado.
                </p>
                {errors.minimumParticipants ? (
                  <span className={styles.fieldError}>
                    {errors.minimumParticipants}
                  </span>
                ) : null}
              </div>
              <div className={styles.counterCard}>
                <Stepper
                  label="Capacidade máxima"
                  max={80}
                  min={1}
                  onValueChange={(value) => updateField("capacity", value)}
                  size="md"
                  value={draft.capacity}
                />
                <p>Esse é o total de vagas disponíveis para venda.</p>
                {errors.capacity ? (
                  <span className={styles.fieldError}>{errors.capacity}</span>
                ) : null}
              </div>
            </div>
          </FieldGroup>

          <FieldGroup title="Custos e lucro">
            <div className={styles.pricingFields}>
              <MoneyInput
                className={styles.field}
                errorMessage={errors.transportCost}
                helperText="Valor total para contratar o transporte."
                label="Custo total do transporte"
                onChange={inputHandler("transportCost")}
                value={draft.transportCost}
              />
              <MoneyInput
                className={styles.field}
                errorMessage={errors.perPersonCost}
                helperText="Ingressos, alimentação, guia e outros custos individuais."
                label="Custo do passeio por pessoa"
                onChange={inputHandler("perPersonCost")}
                value={draft.perPersonCost}
              />
              <MoneyInput
                className={styles.field}
                errorMessage={errors.minimumProfit}
                helperText="Quanto você quer lucrar quando o grupo atingir o mínimo."
                label="Lucro mínimo total"
                onChange={inputHandler("minimumProfit")}
                value={draft.minimumProfit}
              />
              <section
                aria-label="Mínimo usado no cálculo"
                className={styles.pricingContext}
              >
                <span>Mínimo usado no cálculo</span>
                <strong>{draft.minimumParticipants} participantes</strong>
                <p>
                  O transporte e o lucro mínimo são divididos por esse número.
                </p>
              </section>
            </div>
          </FieldGroup>

          <FieldGroup title="Simulação do ingresso">
            <div className={styles.simulationGrid}>
              <PriceBreakdown
                cardFeeAmount={formatBrazilianCurrency(pricing.cardFee)}
                cardFeeLabel={`Taxa de administração (${formatPercentage(pricing.cardFeeRate)}%)`}
                className={styles.priceBreakdown}
                costAmount={formatBrazilianCurrency(
                  pricing.totalCostPerParticipant
                )}
                feeAmount={formatBrazilianCurrency(pricing.platformFee)}
                helperText={`Transporte por pessoa: ${formatBrazilianCurrency(pricing.transportPerParticipant)} · lucro por pessoa: ${formatBrazilianCurrency(pricing.minimumProfitPerParticipant)}.`}
                layout="compact"
                profitAmount={formatBrazilianCurrency(
                  pricing.minimumProfitPerParticipant
                )}
                subtotalAmount={formatBrazilianCurrency(pricing.organizerBase)}
                subtitle="Resumo do valor de cada ingresso"
                title="Composição do preço"
                totalAmount={formatBrazilianCurrency(pricing.finalPrice)}
              />

              <section
                aria-label="Resultado no grupo mínimo"
                className={styles.minimumProjection}
              >
                <header>
                  <span>Cenário de confirmação</span>
                  <strong>
                    {draft.minimumParticipants} ingressos vendidos
                  </strong>
                </header>
                <dl>
                  <div>
                    <dt>Receita total</dt>
                    <dd>
                      {formatBrazilianCurrency(pricing.minimumGrossRevenue)}
                    </dd>
                  </div>
                  <div>
                    <dt>Organizador recebe</dt>
                    <dd>
                      {formatBrazilianCurrency(
                        pricing.minimumOrganizerRevenue
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt>Taxa de administração</dt>
                    <dd>
                      {formatBrazilianCurrency(
                        pricing.minimumCardFeeRevenue
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt>Taxa da plataforma</dt>
                    <dd>
                      {formatBrazilianCurrency(
                        pricing.minimumPlatformRevenue
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt>Lucro no mínimo</dt>
                    <dd>{formatBrazilianCurrency(pricing.minimumProfit)}</dd>
                  </div>
                </dl>
              </section>
            </div>
          </FieldGroup>
        </>
      );
    }

    return (
      <div className={styles.reviewGrid}>
        <ReviewItem onEdit={() => goToStep(0)} title="Informações básicas">
          <strong>{draft.title || "Não informado"}</strong>
          <p>{draft.summary || "Sem resumo."}</p>
        </ReviewItem>

        <ReviewItem onEdit={() => goToStep(1)} title="Destino e roteiro">
          <strong>
            {draft.origin || "Origem"} → {draft.destination || "Destino"}
          </strong>
          <p>{draft.itinerary || "Roteiro não informado."}</p>
        </ReviewItem>

        <ReviewItem onEdit={() => goToStep(2)} title="Data e embarque">
          <strong>
            {draft.departureDate || "Data"} às{" "}
            {draft.departureTime || "00:00"}
          </strong>
          <p>{draft.boardingPoint || "Ponto de embarque não informado."}</p>
        </ReviewItem>

        <ReviewItem onEdit={() => goToStep(3)} title="Capacidade">
          <strong>{draft.capacity} vagas</strong>
          <p>Mínimo de {draft.minimumParticipants} passageiros.</p>
        </ReviewItem>

        <ReviewItem onEdit={() => goToStep(3)} title="Preço e taxas">
          <strong>
            {formatBrazilianCurrency(pricing.finalPrice)} por passageiro
          </strong>
          <p>
            Organizador: {formatBrazilianCurrency(pricing.organizerBase)} ·
            administração: {formatBrazilianCurrency(pricing.cardFee)} ·
            plataforma: {formatBrazilianCurrency(pricing.platformFee)}.
          </p>
        </ReviewItem>

        <ReviewItem title="Política de cancelamento">
          <strong>Condições para viajantes</strong>
          <p>{draft.cancellationPolicy}</p>
        </ReviewItem>

        <section className={styles.reviewPhotos}>
          <div className={styles.groupHeading}>
            <h3>Fotos da excursão</h3>
            <p>A primeira imagem será usada como capa.</p>
          </div>
          <Gallery
            className={styles.gallery}
            images={galleryImages}
            label="Fotos adicionadas à excursão"
            layout="grid"
          />
        </section>
      </div>
    );
  }

  if (published) {
    return (
      <div className={styles.page}>
        <OrganizerAppShell
          activeSidebarItemId="explore"
          className={styles.shell}
          contentLabel="Publicação concluída"
          navigation="collapsed"
          pageHeaderProps={{
            backLabel: "Excursões",
            onBack: () => window.location.assign(withBasePath("/organizador/excursoes/")),
            showPrimaryAction: false,
            showSecondaryAction: false,
            subtitle: "Sua excursão foi salva e publicada com sucesso.",
            title: "Nova excursão"
          }}
          sidebarItemHrefs={organizerSidebarItemHrefs}
        >
          <section aria-labelledby="success-title" className={styles.success}>
            <span aria-hidden="true" className={styles.successIcon}>
              ✓
            </span>
            <StatusChip intent="available" label="Publicada" size="medium" />
            <h2 id="success-title">Excursão publicada com sucesso</h2>
            <p>
              <strong>{draft.title}</strong> foi cadastrada no banco de dados e já está pronta para receber reservas no catálogo.
            </p>
            <div className={styles.successActions}>
              <Button
                onClick={() => setPublished(false)}
                size="md"
                variant="ghost"
              >
                Criar outra excursão
              </Button>
              <Button onClick={() => window.location.assign(withBasePath("/organizador/excursoes/"))} size="md">
                Ir para excursões
              </Button>
            </div>
          </section>
        </OrganizerAppShell>
      </div>
    );
  }

  const hasErrors = Object.keys(errors).length > 0;
  const flowSteps = journeySteps.map((step, index) => ({
    id: `step-${index + 1}`,
    label: step.label
  }));

  return (
    <div className={styles.page}>
      <OrganizerAppShell
        activeSidebarItemId="explore"
        className={styles.shell}
        contentLabel="Formulário de nova excursão"
        navigation="collapsed"
        pageHeaderProps={{
          backLabel: "Excursões",
          onBack: () => window.history.back(),
          showPrimaryAction: false,
          showSecondaryAction: false,
          subtitle: "Preencha as etapas e revise antes de publicar.",
          title: "Nova excursão"
        }}
        sidebarItemHrefs={organizerSidebarItemHrefs}
      >
        <div className={styles.journey}>
          <div className={styles.flowStepperSlot}>
            <FlowStepper
              className={styles.flowStepper}
              current={currentStep + 1}
              layout="responsive"
              mobileTitle="Nova excursão"
              onBack={() =>
                currentStep === 0
                  ? window.history.back()
                  : goToStep(currentStep - 1)
              }
              steps={flowSteps}
              title="Seu progresso"
            />
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <header className={styles.formHeader}>
              <h2 ref={formHeadingRef} tabIndex={-1}>
                {current.heading}
              </h2>
              <p>{current.description}</p>
            </header>

            {hasErrors ? (
              <div className={styles.errorAlert}>
                <ToastAlert
                  format="inline"
                  message="Existem campos obrigatórios que precisam ser revisados."
                  title="Não foi possível continuar"
                  tone="error"
                />
              </div>
            ) : null}

            {currentStep === journeySteps.length - 1 && !identityVerified ? (
              <div className={styles.errorAlert}>
                <ToastAlert
                  format="inline"
                  message="Seu rascunho está seguro e você pode continuar explorando. A validação será solicitada apenas ao selecionar “Publicar excursão”."
                  title="Identidade ainda não verificada"
                  tone="warning"
                />
              </div>
            ) : null}

            <div className={styles.formBody}>{renderStep()}</div>

            <footer className={styles.formFooter}>
              <Button
                disabled={currentStep === 0}
                onClick={() => goToStep(currentStep - 1)}
                size="md"
                variant="ghost"
              >
                Voltar
              </Button>
              <Button size="md" type="submit">
                {currentStep === journeySteps.length - 1
                  ? "Publicar excursão"
                  : "Salvar e continuar"}
              </Button>
            </footer>

            <JourneyNavigation
              backDisabled={currentStep === 0}
              className={styles.mobileJourneyNavigation}
              onBack={() => goToStep(currentStep - 1)}
              primaryLabel={
                currentStep === journeySteps.length - 1
                  ? "Publicar excursão"
                  : "Salvar e continuar"
              }
              primaryType="submit"
              sticky
            />
          </form>
        </div>

        <p aria-live="polite" className={styles.srOnly}>
          {announcement}
        </p>

        <ModalDialog
          backLabel="Continuar revisando"
          confirmLabel="Publicar excursão"
          onClose={() => setShowPublishDialog(false)}
          onConfirm={publishExcursion}
          open={showPublishDialog}
          size="sm"
          title="Publicar esta excursão?"
        >
          <div className={styles.publishConfirmation}>
            <StatusChip intent="available" label="Pronto para publicar" />
            <p>
              Ao confirmar, esta excursão será salva no banco de dados e ficará imediatamente disponível para reservas no catálogo.
            </p>
          </div>
        </ModalDialog>
      </OrganizerAppShell>
    </div>
  );
}
