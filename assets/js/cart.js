/* Standup Zorg — winkelmandje (geen dependencies)
   Bewaart de mand in localStorage. Prijzen worden op de server (Netlify Function)
   opnieuw berekend, dus prijzen hier zijn alleen voor de weergave. */
(function () {
  'use strict';

  var KEY = 'sz_cart';

  /* Producten in de webshop. id moet overeenkomen met de server (create-payment.js). */
  var PRODUCTS = {
    dek: {
      id: 'dek',
      naam: 'Dieren Emotie Kwartet',
      prijs: 2199, /* in centen */
      img: 'assets/img/kwartet-doos-kaarten.png'
    }
  };

  function get() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch (e) { return []; }
  }
  function save(cart) {
    localStorage.setItem(KEY, JSON.stringify(cart));
    render();
  }
  function add(id, qty) {
    qty = qty || 1;
    if (!PRODUCTS[id]) return;
    var cart = get();
    var item = cart.find(function (x) { return x.id === id; });
    if (item) { item.aantal += qty; } else { cart.push({ id: id, aantal: qty }); }
    save(cart);
    openDrawer();
  }
  function setQty(id, qty) {
    qty = Math.max(0, qty | 0);
    var cart = get()
      .map(function (x) { return x.id === id ? { id: x.id, aantal: qty } : x; })
      .filter(function (x) { return x.aantal > 0; });
    save(cart);
  }
  function remove(id) {
    save(get().filter(function (x) { return x.id !== id; }));
  }
  function clear() {
    localStorage.removeItem(KEY);
    render();
  }
  function count() {
    return get().reduce(function (n, x) { return n + x.aantal; }, 0);
  }
  function total() {
    return get().reduce(function (n, x) {
      var p = PRODUCTS[x.id] ? PRODUCTS[x.id].prijs : 0;
      return n + p * x.aantal;
    }, 0);
  }
  /* Regels met productgegevens erbij, voor weergave en verzending naar de server. */
  function lines() {
    return get().map(function (x) {
      var p = PRODUCTS[x.id] || { naam: x.id, prijs: 0, img: '' };
      return { id: x.id, naam: p.naam, prijs: p.prijs, img: p.img, aantal: x.aantal, subtotaal: p.prijs * x.aantal };
    });
  }

  function euro(cents) {
    return '€ ' + (cents / 100).toFixed(2).replace('.', ',');
  }

  /* ---- Weergave ---- */

  function updateBadges() {
    var n = count();
    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.textContent = n;
      el.hidden = n === 0;
    });
  }

  function render() {
    updateBadges();
    var body = document.getElementById('cart-body');
    if (body) {
      var ls = lines();
      if (!ls.length) {
        body.innerHTML = '<p class="cart-empty">Je winkelmandje is leeg.</p>';
      } else {
        body.innerHTML = ls.map(function (l) {
          return '' +
            '<div class="cart-item">' +
              '<img src="' + l.img + '" alt="" width="56" height="56">' +
              '<div class="cart-item-info">' +
                '<b>' + l.naam + '</b>' +
                '<span>' + euro(l.prijs) + '</span>' +
              '</div>' +
              '<div class="cart-qty">' +
                '<button type="button" aria-label="Minder" data-cart-dec="' + l.id + '">−</button>' +
                '<span>' + l.aantal + '</span>' +
                '<button type="button" aria-label="Meer" data-cart-inc="' + l.id + '">+</button>' +
              '</div>' +
              '<button type="button" class="cart-remove" aria-label="Verwijderen" data-cart-remove="' + l.id + '">×</button>' +
            '</div>';
        }).join('');
      }
    }
    var totalEl = document.getElementById('cart-total');
    if (totalEl) totalEl.textContent = euro(total());
    var footEl = document.getElementById('cart-foot');
    if (footEl) footEl.hidden = count() === 0;

    /* Bestelknop uit/aan op de afrekenpagina */
    document.querySelectorAll('[data-cart-checkout]').forEach(function (el) {
      el.classList.toggle('is-disabled', count() === 0);
    });
  }

  /* ---- Drawer ---- */
  function openDrawer() {
    var d = document.getElementById('cart-drawer');
    if (!d) return;
    d.classList.add('open');
    d.setAttribute('aria-hidden', 'false');
    document.body.classList.add('cart-open');
  }
  function closeDrawer() {
    var d = document.getElementById('cart-drawer');
    if (!d) return;
    d.classList.remove('open');
    d.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('cart-open');
  }

  /* ---- Events (event delegation) ---- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-cart-add],[data-cart-inc],[data-cart-dec],[data-cart-remove],[data-cart-open],[data-cart-close]');
    if (!t) return;
    var id;
    if (t.hasAttribute('data-cart-add')) {
      e.preventDefault();
      id = t.getAttribute('data-cart-add');
      var qtyInput = document.getElementById('qty-' + id);
      var q = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;
      add(id, q);
    } else if (t.hasAttribute('data-cart-inc')) {
      id = t.getAttribute('data-cart-inc');
      var cur = get().find(function (x) { return x.id === id; });
      setQty(id, (cur ? cur.aantal : 0) + 1);
    } else if (t.hasAttribute('data-cart-dec')) {
      id = t.getAttribute('data-cart-dec');
      var cur2 = get().find(function (x) { return x.id === id; });
      setQty(id, (cur2 ? cur2.aantal : 0) - 1);
    } else if (t.hasAttribute('data-cart-remove')) {
      remove(t.getAttribute('data-cart-remove'));
    } else if (t.hasAttribute('data-cart-open')) {
      e.preventDefault();
      openDrawer();
    } else if (t.hasAttribute('data-cart-close')) {
      e.preventDefault();
      closeDrawer();
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });

  /* Openbaar maken voor de afrekenpagina */
  window.SZCart = {
    get: get, lines: lines, total: total, count: count, clear: clear,
    euro: euro, PRODUCTS: PRODUCTS, render: render
  };

  document.addEventListener('DOMContentLoaded', render);
})();
