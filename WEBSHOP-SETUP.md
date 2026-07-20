# Webshop instellen — Mollie betalingen

De webshop met winkelmandje, afrekenpagina en betaling is gebouwd. Om **echte betalingen**
(iDEAL, Google Pay, creditcard) aan te zetten en de bevestigingen naar
`info@standup-zorg.nl` te laten sturen, moet je nog 3 dingen doen. Duurt ~15 minuten
(plus wachttijd op verificatie door Mollie).

---

## Stap 1 — Mollie-account aanmaken

1. Ga naar **https://www.mollie.com/nl** en maak een account aan voor Standup Zorg.
2. Vul je bedrijfsgegevens in (KvK 88657531, IBAN van Standup Zorg). Mollie verifieert dit
   meestal binnen een dag.
3. Zet in het Mollie-dashboard de gewenste **betaalmethodes** aan:
   **iDEAL**, **Google Pay**, **Creditcard** (en eventueel PayPal, Bancontact).
4. Ga in het dashboard naar **Ontwikkelaars → API-sleutels** en kopieer de sleutel:
   - `test_...` = testmodus (geen echt geld) — handig om eerst te proberen.
   - `live_...` = echte betalingen.

> Ik heb geen account voor je aangemaakt: dat kan en mag ik niet, want er zijn
> bedrijfs- en bankgegevens voor nodig.

## Stap 2 — API-sleutel in Netlify zetten

1. Ga naar **https://app.netlify.com** → project **standupzorg**.
2. **Site configuration → Environment variables → Add a variable**.
3. Key: `MOLLIE_API_KEY` — Value: je Mollie-sleutel (begin met `test_...` om te testen).
4. Opslaan en daarna **Deploys → Trigger deploy → Deploy site** (zodat de functie de sleutel oppikt).

## Stap 3 — Bestellingen en aanmeldingen per e-mail ontvangen

De bestelling + betaalbevestiging én websiteaanmeldingen worden via **Netlify Forms**
naar je gemaild. **Belangrijk: Form detection staat standaard UIT** — getest op
2026-07-20: formulier-POSTs geven nu 404 totdat je dit aanzet.

1. In Netlify: **Site configuration → Forms → Enable form detection** → aanzetten.
2. Daarna **Deploys → Trigger deploy → Deploy site** (nodig zodat Netlify de
   formulieren `bestelling` en `aanmelding` registreert).
3. Open daarna onder **Forms** elk formulier → **Settings → Form notifications →
   Add notification → Email notification** → `info@standup-zorg.nl`. Opslaan.
   Doe dit voor **beide** formulieren: `bestelling` en `aanmelding`.

Vanaf nu krijg je per bestelling twee mails:
- **In afwachting van betaling** — zodra iemand op "Betalen" klikt (met alle klantgegevens).
- **BETAALD ✓** — zodra Mollie de betaling bevestigt (met betaalmethode).

Mollie stuurt jou daarnaast zelf ook een melding van elke geslaagde betaling, als extra controle.

---

## Testen (aanbevolen vóór livegang)

1. Gebruik eerst de `test_...` sleutel in stap 2.
2. Ga naar de webshop, leg het kwartet in de mand en reken af.
3. Op de Mollie-pagina kies je een methode en zet je de status op **Paid** (testmodus laat je dit kiezen).
4. Controleer of `info@standup-zorg.nl` de twee mails ontvangt.
5. Werkt alles? Vervang `MOLLIE_API_KEY` door de `live_...` sleutel en deploy opnieuw.

## Prijs of verzendkosten aanpassen

- **Prijs** staat op 2 plekken (moeten gelijk zijn):
  - `assets/js/cart.js` → `PRODUCTS.dek.prijs` (in centen, nu `2199`)
  - `netlify/functions/create-payment.js` → `PRODUCTS.dek.prijs`
- **Verzendkosten**: verzending is inbegrepen in de prijs (`VERZENDKOSTEN = 0`).
  Wil je toch aparte verzendkosten? Pas `VERZENDKOSTEN` (in centen) aan op twee plekken:
  - `netlify/functions/create-payment.js`
  - `afrekenen.html` (in het script onderaan)

Geef het door, dan pas ik het voor je aan.

## Nieuw product toevoegen

Laat het me weten met naam, prijs en foto('s), dan voeg ik het product toe aan de webshop
(`cart.js`, `create-payment.js` en `webshop.html`).
