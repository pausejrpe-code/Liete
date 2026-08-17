const assert = require("node:assert/strict");
const test = require("node:test");
const {
  formatBrazilianDocument,
  isCompleteBrazilianDocument
} = require("./brazilian-document.ts");

test("formats and limits CPF input", () => {
  assert.equal(formatBrazilianDocument("12345678901", "person"), "123.456.789-01");
  assert.equal(formatBrazilianDocument("12345678901999", "person"), "123.456.789-01");
  assert.equal(isCompleteBrazilianDocument("123.456.789-01", "person"), true);
  assert.equal(isCompleteBrazilianDocument("123.456", "person"), false);
});

test("formats and limits CNPJ input", () => {
  assert.equal(
    formatBrazilianDocument("12345678000190", "company"),
    "12.345.678/0001-90"
  );
  assert.equal(
    formatBrazilianDocument("12345678000190999", "company"),
    "12.345.678/0001-90"
  );
  assert.equal(
    isCompleteBrazilianDocument("12.345.678/0001-90", "company"),
    true
  );
  assert.equal(isCompleteBrazilianDocument("12.345.678", "company"), false);
});
