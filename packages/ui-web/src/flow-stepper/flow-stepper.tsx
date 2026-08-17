"use client";

import type { HTMLAttributes } from "react";
import { getAssetUrl } from "../internal/asset-url";
import keyboardArrowLeft from "./assets/keyboard-arrow-left.svg";
import styles from "./flow-stepper.module.css";

export type FlowStepperLayout = "desktop" | "mobile" | "responsive";

export type FlowStepperStep = {
  id: string;
  label: string;
};

export type FlowStepperProps = Omit<
  HTMLAttributes<HTMLElement>,
  "title"
> & {
  backLabel?: string;
  current?: number;
  layout?: FlowStepperLayout;
  mobileTitle?: string;
  onBack?: () => void;
  showHeader?: boolean;
  steps?: readonly FlowStepperStep[];
  title?: string;
};

const defaultSteps: readonly FlowStepperStep[] = [
  { id: "basic", label: "Informações básicas" },
  { id: "route", label: "Destino, roteiro e fotos" },
  { id: "dates", label: "Datas e embarque" },
  { id: "price", label: "Preço, taxas e capacidade" },
  { id: "review", label: "Revisão" }
];

function clampCurrent(current: number, total: number) {
  return Math.min(Math.max(Math.round(current), 1), Math.max(total, 1));
}

export function FlowStepper({
  "aria-label": ariaLabel = "Progresso da publicação",
  backLabel = "Voltar",
  className,
  current = 1,
  layout = "responsive",
  mobileTitle = "Nova excursão",
  onBack,
  showHeader = true,
  steps = defaultSteps,
  title = "Seu progresso",
  ...props
}: FlowStepperProps) {
  const safeSteps = steps.length > 0 ? steps : defaultSteps;
  const safeCurrent = clampCurrent(current, safeSteps.length);
  const currentStep = safeSteps[safeCurrent - 1];
  const classes = [styles.root, styles[layout], className]
    .filter(Boolean)
    .join(" ");

  return (
    <nav
      {...props}
      aria-label={ariaLabel}
      className={classes}
      data-current={safeCurrent}
      data-figma-node-id="124:1349"
      data-layout={layout}
    >
      {layout !== "mobile" ? (
        <div className={styles.desktopPresentation}>
          {showHeader ? (
            <div className={styles.desktopHeader}>
              <strong>{title}</strong>
              <span>
                Etapa {safeCurrent} de {safeSteps.length}
              </span>
            </div>
          ) : null}

          <ol className={styles.desktopSteps}>
            {safeSteps.map((step, index) => {
              const stepNumber = index + 1;
              const state =
                stepNumber < safeCurrent
                  ? "complete"
                  : stepNumber === safeCurrent
                    ? "current"
                    : "upcoming";

              return (
                <li data-state={state} key={step.id}>
                  <span className={styles.stepContent}>
                    <span
                      aria-current={state === "current" ? "step" : undefined}
                      className={styles.indicator}
                    >
                      {state === "complete" ? "✓" : stepNumber}
                    </span>
                    <span className={styles.stepLabel}>{step.label}</span>
                  </span>
                  {index < safeSteps.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className={styles.connector}
                      data-complete={state === "complete" || undefined}
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </div>
      ) : null}

      {layout !== "desktop" ? (
        <div className={styles.mobilePresentation}>
          {showHeader ? (
            <div className={styles.mobileHeader}>
              {onBack ? (
                <button aria-label={backLabel} onClick={onBack} type="button">
                  <img
                    alt=""
                    aria-hidden="true"
                    src={getAssetUrl(keyboardArrowLeft)}
                  />
                </button>
              ) : (
                <span aria-hidden="true" className={styles.mobileHeaderSpacer} />
              )}
              <strong>{mobileTitle}</strong>
              <span aria-hidden="true" className={styles.mobileHeaderSpacer} />
            </div>
          ) : null}

          <div
            aria-label={`${currentStep.label}, etapa ${safeCurrent} de ${safeSteps.length}`}
            aria-valuemax={safeSteps.length}
            aria-valuemin={1}
            aria-valuenow={safeCurrent}
            aria-valuetext={`${currentStep.label}, etapa ${safeCurrent} de ${safeSteps.length}`}
            className={styles.mobileProgress}
            role="progressbar"
          >
            {safeSteps.map((step, index) => (
              <span
                aria-hidden="true"
                data-complete={index < safeCurrent || undefined}
                key={step.id}
              />
            ))}
          </div>

          <div className={styles.mobileMeta}>
            <strong>{currentStep.label}</strong>
            <span>
              Etapa {safeCurrent} de {safeSteps.length}
            </span>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
