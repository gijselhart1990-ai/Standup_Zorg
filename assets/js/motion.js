/* Standup Zorg — motion.js
   Sportieve, vloeiende animaties bovenop main.js. Geen dependencies.
   Plaats na main.js:  <script src="assets/js/motion.js" defer></script>
   Respecteert prefers-reduced-motion. Per pagina eigen accenten (zie PAGES). */
(function () {
  'use strict';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var PAGES = {
    index: { hl: 2, words: ['Bewegen', 'Oefenen', 'Ervaren', 'Ontdekken', 'In je kracht staan'] },
    aanbod: { hl: 3, words: ['Therapie', 'Training', 'Begeleiding', 'Coaching'] },
    pmt: { duo: 'split', words: ['Doen', 'Voelen', 'Ervaren', 'Reflecteren', 'Vertalen naar thuis'] },
    weerbaarheid: { duo: 'repel', words: ['Grenzen voelen', 'Stop zeggen', 'Voor jezelf opkomen', 'Je eigen kracht ervaren'] },
    bewegingsagogie: { duo: 'bounce', words: ['Samen in beweging', 'Succeservaringen', 'Plezier in bewegen', 'Voor elk niveau'] },
    coaching: { spotlight: true, words: ['Bewustwording', 'Actie', 'Teamkracht', 'Bewegen is de sleutel tot welzijn'] },
    organisaties: { words: ['Groepstrajecten', 'Weerbaarheid', 'Workshops', 'Teamcoaching', 'Maatwerk'] },
    'over-ons': { words: ['Actief', 'Betrokken', 'Energiek'] },
    webshop: { product: true, words: ['Spelenderwijs', 'Emoties herkennen', 'Emoties benoemen', 'Thuis, in de klas of in therapie'] },
    tarieven: { calm: true, count: true },
    contact: { calm: true },
    aanmelden: { calm: true }
  };
  var slug = (document.body.getAttribute('data-motion') ||
    decodeURIComponent(location.pathname.split('/').pop() || 'index').replace(/\.html?$/, '')) || 'index';
  var cfg = PAGES[slug] || { calm: true };
  var calm = !!cfg.calm, amp = calm ? 0.45 : 1;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- styles ---------- */
  var css = [
    'html,body{overflow-x:clip}',
    '.mo .reveal{transform:translateY(40px);transition:opacity .7s var(--ease),transform .9s var(--ease)}',
    '.mo .reveal.in{transform:none}',
    '.mo-child{opacity:0;transform:translateY(34px)}',
    '.mo-child.mo-l{transform:translateX(-56px) rotate(-1.2deg)}',
    '.mo-child.mo-r{transform:translateX(56px) rotate(1.2deg)}',
    '.reveal.in .mo-child{opacity:1;transform:none;transition:opacity .6s var(--ease),transform .9s var(--ease);transition-delay:calc(var(--i,0) * 85ms)}',
    '.mo-w{display:inline-block;position:relative;overflow:hidden;vertical-align:top;padding-bottom:.12em;margin-bottom:-.12em}',
    '.mo-wi{display:inline-block;transform:translateY(110%);transition:transform .9s var(--ease)}',
    '.mo-go .mo-wi{transform:none}',
    '.mo-sw{position:absolute;left:0;right:0;bottom:.06em;height:.13em;border-radius:999px;background:var(--salmon);transform:scaleX(0);transform-origin:left center;transition:transform .8s var(--ease)}',
    '.mo-go .mo-sw{transform:scaleX(1)}',
    '.hero>.wrap,.product-hero>.wrap{position:relative;z-index:1}',
    '.mo-stripe{position:absolute;left:0;border-radius:999px;pointer-events:none;z-index:0;will-change:transform}',
    '.mo-marquee{position:relative;z-index:2;overflow:hidden;background:var(--sage-soft);padding:.5rem 0;margin:.4rem 0 0;transform:rotate(-1deg) scale(1.03)}',
    '.mo-track{display:flex;width:max-content;will-change:transform}',
    '.mo-group{display:flex;gap:1.4rem;padding-right:1.4rem;align-items:center;white-space:nowrap;font-size:.95rem;letter-spacing:.04em;color:var(--sage-deep)}',
    '.mo-dot{color:var(--salmon);font-size:.6em}',
    '.mo-progress{position:fixed;top:0;left:0;right:0;height:3px;background:var(--salmon);transform:scaleX(0);transform-origin:left center;z-index:300;pointer-events:none}',
    '.site-header{transition:box-shadow var(--t-med) var(--ease)}',
    '.site-header.mo-scrolled{box-shadow:var(--shadow-s)}',
    '.mo-imgwrap{overflow:hidden;border-radius:var(--r-m);margin-bottom:1rem}',
    '.mo-imgwrap .card-img{margin:0;transition:transform .7s var(--ease)}',
    '.member img{transition:transform .7s var(--ease)}',
    '.mo-q{opacity:.18;transition:opacity .45s var(--ease)}',
    '.mo-q.on{opacity:1}',
    '@keyframes mo-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}',
    '.recog li{transition:background var(--t-fast),transform var(--t-fast) var(--ease)}',
    '.recog li.mo-bob{animation:mo-bob 3.2s var(--ease) infinite;animation-delay:calc(var(--i,0) * -.45s)}',
    '.recog li:hover{background:var(--sage-soft);animation-play-state:paused}',
    '.reveal .step::before{transform:scale(.2);opacity:0;transition:transform .6s var(--ease),opacity .4s;transition-delay:calc(var(--i,0) * 110ms + 250ms)}',
    '.reveal.in .step::before{transform:none;opacity:1}',
    '.radio-row label{transition:transform var(--t-fast) var(--ease),background var(--t-fast),border-color var(--t-fast)}',
    '.radio-row label:has(input:checked){transform:translateY(-2px)}',
    '.field input,.field select,.field textarea{transition:border-color var(--t-fast),box-shadow var(--t-fast),transform var(--t-fast) var(--ease)}',
    '.field input:focus,.field select:focus,.field textarea:focus{transform:translateY(-1px)}'
  ].join('\n');
  var st = document.createElement('style'); st.id = 'motion-css'; st.textContent = css;
  document.head.appendChild(st);
  document.documentElement.classList.add('mo');

  /* ---------- staggered children ---------- */
  $$('.grid, .prices, .team-grid, .steps, .route, .recog, .values, .product-usps, .form-card, .cpanel, .faq, .duo').forEach(function (box) {
    if (!box.closest('.reveal')) return;
    Array.prototype.slice.call(box.children).forEach(function (c, i) {
      if (c.matches('#form-status, input[type=hidden], [hidden]')) return;
      c.classList.add('mo-child'); c.style.setProperty('--i', i);
      if (box.classList.contains('step') || c.classList.contains('step')) c.style.setProperty('--i', i);
    });
  });
  $$('.split.reveal').forEach(function (s) {
    var k = s.children;
    if (k[0]) k[0].classList.add('mo-child', 'mo-l');
    if (k[1]) { k[1].classList.add('mo-child', 'mo-r'); k[1].style.setProperty('--i', 1); }
  });
  /* once revealed, release children so hover/tilt transitions feel instant */
  function settle(rev) {
    $$('.mo-child', rev).forEach(function (c) {
      var i = +(c.style.getPropertyValue('--i') || 0);
      setTimeout(function () {
        c.classList.remove('mo-child', 'mo-l', 'mo-r');
        if (c.matches('.recog li')) c.classList.add('mo-bob');
      }, 1000 + i * 85);
    });
  }
  var revs = $$('.reveal');
  var mo = new MutationObserver(function (ms) {
    ms.forEach(function (m) { if (m.target.classList.contains('in') && !m.target._settled) { m.target._settled = 1; settle(m.target); } });
  });
  revs.forEach(function (r) { mo.observe(r, { attributes: true, attributeFilter: ['class'] }); });
  function revealInView() {
    var vh = window.innerHeight;
    revs.forEach(function (r) { if (!r.classList.contains('in') && r.getBoundingClientRect().top < vh * 0.94) r.classList.add('in'); });
  }
  setTimeout(revealInView, 900);
  setTimeout(revealInView, 1800);

  /* ---------- headline word rise + swoosh ---------- */
  var h1 = $('.hero h1, .product-hero h1, main h1');
  if (h1 && !h1.children.length) {
    var ws = h1.textContent.trim().split(/\s+/);
    var hl = cfg.hl != null ? cfg.hl : ws.length - 1;
    h1.innerHTML = '';
    ws.forEach(function (w, i) {
      var o = document.createElement('span'); o.className = 'mo-w';
      var n = document.createElement('span'); n.className = 'mo-wi'; n.textContent = w;
      n.style.transitionDelay = (150 + i * 85) + 'ms';
      o.appendChild(n);
      if (i === hl) { var s = document.createElement('span'); s.className = 'mo-sw'; s.style.transitionDelay = (300 + ws.length * 85) + 'ms'; o.appendChild(s); }
      h1.appendChild(o);
      if (i < ws.length - 1) h1.appendChild(document.createTextNode(' '));
    });
    h1.getBoundingClientRect();
    setTimeout(function () { h1.classList.add('mo-go'); }, 60);
  }

  /* ---------- hero décor ---------- */
  var hero = $('.hero') || $('.product-hero');
  var stripes = [];
  if (hero && !calm) {
    [[22, 220, 10, 'var(--sage-soft)', 1.6], [31, 120, 6, 'var(--salmon-soft)', 2.4], [80, 300, 12, 'var(--sage-soft)', 1.1], [88, 90, 6, 'rgba(110,156,132,.35)', 3]]
      .forEach(function (d, i) {
        var e = document.createElement('div'); e.className = 'mo-stripe'; e.setAttribute('aria-hidden', 'true');
        e.style.cssText += 'top:' + d[0] + '%;width:' + d[1] + 'px;height:' + d[2] + 'px;background:' + d[3];
        hero.insertBefore(e, hero.firstChild);
        stripes.push({ el: e, sp: d[4], x: i * 260 - 200 });
      });
  }
  var media = $('.hero-media');
  var blob = media && $('.hero-blob', media);
  if (media && !blob && !calm) {
    blob = document.createElement('div'); blob.className = 'hero-blob'; blob.setAttribute('aria-hidden', 'true');
    media.appendChild(blob);
  }
  var heroImg = media && $('.hero-media > picture img, .hero-media > img');
  var duo = media ? $$('.duo > picture, .duo > img', media) : [];
  var note = $('.hero-note');
  var product = cfg.product ? $('.product-gallery > img') : null;

  /* ---------- marquee ---------- */
  var track = null;
  if (!calm && cfg.words && hero) {
    var band = document.createElement('div'); band.className = 'mo-marquee'; band.setAttribute('aria-hidden', 'true');
    track = document.createElement('div'); track.className = 'mo-track';
    for (var g = 0; g < 2; g++) {
      var grp = document.createElement('div'); grp.className = 'mo-group';
      for (var rep = 0; rep < 3; rep++) cfg.words.forEach(function (w) {
        var s = document.createElement('span'); s.textContent = w; grp.appendChild(s);
        var d = document.createElement('span'); d.className = 'mo-dot'; d.textContent = '●'; grp.appendChild(d);
      });
      track.appendChild(grp);
    }
    band.appendChild(track);
    hero.parentNode.insertBefore(band, hero.nextSibling);
  }

  /* ---------- progress + header ---------- */
  var bar = document.createElement('div'); bar.className = 'mo-progress'; bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  var header = $('.site-header');

  /* ---------- tilt / lift ---------- */
  $$('.card .card-img').forEach(function (img) {
    var pic = img.closest('picture') || img;
    if (pic.parentNode.classList.contains('mo-imgwrap')) return;
    var w = document.createElement('div'); w.className = 'mo-imgwrap';
    pic.parentNode.insertBefore(w, pic); w.appendChild(pic);
  });
  var tiltSel = '.card, .member, .route a, .price, .value, .step, .product-usp, .faq details, .forwho' + (product ? ', .product-gallery > img' : '');
  $$(tiltSel).forEach(function (el) {
    var img = $('.card-img, .member img', el);
    var deg = calm || !finePointer ? 0 : (el.matches('.route a') ? 6 : el.matches('.faq details, .forwho') ? 2 : 8);
    el.addEventListener('pointerenter', function () {
      el.style.transition = 'transform .3s var(--ease), box-shadow .35s var(--ease), background-image .2s';
    });
    el.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      var r = el.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = 'perspective(1000px) rotateX(' + (-py * deg) + 'deg) rotateY(' + (px * deg) + 'deg) translateY(' + (calm ? -3 : -6) + 'px)';
      el.style.boxShadow = 'var(--shadow-m)';
      if (img) img.style.transform = 'scale(1.08) translate(' + (-px * 12) + 'px,' + (-py * 12) + 'px)';
      if (cfg.spotlight) el.style.backgroundImage = 'radial-gradient(260px circle at ' + (px + .5) * 100 + '% ' + (py + .5) * 100 + '%, rgba(232,135,90,.13), transparent 70%)';
    });
    el.addEventListener('pointerleave', function () {
      el.style.transform = ''; el.style.boxShadow = ''; el.style.backgroundImage = '';
      if (img) img.style.transform = '';
    });
  });

  /* ---------- magnetic buttons ---------- */
  if (!calm && finePointer) $$('main .btn').forEach(function (b) {
    b.addEventListener('pointermove', function (e) {
      var r = b.getBoundingClientRect();
      var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      b.style.transform = 'translate(' + dx * 0.14 + 'px,' + (dy * 0.25 - 2) + 'px)';
    });
    b.addEventListener('pointerleave', function () { b.style.transform = ''; });
  });

  /* ---------- quote: words light up ---------- */
  $$('.quote blockquote').forEach(function (q) {
    if (q.children.length) return;
    var parts = q.textContent.trim().split(/\s+/);
    q.innerHTML = parts.map(function (w) { return '<span class="mo-q">' + w.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</span>'; }).join(' ');
    q._words = $$('.mo-q', q);
  });

  /* ---------- count-up prices ---------- */
  var counters = [];
  if (cfg.count) $$('.price .amt').forEach(function (a) {
    var t = a.firstChild; if (!t || t.nodeType !== 3) return;
    var m = t.nodeValue.match(/(\d+)(?:,(\d{2}))?/); if (!m) return;
    counters.push({ node: t, tpl: t.nodeValue, val: parseFloat(m[1] + '.' + (m[2] || '00')), raw: m[0], done: false, el: a });
  });
  function runCount(c) {
    c.done = true; var t0 = performance.now();
    (function step(now) {
      var k = Math.min(1, (now - t0) / 1100), e = 1 - Math.pow(1 - k, 3);
      c.node.nodeValue = c.tpl.replace(c.raw, (c.val * e).toFixed(2).replace('.', ','));
      if (k < 1) requestAnimationFrame(step);
    })(t0);
    setTimeout(function () { c.node.nodeValue = c.tpl; }, 1400);
  }

  /* ---------- duo repel (weerbaarheid) ---------- */
  var repel = { x: 0, y: 0, tx: 0, ty: 0 };
  if (cfg.duo === 'repel' && hero && finePointer) {
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      repel.tx = ((e.clientX - r.left) / r.width - 0.5) * -26;
      repel.ty = ((e.clientY - r.top) / r.height - 0.5) * -18;
    });
    hero.addEventListener('pointerleave', function () { repel.tx = 0; repel.ty = 0; });
  }

  /* ---------- main loop ---------- */
  var sy = function () { return Math.max(window.scrollY || 0, document.documentElement.scrollTop || 0); };
  var lastY = sy(), vel = 0, mx = 0, last = performance.now();
  function morph(t, k) {
    var s = Math.sin(t * .9 + k) * 8, c = Math.cos(t * .7 + k) * 8, s2 = Math.sin(t * .6 + k) * 8;
    return (46 + s) + '% ' + (54 - s) + '% ' + (52 + c) + '% ' + (48 - c) + '% / ' + (60 + s2) + '% ' + (44 + c) + '% ' + (56 - s2) + '% ' + (40 + s) + '%';
  }
  function inView(el) { var r = el.getBoundingClientRect(); return r.top < window.innerHeight * 0.85 && r.bottom > 0; }
  function frame(now) {
    requestAnimationFrame(frame);
    var dt = Math.min(48, now - last) / 16.67; last = now;
    var y = sy(), dy = y - lastY; lastY = y;
    vel += (dy - vel) * 0.12;
    var t = now / 1000, vh = window.innerHeight;
    var max = document.documentElement.scrollHeight - vh;
    bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
    if (header) header.classList.toggle('mo-scrolled', y > 8);
    var boost = 1 + Math.min(12, Math.abs(vel) * 0.5) * amp;

    if (track) {
      var w = track.scrollWidth / 2 || 1, dir = vel < -0.3 ? -1 : 1;
      mx = (mx + 0.8 * boost * dir * dt) % w; if (mx < 0) mx += w;
      var sk = Math.max(-9, Math.min(9, -vel * 0.35));
      track.style.transform = 'translate3d(' + (-mx) + 'px,0,0) skewX(' + sk + 'deg)';
    }
    if (stripes.length && hero) {
      var hw = hero.clientWidth;
      stripes.forEach(function (s) {
        s.x += s.sp * boost * dt;
        if (s.x > hw + 40) s.x = -s.el.offsetWidth - 40;
        s.el.style.transform = 'translate3d(' + s.x + 'px,0,0)';
      });
    }
    if (media && y < vh * 1.5) {
      var r = media.getBoundingClientRect();
      var off = (r.top + r.height / 2 - vh / 2) * 0.08 * amp;
      if (heroImg) heroImg.style.transform = 'translate3d(0,' + off + 'px,0)';
      if (duo.length) {
        repel.x += (repel.tx - repel.x) * 0.08; repel.y += (repel.ty - repel.y) * 0.08;
        duo.forEach(function (d, i) {
          var sgn = i ? -1 : 1, ty = off, tx = 0;
          if (cfg.duo === 'split') ty = off * 1.6 * sgn;
          else if (cfg.duo === 'bounce') ty = Math.abs(Math.sin(t * 2.2 + i * Math.PI / 2)) * -10 * amp;
          else if (cfg.duo === 'repel') { tx = repel.x * (i ? 1.4 : .8); ty = repel.y * (i ? 1.4 : .8); }
          d.style.display = 'block';
          d.style.transform = 'translate3d(' + tx + 'px,' + ty + 'px,0)';
        });
      }
    }
    if (blob) {
      blob.style.borderRadius = morph(t, 0);
      blob.style.transform = 'rotate(' + (t * 12 * amp) % 360 + 'deg) translateY(' + (-y * 0.06) + 'px)';
    }
    if (note) note.style.transform = 'translateY(' + Math.sin(t * 1.3) * 6 * amp + 'px)';
    if (product && !product.matches(':hover')) product.style.transform = 'translateY(' + Math.sin(t * 1.4) * 8 + 'px) rotate(' + Math.sin(t * .9) * 1.2 + 'deg)';

    $$('.quote blockquote').forEach(function (q) {
      if (q._lit || !q._words || !inView(q)) return; q._lit = 1;
      q._words.forEach(function (s, i) { setTimeout(function () { s.classList.add('on'); }, i * 45); });
    });
    counters.forEach(function (c) { if (!c.done && inView(c.el)) runCount(c); });
  }
  requestAnimationFrame(frame);
  /* fallback when frames are throttled: never leave content hidden */
  setTimeout(function () {
    $$('.mo-q').forEach(function (s) { if (s.getBoundingClientRect().top < window.innerHeight) s.classList.add('on'); });
  }, 2000);
  window.addEventListener('scroll', revealInView, { passive: true });
})();
