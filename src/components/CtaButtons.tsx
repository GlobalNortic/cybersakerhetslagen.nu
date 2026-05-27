import { Link } from "@tanstack/react-router";
import { track } from "@/lib/analytics";

export function PrimaryCta({ children = "Gör preliminär bedömning", to = "/bedomning" }: { children?: string; to?: string }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
    >
      {children}
    </Link>
  );
}

export function SecondaryCta({ children = "Boka genomgång", to = "/kontakt" }: { children?: string; to?: string }) {
  const isContact = to === "/kontakt";
  return (
    <Link
      to={to}
      onClick={() => isContact && track("consultant_contact", { kalla: "secondary_cta" })}
      className="inline-flex items-center justify-center rounded-md border border-border bg-background px-5 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
    >
      {children}
    </Link>
  );
}
