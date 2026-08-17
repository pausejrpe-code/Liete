import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MediaUploader } from "./media-uploader";

describe("MediaUploader", () => {
  it("uses a native file input and returns selected files", async () => {
    const onFilesSelected = vi.fn();
    const user = userEvent.setup();
    const file = new File(["image"], "roteiro.png", { type: "image/png" });

    render(<MediaUploader onFilesSelected={onFilesSelected} />);

    await user.upload(
      screen.getByLabelText("Fotos da excursão: selecionar imagens"),
      file
    );

    expect(onFilesSelected).toHaveBeenCalledWith([file]);
  });

  it("announces upload progress and disables duplicate selection", () => {
    render(<MediaUploader progress={64} state="uploading" />);

    expect(
      screen.getByRole("progressbar", { name: "Progresso do envio" })
    ).toHaveAttribute("aria-valuenow", "64");
    expect(screen.getByRole("button", { name: "Enviando..." })).toBeDisabled();
  });

  it("renders success previews and the add-more action", () => {
    render(
      <MediaUploader
        previewItems={["Capa", "Trilha", "Destino"]}
        state="success"
      />
    );

    expect(
      screen.getByRole("list", { name: "Imagens adicionadas" })
    ).toHaveTextContent("CapaTrilhaDestino");
    expect(
      screen.getByRole("button", { name: "Adicionar mais" })
    ).toBeEnabled();
  });

  it("supports contextual heading and action copy", () => {
    render(
      <MediaUploader
        actionLabel="Selecionar imagem"
        heading="Adicione sua foto ou logo"
        multiple={false}
      />
    );

    expect(screen.getByText("Adicione sua foto ou logo")).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Selecionar imagem" })
    ).toBeEnabled();
  });

  it("supports drag and drop and exposes error feedback", () => {
    const onFilesSelected = vi.fn();
    const file = new File(["image"], "capa.jpg", { type: "image/jpeg" });
    const { rerender } = render(
      <MediaUploader onFilesSelected={onFilesSelected} />
    );

    fireEvent.drop(screen.getByRole("group"), {
      dataTransfer: { files: [file] }
    });
    expect(onFilesSelected).toHaveBeenCalledWith([file]);

    rerender(<MediaUploader state="error" />);
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Verifique sua conexão e tente novamente."
    );
  });
});
