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

  /* Formulier: client-side validatie + mailto-overdracht.
     NB: server-side afhandeling vereist een formulierendienst — zie docs/deployment.md. */
  var form = document.getElementById('signup-form');
  if (form) {
    var status = document.getElementById('form-status');
    function setInvalid(field, invalid) {
      var wrap = field.closest('.field');
      if (!wrap) return;
      wrap.classList.toggle('invalid', invalid);
      field.setAttribute('aria-invalid', invalid ? 'true' : 'false');
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
        status.className = 'form-status err';
        status.textContent = 'Controleer de rood gemarkeerde velden en probeer het opnieuw.';
        status.focus && status.focus();
        return;
      }
      var wie = form.querySelector('input[name="wie"]:checked');
      var onderwerp = form.querySelector('#f-onderwerp');
      var tel = form.querySelector('#f-tel');
      var subject = encodeURIComponent('Aanmelding via website — ' + ((onderwerp && onderwerp.value) || 'contact'));
      var body = encodeURIComponent(
        'Naam: ' + naam.value + '\n' +
        'E-mail: ' + email.value + '\n' +
        'Telefoon: ' + ((tel && tel.value) || '-') + '\n' +
        'Ik ben: ' + (wie ? wie.value : '-') + '\n\n' +
        bericht.value
      );
      window.location.href = 'mailto:info@standup-zorg.nl?subject=' + subject + '&body=' + body;
      status.className = 'form-status ok';
      status.textContent = 'Je e-mailprogramma opent met het ingevulde bericht. Verstuur dit om je aanvraag af te ronden.';
    });
  }
})();
