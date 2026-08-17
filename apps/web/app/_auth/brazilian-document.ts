export type LegalType = "company" | "person";

export function documentDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function formatBrazilianDocument(value: string, legalType: LegalType) {
  const maxLength = legalType === "person" ? 11 : 14;
  const digits = documentDigits(value).slice(0, maxLength);

  if (legalType === "person") {
    return digits
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1-$2");
  }

  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

export function isCompleteBrazilianDocument(
  value: string,
  legalType: LegalType
) {
  return documentDigits(value).length === (legalType === "person" ? 11 : 14);
}
