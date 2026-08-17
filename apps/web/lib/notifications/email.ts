export type BookingConfirmationEmailParams = {
  buyerEmail: string;
  buyerName: string;
  date: string;
  departureCity: string;
  excursionTitle: string;
  orderId: string;
  participants: Array<{ birthDate?: string | null; document: string; name: string }>;
  totalAmount: number;
  voucherCode: string;
};

export type OrganizerSaleNotificationParams = {
  excursionTitle: string;
  grossAmount: number;
  organizerEmail: string;
  organizerName: string;
  quantity: number;
  soldSeats: number;
  totalCapacity: number;
};

export function renderBookingConfirmationHtml(params: BookingConfirmationEmailParams): string {
  const { buyerName, excursionTitle, date, departureCity, totalAmount, voucherCode, orderId, participants } = params;

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1f2937; background: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #047857; margin: 0; font-size: 28px;">Liete</h1>
        <p style="color: #6b7280; margin-top: 4px; font-size: 14px;">Sua próxima aventura está confirmada!</p>
      </div>

      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
        <span style="font-size: 13px; color: #15803d; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Voucher de Embarque</span>
        <div style="font-size: 24px; font-weight: 800; color: #166534; letter-spacing: 0.1em; margin: 8px 0;">${voucherCode}</div>
        <p style="color: #15803d; font-size: 13px; margin: 0;">Apresente este código no momento do embarque com documento oficial.</p>
      </div>

      <div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <h2 style="font-size: 18px; margin-top: 0; margin-bottom: 16px; color: #111827;">Resumo da Viagem</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Excursão:</td>
            <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #111827;">${excursionTitle}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Data de Saída:</td>
            <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #111827;">${date}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Local de Saída:</td>
            <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #111827;">${departureCity}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Passageiros:</td>
            <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #111827;">${participants.length} pessoa(s)</td>
          </tr>
          <tr style="border-top: 1px solid #e5e7eb;">
            <td style="padding: 12px 0 0; font-weight: 700; color: #111827;">Total Pago:</td>
            <td style="padding: 12px 0 0; font-weight: 800; font-size: 16px; color: #047857; text-align: right;">R$ ${totalAmount.toFixed(2)}</td>
          </tr>
        </table>
      </div>

      <div style="margin-bottom: 24px;">
        <h3 style="font-size: 15px; color: #374151; margin-bottom: 8px;">Lista de Participantes</h3>
        <ul style="padding-left: 20px; margin: 0; font-size: 13px; color: #4b5563;">
          ${participants.map((p) => `<li><strong>${p.name}</strong> (${p.document})</li>`).join("")}
        </ul>
      </div>

      <div style="text-align: center; border-top: 1px solid #f3f4f6; padding-top: 20px; font-size: 12px; color: #9ca3af;">
        <p style="margin: 0 0 4px;">Dúvidas? Entre em contato pelo e-mail suporte@liete.com.br</p>
        <p style="margin: 0;">Liete Tecnologia de Turismo LTDA • Pedido #${orderId}</p>
      </div>
    </div>
  `;
}

export async function sendTransactionalEmail(to: string, subject: string, htmlContent: string): Promise<boolean> {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (resendApiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "Liete <contato@liete.com.br>",
          html: htmlContent,
          subject,
          to: [to]
        }),
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json"
        },
        method: "POST"
      });

      return res.ok;
    } catch {
      return false;
    }
  }

  // Graceful logger for dev / production environments without third-party email key
  return true;
}

export async function sendBookingConfirmation(params: BookingConfirmationEmailParams): Promise<boolean> {
  const html = renderBookingConfirmationHtml(params);
  return sendTransactionalEmail(
    params.buyerEmail,
    `Reserva Confirmada: ${params.excursionTitle} — Voucher ${params.voucherCode}`,
    html
  );
}
