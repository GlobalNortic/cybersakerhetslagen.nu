export type FaqItem = { q: string; a: string };

export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-border rounded-xl border border-border bg-card">
      {items.map((it, i) => (
        <details key={i} className="group p-5">
          <summary className="cursor-pointer list-none text-base font-medium marker:hidden flex items-center justify-between">
            <span>{it.q}</span>
            <span className="ml-4 text-muted-foreground transition group-open:rotate-45">+</span>
          </summary>
          <p className="mt-3 text-sm text-foreground/80">{it.a}</p>
        </details>
      ))}
    </div>
  );
}

export function faqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}
