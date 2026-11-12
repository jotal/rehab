# Jotal Rehab – Celluma ELITE

Statisk webbplats om behandling med Celluma ELITE (LED-ljusterapi) med möjlighet att skicka bokningsförfrågan.
Hostas på **Azure Static Web Apps** och nås på **www.jotal.se**.

## Struktur

```
index.html                 Startsidan (all info + bokning)
404.html                   Sidan som visas när en adress inte finns
css/style.css              Utseende
js/main.js                 Bokningsformulär + INSTÄLLNINGAR överst i filen
img/favicon.svg            Ikon i webbläsarfliken
staticwebapp.config.json   Azure-inställningar (404, säkerhetsheaders, cache)
```

## Saker att ändra innan lansering

Överst i `js/main.js` (`CONFIG`):

- `email` – dit bokningsförfrågningar går (t.ex. `info@jotal.se` – kontrollera att adressen faktiskt tar emot mejl)
- `phoneDisplay` / `phoneLink` – riktigt telefonnummer
- `openingHours` och `slotMinutes` – vilka tider som går att välja
- `externalBookingUrl` – om du skaffar ett bokningssystem (Bokadirekt, Timma, Calendly …), klistra in länken så visas en knapp

I `index.html`: företagsnamn ("Jotal Rehab"), texter och behandlingar.

> **Om bokningen:** Formuläret öppnar besökarens e-postprogram med en färdig förfrågan. Det finns ingen
> server som lagrar bokningar. Vill du ha riktig onlinebokning med lediga tider – använd ett bokningssystem
> och sätt `externalBookingUrl`, eller bygg vidare med en Azure Functions-backend.

## Testa lokalt

Öppna `index.html` direkt i webbläsaren, eller kör en lokal server:

```bash
npx serve .
```

## Driftmiljö

| | |
|---|---|
| Azure-prenumeration | Azure subscription (tenant `jotal.onmicrosoft.com`) |
| Resursgrupp | `rg-jotal-web` |
| Static Web App | `jotal-rehab` (Free, East US 2 – West Europe tog inte emot nya appar) |
| Standardadress | https://brave-mushroom-028a75f0f.8.azurestaticapps.net |
| Egen domän | https://www.jotal.se (CNAME hos Loopia, certifikat från Azure) |

## Deploy

Varje `git push` till `main` deployas automatiskt via GitHub Actions
(`.github/workflows/azure-static-web-apps.yml`). Pull requests mot `main` får en egen
förhandsvisnings-URL som stängs när PR:en stängs. En deploy kan också startas manuellt under
*Actions → Deploy till Azure Static Web Apps → Run workflow*.

Workflowen kräver hemligheten `AZURE_STATIC_WEB_APPS_API_TOKEN` i repot
(*Settings → Secrets and variables → Actions*). Ny token hämtas med:

```bash
az staticwebapp secrets list -n jotal-rehab -g rg-jotal-web --query properties.apiKey -o tsv
```

## DNS hos Loopia

| Subdomän | Typ | Värde |
|---|---|---|
| `www` | CNAME | `brave-mushroom-028a75f0f.8.azurestaticapps.net.` |
| `@` | MX / TXT | Loopias e-post – rör inte |

Rotdomänen `jotal.se` ska vidarebefordras till `https://www.jotal.se` hos Loopia
(Loopia stöder inte ALIAS-poster). Alternativt: flytta DNS till Azure DNS och använd en alias-post.
