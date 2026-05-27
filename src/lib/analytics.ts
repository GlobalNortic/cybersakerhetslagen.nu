// Lightweight, privacy-friendly analytics dispatcher.
// No PII, no external SDK. Pushes to window.dataLayer if present (GTM/GA4),
// calls window.plausible if present, and dispatches a CustomEvent on window
// so any listener (including future tag managers) can subscribe.

export type AnalyticsEvent =
  | "assessment_started"
  | "assessment_completed"
  | "report_viewed"
  | "consultant_contact";

type Props = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    plausible?: (event: string, opts?: { props?: Props }) => void;
  }
}

export function track(event: AnalyticsEvent, props: Props = {}) {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...props });
    window.plausible?.(event, { props });
    window.dispatchEvent(new CustomEvent("analytics", { detail: { event, props } }));
  } catch {
    /* no-op */
  }
}
