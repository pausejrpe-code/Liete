"use client";

import {
  forwardRef,
  useId,
  useRef,
  type ChangeEvent,
  type DragEvent,
  type InputHTMLAttributes,
  type ReactNode,
  type Ref
} from "react";
import { Button } from "../button/button";
import styles from "./media-uploader.module.css";

export type MediaUploaderLayout = "regular" | "compact";
export type MediaUploaderState = "empty" | "uploading" | "success" | "error";

type NativeFileInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "children" | "className" | "size" | "title" | "type"
>;

export type MediaUploaderProps = NativeFileInputProps & {
  actionLabel?: string;
  className?: string;
  heading?: string;
  helperText?: string;
  layout?: MediaUploaderLayout;
  onFilesSelected?: (files: File[]) => void;
  previewItems?: ReactNode[];
  progress?: number;
  showAction?: boolean;
  showHelper?: boolean;
  showTitle?: boolean;
  state?: MediaUploaderState;
  title?: string;
};

function assignRef(
  ref: Ref<HTMLInputElement>,
  node: HTMLInputElement | null
) {
  if (typeof ref === "function") {
    ref(node);
  } else if (ref) {
    ref.current = node;
  }
}

const stateContent: Record<
  MediaUploaderState,
  { action: string; heading: string }
> = {
  empty: {
    action: "Selecionar imagens",
    heading: "Arraste imagens aqui"
  },
  uploading: {
    action: "Enviando...",
    heading: "Enviando 3 imagens..."
  },
  success: {
    action: "Adicionar mais",
    heading: "3 imagens adicionadas"
  },
  error: {
    action: "Tentar novamente",
    heading: "Não foi possível enviar as imagens"
  }
};

export const MediaUploader = forwardRef<HTMLInputElement, MediaUploaderProps>(
  (
    {
      accept = "image/jpeg,image/png",
      actionLabel,
      className,
      disabled = false,
      heading,
      helperText,
      id,
      layout = "regular",
      multiple = true,
      onChange,
      onFilesSelected,
      previewItems = ["1", "2", "3"],
      progress = 64,
      showAction = true,
      showHelper = true,
      showTitle = true,
      state = "empty",
      title = "Fotos da excursão",
      ...props
    },
    forwardedRef
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const headingId = `${inputId}-heading`;
    const inputRef = useRef<HTMLInputElement | null>(null);
    const isUploading = state === "uploading";
    const isError = state === "error";
    const isSuccess = state === "success";
    const safeProgress = Math.min(100, Math.max(0, progress));
    const content = stateContent[state];
    const resolvedHelper =
      helperText ??
      (isError
        ? "Verifique sua conexão e tente novamente."
        : "JPG ou PNG • até 10 MB por arquivo");
    const classes = [
      styles.root,
      styles[layout],
      styles[state],
      className
    ]
      .filter(Boolean)
      .join(" ");

    const emitFiles = (files: FileList | null) => {
      if (files?.length) {
        onFilesSelected?.(Array.from(files));
      }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      emitFiles(event.currentTarget.files);
      onChange?.(event);
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!disabled && !isUploading) {
        emitFiles(event.dataTransfer.files);
      }
    };

    return (
      <div
        className={classes}
        data-figma-node-id="241:842"
        data-layout={layout}
        data-state={state}
      >
        {showTitle ? (
          <label className={styles.label} htmlFor={inputId}>
            {title}
          </label>
        ) : null}

        <div
          aria-labelledby={headingId}
          aria-busy={isUploading || undefined}
          className={styles.zone}
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
          role={isError ? "alert" : "group"}
        >
          <strong className={styles.heading} id={headingId}>
            {heading ?? content.heading}
          </strong>

          {showHelper ? (
            <p className={styles.helper}>{resolvedHelper}</p>
          ) : null}

          {isUploading ? (
            <div
              aria-label="Progresso do envio"
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={safeProgress}
              className={styles.track}
              role="progressbar"
            >
              <span
                className={styles.bar}
                style={{ width: `${safeProgress}%` }}
              />
            </div>
          ) : null}

          {isSuccess ? (
            <ul aria-label="Imagens adicionadas" className={styles.thumbnails}>
              {previewItems.slice(0, 3).map((item, index) => (
                <li className={styles.thumbnail} key={index}>
                  {item}
                </li>
              ))}
            </ul>
          ) : null}

          {showAction ? (
            <Button
              disabled={disabled || isUploading}
              onClick={() => inputRef.current?.click()}
              size="sm"
              variant="primary"
            >
              {actionLabel ?? content.action}
            </Button>
          ) : null}

          <input
            {...props}
            ref={(node) => {
              inputRef.current = node;
              assignRef(forwardedRef, node);
            }}
            accept={accept}
            aria-label={`${title}: selecionar imagens`}
            className={styles.input}
            disabled={disabled || isUploading}
            id={inputId}
            multiple={multiple}
            onChange={handleChange}
            type="file"
          />
        </div>
      </div>
    );
  }
);

MediaUploader.displayName = "MediaUploader";
