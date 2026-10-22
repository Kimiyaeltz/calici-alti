// Full check from first-draft-rules.md: 5 sizes, both languages, every page.
// Usage: npm run serve (in another terminal), then npm run check
// Screenshots go to .tmp/screens/ (disposable).
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.BASE || 'http://localhost:8000';
const SIZES = [[1440, 900], [1366, 768], [1280, 720], [768, 1024], [390, 844]];
const PAGES = (process.env.PAGES || 'index.html,menu.html,locale.html,eventi.html,contatti.html,404.html').split(',');
const HEADER = 72;
const OUT = path.resolve('.tmp/screens');
fs.mkdirSync(OUT, { recursive: true });

const issues = [];
const note = (msg) => { issues.push(msg); console.log('  FAIL ' + msg); };

// Runs inside the page: measures every block that must fit one screen.
const measure = () => {
  const out = [];
  const vh = window.innerHeight, vw = window.innerWidth;
  const hh = 72;
  const blocks = [...document.querySelectorAll('main section, .runname, footer')];
  for (const s of blocks) {
    const r = s.getBoundingClientRect();
    const name = s.id || s.className.split(' ')[0];
    if (r.height > vh - hh + 1) out.push(`${name}: height ${Math.round(r.height)} > ${vh - hh}`);
    const bad = [];
    for (const el of s.querySelectorAll('*')) {
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      if (el.closest('[hidden]') || el.closest('svg') || el.closest('.runname')) continue;
      const b = el.getBoundingClientRect();
      if (b.width === 0 || b.height === 0) continue;
      if (el.closest('.split__media, .menu-panel__photo, .page-hero__photo, .ca-ring__plate')) continue;
      if (b.bottom > r.bottom + 1 || b.right > vw + 1 || b.left < -1) bad.push(`${el.tagName.toLowerCase()}.${(el.className + '').split(' ')[0]}`);
      if ((cs.overflowY === 'hidden' || cs.overflowY === 'auto') && el.scrollHeight > el.clientHeight + 1 && !el.closest('.ca-ring')) bad.push(`overflowY ${el.tagName}.${(el.className + '').split(' ')[0]}`);
      if ((cs.overflowX === 'auto' || cs.overflowX === 'hidden') && el.scrollWidth > el.clientWidth + 1 && !el.closest('.ca-ring')) bad.push(`overflowX ${el.tagName}.${(el.className + '').split(' ')[0]}`);
    }
    // empty band: any vertical gap > 120px between content inside the section
    const ivs = [];
    for (const el of s.querySelectorAll('*')) {
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden' || el.closest('[hidden]') || el.closest('.runname')) continue;
      const tag = el.tagName.toLowerCase();
      const direct = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (!(direct || ['img', 'svg', 'input', 'textarea', 'button'].includes(tag))) continue;
      if (el.closest('svg') && tag !== 'svg') continue;
      const b = el.getBoundingClientRect();
      if (b.height === 0) continue;
      ivs.push([Math.max(b.top, r.top), Math.min(b.bottom, r.bottom)]);
    }
    ivs.sort((a, b) => a[0] - b[0]);
    let reach = r.top, gap = 0;
    for (const [t0, t1] of ivs) { gap = Math.max(gap, t0 - reach); reach = Math.max(reach, t1); }
    gap = Math.max(gap, r.bottom - reach);
    if (gap > 120 && !s.classList.contains('runname')) out.push(`${name}: empty band ${Math.round(gap)}px`);
    if (bad.length) out.push(`${name}: clipped/outside: ${[...new Set(bad)].slice(0, 6).join(', ')}`);
  }
  if (document.documentElement.scrollWidth > vw) out.push(`sideways scroll ${document.documentElement.scrollWidth} > ${vw}`);
  return out;
};

const langChecks = () => {
  const out = [];
  const D = window.CA.dict, cur = window.CA.lang();
  for (const el of document.querySelectorAll('[data-t-html]')) {
    const k = el.getAttribute('data-t-html');
    if (!(k in D.it) || !(k in D.en)) out.push('missing key ' + k);
  }
  const vis = document.body.innerText.toLowerCase();
  if (/da confermare|to confirm|\bdi confermare/.test(vis)) out.push('visible "da confermare" text');
  for (const el of document.querySelectorAll('[data-t]')) {
    const k = el.getAttribute('data-t');
    if (!(k in D.it) || !(k in D.en)) out.push('missing key ' + k);
    const txt = el.textContent.trim();
    if (txt === k) out.push('raw key shown ' + k);
    if (!txt && D[cur][k] && !el.hidden) out.push('empty but has text ' + k);
  }
  for (const el of document.querySelectorAll('[data-t-attr]')) {
    for (const p of el.getAttribute('data-t-attr').split(';')) {
      const [a, k] = [p.slice(0, p.indexOf(':')), p.slice(p.indexOf(':') + 1)];
      if (!(k in D.it) || !(k in D.en)) out.push('missing attr key ' + k);
      if (el.getAttribute(a) !== D[cur][k]) out.push(`attr ${a} not switched (${k})`);
    }
  }
  // text outside any data-t that looks like prose (letters, 3+ words) is a missing translation
  const walker = document.createTreeWalker(document.querySelector('main'), NodeFilter.SHOW_TEXT);
  const known = new Set(['Via San Giorgio 36', '55100 Lucca (LU)', 'Calici', 'Alti', 'Calici Alti', 'WhatsApp 389 1591956', 'calicialti2025@gmail.com']);
  while (walker.nextNode()) {
    const n = walker.currentNode, t = n.textContent.trim();
    if (!t || n.parentElement.closest('[data-t], [data-t-html]') || known.has(t)) continue;
    if (n.parentElement.closest('.ca-menu__name, .ev-card__course, .dishes__name, svg, script, [aria-hidden="true"]')) continue;
    if (/[A-Za-zÀ-ÿ]{3,}/.test(t) && !/^[\d\s:.\-·+/()]+$/.test(t)) out.push('untranslated text: ' + t.slice(0, 40));
  }
  return out;
};

const blueCheck = () => {
  const out = [];
  const isBlue = (c) => {
    const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?/);
    if (!m) return false;
    const [r, g, b] = [+m[1], +m[2], +m[3]];
    const a = m[4] === undefined ? 1 : +m[4];
    return a > 0.1 && b > r + 30 && b > g + 15;
  };
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    for (const p of ['color', 'backgroundColor', 'borderTopColor', 'borderBottomColor', 'outlineColor']) {
      if (isBlue(cs[p])) out.push(`${el.tagName}.${(el.className + '').split(' ')[0]} ${p}=${cs[p]}`);
    }
  }
  return out;
};

const browser = await chromium.launch();

for (const [w, h] of SIZES) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error' && !/fonts\.g/.test(m.text())) errors.push(m.text()); });
  const pageErrorsFailed = new Set();

  for (const file of PAGES) {
    for (const lang of ['it', 'en']) {
      const tag = `${file} ${w}x${h} ${lang}`;
      console.log(tag);
      await page.goto(`${BASE}/${file}?lang=${lang}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1500); // ring animation done
      const fontsOk = await page.evaluate(() => document.fonts.check('16px Gloock') && document.fonts.check('16px "Instrument Sans"') && document.fonts.check('16px "Pinyon Script"'));
      if (!fontsOk) note(`${tag}: fonts not loaded`);
      const base = `${file.replace('.html', '')}-${w}x${h}-${lang}`;

      // hero buttons visible at load
      if (file === 'index.html') {
        const vis = await page.evaluate(() => [...document.querySelectorAll('#hero .ca-btn, #hero .hero__word')].every((e) => { const r = e.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight; }));
        if (!vis) note(`${tag}: hero headline, lede or buttons not fully visible on load`);
      }

      if (file === 'menu.html') {
        const tabs = await page.$$('.ca-tab');
        for (let i = 0; i < tabs.length; i++) {
          await tabs[i].click();
          const id = await tabs[i].getAttribute('id');
          const steps = (w <= 640 && !(await page.$eval(`#panel-${id.replace('tab-', '')} .pager`, (e) => e.hidden).catch(() => true))) ? 6 : 1;
          for (let s = 0; s < steps; s++) {
            await page.waitForTimeout(80);
            const m = await page.evaluate(measure);
            m.forEach((x) => note(`${tag} [${id} p${s}] ${x}`));
            await page.screenshot({ path: `${OUT}/${base}-${id}${steps > 1 ? '-p' + s : ''}.png`, fullPage: false });
            if (steps > 1) {
              const more = await page.$(`#panel-${id.replace('tab-', '')} .pager button`);
              if (more) await more.click();
            }
          }
        }
        await tabs[0].click();
      } else if (w <= 800 && (file === 'eventi.html')) {
        for (const scope of ['#serate', '#catering']) {
          const btns = await page.$$(`${scope} [data-show]`);
          for (let i = 0; i < btns.length; i++) {
            await btns[i].click();
            await page.waitForTimeout(80);
            const m = await page.evaluate(measure);
            m.forEach((x) => note(`${tag} [${scope} pane ${i}] ${x}`));
            await page.locator(scope).screenshot({ path: `${OUT}/${base}-${scope.slice(1)}-pane${i}.png` });
          }
          await btns[0].click();
        }
        const m = await page.evaluate(measure);
        m.forEach((x) => note(`${tag} ${x}`));
      } else {
        const m = await page.evaluate(measure);
        m.forEach((x) => note(`${tag} ${x}`));
      }

      (await page.evaluate(langChecks)).forEach((x) => note(`${tag} ${x}`));
      (await page.evaluate(blueCheck)).forEach((x) => note(`${tag} BLUE ${x}`));
      await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 300) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); } window.scrollTo(0, 0); });
      await page.waitForTimeout(200);
      await page.screenshot({ path: `${OUT}/${base}-full.png`, fullPage: true });
    }
  }
  errors.forEach((e) => note(`${w}x${h} console/page error: ${e}`));
  await ctx.close();
}

// Anchors: every in-page link lands below the header on a section that fits
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await ctx.newPage();
  for (const file of PAGES) {
    await page.goto(`${BASE}/${file}`, { waitUntil: 'networkidle' });
    const hrefs = await page.$$eval('a[href^="#"]:not(.skip)', (as) => [...new Set(as.map((a) => a.getAttribute('href')))].filter((h) => h.length > 1));
    for (const h of hrefs) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.click(`a[href="${h}"]:not(.skip)`);
      await page.waitForTimeout(700);
      const r = await page.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return null; const b = e.getBoundingClientRect(); return { top: b.top, h: b.height, vh: innerHeight }; }, h);
      if (!r) note(`${file} anchor ${h}: target missing`);
      else if (r.top < 70 || r.top > 80 || r.h > r.vh - 72 + 1) note(`${file} anchor ${h}: lands at ${Math.round(r.top)}px, height ${Math.round(r.h)}`);
    }
  }
  await ctx.close();
}

// Links and images resolve
{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const seen = new Set();
  for (const file of PAGES) {
    await page.goto(`${BASE}/${file}`, { waitUntil: 'networkidle' });
    const urls = await page.evaluate(() => [
      ...[...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')),
      ...[...document.querySelectorAll('img[src], link[href], script[src]')].map((e) => e.getAttribute('src') || e.getAttribute('href')),
    ]);
    for (const u of urls) {
      if (!u || u.startsWith('#') || /^(mailto:|tel:|https?:)/.test(u) || seen.has(u)) continue;
      seen.add(u);
      const res = await page.request.get(`${BASE}/${u}`);
      if (!res.ok()) note(`${file}: ${u} -> ${res.status()}`);
    }
    // images actually decoded
    const broken = await page.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src));
    broken.forEach((b) => note(`${file}: broken image ${b}`));
  }
  await ctx.close();
}

await browser.close();
console.log(issues.length ? `\n${issues.length} issue(s)` : '\nALL CHECKS PASSED');
process.exit(issues.length ? 1 : 0);
