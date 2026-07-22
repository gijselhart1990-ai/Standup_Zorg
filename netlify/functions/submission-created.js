/* Netlify Function — wordt automatisch aangeroepen bij elke formulierinzending.
   Stuurt een bevestiging naar de klant zelf (Standup Zorg krijgt al een melding
   via Netlify Forms).

   Vereist environment variable: RESEND_API_KEY
   Zonder die sleutel doet deze functie niets en breekt er niets. */

'use strict';

const AFZENDER = 'Standup Zorg <info@standup-zorg.nl>';
const ANTWOORD_NAAR = 'info@standup-zorg.nl';

exports.handler = async function (event) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return ok(); /* nog niet geconfigureerd */

  let payload;
  try {
    payload = JSON.parse(event.body || '{}').payload || {};
  } catch (e) { return ok(); }

  const formulier = payload.form_name || '';
  const d = payload.data || {};
  const email = String(d.email || '').trim();
  const naam = String(d.naam || '').trim();

  /* Zonder geldig e-mailadres valt er niets te bevestigen */
  if (!/.+@.+\..+/.test(email)) return ok();

  let onderwerp, inhoud;

  if (formulier === 'aanmelding') {
    onderwerp = 'We hebben je aanmelding ontvangen';
    inhoud = blok(
      `Hoi${naam ? ' ' + voornaam(naam) : ''},`,
      `<p>Bedankt voor je bericht aan Standup Zorg. We hebben je aanmelding goed ontvangen
       en nemen <b>binnen twee werkdagen</b> contact met je op om een vrijblijvende
       kennismaking te plannen.</p>`,
      d.bericht ? `<p style="color:#54655C;font-size:14px"><b>Je bericht:</b><br>${esc(d.bericht)}</p>` : '',
      `<p>Heb je tussendoor een vraag? Bel gerust 06 - 570 236 74 of mail naar
       <a href="mailto:info@standup-zorg.nl">info@standup-zorg.nl</a>.</p>`
    );

  } else if (formulier === 'bestelling') {
    /* Dit formulier komt twee keer binnen: bij aanmaken en na betaling.
       Alleen ná een geslaagde betaling sturen we de klant een bevestiging. */
    const betaald = String(d.betaalstatus || '').toUpperCase().indexOf('BETAALD') === 0;
    if (!betaald) return ok();

    onderwerp = 'Bedankt voor je bestelling bij Standup Zorg';
    inhoud = blok(
      `Hoi${naam ? ' ' + voornaam(naam) : ''},`,
      `<p>Bedankt voor je bestelling! We hebben je betaling ontvangen en maken je pakketje klaar.
       De levertijd is <b>7 tot 14 dagen</b>.</p>`,
      `<table style="border-collapse:collapse;font-size:14px;margin:18px 0">
         ${rij('Ordernummer', d.ordernummer)}
         ${rij('Bestelling', d.bestelling)}
         ${rij('Totaal', d.totaal)}
         ${rij('Bezorgadres', [d.adres, [d.postcode, d.plaats].filter(Boolean).join('  ')].filter(Boolean).join('<br>'))}
       </table>`,
      `<p>Vragen over je bestelling? Mail naar
       <a href="mailto:info@standup-zorg.nl">info@standup-zorg.nl</a> met je ordernummer.</p>`
    );

  } else {
    return ok(); /* onbekend formulier: niets doen */
  }

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: AFZENDER,
        to: [email],
        reply_to: ANTWOORD_NAAR,
        subject: onderwerp,
        html: inhoud
      })
    });
  } catch (err) {
    /* Bevestiging mislukt: Standup Zorg heeft de inzending al binnen via Netlify Forms */
  }

  return ok();
};

function ok() { return { statusCode: 200, body: 'ok' }; }

function voornaam(naam) { return esc(naam.split(' ')[0]); }

function esc(s) {
  return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

function rij(label, waarde) {
  if (!waarde) return '';
  return `<tr>
    <td style="padding:6px 16px 6px 0;color:#54655C;vertical-align:top">${label}</td>
    <td style="padding:6px 0"><b>${waarde}</b></td>
  </tr>`;
}

function blok(aanhef, ...delen) {
  return `<div style="font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.7;color:#26332C;max-width:560px">
    <p style="font-size:18px;margin:0 0 16px"><b>${esc(aanhef)}</b></p>
    ${delen.filter(Boolean).join('\n')}
    <p style="margin-top:28px">Hartelijke groet,<br><b>Team Standup Zorg</b></p>
    <hr style="border:0;border-top:1px solid #dfe9e2;margin:24px 0">
    <p style="font-size:13px;color:#54655C;margin:0">
      Standup Zorg · Therapie, training en coaching in Midden-Nederland<br>
      06 - 570 236 74 · info@standup-zorg.nl · KvK 88657531
    </p>
  </div>`;
}
