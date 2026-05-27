// Vercel Serverless Function (Node runtime).
// Receives lead form submissions and notifies the team via Brevo
// Transactional Email API. Server-side only — secrets are never exposed
// to the browser.
//
// Env vars (server-side only, never prefix with VITE_):
//   BREVO_API_KEY   — Brevo (Sendinblue) Transactional API key
//   LEAD_TO_EMAIL   — internal recipient address for lead notifications
//
// Public legal disclaimer (do not remove):
//   "Plattformen är ett väglednings- och dokumentationsverktyg. Den ersätter
//    inte juridisk rådgivning och ger ingen garanti för rättslig efterlevnad."

export const config = { runtime: "nodejs" };

// ASCII-only Swedish field names (no å/ä/ö) to match the rest of the
// project and avoid encoding issues in downstream systems.
type LeadPayload = {
  namn?: string;
  foretag?: string;
  epost?: string;
  telefon?: string;
  roll?: string;
  sektor?: string;
  kommentar?: string;
  resultat?: string;
  titel?: string;
  onskemal?: "boka" | "rapport";
  omsattning_sek?: number | null;
  balans_sek?: number | null;
  omsattning_eur?: number | null;
  balans_eur?: number | null;
};

const SENDER = {
  name: "Cybersäkerhetslagen",
  email: "hej@cybersakerhetslagen.nu",
};

const DISCLAIMER =
  "Plattformen är ett väglednings- och dokumentationsverktyg. Den ersätter inte juridisk rådgivning och ger ingen garanti för rättslig efterlevnad.";

function escapeHtml(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function fmt(v: unknown): string {
  if (v === null || v === undefined || v === "") return "—";
  return String(v);
}

function buildEmail(body: LeadPayload, meta: { timestamp: string; source: string | null }) {
  const onskemalText =
    body.onskemal === "boka"
      ? "Boka kostnadsfri 30-minuters genomgång"
      : body.onskemal === "rapport"
      ? "Få preliminär NIS2-rapport via e-post"
      : "—";

  const rows: [string, unknown][] = [
    ["Namn", body.namn],
    ["Organisation", body.foretag],
    ["E-post", body.epost],
    ["Telefon", body.telefon],
    ["Roll", body.roll],
    ["Bransch/sektor", body.sektor],
    ["Önskemål", onskemalText],
    ["Preliminärt resultat", body.titel || body.resultat],
    [
      "Årsomsättning",
      body.omsattning_sek != null
        ? `${body.omsattning_sek.toLocaleString("sv-SE")} SEK${
            body.omsattning_eur != null ? ` (~${body.omsattning_eur.toLocaleString("sv-SE")} EUR)` : ""
          }`
        : null,
    ],
    [
      "Balansomslutning",
      body.balans_sek != null
        ? `${body.balans_sek.toLocaleString("sv-SE")} SEK${
            body.balans_eur != null ? ` (~${body.balans_eur.toLocaleString("sv-SE")} EUR)` : ""
          }`
        : null,
    ],
    ["Kommentar", body.kommentar],
    ["Tidsstämpel", meta.timestamp],
    ["Källsida", meta.source],
  ];

  const htmlRows = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;color:#475569;font-weight:600;vertical-align:top;white-space:nowrap;">${escapeHtml(
          k,
        )}</td><td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;color:#0f172a;white-space:pre-wrap;">${escapeHtml(
          fmt(v),
        )}</td></tr>`,
    )
    .join("");

  const htmlContent = `<!doctype html><html><body style="font-family:Arial,Helvetica,sans-serif;background:#ffffff;color:#0f172a;">
    <div style="max-width:640px;margin:0 auto;padding:24px;">
      <h2 style="margin:0 0 8px;font-size:18px;color:#0f172a;">Ny preliminär NIS2-bedömning</h2>
      <p style="margin:0 0 16px;color:#475569;font-size:13px;">Inskickad via cybersakerhetslagen.nu</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">${htmlRows}</table>
      <p style="margin:24px 0 0;color:#94a3b8;font-size:12px;line-height:1.5;">${escapeHtml(DISCLAIMER)}</p>
    </div></body></html>`;

  const textContent =
    `Ny preliminär NIS2-bedömning – cybersakerhetslagen.nu\n\n` +
    rows.map(([k, v]) => `${k}: ${fmt(v)}`).join("\n") +
    `\n\n---\n${DISCLAIMER}\n`;

  return { htmlContent, textContent };
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  let body: LeadPayload = {};
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body ?? {});
  } catch {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  if (!body.namn || !body.foretag || !body.epost) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const apiKey = process.env.BREVO_API_KEY;
  const toEmail = process.env.LEAD_TO_EMAIL;
  const isProd =
    process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";

  if (!apiKey || !toEmail) {
    if (isProd) {
      console.error("Brevo env vars missing in production (BREVO_API_KEY / LEAD_TO_EMAIL).");
      return res.status(503).json({
        ok: false,
        error: "form_not_configured",
        message:
          'Formuläret är inte aktiverat just nu. Kontakta oss via e-post på <a href="mailto:hej@cybersakerhetslagen.nu">hej@cybersakerhetslagen.nu</a>.',
        contactEmail: "hej@cybersakerhetslagen.nu",
      });
    }
    console.warn("[dev] BREVO_API_KEY/LEAD_TO_EMAIL not set — returning mock success.");
    return res.status(200).json({ ok: true, mode: "mock" });
  }

  const timestamp = new Date().toISOString();
  const source =
    (req.headers?.referer as string | undefined) ||
    (req.headers?.referrer as string | undefined) ||
    null;

  const { htmlContent, textContent } = buildEmail(body, { timestamp, source });

  const subject = "Ny preliminär NIS2-bedömning – cybersakerhetslagen.nu";

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const submitterEmail = typeof body.epost === "string" ? body.epost.trim() : "";
  const replyTo =
    submitterEmail && EMAIL_RE.test(submitterEmail)
      ? { email: submitterEmail, name: body.namn || undefined }
      : undefined;

  const genericError = {
    ok: false,
    error: "email_delivery_failed",
    message:
      'Det gick inte att skicka formuläret just nu. Försök igen senare eller kontakta oss på <a href="mailto:hej@cybersakerhetslagen.nu">hej@cybersakerhetslagen.nu</a>.',
    contactEmail: "hej@cybersakerhetslagen.nu",
  };

  const payload: Record<string, unknown> = {
    sender: SENDER,
    to: [{ email: toEmail }],
    subject,
    htmlContent,
    textContent,
  };
  if (replyTo) payload.replyTo = replyTo;

  try {
    const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!brevoResponse.ok) {
      const errorText = await brevoResponse.text().catch(() => "");
      console.error("Brevo upstream error", brevoResponse.status, errorText);
      return res.status(502).json(genericError);
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Brevo send error", err);
    return res.status(502).json(genericError);
  }
}
