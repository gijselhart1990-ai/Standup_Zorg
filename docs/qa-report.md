# QA-rapport (2026-07-10)

## Uitgevoerde tests (geautomatiseerd in deze omgeving)
- **Build:** `python3 build.py` → 11 pagina's + 404, sitemap.xml, robots.txt — zonder fouten.
- **Linkcontrole:** 22 unieke interne links, 0 dode links.
- **Assetcontrole:** 50 image-referenties (incl. alle srcset-varianten), 0 ontbrekend.
- **SEO/a11y-smoke per pagina (12/12 PASS):** exact één H1; `lang="nl"`; alle `<img>` met alt; canonical; meta description; Open Graph aanwezig.
- **Structured data:** LocalBusiness (home), Service + FAQPage (4 dienstpagina's, FAQ's zichtbaar), Person ×3 (team), BreadcrumbList (subpagina's). Geen review-/ratingdata.
- **Payload homepage (kritiek pad):** ±294 KB totaal — HTML 13 KB, CSS 18 KB, JS 3,5 KB, 2 preloaded fonts, hero-WebP 165 KB, logo 63 KB. 0 externe requests, 0 third-party scripts.

## Verwachte Lighthouse-scores (te verifiëren in browser)
Op basis van payload, geen render-blocking third parties, width/height op afbeeldingen (CLS≈0), fetchpriority op hero (snelle LCP) en semantische opbouw: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95 zijn realistisch. **Meet na deployment** met Lighthouse (mobiel) ter bevestiging.

## Toegankelijkheid (WCAG 2.2 AA — geïmplementeerd)
Skip-link; zichtbare focusstijl (`:focus-visible`); toetsenbord-bedienbaar mobiel menu met `aria-expanded` + Escape; landmarks (header/nav/main/footer); labels boven velden, foutmeldingen gekoppeld via `aria-describedby`, status via `role="status"`; native `<details>` voor FAQ; contrast: CTA #B9541F op wit ≥ 4.5:1, bodytekst #26332C en secundair #54655C op crème ≥ AA; `prefers-reduced-motion` volledig gerespecteerd; geen informatie uitsluitend via kleur.

## Responsive
CSS-breakpoints op 1000px en 600px; fluid type via clamp(); knoppen full-width op mobiel; geen vaste breedtes → geen horizontale scroll. **Handmatig na te lopen op device:** 320/375/768/1024/1280/1440.

## Beperkingen van deze QA-omgeving
- Geen browser beschikbaar → geen screenshots/Lighthouse-run/E2E (Playwright-browsers niet downloadbaar). Aanbevolen na deployment: Lighthouse mobiel + de 7 kernroutes handmatig doorlopen (home→PMT→aanmelden; home→weerbaarheid; organisaties→offerte; mobiel menu; formulier geldig; formulier ongeldig; toetsenbordnavigatie).
- Formulier: server-side afhandeling vereist configuratie (zie deployment.md).
