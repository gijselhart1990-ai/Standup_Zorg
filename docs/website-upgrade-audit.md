# Website-upgrade audit — Standup Zorg (2026-07-10)

## Beginsituatie
- Huidige site draait op Wix (standup-zorg.nl); geen repository of exporteerbare codebase beschikbaar.
- Wix Editor-pagina's zijn niet via API bewerkbaar; assets stonden als hotlinks op static.wixstatic.com.
- Geconstateerd op de live site: bedrijfsnaam stond geregistreerd als slogan-variant (inmiddels gecorrigeerd via API), footerjaartal 2023, tekstuele inconsistenties (o.a. "Bovaan", wisselende schrijfwijzen StandUp/Standup), tarievenpagina met lange opsommingen in kaarten, geen aparte route voor organisaties/verwijzers, marquee-slogan dubbelde met heroboodschap.

## Belangrijkste problemen
1. Geen scheiding tussen cliëntroute en organisatie-/verwijzersroute.
2. Diensten (therapie/training/begeleiding/coaching) onvoldoende van elkaar onderscheiden.
3. Afbeeldingen niet geoptimaliseerd (grote JPEG's, hotlinks), geen alt-teksten-strategie.
4. Geen structured data, wisselende metadata, geen sitemap-controle mogelijk.
5. Formulier zonder doelgroep-veld en zonder privacy-nota.

## Grootste kansen
- Conversiegerichte homepage met twee duidelijke bezoekersroutes.
- Volwaardige dienstpagina's met FAQ (zichtbaar) → betere SEO en minder vragen vooraf.
- Aparte organisatiepagina met offerte-CTA.
- Lokale, geoptimaliseerde assets → snelle LCP.

## Gekozen technische aanpak (met motivatie)
**Statische multi-page site, gegenereerd uit één centrale generator (build.py).**
- De bestaande "stack" is Wix; er is geen moderne repo om binnen te verbeteren → regel 2 (herbouw) is van toepassing.
- Bewust géén Next.js: de eigenaar kan geen Node.js installeren en er is geen dynamische functionaliteit die een framework rechtvaardigt. Statische HTML is sneller, robuuster, overal te hosten en zonder build-kennis te beheren. Content staat centraal in build.py (single source of truth); wijzigingen = één bestand aanpassen en `python3 build.py` draaien (of direct de HTML bewerken).
- Fonts self-hosted (Fraunces + DM Sans, latin subset, woff2) — geen Google-Fonts-request (privacy + performance).
- Afbeeldingen: responsive WebP (meerdere breedtes) + JPEG-fallback, width/height-attributen tegen CLS, lazy loading buiten viewport, hero met fetchpriority=high.

## Informatiearchitectuur (nieuw)
Home · Aanbod (→ PMT / Weerbaarheid / Bewegingsagogie / Coaching & workshops) · Voor organisaties · Over ons (incl. #team) · Tarieven & vergoedingen (incl. #vergoedingen) · Aanmelden · Contact · 404. Materialen (Dieren emotie kwartet) als ondergeschikte sectie op Aanbod.

## Risico's
- Formulier heeft nog geen server-side afhandeling (statische site) → mailto-overdracht als tussenoplossing; formulierdienst configureren (zie deployment.md).
- Webshop-checkout blijft in Wix; de knop "Bestel in de webshop" linkt daarheen.
- Tarieven/vergoedingen/registraties: overgenomen uit live site en aangeleverde gegevens — vóór publicatie laten controleren (zie content-review.md).

## Vereist inhoudelijke controle door Standup Zorg
Zie docs/content-review.md.
