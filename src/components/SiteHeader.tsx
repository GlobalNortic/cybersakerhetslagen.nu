import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { BrandMark } from "./BrandMark";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const link = "text-sm text-foreground/80 hover:text-primary transition-colors";
  const active = { className: "text-primary font-medium" };
  return (
    <header className="sticky top-0 z-40 w-full max-w-[100vw] box-border border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[100vw] items-center gap-3 box-border px-4 py-3 md:max-w-6xl">
        <Link to="/" className="flex min-w-0 max-w-full flex-1 items-center gap-2 font-semibold tracking-tight" aria-label="cybersakerhetslagen.nu – startsida">
          <BrandMark className="shrink-0 [width:20px] [height:20px] md:[width:22px] md:[height:22px]" />
          <span className="block min-w-0 max-w-full truncate text-sm sm:text-base text-[hsl(var(--primary))]">cybersakerhetslagen<span className="font-medium" style={{ color: "#2F6F9F" }}>.nu</span></span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/bedomning" className={link} activeProps={active}>Bedömning</Link>
          <Link to="/branscher" className={link} activeProps={active}>Branscher</Link>
          <Link to="/nis2-konsult" className={link} activeProps={active}>NIS2-konsult</Link>
          <Link to="/for-konsulter" className={link} activeProps={active}>För konsulter</Link>
          <Link to="/kontakt" className={link} activeProps={active}>Kontakt</Link>
          <Link
            to="/bedomning"
            className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            Gör preliminär bedömning
          </Link>
        </nav>
        <button
          className="md:hidden ml-auto shrink-0 rounded-md border border-border px-3 py-2 text-sm"
          onClick={() => setOpen(!open)}
          aria-label="Meny"
        >
          Meny
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="mx-auto flex w-full max-w-[100vw] flex-col gap-3 box-border px-4 py-4 md:max-w-6xl">
            <Link to="/bedomning" className={link} onClick={() => setOpen(false)}>Bedömning</Link>
            <Link to="/branscher" className={link} onClick={() => setOpen(false)}>Branscher</Link>
            <Link to="/nis2-konsult" className={link} onClick={() => setOpen(false)}>NIS2-konsult</Link>
            <Link to="/for-konsulter" className={link} onClick={() => setOpen(false)}>För konsulter</Link>
            <Link to="/kontakt" className={link} onClick={() => setOpen(false)}>Kontakt</Link>
            <Link to="/bedomning" className="rounded-md bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground" onClick={() => setOpen(false)}>
              Gör preliminär bedömning
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
