/* Netlify Function — Mollie webhook.
   Mollie roept deze aan zodra de betaalstatus wijzigt. We halen de betaling op,
   en als die betaald is sturen we een bevestiging naar info@standup-zorg.nl
   via een Netlify-formulier ("bestelling").
   Vereist environment variable: MOLLIE_API_KEY */

'use strict';

exports.handler = async function (event) {
  /* Mollie verwacht altijd snel een 200, anders blijft het opnieuw proberen. */
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.MOLLIE_API_KEY;
  if (!apiKey) return { statusCode: 200, body: 'ok' };

  /* Body is form-encoded: id=tr_xxxxx */
  let id = '';
  try {
    const params = new URLSearchParams(event.body || '');
    id = params.get('id') || '';
  } catch (e) { /* negeren */ }
  if (!id) return { statusCode: 200, body: 'ok' };

  try {
    const res = await fetch('https://api.mollie.com/v2/payments/' + encodeURIComponent(id), {
      headers: { 'Authorization': 'Bearer ' + apiKey }
    });
    const p = await res.json();
    if (!res.ok) return { statusCode: 200, body: 'ok' };

    if (p.status === 'paid') {
      const m = p.metadata || {};
      const klant = m.klant || {};
      const base = (process.env.URL || 'https://standupzorg.netlify.app').replace(/\/$/, '');

      const velden = {
        'form-name': 'bestelling',
        ordernummer: m.ordernummer || id,
        betaalstatus: 'BETAALD ✓',
        betaalmethode: p.method || '-',
        naam: klant.naam || '-',
        email: klant.email || '-',
        telefoon: klant.telefoon || '-',
        adres: klant.adres || '-',
        postcode: klant.postcode || '-',
        plaats: klant.plaats || '-',
        bestelling: m.bestelling || '-',
        aantal: String(m.aantal || '-'),
        subtotaal: '€ ' + (m.subtotaal || '-'),
        verzendkosten: m.verzendkosten || 'inbegrepen',
        totaal: '€ ' + (m.totaal || '-'),
        opmerking: klant.opmerking || '-'
      };

      /* Naar Netlify Forms posten → e-mailnotificatie naar info@standup-zorg.nl */
      try {
        await fetch(base + '/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(velden).toString()
        });
      } catch (e) { /* negeren; Mollie stuurt zelf ook een melding */ }
    }
  } catch (err) {
    /* Altijd 200 teruggeven zodat Mollie niet blijft herhalen op een echte fout */
  }

  return { statusCode: 200, body: 'ok' };
};
