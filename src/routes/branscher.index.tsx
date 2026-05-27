import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { seoFromEntry, jsonLd } from "@/lib/seo";
import { getPage } from "@/seo/pageRegistry";
import { INDUSTRIES, type Industry } from "@/lib/industries";

export const Route = createFileRoute("/branscher/")({
  head: () => {
    const s = seoFromEntry(getPage("/branscher")!);
    return {
      ...s,
      scripts: [jsonLd({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Start", item: "https://cybersakerhetslagen.nu/" },
          { "@type": "ListItem", position: 2, name: "Branscher", item: "https://cybersakerhetslagen.nu/branscher" },
        ],
      })],
    };
  },
  component: Page,
});

type Filter = "alla" | "I" | "II";

function Page() {
  const [filter, setFilter] = useState<Filter>("alla");

  const annexI = INDUSTRIES.filter((i) => i.annex === "I");
  const annexII = INDUSTRIES.filter((i) => i.annex === "II");

  const showI = filter === "alla" || filter === "I";
  const showII = filter === "alla" || filter === "II";

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-semibold md:text-4xl">{getPage("/branscher")!.h1}</h1>
      <p className="mt-4 max-w-2xl text-foreground/80">
        NIS2 pekar ut 18 sektorer som kan omfattas av cybersäkerhetslagen. Om din organisation
        verkar inom någon av dessa sektorer kan ni behöva göra en närmare bedömning.
      </p>

      {/* Filter / segment control */}
      <div
        role="tablist"
        aria-label="Filtrera sektorer"
        className="mt-6 inline-flex rounded-md border border-border bg-card p-1 text-sm"
      >
        {([
          ["alla", `Alla (${INDUSTRIES.length})`],
          ["I", `Bilaga I (${annexI.length})`],
          ["II", `Bilaga II (${annexII.length})`],
        ] as const).map(([key, label]) => {
          const active = filter === key;
          return (
            <button
              key={key}
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(key as Filter)}
              className={
                "rounded px-3 py-1.5 font-medium transition " +
                (active
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/70 hover:text-foreground")
              }
            >
              {label}
            </button>
          );
        })}
      </div>

      {showI && (
        <Group
          title="Bilaga I – högkritiska sektorer"
          description="Sektorer där medelstora och större aktörer typiskt kan klassas som väsentliga verksamhetsutövare."
          industries={annexI}
        />
      )}

      {showII && (
        <Group
          title="Bilaga II – andra kritiska sektorer"
          description="Sektorer som i regel klassas som viktiga verksamhetsutövare för medelstora och större aktörer."
          industries={annexII}
        />
      )}
    </section>
  );
}

function Group({
  title,
  description,
  industries,
}: {
  title: string;
  description: string;
  industries: Industry[];
}) {
  return (
    <div className="mt-10">
      <div className="border-b border-border pb-3">
        <h2 className="text-lg font-semibold md:text-xl">{title}</h2>
        <p className="mt-1 text-sm text-foreground/70">{description}</p>
      </div>
      <ul className="mt-4 grid gap-2 md:grid-cols-2">
        {industries.map((i) => (
          <li key={i.slug}>
            <Link
              to="/branscher/$slug"
              params={{ slug: i.slug }}
              className="group flex h-full items-start gap-3 rounded-md border border-border bg-card px-4 py-3 transition hover:bg-surface hover:border-foreground/20"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-semibold text-foreground group-hover:text-primary">
                    {i.name}
                  </span>
                  <span className="shrink-0 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    Bilaga {i.annex}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm leading-snug text-foreground/70">
                  {i.oneLine ?? i.intro}
                </p>
              </div>
              <span className="mt-0.5 shrink-0 text-xs font-medium text-primary opacity-80 group-hover:opacity-100">
                Läs mer →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
