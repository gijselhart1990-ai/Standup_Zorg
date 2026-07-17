/* Netlify Function — maakt een Mollie-betaling aan.
   De prijzen worden HIER (server-side) bepaald, nooit vanuit de browser vertrouwd.
   Vereist environment variable: MOLLIE_API_KEY (test_... of live_...) */

'use strict';

/* Producten + prijzen in centen. Pas hier de prijs aan als die verandert. */
const PRODUCTS = {
  dek: { naam: 'Dieren Emotie Kwartet', prijs: 2199 }
};

/* Verzendkosten in centen. Verzending is inbegrepen in de productprijs. */
const VERZENDKOSTEN = 0;

/* Voor de e-mail/metadata: Nederlands formaat met komma. */
function euro(cents) {
  return (cents / 100).toFixed(2).replace('.', ',');
}
/* Voor de Mollie API: bedrag met punt, bv. "26.94". */
function mollieAmount(cents) {
  return (cents / 100).toFixed(2);
}

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.MOLLIE_API_KEY;
  if (!apiKey) {
    return json(500, { error: 'Betalingen zijn nog niet geconfigureerd (MOLLIE_API_KEY ontbreekt).' });
  }

  let payload;
  try { payload = JSON.parse(event.body || '{}'); }
  catch (e) { return json(400, { error: 'Ongeldige aanvraag.' }); }

  const items = Array.isArray(payload.items) ? payload.items : [];
  const klant = payload.klant || {};
  const ordernummer = String(payload.ordernummer || 'SZ-' + Date.now()).slice(0, 40);

  /* Regels opbouwen op basis van vertrouwde serverprijzen */
  let subtotaal = 0;
  const regels = [];
  for (const it of items) {
    const p = PRODUCTS[it && it.id];
    if (!p) continue;
    let aantal = parseInt(it.aantal, 10);
    if (!Number.isFinite(aantal) || aantal < 1) aantal = 1;
    if (aantal > 99) aantal = 99;
    subtotaal += p.prijs * aantal;
    regels.push({ id: it.id, naam: p.naam, aantal: aantal, stukprijs: p.prijs });
  }

  if (!regels.length) {
    return json(400, { error: 'Je winkelmandje is leeg.' });
  }
  if (!klant.naam || !klant.email) {
    return json(400, { error: 'Vul je naam en e-mailadres in.' });
  }

  const totaal = subtotaal + VERZENDKOSTEN;
  const base = (process.env.URL || 'https://standupzorg.netlify.app').replace(/\/$/, '');
  const bestellingStr = regels.map(r => r.aantal + '× ' + r.naam).join(', ');

  const body = {
    amount: { currency: 'EUR', value: mollieAmount(totaal) },
    description: 'Standup Zorg bestelling ' + ordernummer,
    redirectUrl: base + '/bedankt.html?order=' + encodeURIComponent(ordernummer),
    webhookUrl: base + '/.netlify/functions/mollie-webhook',
    metadata: {
      ordernummer: ordernummer,
      klant: {
        naam: String(klant.naam || '').slice(0, 120),
        email: String(klant.email || '').slice(0, 160),
        telefoon: String(klant.telefoon || '').slice(0, 40),
        adres: String(klant.adres || '').slice(0, 160),
        postcode: String(klant.postcode || '').slice(0, 20),
        plaats: String(klant.plaats || '').slice(0, 80),
        opmerking: String(klant.opmerking || '').slice(0, 500)
      },
      bestelling: bestellingStr,
      aantal: regels.reduce((n, r) => n + r.aantal, 0),
      subtotaal: euro(subtotaal),
      verzendkosten: 'inbegrepen',
      totaal: euro(totaal)
    }
  };

  try {
    const res = await fetch('https://api.mollie.com/v2/payments', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) {
      const msg = (data && data.detail) || 'Betaling kon niet worden aangemaakt.';
      return json(502, { error: msg });
    }
    const checkoutUrl = data._links && data._links.checkout && data._links.checkout.href;
    if (!checkoutUrl) {
      return json(502, { error: 'Geen betaal-URL ontvangen van Mollie.' });
    }
    return json(200, { checkoutUrl: checkoutUrl, ordernummer: ordernummer });
  } catch (err) {
    return json(502, { error: 'Verbinding met de betaaldienst mislukt.' });
  }
};

function json(statusCode, obj) {
  return {
    statusCode: statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(obj)
  };
}
