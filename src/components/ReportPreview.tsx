import heroReport from "@/assets/hero-report.png";

export function ReportPreview({ priority = false, className = "" }: { priority?: boolean; className?: string }) {
  return (
    <figure className={`w-full max-w-full min-w-0 overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-2xl ${className}`}>
      <img
        src={heroReport}
        alt="Förhandsvisning av en preliminär NIS2-bedömning: frågekort, resultatkort med vägledande indikation och checklista för nästa steg."
        width={1280}
        height={960}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        className="block h-auto w-full"
      />
    </figure>
  );
}
