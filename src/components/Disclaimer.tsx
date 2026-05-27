export function Disclaimer({ className = "" }: { className?: string }) {
  return (
    <p className={`rounded-md border border-border bg-muted/60 p-4 text-xs text-muted-foreground ${className}`}>
      Plattformen är ett väglednings- och dokumentationsverktyg. Den ersätter inte
      juridisk rådgivning och ger ingen garanti för rättslig efterlevnad.
    </p>
  );
}
