import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-16 w-full max-w-[100vw] box-border border-t border-border bg-surface">
      <div className="mx-auto grid w-full max-w-[100vw] gap-8 box-border px-4 py-12 md:max-w-6xl md:grid-cols-4">
        <div>
          <div className="font-semibold">cybersakerhetslagen.nu</div>
          <p className="mt-2 text-sm text-muted-foreground">
            Vägledande information om Cybersäkerhetslagen (2025:1506) och Sveriges
            NIS2-implementering.
          </p>
        </div>
        <div>
          <div className="text-sm font-medium">Verktyg</div>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li><Link to="/bedomning" className="hover:text-primary">Preliminär bedömning</Link></li>
            <li><Link to="/branscher" className="hover:text-primary">Branscher</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-medium">För företag</div>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li><Link to="/nis2-konsult" className="hover:text-primary">Hitta NIS2-konsult</Link></li>
            <li><Link to="/for-konsulter" className="hover:text-primary">För konsulter</Link></li>
            <li><Link to="/kontakt" className="hover:text-primary">Kontakt</Link></li>
            <li><a href="mailto:kontakt@cybersakerhetslagen.nu" className="hover:text-primary">kontakt@cybersakerhetslagen.nu</a></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-medium">Juridiskt</div>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li><Link to="/ikrafttradandedatum" className="hover:text-primary">Ikraftträdandedatum</Link></li>
            <li><Link to="/integritet" className="hover:text-primary">Integritetspolicy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto w-full max-w-[100vw] box-border px-4 py-6 text-xs text-muted-foreground md:max-w-6xl">
          Plattformen är ett väglednings- och dokumentationsverktyg. Den ersätter inte
          juridisk rådgivning och ger ingen garanti för rättslig efterlevnad.
        </div>
      </div>
    </footer>
  );
}
