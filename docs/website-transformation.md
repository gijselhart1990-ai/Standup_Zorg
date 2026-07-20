# Website-transformatie Standup Zorg — audit & uitvoering

Werkdocument bij de volledige upgrade (juli 2026). Live: https://standupzorg.netlify.app
Domein www.standup-zorg.nl blijft op Wix tot de site af is; interne links blijven relatief.

## 1. Huidige situatie (audit)

**Stack:** statische HTML (15 pagina's), één design-system-CSS (`assets/css/style.css`,
tokens → componenten), vanilla JS (`main.js` menu/reveal/formulier, `cart.js` winkelmand),
Netlify Functions voor Mollie-betaling, Netlify Forms voor bestellingen. Geen build-stap,
geen dependencies. Fonts self-hosted (Fraunces + DM Sans, woff2). Afbeeldingen jpg + webp
met srcset.

**Sterk:** consistent design system, responsive images, sticky header, skip-link,
reduced-motion-support, structured data op meerdere pagina's, sitemap + robots.txt,
werkende webshop met winkelmand en (nog te activeren) Mollie-checkout.

**Belangrijkste bevindingen:**

| # | Bevinding | Ernst |
|---|-----------|-------|
| 1 | Aanmeldformulier gebruikt `mailto:`-overdracht; geen echte serververwerking, faalt stil zonder mailprogramma | Hoog |
| 2 | `sitemap.xml` mist `webshop.html` | Middel |
| 3 | Homepage mist "herkenning"-sectie (probleemherkenning bezoeker) en productsectie kwartet | Middel |
| 4 | Hamburger-knop heeft geen toegankelijke naam (span is `hidden`) | Middel |
| 5 | Proces toont 4 stappen; reflectiestap ontbreekt in het verhaal | Laag |
| 6 | Geen privacyverklaring terwijl formulieren persoonsgegevens verwerken | Hoog |
| 7 | Webshop mist Product/Offer structured data en praktische bestel-FAQ | Middel |
| 8 | Hero-CTA's generiek ("Bekijk ons aanbod"); geen kennismakings-CTA | Laag |
| 9 | Geen `theme-color`; `.sr-only` utility ontbreekt in CSS | Laag |

## 2. Strategie

Geen framework-migratie (geen technische noodzaak; stack is snel en Netlify-compatibel).
Gerichte verdieping binnen het bestaande design system: conversiepaden aanscherpen,
ontbrekende secties toevoegen, formulier betrouwbaar maken, privacy zichtbaar regelen,
SEO/a11y-gaten dichten. Bestaande feiten (tarieven, registraties, testimonials,
contactgegevens) blijven ongewijzigd.

## 3. Uitgevoerd (bijgewerkt tijdens implementatie)

- Sitemap aangevuld met webshop; lastmod bijgewerkt.
- CSS: `.sr-only`, herkenning-chips (`.recog`), 5-koloms stappen (`.steps.s5`),
  status-/focus-tokens.
- Homepage: scherpere hero-CTA's, herkenning-sectie, 5-staps proces (incl. Reflecteren),
  kwartet-productsectie, gevarieerde CTA-teksten.
- Aanmeldformulier omgezet naar Netlify Forms (`aanmelding`) met echte
  success/error-states; mailto alleen nog als fallback in de fouttekst.
- Hamburger-knop `aria-label`; `theme-color` op alle pagina's.
- Webshop: Product/Offer structured data, bestel-FAQ en verzendinformatie.
- Privacyverklaring (concept, gemarkeerd voor juridische controle) + footerlink overal.

## 4. Risico's & menselijke controle

- Privacyverklaring is een CONCEPT: juridisch laten controleren.
- Netlify Forms: notificatie naar info@standup-zorg.nl instellen voor formulier
  `aanmelding` (net als voor `bestelling`).
- Mollie-sleutel nog niet gezet; checkout geeft bewust nette foutmelding.
- Prijs kwartet (€ 21,99) en tarieven op tarieven.html door eigenaar bevestigen.

## 5. Testplan

Zie ook docs/qa-report.md. Per release: alle routes 200 (curl), formulier leeg/ongeldig/
geldig, winkelmand toevoegen/verhogen/verwijderen/legen, checkout zonder sleutel → nette
fout, mobiel 375px + desktop 1280px screenshots, console errors, links relatief.
