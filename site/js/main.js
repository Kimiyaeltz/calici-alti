/* Calici Alti: draft highlight (?bozza), header on scroll, menu tabs and ring, mobile paging,
   mobile pane switch, nav toggle, quote form (opens WhatsApp, sends nothing). */
(function () {
  'use strict';

  var CA = window.CA || { t: function (k) { return k; }, lang: function () { return 'it'; } };
  var WA = 'https://wa.me/393891591956';

  /* ?bozza highlights every unconfirmed fact; stays on for the session */
  try {
    if (/[?&]bozza\b/.test(location.search)) sessionStorage.setItem('ca-bozza', '1');
    if (sessionStorage.getItem('ca-bozza') === '1') document.documentElement.classList.add('bozza');
  } catch (e) {
    if (/[?&]bozza\b/.test(location.search)) document.documentElement.classList.add('bozza');
  }

  /* Header: red over the home hero, white after scrolling */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* Language buttons */
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { CA.setLang(b.getAttribute('data-lang')); });
  });

  /* Mobile nav */
  var burger = document.querySelector('.burger');
  var nav = document.getElementById('nav');
  if (burger && nav) {
    var closeNav = function () { nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); };
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) closeNav(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });
    window.matchMedia('(min-width: 901px)').addEventListener('change', closeNav);
  }

  /* Menu tabs, ring photo and mobile paging */
  var tablist = document.querySelector('.ca-tabs');
  if (tablist) {
    var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
    var ringImgs = Array.prototype.slice.call(document.querySelectorAll('[data-ring-img]'));
    var pages = {};
    var phone = window.matchMedia('(max-width: 640px)');
    var size = function () { return window.innerHeight < 700 ? 3 : 4; };

    var renderPanel = function (panel) {
      var pager = panel.querySelector('.pager');
      if (!pager) return;
      var items = Array.prototype.slice.call(panel.querySelectorAll('.ca-menu li'));
      var n = size();
      if (!phone.matches || items.length <= n) {
        items.forEach(function (li) { li.hidden = false; });
        pager.hidden = true;
        return;
      }
      var total = Math.ceil(items.length / n);
      var p = (pages[panel.id] || 0) % total;
      pages[panel.id] = p;
      items.forEach(function (li, i) { li.hidden = Math.floor(i / n) !== p; });
      pager.hidden = false;
      pager.querySelector('.pager__count').textContent = (p + 1) + ' / ' + total;
      var pk = p < total - 1 ? 'menu.more' : 'menu.restart', pb = pager.querySelector('button');
      pb.setAttribute('data-t', pk);
      pb.textContent = CA.t(pk);
    };

    var select = function (idx, focus) {
      tabs.forEach(function (t, i) {
        var on = i === idx;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        panels[i].hidden = !on;
      });
      var ring = tabs[idx].getAttribute('data-ring');
      ringImgs.forEach(function (img) { img.classList.toggle('is-on', img.getAttribute('data-ring-img') === ring); });
      renderPanel(panels[idx]);
      if (focus) tabs[idx].focus();
    };

    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () {
        select(i);
        if (history.replaceState) history.replaceState(null, '', location.search + '#' + t.id.replace('tab-', ''));
      });
      t.addEventListener('keydown', function (e) {
        var k = e.key, j = -1;
        if (k === 'ArrowRight') j = (i + 1) % tabs.length;
        else if (k === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
        else if (k === 'Home') j = 0;
        else if (k === 'End') j = tabs.length - 1;
        if (j > -1) { e.preventDefault(); select(j, true); }
      });
    });

    panels.forEach(function (panel) {
      var btn = panel.querySelector('.pager button');
      if (btn) btn.addEventListener('click', function () { pages[panel.id] = (pages[panel.id] || 0) + 1; renderPanel(panel); });
    });

    var startTab = 0;
    var h = (location.hash || '').replace('#', '');
    tabs.forEach(function (t, i) { if (t.id === 'tab-' + h) startTab = i; });
    select(startTab);

    var rerender = function () { panels.forEach(function (p) { if (!p.hidden) renderPanel(p); }); };
    phone.addEventListener('change', rerender);
    window.addEventListener('resize', rerender);
    document.addEventListener('langchange', rerender);
  }

  /* Mobile pane switch (themed dinners, catering) */
  document.querySelectorAll('[data-panes]').forEach(function (scope) {
    var btns = Array.prototype.slice.call(scope.querySelectorAll('[data-show]'));
    var items = Array.prototype.slice.call(scope.querySelectorAll('[data-pane]'));
    scope.classList.add('has-panes');
    var show = function (name) {
      btns.forEach(function (b) { b.setAttribute('aria-selected', b.getAttribute('data-show') === name ? 'true' : 'false'); });
      items.forEach(function (p) { p.classList.toggle('is-on', p.getAttribute('data-pane') === name); });
    };
    btns.forEach(function (b) { b.addEventListener('click', function () { show(b.getAttribute('data-show')); }); });
    show(btns[0].getAttribute('data-show'));
    if (scope.id) {
      document.querySelectorAll('a[href="#' + scope.id + '"]').forEach(function (a) {
        a.addEventListener('click', function () { show(btns[btns.length - 1].getAttribute('data-show')); });
      });
    }
  });

  /* Quote form: no server, opens WhatsApp with the answers written out */
  var form = document.getElementById('quote-form');
  if (form) {
    var val = function (n) {
      var el = form.elements[n];
      return el ? String(el.value || '').trim() : '';
    };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var typeEl = form.querySelector('input[name="type"]:checked');
      form.querySelectorAll('.err').forEach(function (x) { x.textContent = ''; });
      var missing = [];
      ['date', 'guests', 'name'].forEach(function (n) { if (!val(n)) missing.push(n); });
      if (!typeEl) missing.push('type');
      if (missing.length) {
        missing.forEach(function (n) {
          var slot = form.querySelector('.err[data-for="' + n + '"]');
          if (slot) slot.textContent = CA.t('form.required');
        });
        var first = form.elements[missing[0]];
        if (first && first.focus) first.focus(); else if (missing[0] === 'type') form.querySelector('input[name="type"]').focus();
        return;
      }
      var lines = [
        CA.t('wa.intro'),
        CA.t('wa.date') + ': ' + val('date'),
        CA.t('wa.guests') + ': ' + val('guests'),
        CA.t('wa.type') + ': ' + typeEl.getAttribute('data-label-' + CA.lang()),
        CA.t('wa.name') + ': ' + val('name')
      ];
      if (val('note')) lines.push(CA.t('wa.note') + ': ' + val('note'));
      window.open(WA + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
    });
  }
})();
