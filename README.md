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

## Deploya till Azure (första gången)

1. **Pusha till GitHub** – `main`-branchen i `jotal/rehab`.
2. **Skapa Static Web App** i Azure-portalen: *Create a resource → Static Web App*
   - Resource group: `rg-jotal-web`, Name: `jotal-rehab`, Plan: **Free**, Region: West Europe
   - Source: **GitHub** → `jotal/rehab`, branch `main`
   - Build preset: **Custom**, App location: `/`, Api location: *(tomt)*, Output location: *(tomt)*
3. Azure lägger till en GitHub Actions-workflow i repot. Gör `git pull` lokalt för att få ner den.
4. Efter ~1 min är sajten live på `https://<namn>.azurestaticapps.net`.

Därefter: varje `git push` till `main` deployas automatiskt. Pull requests får en egen förhandsvisnings-URL.

## Koppla www.jotal.se (DNS hos Loopia)

1. Azure: Static Web App → **Custom domains → Add → Custom domain on other DNS** → `www.jotal.se`.
2. Loopia: Kundzonen → `jotal.se` → **DNS-editor** → subdomän `www`:
   - ta bort befintliga A/AAAA-poster
   - lägg till **CNAME** → `<namn>.azurestaticapps.net`
3. Azure: klicka **Validate**. HTTPS-certifikat skapas automatiskt (5–30 min).
4. Rotdomänen `jotal.se`: ställ in vidarebefordring till `https://www.jotal.se` hos Loopia
   (Loopia stöder inte ALIAS-poster). Alternativt flytta DNS till Azure DNS och använd en alias-post.
