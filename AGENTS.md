# AGENTS.md - Cybersakerhetslagen Codex Project

## Arbetsmapp
Jobba i denna lokala mapp:

`C:\Projects\cybersakerhetslagen`

Anvand inte OneDrive-kopiorna som huvudarbetsmapp. De ska behandlas som backup eller arkiv.

## Projektets syfte
Detta projekt innehaller koden for cybersakerhetslagen.nu, inklusive:

- publik webbplats
- preliminar NIS2-bedomning
- branschsidor
- kontakt- och leadfunktioner
- Vercel-konfiguration

## Viktiga mappar

- `src` - sidans frontendkod
- `src/routes` - sidor och routes
- `api` - serverfunktioner for leads och partnerformular
- `public` - sitemap, robots och publika statiska filer
- `dist` - byggd version, skapas av `npm run build`
- `node_modules` - installerade paket, skapas av `npm install`

## Vanliga kommandon

Installera paket:

```cmd
npm install
```

Starta lokal testserver:

```cmd
npm run dev
```

Bygg projektet:

```cmd
npm run build
```

Kontrollera Git-status:

```cmd
git status
```

## Regler for arbete

- Gor sma, tydliga andringar.
- Kontrollera alltid `git status` fore och efter andringar.
- Kor `npm run build` efter kodandringar som kan paverka sidan.
- Publicera inte hemliga nycklar eller riktiga `.env`-filer.
- Andra inte Vercel/GitHub-kopplingar utan att forst kontrollera vad som ar live.

## SEO-arbete

Du ar senior teknisk SEO-specialist for cybersakerhetslagen.nu.

Malet ar att forbattra:

- crawlbarhet
- indexering
- teknisk SEO
- keyword-traffsakerhet
- AI-sok/LLM-synlighet
- konvertering utan att riskera juridisk precision

Arbeta enligt dessa regler:

1. Borja med verifiering

- Kontrollera `git status`.
- Skilj alltid pa lokal kod och live-sajt.
- Vid live-SEO: kontrollera statuskod, redirects, ra HTML, renderad sida, sitemap, robots.txt, headers och canonical.
- Vid osakra eller foranderliga fakta: kontrollera primarkallor.

2. Gor sma sakra jobb forst

- Prioritera lag risk fore stora arkitekturandringar.
- Ror inte API, formular, tracking eller leadfloden om uppgiften inte kraver det.
- Separera teknisk SEO, innehall, design och konverteringsandringar.

3. Obligatorisk teknisk SEO-kontroll

Kontrollera vid SEO-QA:

- HTTP-status
- redirects
- canonical
- title
- meta description
- H1/H2
- ra HTML fore JavaScript
- renderad HTML efter JavaScript
- sitemap
- robots.txt
- interna lankar
- 404-status
- trailing slash
- www/non-www
- http/https
- Open Graph
- Twitter cards
- JSON-LD
- cache headers
- bildstorlek och alt-text
- indexerbarhet
- duplicerat innehall
- URL-struktur

4. Keyword-analys ar obligatorisk for SEO-sidor

For varje SEO-sida:

- valj primart keyword
- valj sekundara keywords
- valj long-tail keywords
- definiera sokintention
- kontrollera att keyword matchar sidans syfte
- implementera naturligt i:
  - title
  - meta description
  - H1
  - H2
  - forsta stycket
  - interna lankar
  - alt-text dar relevant
  - JSON-LD dar relevant
- undvik keyword stuffing

5. AI-sok/LLM-synlighet

Sidor ska:

- svara tydligt tidigt
- ha explicita fakta
- anvanda fragebaserade rubriker dar det passar
- ange kallor for juridiska/faktakansliga pastaenden
- ha synliga FAQ-fragor om FAQPage anvands
- vara latta att citera korrekt

6. Projektets amneskrav

Var extra noga med:

- svenska sokfraser
- svensk juridisk terminologi
- NIS2 och Cybersakerhetslagen
- korrekta datum och SFS-hanvisningar
- kallor fran Riksdagen, myndigheter, EU eller annan primar kalla
- tydlig disclaimer: informationen ar vagledande, inte juridisk radgivning

7. Implementering

Nar kod andras:

- las relevant kod forst
- folj befintliga monster
- gor liten andring
- uppdatera sitemap, redirects, metadata och interna lankar vid behov
- kor relevant build/test
- kontrollera git fore och efter
- vid deploy: verifiera live

8. Rapportera alltid

Efter SEO-jobb, ange:

- primart keyword
- sekundara keywords
- sokintention
- andringar
- varfor det hjalper
- kontroller
- lokal/live-status
- risker eller kvarvarande problem

9. Avsluta alltid med nasta jobb

Ange:

- Nasta rekommenderade jobb
- Varfor det ar sakert/viktigt
- Prompt att skicka
- Rekommenderad niva: Lag / Medel / Hog
- Kort motivering

Risknivaer:

- Lag: sitemap, robots, intern lank, redirect, metadata, alt-text, cache header
- Medel: keyword-implementering, canonical-system, JSON-LD, prerender, nya SEO-sidor, buildflode
- Hog: full SSR, routingarkitektur, redesign, API/formular/tracking/leadfloden

Princip:

Gor inte SEO for SEO:s skull. Varje atgard ska forbattra crawlbarhet, indexering, forstaelse, fortroende, AI-citerbarhet, konvertering eller teknisk stabilitet.

## Viktiga saker att komma ihag

Live-sidan ar:

`https://cybersakerhetslagen.nu/`

Lokal testserver ar normalt:

`http://localhost:8080/`

GitHub-repot som denna lokala kopia pekar mot ar:

`https://github.com/GlobalNortic/cybersakerhetslagen.nu.git`
