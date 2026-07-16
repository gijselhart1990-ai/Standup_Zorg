# Standup Zorg — website

Statische website (HTML/CSS/JS), gegenereerd met `build.py`.

## Lokaal bekijken
Open `index.html` direct in je browser, of start een mini-server:
```
cd site && python3 -m http.server 8000
```
→ http://localhost:8000

## Content aanpassen
1. Open `build.py` — alle teksten staan per pagina bij elkaar.
2. Pas de tekst aan en draai `python3 build.py` (vanuit de map boven `site/`).
   Alternatief: bewerk de HTML-bestanden direct (kleine wijzigingen).

## Nieuwe foto toevoegen
Voeg de bron toe aan de image-pijplijn (zie audit) of plaats handmatig een geoptimaliseerde WebP in `assets/img/` en verwijs ernaar.

## Structuur
```
site/
  index.html … contact.html, 404.html
  assets/css/style.css   (designsysteem)
  assets/js/main.js      (menu, reveal, formulier)
  assets/fonts/          (self-hosted woff2)
  assets/img/            (responsive WebP + fallbacks)
  sitemap.xml, robots.txt
  docs/                  (audit, content-review, deployment, qa-report)
```

## Publiceren
Zie `docs/deployment.md` (hosting, redirects, formulierdienst).
