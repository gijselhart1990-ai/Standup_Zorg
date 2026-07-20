/* Standup Zorg — main.js (geen dependencies) */
(function () {
  'use strict';

  /* Mobiel menu */
  var toggle = document.querySelector('.nav-toggle');
  var list = document.getElementById('nav-list');
  if (toggle && list) {
    toggle.addEventListener('click', function () {
      var open = list.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && list.classList.contains('open')) {
        list.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* Reveal bij inscrollen (respecteert reduced motion) */
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = document.querySelectorAll('.reveal');
  if (!reduced && 'IntersectionObserver' in window && items.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  /* Formulier: client-side validatie + verzending via Netlify Forms ("aanmelding").
     Succes wordt pas gemeld als de server de aanvraag echt heeft ontvangen. */
  var form = document.getElementById('signup-form');
  if (form) {
    var status = document.getElementById('form-status');
    function setInvalid(field, invalid) {
      var wrap = field.closest('.field');
      if (!wrap) return;
      wrap.classList.toggle('invalid', invalid);
      field.setAttribute('aria-invalid', invalid ? 'true' : 'false');
    }
    function showStatus(cls, text) {
      status.className = 'form-status ' + cls;
      status.textContent = text;
      status.focus && status.focus();
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      var naam = form.querySelector('#f-naam');
      var email = form.querySelector('#f-email');
      var bericht = form.querySelector('#f-bericht');
      [naam, email, bericht].forEach(function (f) { setInvalid(f, false); });
      if (!naam.value.trim()) { setInvalid(naam, true); ok = false; }
      if (!email.value.trim() || email.validity.typeMismatch || !/.+@.+\..+/.test(email.value)) { setInvalid(email, true); ok = false; }
      if (!bericht.value.trim()) { setInvalid(bericht, true); ok = false; }
      /* honeypot tegen spam */
      var hp = form.querySelector('#f-web');
      if (hp && hp.value) { return; }
      if (!ok) {
        showStatus('err', 'Controleer de rood gemarkeerde velden en probeer het opnieuw.');
        return;
      }
      /* Verzenden werkt alleen op de online site, niet vanaf een lokaal bestand. */
      if (location.protocol.indexOf('http') !== 0) {
        showStatus('err', 'Versturen werkt alleen op de online website. Mail ons anders direct via info@standup-zorg.nl.');
        return;
      }
      var wie = form.querySelector('input[name="wie"]:checked');
      var onderwerp = form.querySelector('#f-onderwerp');
      var tel = form.querySelector('#f-tel');
      var submitBtn = form.querySelector('button[type="submit"]');
      var btnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Bezig met versturen…';
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          'form-name': 'aanmelding',
          wie: wie ? wie.value : '-',
          naam: naam.value.trim(),
          email: email.value.trim(),
          telefoon: (tel && tel.value.trim()) || '-',
          onderwerp: (onderwerp && onderwerp.value.trim()) || '-',
          bericht: bericht.value.trim()
        }).toString()
      }).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        form.reset();
        showStatus('ok', 'Bedankt voor je aanmelding! We nemen binnen twee werkdagen contact met je op.');
      }).catch(function () {
        showStatus('err', 'Versturen is helaas niet gelukt. Probeer het later opnieuw, of mail direct naar info@standup-zorg.nl of bel 06 - 570 236 74.');
      }).finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = btnText;
      });
    });
  }
})();
