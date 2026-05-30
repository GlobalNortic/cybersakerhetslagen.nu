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

## Viktiga saker att komma ihag

Live-sidan ar:

`https://cybersakerhetslagen.nu/`

Lokal testserver ar normalt:

`http://localhost:8080/`

GitHub-repot som denna lokala kopia pekar mot ar:

`https://github.com/GlobalNortic/cybersakerhetslagen.nu.git`
