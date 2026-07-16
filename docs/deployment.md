# Deployment — Standup Zorg (statische site)

## Wat is dit?
Een volledig statische website: HTML + CSS + JS + assets. Geen build-stap nodig om te hosten; `build.py` is alleen nodig om pagina's opnieuw te genereren na contentwijzigingen (Python 3, geen dependencies behalve niets — Pillow alleen voor nieuwe afbeeldingen).

## Hosten (kies één)
1. **Netlify / Vercel / Cloudflare Pages (aanbevolen):** sleep de map `site/` in het dashboard of koppel een Git-repo. HTTPS en CDN automatisch.
2. **Klassieke hosting:** upload de inhoud van `site/` naar de webroot via (S)FTP.

Domein: verwijs www.standup-zorg.nl naar de nieuwe hosting (DNS). Houd de Wix-webshop bereikbaar zolang de shop daar draait, of verhuis de shop later.

## Redirects (oude Wix-URL's → nieuw)
Configureer permanente (301) redirects op hostingniveau:
```
/over-ons        /over-ons.html        301
/team            /over-ons.html#team   301
/aanbod          /aanbod.html          301
/tarieven        /tarieven.html        301
/vergoedingen    /tarieven.html#vergoedingen 301
/contact         /contact.html         301
```
(Netlify: `_redirects`-bestand met exact deze regels in de site-root.)

## Formulier (belangrijk)
Het aanmeldformulier valideert client-side en opent nu een voor-ingevulde e-mail (mailto) — er is géén server. Voor echte server-side afhandeling + spamfilter:
1. Maak een account bij een formulierdienst (bijv. Formspree of Netlify Forms).
2. Netlify Forms: voeg `data-netlify="true"` en `name="aanmelden"` toe aan het `<form>`-element; klaar.
3. Formspree: zet `action="https://formspree.io/f/XXXX"` en `method="POST"` op het formulier.
Het honeypot-veld (`website`) is al aanwezig voor spambeveiliging.

## Environment variables / secrets
Geen. De site gebruikt geen API-keys en laadt nul externe scripts.

## Analytics (optioneel)
Niet geïnstalleerd (privacy by design). Aanbevolen indien gewenst: een cookieloze, privacyvriendelijke teller (bijv. Plausible/Simple Analytics). Nuttige events: klik Aanmelden, formulier verzonden, klik telefoon, klik e-mail, bezoek dienstpagina, offerte-CTA organisaties.

## 404
`404.html` is aanwezig; activeer deze in de hostingconfiguratie (Netlify/Vercel: automatisch).
