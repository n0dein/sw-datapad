/* SW5e Datapad: UI, storage and navigation.
 * Rules math lives in rules.js, rules text in data.js, flavor in lore.js. */
(function () {
  'use strict';
  const D = window.SW5E, L = window.LORE, R = window.RULES;
  const { ABIL, SKILLS, fmt, md } = R;

  /* ------------------------------------------------------------ helpers */
  const $ = (s, r) => (r || document).querySelector(s);

  function h(tag, props) {
    const el = document.createElement(tag);
    if (props) {
      for (const k of Object.keys(props)) {
        const v = props[k];
        if (v == null || v === false) continue;
        if (k === 'class') el.className = v;
        else if (k === 'text') el.textContent = v;
        else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v);
        else if (k === 'value' || k === 'checked' || k === 'disabled' || k === 'hidden') el[k] = v;
        else el.setAttribute(k, v === true ? '' : v);
      }
    }
    for (let i = 2; i < arguments.length; i++) append(el, arguments[i]);
    return el;
  }
  function append(el, kid) {
    if (kid == null || kid === false) return;
    if (Array.isArray(kid)) kid.forEach((k) => append(el, k));
    else el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
  }
  function debounce(fn, ms) { let t; return function () { clearTimeout(t); t = setTimeout(fn, ms); }; }

  const ICONS = {
    roster: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
    sheet: 'M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6M8 13h8M8 17h6',
    build: 'M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6',
    holo: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2',
    settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
    plus: 'M12 5v14M5 12h14',
    index: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16M21 21l-4.3-4.3M8 11h6',
    timeline: 'M12 3v18M12 7h7M12 12H5M12 17h7M19 7v0M5 12v0M19 17v0',
    user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8'
  };
  function icon(name) {
    const ns = 'http://www.w3.org/2000/svg';
    const s = document.createElementNS(ns, 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('aria-hidden', 'true');
    const p = document.createElementNS(ns, 'path');
    p.setAttribute('d', ICONS[name]);
    s.append(p);
    return s;
  }

  let toastT;
  function toast(msg) {
    const old = $('.toast'); if (old) old.remove();
    const t = h('div', { class: 'toast', role: 'status' }, msg);
    document.body.append(t);
    clearTimeout(toastT);
    toastT = setTimeout(() => t.remove(), 2200);
  }

  /* <select> from [{v,t,g}] with optional groups */
  function selectEl(opts, value, onchange, attrs) {
    const s = h('select', attrs);
    const groups = {};
    opts.forEach((o) => {
      const opt = h('option', { value: o.v }, o.t);
      if (o.g) {
        if (!groups[o.g]) { groups[o.g] = h('optgroup', { label: o.g }); s.append(groups[o.g]); }
        groups[o.g].append(opt);
      } else s.append(opt);
    });
    s.value = value == null ? '' : value;
    s.addEventListener('change', () => onchange(s.value));
    return s;
  }
  const field = (label, control, id) => h('div', { class: 'field' }, h('label', { for: id }, label), control);
  let uid = 0;
  const nid = () => 'f' + (++uid);

  /* ------------------------------------------------------------ storage */
  const DB_NAME = 'sw5e-datapad';
  let idb = null;

  function openDB() {
    return new Promise((res) => {
      try {
        const rq = indexedDB.open(DB_NAME, 1);
        rq.onupgradeneeded = () => {
          ['chars', 'imgs', 'meta'].forEach((s) => { if (!rq.result.objectStoreNames.contains(s)) rq.result.createObjectStore(s); });
        };
        rq.onsuccess = () => res(rq.result);
        rq.onerror = () => res(null);
        rq.onblocked = () => res(null);
      } catch (e) { res(null); }
    });
  }
  function tx(store, mode, fn) {
    return new Promise((res) => {
      if (!idb) return res(null);
      try {
        const t = idb.transaction(store, mode);
        const r = fn(t.objectStore(store));
        t.oncomplete = () => res(r && r.result !== undefined ? r.result : null);
        t.onerror = t.onabort = () => res(null);
      } catch (e) { res(null); }
    });
  }
  const dbGet = (s, k) => tx(s, 'readonly', (o) => o.get(k));
  const dbPut = (s, k, v) => tx(s, 'readwrite', (o) => o.put(v, k));
  const dbDel = (s, k) => tx(s, 'readwrite', (o) => o.delete(k));
  function dbEntries(store) {
    return new Promise((res) => {
      if (!idb) return res([]);
      const out = [];
      try {
        const rq = idb.transaction(store, 'readonly').objectStore(store).openCursor();
        rq.onsuccess = () => { const c = rq.result; if (c) { out.push([c.key, c.value]); c.continue(); } else res(out); };
        rq.onerror = () => res(out);
      } catch (e) { res(out); }
    });
  }

  /* -------------------------------------------------------------- state */
  const S = { chars: [], imgs: {}, cfg: { aur: true }, cur: null, tab: 'index', sec: 'basics', holo: 'species', holoKey: {}, story: 'origin', ok: true, fontOK: false, confirm: '', installEvt: null };
  const cur = () => S.chars.find((c) => c.id === S.cur) || null;

  const dirty = new Set();
  const flush = () => { dirty.forEach((id) => { const c = S.chars.find((x) => x.id === id); if (c) dbPut('chars', id, c); }); dirty.clear(); };
  const flushSoon = debounce(flush, 350);
  function touch(c) { c.updated = Date.now(); dirty.add(c.id); flushSoon(); }
  window.addEventListener('pagehide', flush);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); });

  function setImg(key, data) {
    if (data) { S.imgs[key] = data; dbPut('imgs', key, data); } else { delete S.imgs[key]; dbDel('imgs', key); }
  }
  async function fileToDataURL(file, max) {
    let img = await (window.createImageBitmap ? createImageBitmap(file).catch(() => null) : null);
    if (!img) {
      img = await new Promise((res, rej) => {
        const i = new Image(); const u = URL.createObjectURL(file);
        i.onload = () => res(i); i.onerror = rej; i.src = u;
      });
    }
    const k = Math.min(1, (max || 1200) / Math.max(img.width, img.height));
    const cv = document.createElement('canvas');
    cv.width = Math.round(img.width * k); cv.height = Math.round(img.height * k);
    const g = cv.getContext('2d');
    g.fillStyle = '#0a1a28'; g.fillRect(0, 0, cv.width, cv.height);
    g.drawImage(img, 0, 0, cv.width, cv.height);
    return cv.toDataURL('image/jpeg', 0.85);
  }
  const bgImg = (key) => (S.imgs[key] ? 'background-image:url("' + S.imgs[key] + '")' : '');

  /* image slot with add / replace / remove */
  function slot(key, opts) {
    opts = opts || {};
    const box = h('div', { class: 'cover' + (opts.small ? ' small' : '') });
    const empty = h('div', { class: 'empty-art' }, h('div', null, icon('user'), h('div', { class: 'sub' }, opts.hint || 'No image yet')));
    const input = h('input', { type: 'file', accept: 'image/*', hidden: true, 'aria-label': 'Choose an image' });
    const add = h('button', { class: 'btn sm', type: 'button' });
    const link = h('button', { class: 'btn sm', type: 'button' }, 'Use web link');
    const lin = h('input', { type: 'url', placeholder: 'https://… link to an image', 'aria-label': 'Image web address', autocomplete: 'off' });
    const lrow = h('div', { class: 'bar', hidden: true }, lin, h('button', { class: 'btn sm', type: 'button', onclick: () => {
      const u = lin.value.trim();
      if (!/^https:\/\/[^\s"'()]+$/.test(u)) { toast('Paste a full https link with no spaces.'); return; }
      const t = new Image();
      t.onerror = () => toast('That link would not load here. It may be blocked in this view, but can work in the installed app.');
      t.src = u;
      setImg(key, u); lin.value = ''; lrow.hidden = true; paint();
    } }, 'Save'));
    const del = h('button', { class: 'btn sm warn', type: 'button' }, 'Remove');
    let fbOK = false;
    let fbURL = '';
    const fbList = [].concat(opts.fallback || []).filter(Boolean);
    (function tryNext(i) { if (i >= fbList.length) return; const t = new Image(); t.onload = () => { fbOK = true; fbURL = fbList[i]; paint(); }; t.onerror = () => tryNext(i + 1); t.src = fbList[i]; })(0);
    /* show the whole picture, never stretched, never enlarged past its own pixels (so it stays sharp) */
    function fit() {
      const n = box._nat, W = box.clientWidth, H = box.clientHeight;
      if (!n || !W || !H) return;
      const k = Math.min(W / n[0], H / n[1], 1);
      box.style.backgroundSize = Math.round(n[0] * k) + 'px ' + Math.round(n[1] * k) + 'px';
    }
    if (opts.small && window.ResizeObserver) new ResizeObserver(fit).observe(box);
    function paint() {
      const has = !!S.imgs[key];
      const fb = !has && fbOK;
      const cur = has ? S.imgs[key] : fb ? fbURL : '';
      box.setAttribute('style', cur ? 'background-image:url("' + cur.replace(/"/g, '%22') + '")' : '');
      box._nat = null;
      if (cur && opts.small) { const t = new Image(); t.onload = () => { box._nat = [t.naturalWidth, t.naturalHeight]; fit(); }; t.src = cur; }
      empty.hidden = has || fb; del.hidden = !has;
      add.textContent = has || fb ? 'Replace image' : 'Add image';
    }
    add.addEventListener('click', () => input.click());
    del.addEventListener('click', () => { setImg(key, null); paint(); });
    input.addEventListener('change', async () => {
      const f = input.files && input.files[0];
      if (!f) return;
      try { setImg(key, await fileToDataURL(f, opts.max || 1200)); paint(); } catch (e) { toast('That image could not be read.'); }
      input.value = '';
    });
    link.addEventListener('click', () => { lrow.hidden = !lrow.hidden; if (!lrow.hidden) lin.focus(); });
    if (opts.bare) box.append(empty);
    else box.append(empty, h('div', { class: 'bar' }, add, link, del, input), lrow);
    if (opts.links) box.append(h('div', { class: 'slinks' }, opts.links.map((l) =>
      h('a', { class: 'slink', href: l.href, target: '_blank', rel: 'noopener noreferrer', title: l.title, 'aria-label': l.title }, l.text))));
    paint();
    return box;
  }

  /* searchable full-screen picker */
  function openPicker(o) {
    const input = h('input', { type: 'search', placeholder: 'Search ' + o.title.toLowerCase(), 'aria-label': 'Search' });
    const body = h('div', { class: 'body' });
    const close = () => scrim.remove();
    const scrim = h('div', { class: 'scrim', role: 'dialog', 'aria-label': o.title },
      h('div', { class: 'bar' }, input, h('button', { class: 'btn sm', type: 'button', onclick: close }, 'Close')), body);
    function paint() {
      const q = input.value.trim().toLowerCase();
      const list = o.items.filter((i) => !q || (i.name + ' ' + (i.sub || '') + ' ' + (i.group || '')).toLowerCase().includes(q));
      body.replaceChildren();
      let g = null, n = 0;
      for (const it of list) {
        if (n++ >= 150) { body.append(h('p', { class: 'sub' }, 'Showing the first 150. Keep typing to narrow the list.')); break; }
        if (it.group !== g) { g = it.group; if (g) body.append(h('div', { class: 'lbl', style: 'margin-top:14px' }, g)); }
        body.append(h('button', { class: 'pick', type: 'button', onclick: () => { close(); o.onPick(it.id); } }, h('strong', null, it.name), it.sub ? h('span', null, it.sub) : null));
      }
      if (!list.length) body.append(h('p', { class: 'empty' }, 'Nothing matches that search.'));
    }
    input.addEventListener('input', paint);
    paint();
    document.body.append(scrim);
    input.focus();
  }

  const panel = (title, ...kids) => h('section', { class: 'panel' },
    h('div', { class: 'head' }, h('h2', null, title), h('span', { class: 'aur', 'aria-hidden': 'true' }, title)), kids);
  const mdBox = (src) => { const d = h('div', { class: 'md' }); d.innerHTML = md(src); return d; };
  const expand = (title, body, open) => h('details', open === false ? null : { open: true }, h('summary', null, title), body);

  function textBind(c, store, key, opts) {
    opts = opts || {};
    const id = nid();
    const el = opts.line ? h('input', { type: 'text', id, value: store[key] || '', placeholder: opts.ph || '', autocomplete: 'off' })
      : h('textarea', { id, placeholder: opts.ph || '', rows: opts.rows || 4 });
    if (!opts.line) el.value = store[key] || '';
    el.addEventListener('input', () => { store[key] = el.value; touch(c); if (opts.on) opts.on(); });
    return field(opts.label, el, id);
  }

  /* ------------------------------------------------------------ chrome */
  const TABS = [
    ['index', 'Index', 'index'], ['timeline', 'Timeline', 'timeline'],
    ['roster', 'Characters', 'roster'],
    ['holo', 'Holopedia', 'holo'], ['settings', 'Settings', 'settings']
  ];
  function buildChrome() {
    const bar = $('.tabbar');
    TABS.forEach(([id, label, ic]) => {
      bar.append(h('button', { type: 'button', 'data-tab': id, onclick: () => go(id) }, icon(ic), h('span', null, label)));
    });
  }

  /* ---- colour theme: one hue drives every blue shade, brightness stays as designed ---- */
  const BASE = { ground: '#040b12', panel: '#0a1a28', 'panel-2': '#0e2436', line: '#1f6784', 'line-2': '#1c4a5e', deep: '#07141f', holo: '#6fe6ff', 'holo-dim': '#4a9bb5', text: '#d9f5ff', muted: '#86b4c6' };
  const hex2rgb = (x) => [1, 3, 5].map((i) => parseInt(x.slice(i, i + 2), 16));
  const rgb2hex = (r) => '#' + r.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
  function rgb2hsl([r, g, b]) {
    r /= 255; g /= 255; b /= 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
    let hh = 0, s = 0;
    if (d) {
      s = d / (1 - Math.abs(2 * l - 1));
      hh = mx === r ? ((g - b) / d + (g < b ? 6 : 0)) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
      hh *= 60;
    }
    return [hh, s, l];
  }
  function hsl2rgb([hh, s, l]) {
    const k = (n) => (n + hh / 30) % 12, a2 = s * Math.min(l, 1 - l);
    const f = (n) => l - a2 * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [f(0) * 255, f(8) * 255, f(4) * 255];
  }
  const BASE_HUE = rgb2hsl(hex2rgb(BASE.holo))[0];
  function themeFor(hue) {
    const out = {};
    const shift = hue - BASE_HUE;
    Object.keys(BASE).forEach((k) => {
      const [h0, s, l] = rgb2hsl(hex2rgb(BASE[k]));
      out[k] = rgb2hex(hsl2rgb([(h0 + shift + 720) % 360, s, l]));
    });
    return out;
  }
  function applyTheme() {
    const st = document.documentElement.style;
    const hue = typeof S.cfg.hue === 'number' ? S.cfg.hue : null;
    const t = hue === null ? BASE : themeFor(hue);
    Object.keys(t).forEach((k) => st.setProperty('--' + k, t[k]));
    const trip = (x) => hex2rgb(x).join(',');
    st.setProperty('--holo-rgb', trip(t.holo)); st.setProperty('--line-rgb', trip(t.line)); st.setProperty('--ground-rgb', trip(t.ground));
    const v = hex2rgb(t.ground).map((n) => Math.max(0, n - 2)); st.setProperty('--void-rgb', v.join(','));
    const m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute('content', t.ground);
    return t.holo;
  }
  function applyMotion() {
    const sys = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const calm = S.cfg.calm === undefined ? sys : !!S.cfg.calm;
    document.body.classList.toggle('calm', calm);
    document.body.classList.toggle('motion-on', !calm);
  }
  function applyAur() { document.body.classList.toggle('no-aur', !(S.cfg.aur && S.fontOK)); }
  function titleFor() {
    const c = cur();
    switch (S.tab) {
      case 'index': return window.CANON ? window.CANON.title() : 'Index';
      case 'timeline': return 'Timeline';
      case 'roster': return 'My characters';
      case 'build': return c ? c.name || 'Unnamed character' : 'Character';
      case 'holo': return 'The Holopedia';
      default: return 'Settings';
    }
  }
  function removeChar(id) {
    S.chars = S.chars.filter((c) => c.id !== id); dbDel('chars', id);
    Object.keys(S.imgs).filter((k) => k.indexOf(id + ':') === 0).forEach((k) => setImg(k, null));
    if (S.cur === id) S.cur = S.chars[0] ? S.chars[0].id : null;
    if (!S.cur && S.tab === 'build') S.tab = 'roster';
  }
  function askDelete(id) {
    const c = S.chars.find((x) => x.id === id); if (!c) return;
    const close = () => scrim.remove();
    const scrim = h('div', { class: 'scrim fsheet', role: 'dialog', 'aria-label': 'Delete character' },
      h('div', { class: 'fcard', style: 'padding:16px' },
        h('h3', { style: 'color:var(--holo)' }, 'Delete ' + (c.name || 'this character') + '?'),
        h('p', { class: 'sub', style: 'margin:8px 0 14px' }, 'The character and its pictures are removed from this device. This cannot be undone. A backup in Settings can restore it.'),
        h('div', { class: 'btns' },
          h('button', { class: 'btn', type: 'button', onclick: close }, 'Keep'),
          h('button', { class: 'btn warn', type: 'button', onclick: () => { close(); removeChar(id); toast('Deleted.'); render(true); } }, 'Delete'))));
    scrim.addEventListener('click', (e) => { if (e.target === scrim) close(); });
    document.body.append(scrim);
  }
  function render(resetScroll) {
    const v = $('#view'); const top = v.scrollTop;
    let node;
    try { node = VIEWS[S.tab](); } catch (e) { console.error(e); node = h('div', { class: 'wrap' }, panel('Something went wrong', h('p', null, 'This screen could not be drawn. Try another tab, then come back.'))); }
    v.replaceChildren(node);
    v.scrollTop = resetScroll ? 0 : top;
    const t = titleFor();
    $('#t').textContent = t; $('#ta').textContent = t;
    const bk = $('#tback'); const cd = S.tab === 'index' && window.CANON && window.CANON.hasDetail();
    bk.hidden = !(S.tab === 'build' || cd);
    bk.onclick = () => { if (S.tab === 'index' && window.CANON && window.CANON.hasDetail()) window.CANON.back(); else go('roster'); };
    const xb = $('#tdel'); const showX = S.tab === 'build' && !!cur();
    xb.hidden = !showX; xb.onclick = () => { const c = cur(); if (c) askDelete(c.id); };
    document.querySelectorAll('.tabbar button').forEach((b) => {
      if (b.dataset.tab === (S.tab === 'build' ? 'roster' : S.tab)) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
  }
  function go(tab, sec) {
    if (tab === 'sheet') { tab = 'build'; sec = 'sheet'; }
    S.tab = tab; if (sec) S.sec = sec; S.confirm = '';
    render(true);
  }
  function openChar(id, tab) {
    S.cur = id; dbPut('meta', 'last', id);
    go(tab || 'sheet');
  }
  function noChar(msg) {
    return h('div', { class: 'wrap' }, panel('No character selected', h('p', { class: 'sub' }, msg || 'Pick a character from the roster first.'),
      h('div', { class: 'btns' }, h('button', { class: 'btn primary', type: 'button', onclick: () => go('roster') }, 'Open the roster'))));
  }

  /* -------------------------------------------------------------- views */
  const lineage = (d) => [d.species && d.species.name, d.cls ? d.cls.name + (d.arch ? ' (' + d.arch.name + ')' : '') : '', 'Lv ' + d.lvl].filter(Boolean).join(' · ');

  /* ---- PDF export ---- */
  function loadScript(src) {
    return new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error(src)); document.head.append(s); });
  }
  async function exportPDF(c, d, btn) {
    const label = btn.textContent; btn.disabled = true; btn.textContent = 'Building PDF...';
    try {
      if (!window.jspdf) await loadScript('jspdf.min.js');
      if (!window.AUR_TTF) await loadScript('pdffont.js').catch(() => {});
      if (!window.PDFX) await loadScript('pdfexport.js');
      const hue = typeof S.cfg.hue === 'number' ? S.cfg.hue : BASE_HUE;
      const blob = await window.PDFX.make({
        c, d, D, L, R, cover: S.imgs[c.id + ':cover'] || '', aur: !!S.cfg.aur,
        accent: rgb2hex(hsl2rgb([hue, 0.85, 0.28]))
      });
      const fname = ((c.name || 'character').replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '-') || 'character') + '.pdf';
      const file = new File([blob], fname, { type: 'application/pdf' });
      const touch = window.matchMedia && matchMedia('(pointer: coarse)').matches;
      if (touch && navigator.canShare && navigator.canShare({ files: [file] })) {
        try { await navigator.share({ files: [file], title: c.name || 'Character' }); toast('PDF ready.'); return; } catch (e) { if (e && e.name === 'AbortError') return; }
      }
      const url = URL.createObjectURL(blob);
      const a = h('a', { href: url, download: fname }); document.body.append(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      toast('PDF saved.');
    } catch (e) { console.error(e); toast('The PDF could not be built.'); }
    finally { btn.disabled = false; btn.textContent = label; }
  }

  function newChar() {
    const c = R.newCharacter();
    S.chars.push(c); touch(c); flush();
    S.sec = 'basics';
    S.sec = 'basics'; openChar(c.id, 'build');
  }

  function viewRoster() {
    const wrap = h('div', { class: 'wrap' });
    if (!S.ok) wrap.append(h('div', { class: 'note' }, 'This browser is not keeping data between visits. Use Settings, then Back up, after each session.'));
    const grid = h('div', { class: 'cards' });
    S.chars.slice().sort((a, b) => b.updated - a.updated).forEach((c) => {
      const d = R.derive(D, c);
      const has = !!S.imgs[c.id + ':cover'];
      grid.append(h('div', { class: 'cwrap' },
        h('button', { class: 'card', type: 'button', onclick: () => openChar(c.id, 'sheet') },
          h('span', { class: 'pic', style: bgImg(c.id + ':cover') }, has ? null : icon('user')),
          h('span', { class: 'meta' }, h('strong', null, c.name || 'Unnamed'), h('span', null, lineage(d)))),
        h('button', { class: 'xbtn on-card', type: 'button', 'aria-label': 'Delete ' + (c.name || 'character'), onclick: () => askDelete(c.id) }, '\u00d7')));
    });
    grid.append(h('button', { class: 'card new', type: 'button', onclick: newChar }, icon('plus'), 'New character'));
    wrap.append(grid);
    if (!S.chars.length) wrap.append(h('p', { class: 'empty' }, 'No characters yet. Start one and fill in as much or as little as you like.'));
    return wrap;
  }

  /* ---- sheet ---- */
  function viewSheet() {
    const c = cur(); if (!c) return noChar();
    const d = R.derive(D, c);
    const wrap = h('div', { class: 'wrap' });

    const has = !!S.imgs[c.id + ':cover'];
    wrap.append(h('section', { class: 'panel' },
      h('div', { class: 'hero' },
        h('div', { class: 'cover', style: bgImg(c.id + ':cover') }, has ? null : h('div', { class: 'empty-art' }, icon('user'))),
        h('div', null, h('h2', null, c.name || 'Unnamed character'),
          c.concept ? h('div', { class: 'sub' }, c.concept) : null,
          h('div', { class: 'facts' }, h('span', null, lineage(d)), d.bg ? h('span', null, d.bg.name + ' background') : null))),
      h('div', { class: 'btns', style: 'margin-top:12px' }, h('button', { class: 'btn primary', type: 'button', onclick: (e) => exportPDF(c, d, e.currentTarget) }, 'Export PDF'))));

    wrap.append(panel('Vitals',
      h('div', { class: 'vitals' },
        vital(d.ac, 'AC'), vital(d.hp == null ? '—' : d.hp, 'HP'), vital(fmt(d.prof), 'Prof'), vital(fmt(d.initiative), 'Init')),
      h('div', { class: 'vitals', style: 'margin-top:8px' },
        vital(d.passivePerception, 'Pass. Perc.'), vital(d.hitDie ? d.lvl + 'd' + d.hitDie : '—', 'Hit Dice'),
        vital(d.casting ? d.casting.rows[0].dc : '—', d.casting ? d.casting.type + ' DC' : 'Cast DC'), vital(d.weight ? Math.round(d.weight * 10) / 10 : '0', 'Weight')),
      h('p', { class: 'sub', style: 'margin:8px 0 0' }, 'AC: ' + d.acLabel + '. Hit points use the class average per level.')));

    wrap.append(panel('Abilities', h('div', { class: 'abil' }, ABIL.map((a) =>
      h('div', { class: 'ab' }, h('div', { class: 'nm' }, a.a), h('div', { class: 'md2' }, fmt(d.mods[a.k])), h('div', { class: 'sc' }, d.scores[a.k]),
        h('div', { class: 'sv' + (d.saveProf[a.k] ? ' p' : '') }, 'Save ' + fmt(d.saves[a.k]) + (d.saveProf[a.k] ? ' ●' : ''))))),
      h('p', { class: 'sub', style: 'margin:8px 0 0' }, 'Saving throws marked ● are proficient.')));

    wrap.append(panel('Skills', h('div', { class: 'list' }, d.skills.map((s) =>
      h('div', { class: 'li' }, h('span', { class: 'dot' + (s.expert ? ' ex' : s.proficient ? ' on' : '') }),
        h('span', { class: 'nm' }, s.name + ' ', h('small', null, '(' + s.ab.toUpperCase() + ')' + (s.src ? ' · ' + s.src : ''))),
        h('span', { class: 'v' }, fmt(s.bonus)))))));

    if (d.casting) {
      wrap.append(panel(d.casting.type === 'force' ? 'Forcecasting' : 'Techcasting',
        h('div', { class: 'list' }, d.casting.rows.map((r) => h('div', { class: 'li' }, h('span', { class: 'nm' }, r.label), h('span', { class: 'v' }, 'DC ' + r.dc + ' / ' + fmt(r.atk))))),
        h('p', { class: 'sub', style: 'margin:8px 0 0' }, 'Save DC = 8 + proficiency + casting modifier. Attack = proficiency + casting modifier.'),
        casterTable(d)));
    }
    if (d.row && !d.casting && d.row.entries && d.row.entries.length) wrap.append(panel('Class table, level ' + d.lvl, casterTable(d, true)));

    if (d.features.length || d.species || d.bg) {
      const body = h('div', null);
      if (d.species) body.append(expand('Species: ' + d.species.name, h('div', null, (d.species.traits || []).map((t) => expand(t.name, mdBox(t.description))))));
      if (d.features.length) {
        const bySrc = {};
        d.features.forEach((f) => { (bySrc[f.src] = bySrc[f.src] || []).push(f); });
        Object.keys(bySrc).forEach((src) => body.append(expand(src + ' features', h('div', null, bySrc[src].map((f) => expand(f.n + ' (level ' + f.l + ')', mdBox(f.d)))), true)));
      }
      if (d.bg && d.bg.feature) body.append(expand('Background feature: ' + d.bg.feature.name, mdBox(d.bg.feature.description)));
      wrap.append(panel('Features and traits', body));
    }

    if (c.gear.length) {
      wrap.append(panel('Equipment', h('div', { class: 'list' }, c.gear.map((g) => {
        const it = D.equipment.find((e) => e.key === g.key); if (!it) return null;
        const atk = R.attackFor(it, d);
        return h('div', { class: 'li' }, h('span', { class: 'dot' + (g.eq ? ' on' : '') }),
          h('span', { class: 'nm' }, it.name + (g.qty > 1 ? ' ×' + g.qty : ''), h('br'),
            h('small', null, atk ? 'Hit ' + fmt(atk.hit) + ' (' + fmt(atk.hitProf) + ' proficient) · ' + atk.dmg + ' ' + atk.type : it.armorClass ? 'AC ' + it.armorClass : it.category)));
      })), h('p', { class: 'sub', style: 'margin:8px 0 0' }, 'Credits: ' + (c.credits || 0))));
    }
    if (c.powers.length) {
      wrap.append(panel('Powers', h('div', null, c.powers.slice().map((p) => D.powers.find((x) => x.key === p.key)).filter(Boolean)
        .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name)).map((p) =>
          expand(p.name + ' · ' + (p.level ? 'level ' + p.level : 'at-will') + ' ' + p.powerType, h('div', null, h('p', { class: 'sub' }, p.castingTime.text + ' · ' + p.range + ' · ' + p.duration), mdBox(p.description)))))));
    }
    if (c.feats.length) {
      wrap.append(panel('Feats', h('div', null, c.feats.map((f) => D.feats.find((x) => x.key === f.key)).filter(Boolean).map((f) => expand(f.name, mdBox(f.description))))));
    }
    const story = storySummary(c);
    if (story.length || c.bgText.trait || c.bgText.ideal || c.bgText.bond || c.bgText.flaw) {
      const body = h('div', { class: 'list' });
      [['Trait', 'trait'], ['Ideal', 'ideal'], ['Bond', 'bond'], ['Flaw', 'flaw']].forEach(([l, k]) => { if (c.bgText[k]) body.append(h('div', { class: 'li' }, h('span', { class: 'nm' }, h('small', null, l), h('br'), c.bgText[k]))); });
      story.forEach((s) => body.append(h('div', { class: 'li' }, h('span', { class: 'nm' }, h('small', null, s.q), h('br'), s.a))));
      wrap.append(panel('Story', body));
    }
    const noteKeys = Object.keys(c.notes).filter((k) => c.notes[k]);
    if (noteKeys.length) wrap.append(panel('Notes', h('div', null, noteKeys.map((k) => expand(k[0].toUpperCase() + k.slice(1), h('div', { class: 'md' }, h('p', { style: 'white-space:pre-wrap' }, c.notes[k])))))));
    return wrap;
  }
  const vital = (v, l) => h('div', { class: 'vital' }, h('b', null, String(v)), h('small', null, l));

  function casterTable(d, noMargin) {
    const rows = [];
    [d.row, d.archRow].forEach((r) => { if (r && r.entries) r.entries.forEach((e) => rows.push(e)); });
    if (!rows.length) return null;
    return h('div', { class: 'list', style: noMargin ? '' : 'margin-top:8px' }, rows.map((e) => h('div', { class: 'li' }, h('span', { class: 'nm' }, e.label), h('span', { class: 'v' }, String(e.value)))));
  }

  function optionsFor(q, c) {
    if (q.opts === 'eras') return L.eras;
    if (q.opts === 'factions') return L.factions;
    if (q.opts === 'worlds') {
      const sp = D.species.find((s) => s.key === c.speciesKey);
      const out = [];
      if (sp && sp.homeworld) out.push('My species’ homeworld (' + sp.homeworld + ')');
      return out.concat(L.planets);
    }
    return q.opts;
  }
  function storySummary(c) {
    const out = [];
    L.story.forEach((sec) => sec.q.forEach((q) => {
      const a = c.story[q.id];
      if (a && (a.c || a.t)) out.push({ q: q.t, a: [a.c, a.t].filter(Boolean).join(' — ') });
    }));
    return out;
  }

  /* ---- builder ---- */
  const SECTIONS = [['basics', 'Basics'], ['species', 'Species'], ['class', 'Class'], ['background', 'Background'], ['abilities', 'Abilities'],
    ['skills', 'Skills'], ['gear', 'Gear'], ['powers', 'Powers'], ['feats', 'Feats'], ['story', 'Story'], ['notes', 'Notes']];

  function viewBuild() {
    const c = cur(); if (!c) return noChar('Start a new character from the roster, or open one to edit it.');
    const wrap = h('div', { class: 'wrap' });
    wrap.append(h('div', { class: 'chips', role: 'group', 'aria-label': 'Character sections' }, [['sheet', 'Summary']].concat(SECTIONS).map(([id, label]) =>
      h('button', { class: 'chip', type: 'button', 'aria-pressed': String(S.sec === id), onclick: () => { S.sec = id; render(true); } }, label))));
    if (S.sec === 'sheet') { wrap.append(viewSheet()); return wrap; }
    const fn = BUILD[S.sec] || BUILD.basics;
    [].concat(fn(c)).forEach((p) => wrap.append(p));
    const i = SECTIONS.findIndex((s) => s[0] === S.sec);
    wrap.append(h('div', { class: 'btns' },
      i > 0 ? h('button', { class: 'btn', type: 'button', onclick: () => { S.sec = SECTIONS[i - 1][0]; render(true); } }, 'Back: ' + SECTIONS[i - 1][1]) : null,
      i < SECTIONS.length - 1 ? h('button', { class: 'btn primary', type: 'button', onclick: () => { S.sec = SECTIONS[i + 1][0]; render(true); } }, 'Next: ' + SECTIONS[i + 1][1])
        : h('button', { class: 'btn primary', type: 'button', onclick: () => go('sheet') }, 'View summary')));
    return wrap;
  }

  function detailsPanel(c, sec, title) {
    return panel(title + ' details',
      textBind(c, c.notes, sec, { label: 'Your notes', rows: 5, ph: 'Anything you want to remember or flesh out here.' }),
      h('div', { class: 'lbl', style: 'margin-bottom:6px' }, 'Reference image'),
      slot(c.id + ':' + sec, { small: true, hint: 'Add art or a reference picture' }));
  }

  const BUILD = {};

  BUILD.basics = (c) => {
    const lvl = selectEl(Array.from({ length: 20 }, (_, i) => ({ v: String(i + 1), t: 'Level ' + (i + 1) })), String(c.level), (v) => { c.level = +v; touch(c); }, { id: 'lvl' });
    return [
      panel('Character',
        textBind(c, c, 'name', { label: 'Name', line: true, ph: 'Character name' }),
        textBind(c, c, 'concept', { label: 'One-line concept', line: true, ph: 'Example: disgraced pilot with a debt to settle' }),
        field('Level', lvl, 'lvl')),
      panel('Cover portrait', h('p', { class: 'sub' }, 'Shown on the roster and the top of your sheet. Tall images work best.'), slot(c.id + ':cover', { hint: 'Add a full-size portrait' }))
    ];
  };

  function describeInc(inc) {
    if (inc.anyAbilityCount) return fmt(inc.amount) + ' to any ' + (inc.anyAbilityCount === 1 ? 'one ability' : inc.anyAbilityCount + ' different abilities');
    return fmt(inc.amount) + ' ' + inc.abilities.map(cap).join(' or ');
  }
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  BUILD.species = (c) => {
    const opts = [{ v: '', t: 'Choose a species' }].concat(D.species.slice().sort((a, b) => a.name.localeCompare(b.name))
      .map((s) => ({ v: s.key, t: s.name, g: s.contentSet === 'core' ? 'Player’s Handbook' : 'Expanded Content' })));
    const out = [];
    const sel = selectEl(opts, c.speciesKey, (v) => { c.speciesKey = v; c.asiOpt = 0; c.asiPicks = {}; touch(c); render(); }, { id: 'sp' });
    const p = panel('Species', field('Species', sel, 'sp'));
    const sp = D.species.find((s) => s.key === c.speciesKey);
    if (sp) {
      p.append(h('div', { class: 'facts' }, sp.size ? h('span', null, 'Size: ' + cap(sp.size)) : null, sp.homeworld ? h('span', null, 'Homeworld: ' + sp.homeworld) : null, sp.nativeLanguage ? h('span', null, 'Language: ' + sp.nativeLanguage) : null));
      if (sp.appearance) p.append(h('p', { class: 'sub', style: 'margin-top:8px' }, [sp.appearance.distinctions && 'Distinctions: ' + sp.appearance.distinctions, sp.appearance.skinColorOptions && 'Skin: ' + sp.appearance.skinColorOptions].filter(Boolean).join('. ')));
      p.append(expand('About ' + sp.name, mdBox(sp.lore)), expand('Species traits', h('div', null, (sp.traits || []).map((t) => expand(t.name, mdBox(t.description))))));
    }
    out.push(p);
    if (sp) {
      const o = sp.abilityScoreIncreaseOptions;
      const ap = panel('Ability score increases');
      if (!o || !o.length) ap.append(h('p', { class: 'sub' }, 'This species lists no fixed increases. Use the adjustments on the Abilities screen.'));
      else {
        const oi = Math.min(c.asiOpt || 0, o.length - 1);
        if (o.length > 1) {
          ap.append(field('Option', selectEl(o.map((x, i) => ({ v: String(i), t: x.increases.map(describeInc).join(', ') })), String(oi), (v) => { c.asiOpt = +v; c.asiPicks = {}; touch(c); render(); }, { id: 'asiopt' }), 'asiopt'));
        }
        o[oi].increases.forEach((inc, i) => {
          const key = oi + ':' + i;
          if (inc.anyAbilityCount) {
            const picks = Array.isArray(c.asiPicks[key]) ? c.asiPicks[key].slice() : [];
            for (let n = 0; n < inc.anyAbilityCount; n++) {
              const id = nid();
              ap.append(field(fmt(inc.amount) + ' to', selectEl([{ v: '', t: 'Choose an ability' }].concat(ABIL.map((a) => ({ v: a.k, t: a.n }))), picks[n] || '', (v) => {
                const next = Array.from({ length: inc.anyAbilityCount }, (_, j) => (Array.isArray(c.asiPicks[key]) && c.asiPicks[key][j]) || '');
                next[n] = v; c.asiPicks[key] = next; touch(c); render();
              }, { id }), id));
            }
            const chosen = picks.filter(Boolean);
            if (chosen.length !== new Set(chosen).size) ap.append(h('div', { class: 'note' }, 'Each increase must go to a different ability. Repeats are counted once.'));
          } else if (inc.abilities.length > 1) {
            const id = nid();
            ap.append(field(fmt(inc.amount) + ' to one of', selectEl(inc.abilities.map((a) => ({ v: R.FULL[a], t: cap(a) })), c.asiPicks[key] || R.FULL[inc.abilities[0]], (v) => { c.asiPicks[key] = v; touch(c); render(); }, { id }), id));
          } else ap.append(h('div', { class: 'li' }, h('span', { class: 'nm' }, describeInc(inc))));
        });
      }
      out.push(ap);
    }
    out.push(detailsPanel(c, 'species', 'Species'));
    return out;
  };

  function toggleList(from, selected, max, onChange, locked) {
    return h('div', { class: 'list' }, from.map((name) => {
      const on = selected.indexOf(name) >= 0;
      const full = !on && selected.length >= max;
      const b = h('button', { class: 'nm', type: 'button', 'aria-pressed': String(on), disabled: full || undefined,
        onclick: () => onChange(on ? selected.filter((x) => x !== name) : selected.concat(name)) }, name);
      return h('div', { class: 'li', style: full ? 'opacity:.45' : '' }, h('span', { class: 'dot' + (on ? ' on' : '') }), b);
    }));
  }

  BUILD.class = (c) => {
    const opts = [{ v: '', t: 'Choose a class' }].concat(D.classes.map((k) => ({ v: k.key, t: k.name })));
    const out = [];
    const cl = D.classes.find((k) => k.key === c.classKey);
    const p = panel('Class', field('Class', selectEl(opts, c.classKey, (v) => { c.classKey = v; c.archetypeKey = ''; c.classSkills = []; touch(c); render(); }, { id: 'cl' }), 'cl'));
    if (cl) {
      p.append(h('p', null, cl.summary + '.'),
        h('div', { class: 'facts' }, h('span', null, 'Hit die: d' + cl.hitPoints.dieFaces), h('span', null, 'Primary: ' + cap(cl.primaryAbility)), h('span', null, 'Saves: ' + cl.proficiencies.savingThrows.map(cap).join(', '))),
        expand('Proficiencies and equipment', h('div', { class: 'md' }, h('p', null, 'Armor: ' + (cl.proficiencies.armor || 'None')), h('p', null, 'Weapons: ' + cl.proficiencies.weapons), h('p', null, 'Starting wealth: ' + cl.startingWealth), mdBox(cl.startingEquipment))),
        expand('About the ' + cl.name, mdBox(cl.lore)),
        cl.quickBuild ? expand('Quick build', mdBox(cl.quickBuild)) : null);
    }
    out.push(p);
    if (cl) {
      const sk = cl.proficiencies.skills;
      const from = sk.from || SKILLS.map((s) => s[0]);
      out.push(panel('Class skills', h('p', { class: 'sub' }, sk.text + '. Picked ' + c.classSkills.length + ' of ' + sk.choose + '.'),
        toggleList(from, c.classSkills, sk.choose, (v) => { c.classSkills = v; touch(c); render(); })));
      const archs = D.archetypes.filter((a) => a.className === cl.name).sort((a, b) => a.name.localeCompare(b.name));
      if (archs.length) {
        const ao = [{ v: '', t: 'None yet' }].concat(archs.map((a) => ({ v: a.key, t: a.name, g: a.contentSet === 'core' ? 'Player’s Handbook' : 'Expanded Content' })));
        const ar = D.archetypes.find((a) => a.key === c.archetypeKey);
        out.push(panel(cl.archetypeLabel, field('Archetype', selectEl(ao, c.archetypeKey, (v) => { c.archetypeKey = v; touch(c); render(); }, { id: 'ar' }), 'ar'),
          h('p', { class: 'sub' }, cl.archetypeIntroduction),
          ar ? expand(ar.name, mdBox(ar.intro)) : null,
          ar ? expand('Features by level', h('div', null, ar.features.map((f) => expand(f.n + ' (level ' + f.l + ')', mdBox(f.d))))) : null));
      }
      out.push(panel('Class features', h('div', null, cl.features.map((f) => expand(f.n + ' (level ' + f.l + ')', mdBox(f.d))))));
    }
    out.push(detailsPanel(c, 'class', 'Class'));
    return out;
  };

  const BG_PICKS = [['Personality trait', 'trait', 'personalityTraitOptions'], ['Ideal', 'ideal', 'idealOptions'], ['Bond', 'bond', 'bondOptions'], ['Flaw', 'flaw', 'flawOptions']];

  BUILD.background = (c) => {
    const opts = [{ v: '', t: 'Choose a background' }].concat(D.backgrounds.slice().sort((a, b) => a.name.localeCompare(b.name))
      .map((b) => ({ v: b.key, t: b.name, g: b.contentSet === 'core' ? 'Player’s Handbook' : 'Expanded Content' })));
    const out = [];
    const bg = D.backgrounds.find((b) => b.key === c.backgroundKey);
    const p = panel('Background', field('Background', selectEl(opts, c.backgroundKey, (v) => { c.backgroundKey = v; c.bgSkills = []; touch(c); render(); }, { id: 'bg' }), 'bg'));
    if (bg) {
      p.append(mdBox(bg.lore),
        h('div', { class: 'md' }, h('p', null, h('strong', null, 'Skills: '), bg.skillProficiencies), bg.toolProficiencies ? h('p', null, h('strong', null, 'Tools: '), bg.toolProficiencies) : null,
          bg.languageProficiencies ? h('p', null, h('strong', null, 'Languages: '), bg.languageProficiencies) : null),
        expand('Starting equipment', mdBox(bg.startingEquipment)),
        expand('Feature: ' + bg.feature.name, mdBox(bg.feature.description)),
        bg.suggestedCharacteristics ? expand('Suggested characteristics', mdBox(bg.suggestedCharacteristics)) : null);
    }
    out.push(p);
    if (bg) {
      const sk = R.parseSkills(bg.skillProficiencies);
      if (sk.choose > 0) out.push(panel('Background skills', h('p', { class: 'sub' }, 'Picked ' + c.bgSkills.length + ' of ' + sk.choose + '.'), toggleList(sk.from, c.bgSkills, sk.choose, (v) => { c.bgSkills = v; touch(c); render(); })));
      const pp = panel('Personality');
      pp.append(h('p', { class: 'sub' }, 'Choose from the background’s own tables, roll for one, or write your own. Your text is yours to edit.'));
      BG_PICKS.forEach(([label, key, prop]) => {
        const tbl = bg[prop] || [];
        const id = nid();
        const ta = h('textarea', { id, rows: 3, placeholder: 'Write your own, or pick one above.' });
        ta.value = c.bgText[key] || '';
        ta.addEventListener('input', () => { c.bgText[key] = ta.value; touch(c); });
        const set = (t) => { c.bgText[key] = t; ta.value = t; touch(c); };
        const s = selectEl([{ v: '', t: 'Pick from the table' }].concat(tbl.map((o) => ({ v: String(o.roll), t: o.roll + '. ' + (o.description.length > 70 ? o.description.slice(0, 70) + '…' : o.description) }))), '', (v) => { const o = tbl.find((x) => String(x.roll) === v); if (o) set(o.description); s.value = ''; }, { 'aria-label': label + ' table' });
        pp.append(h('div', { class: 'field' }, h('label', { for: id }, label), tbl.length ? s : null,
          tbl.length ? h('div', { class: 'btns', style: 'margin:4px 0' }, h('button', { class: 'btn sm', type: 'button', onclick: () => set(tbl[Math.floor(Math.random() * tbl.length)].description) }, 'Roll')) : null, ta));
      });
      out.push(pp);
    }
    out.push(panel('Tools and languages',
      textBind(c, c, 'tools', { label: 'Tool proficiencies', line: true, ph: 'From your background, class or species' }),
      textBind(c, c, 'langs', { label: 'Languages', line: true, ph: 'Galactic Basic, and others' })));
    out.push(detailsPanel(c, 'background', 'Background'));
    return out;
  };

  BUILD.abilities = (c) => {
    const sp = D.species.find((s) => s.key === c.speciesKey);
    const spb = R.speciesBonuses(sp, c);
    const cost = () => ABIL.reduce((n, a) => n + (R.POINT_COST[c.base[a.k]] || 0), 0);
    const setMethod = (m) => {
      c.method = m;
      if (m === 'standard') ABIL.forEach((a, i) => { c.base[a.k] = R.STD_ARRAY[i]; });
      else if (m === 'pointbuy') ABIL.forEach((a) => { c.base[a.k] = 8; });
      else ABIL.forEach((a) => { c.base[a.k] = 10; });
      touch(c); render();
    };
    const method = h('div', { class: 'chips', role: 'group', 'aria-label': 'Score method' }, [['standard', 'Standard array'], ['pointbuy', 'Point buy'], ['manual', 'Manual or rolled']].map(([id, label]) =>
      h('button', { class: 'chip', type: 'button', 'aria-pressed': String(c.method === id), onclick: () => setMethod(id) }, label)));
    const rows = [];
    const results = {};
    const paintRes = () => ABIL.forEach((a) => {
      const total = c.base[a.k] + spb[a.k] + (c.misc[a.k] || 0);
      results[a.k].replaceChildren('Base ' + c.base[a.k] + ' + species ' + spb[a.k] + ' + other ' + (c.misc[a.k] || 0) + ' = ', h('b', null, total + ' (' + fmt(R.mod(total)) + ')'));
    });
    ABIL.forEach((a) => {
      let ctl;
      if (c.method === 'standard') {
        ctl = selectEl(R.STD_ARRAY.map((v) => ({ v: String(v), t: String(v) })), String(c.base[a.k]), (v) => {
          const other = ABIL.find((x) => x.k !== a.k && c.base[x.k] === +v);
          if (other) c.base[other.k] = c.base[a.k];
          c.base[a.k] = +v; touch(c); render();
        }, { 'aria-label': a.n + ' base score', style: 'width:90px' });
      } else if (c.method === 'pointbuy') {
        const out = h('output', null, String(c.base[a.k]));
        const dec = h('button', { type: 'button', 'aria-label': 'Lower ' + a.n, disabled: c.base[a.k] <= 8, onclick: () => { c.base[a.k]--; touch(c); render(); } }, '−');
        const inc = h('button', { type: 'button', 'aria-label': 'Raise ' + a.n, disabled: c.base[a.k] >= 15 || cost() - R.POINT_COST[c.base[a.k]] + R.POINT_COST[c.base[a.k] + 1] > R.POINT_BUDGET, onclick: () => { c.base[a.k]++; touch(c); render(); } }, '+');
        ctl = h('div', { class: 'stepper' }, dec, out, inc);
      } else {
        ctl = h('input', { type: 'number', min: '1', max: '30', inputmode: 'numeric', value: String(c.base[a.k]), 'aria-label': a.n + ' base score', style: 'width:90px' });
        ctl.addEventListener('input', () => { const n = parseInt(ctl.value, 10); if (n >= 1 && n <= 30) { c.base[a.k] = n; touch(c); paintRes(); } });
      }
      const misc = h('input', { type: 'number', inputmode: 'numeric', value: String(c.misc[a.k] || 0), 'aria-label': a.n + ' other adjustments', style: 'width:76px' });
      misc.addEventListener('input', () => { const n = parseInt(misc.value, 10); c.misc[a.k] = isNaN(n) ? 0 : n; touch(c); paintRes(); });
      results[a.k] = h('div', { class: 'res' });
      rows.push(h('div', { class: 'abrow' }, h('strong', null, a.n), ctl, h('label', { class: 'misc' }, 'Other adjustments', misc), results[a.k]));
    });
    const p = panel('Ability scores', method);
    if (c.method === 'pointbuy') p.append(h('p', { class: 'pointbar' }, 'Points spent: ' + cost() + ' of ' + R.POINT_BUDGET + '. Scores run 8 to 15 before species increases.'));
    if (c.method === 'standard') p.append(h('p', { class: 'sub' }, 'Assign 15, 14, 13, 12, 10 and 8. Picking a value swaps it with the ability that had it.'));
    if (c.method === 'manual') p.append(h('div', { class: 'btns', style: 'margin-bottom:10px' }, h('button', { class: 'btn sm', type: 'button', onclick: () => {
      ABIL.forEach((a) => { const r = [1, 2, 3, 4].map(() => 1 + Math.floor(Math.random() * 6)).sort((x, y) => y - x); c.base[a.k] = r[0] + r[1] + r[2]; });
      touch(c); render();
    } }, 'Roll 4d6, drop lowest')));
    p.append(h('div', { class: 'abgrid' }, rows),
      h('p', { class: 'sub', style: 'margin-top:10px' }, 'Use other adjustments for ability score improvements, feats and anything else that changes a score.'));
    paintRes();
    return [p, detailsPanel(c, 'abilities', 'Abilities')];
  };

  BUILD.skills = (c) => {
    const d = R.derive(D, c);
    const p = panel('Skills', h('p', { class: 'sub' }, 'Class and background picks are locked in. Tap a skill to add proficiency, again for expertise, again to clear.'),
      h('div', { class: 'list' }, d.skills.map((s) => {
        const x = c.skillX[s.name] || 0;
        return h('div', { class: 'li' }, h('span', { class: 'dot' + (s.expert ? ' ex' : s.proficient ? ' on' : '') }),
          h('button', { class: 'nm', type: 'button', onclick: () => { c.skillX[s.name] = (x + 1) % 3; touch(c); render(); } }, s.name + ' ', h('small', null, '(' + s.ab.toUpperCase() + ')' + (s.src ? ' · ' + s.src : ''))),
          h('span', { class: 'v' }, fmt(s.bonus)));
      })));
    return [p, detailsPanel(c, 'skills', 'Skills')];
  };

  BUILD.gear = (c) => {
    const d = R.derive(D, c);
    const credits = h('input', { type: 'number', id: 'cr', inputmode: 'numeric', value: String(c.credits || 0) });
    credits.addEventListener('input', () => { c.credits = parseInt(credits.value, 10) || 0; touch(c); });
    const ac = h('input', { type: 'number', id: 'acov', inputmode: 'numeric', placeholder: 'Auto', value: c.acOverride === '' ? '' : String(c.acOverride) });
    ac.addEventListener('input', () => { c.acOverride = ac.value === '' ? '' : parseInt(ac.value, 10); touch(c); });
    const p = panel('Equipment', h('div', { class: 'row' }, field('Credits', credits, 'cr'), field('AC override', ac, 'acov')),
      h('p', { class: 'sub' }, 'Armor and shields marked equipped set your AC (' + d.ac + ' now). Features that change AC are not applied automatically.'));
    const list = h('div', { class: 'list' });
    c.gear.forEach((g, i) => {
      const it = D.equipment.find((e) => e.key === g.key); if (!it) return;
      const atk = R.attackFor(it, d);
      list.append(h('div', { class: 'li gear' },
        h('button', { class: 'dot' + (g.eq ? ' on' : ''), type: 'button', 'aria-label': (g.eq ? 'Unequip ' : 'Equip ') + it.name, style: 'width:22px;height:22px', onclick: () => { g.eq = !g.eq; touch(c); render(); } }),
        h('span', { class: 'nm' }, it.name, h('br'), h('small', null, [it.category, it.costInCredits + ' cr', it.weight + ' lb', atk ? atk.dmg + ' ' + atk.type : '', it.armorClass ? 'AC ' + it.armorClass : '', (it.properties || []).join(', ')].filter(Boolean).join(' \u00b7 '))),
        h('div', { class: 'ctrls' },
          h('div', { class: 'stepper' },
            h('button', { type: 'button', 'aria-label': 'Fewer ' + it.name, onclick: () => { g.qty = Math.max(1, (g.qty || 1) - 1); touch(c); render(); } }, '\u2212'),
            h('output', null, String(g.qty || 1)),
            h('button', { type: 'button', 'aria-label': 'More ' + it.name, onclick: () => { g.qty = (g.qty || 1) + 1; touch(c); render(); } }, '+')),
          h('span', { style: 'flex:1' }),
          h('span', { class: 'sub' }, g.eq ? 'Equipped' : 'Carried'),
          h('button', { class: 'btn sm warn', type: 'button', onclick: () => { c.gear.splice(i, 1); touch(c); render(); } }, 'Remove'))));
    });
    if (!c.gear.length) list.append(h('p', { class: 'empty' }, 'Nothing yet. Add weapons, armor, kits and gear from the full SW5e list.'));
    p.append(list, h('p', { class: 'sub', style: 'margin-top:8px' }, 'Total weight: ' + Math.round(d.weight * 10) / 10 + ' lb'),
      h('div', { class: 'btns', style: 'margin-top:10px' }, h('button', { class: 'btn primary', type: 'button', onclick: () => openPicker({
        title: 'Equipment',
        items: D.equipment.slice().sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name)).map((e) => ({ id: e.key, name: e.name, group: e.category, sub: e.costInCredits + ' cr · ' + e.weight + ' lb' + (e.damage ? ' · ' + e.damage.numberOfDice + 'd' + e.damage.dieFaces + ' ' + e.damage.type : '') })),
        onPick: (id) => { const ex = c.gear.find((g) => g.key === id); if (ex) ex.qty = (ex.qty || 1) + 1; else c.gear.push({ key: id, qty: 1, eq: false }); touch(c); render(); }
      }) }, 'Add equipment')));
    const out = [p];
    const cl = D.classes.find((k) => k.key === c.classKey), bg = D.backgrounds.find((b) => b.key === c.backgroundKey);
    if (cl || bg) out.push(panel('Starting equipment reference', cl ? expand(cl.name, mdBox(cl.startingEquipment)) : null, bg ? expand(bg.name, mdBox(bg.startingEquipment)) : null));
    out.push(detailsPanel(c, 'gear', 'Gear'));
    return out;
  };

  BUILD.powers = (c) => {
    const d = R.derive(D, c);
    const p = panel('Powers');
    if (d.cls || d.arch) p.append(h('p', { class: 'sub' }, d.casting ? 'Your class table shows how many powers you know and the highest level you can cast. See the Sheet.' : 'Your class does not cast powers, but you may have gained some from another source.'));
    const list = h('div', null);
    c.powers.forEach((cp, i) => {
      const pw = D.powers.find((x) => x.key === cp.key); if (!pw) return;
      list.append(expand(pw.name + ' · ' + (pw.level ? 'level ' + pw.level : 'at-will'), h('div', null,
        h('p', { class: 'sub' }, [pw.powerType, pw.forceAlignment !== 'none' ? pw.forceAlignment + ' side' : '', pw.castingTime.text, pw.range, pw.duration + (pw.concentration ? ' (concentration)' : '')].filter(Boolean).join(' · ')),
        mdBox(pw.description), h('div', { class: 'btns' }, h('button', { class: 'btn sm warn', type: 'button', onclick: () => { c.powers.splice(i, 1); touch(c); render(); } }, 'Remove')))));
    });
    if (!c.powers.length) list.append(h('p', { class: 'empty' }, 'No powers yet.'));
    p.append(list, h('div', { class: 'btns', style: 'margin-top:10px' }, h('button', { class: 'btn primary', type: 'button', onclick: () => openPicker({
      title: 'Powers',
      items: D.powers.slice().sort((a, b) => a.powerType.localeCompare(b.powerType) || a.level - b.level || a.name.localeCompare(b.name))
        .map((x) => ({ id: x.key, name: x.name, group: x.powerType + ' · ' + (x.level ? 'level ' + x.level : 'at-will'), sub: (x.forceAlignment !== 'none' ? x.forceAlignment + ' side · ' : '') + x.castingTime.text })),
      onPick: (id) => { if (!c.powers.find((x) => x.key === id)) c.powers.push({ key: id }); touch(c); render(); }
    }) }, 'Add power')));
    return [p, detailsPanel(c, 'powers', 'Powers')];
  };

  BUILD.feats = (c) => {
    const p = panel('Feats');
    const list = h('div', null);
    c.feats.forEach((cf, i) => {
      const f = D.feats.find((x) => x.key === cf.key); if (!f) return;
      list.append(expand(f.name, h('div', null, f.prerequisite ? h('p', { class: 'sub' }, 'Prerequisite: ' + f.prerequisite) : null, mdBox(f.description),
        h('div', { class: 'btns' }, h('button', { class: 'btn sm warn', type: 'button', onclick: () => { c.feats.splice(i, 1); touch(c); render(); } }, 'Remove')))));
    });
    if (!c.feats.length) list.append(h('p', { class: 'empty' }, 'No feats yet.'));
    p.append(list, h('p', { class: 'sub', style: 'margin-top:8px' }, 'If a feat raises an ability score, add it under other adjustments on the Abilities screen.'),
      h('div', { class: 'btns', style: 'margin-top:10px' }, h('button', { class: 'btn primary', type: 'button', onclick: () => openPicker({
        title: 'Feats',
        items: D.feats.slice().sort((a, b) => a.name.localeCompare(b.name)).map((x) => ({ id: x.key, name: x.name, sub: x.prerequisite ? 'Prerequisite: ' + x.prerequisite : 'No prerequisite' })),
        onPick: (id) => { if (!c.feats.find((x) => x.key === id)) c.feats.push({ key: id }); touch(c); render(); }
      }) }, 'Add feat')));
    return [p, detailsPanel(c, 'feats', 'Feats')];
  };

  BUILD.story = (c) => {
    const sec = L.story.find((s) => s.id === S.story) || L.story[0];
    const chips = h('div', { class: 'chips', role: 'group', 'aria-label': 'Story questions' }, L.story.map((s) =>
      h('button', { class: 'chip', type: 'button', 'aria-pressed': String(s.id === sec.id), onclick: () => { S.story = s.id; render(); } }, s.title)));
    const p = panel(sec.title, h('p', { class: 'sub' }, sec.blurb));
    sec.q.forEach((q) => {
      const a = c.story[q.id] = c.story[q.id] || { c: '', t: '' };
      const opts = optionsFor(q, c);
      const id = nid();
      const box = h('div', { class: 'field' }, h('label', { for: id }, q.t));
      if (opts) box.append(selectEl([{ v: '', t: 'Choose one' }].concat(opts.map((o) => ({ v: o, t: o }))), a.c, (v) => { a.c = v; touch(c); }, { id }));
      const t = opts ? h('input', { type: 'text', 'aria-label': q.t + ' (your own words)', placeholder: 'In your own words (optional)', autocomplete: 'off' })
        : h('textarea', { id, rows: 2, placeholder: 'Write your answer' });
      t.value = a.t;
      t.addEventListener('input', () => { a.t = t.value; touch(c); });
      box.append(t);
      p.append(box);
    });
    return [chips, p, detailsPanel(c, 'story', 'Story')];
  };

  BUILD.notes = (c) => [panel('Notes', textBind(c, c.notes, 'general', { label: 'Anything else', rows: 12, ph: 'Backstory, session notes, plans, loose ideas.' }))];

  /* ---- holopedia ---- */
  const HOLO = [['species', 'Species'], ['classes', 'Classes'], ['planets', 'Planets'], ['aurabesh', 'Aurabesh'], ['words', 'Words']];

  function viewHolo() {
    const wrap = h('div', { class: 'wrap' });
    wrap.append(h('div', { class: 'chips', role: 'group', 'aria-label': 'Holopedia sections' }, HOLO.map(([id, label]) =>
      h('button', { class: 'chip', type: 'button', 'aria-pressed': String(S.holo === id), onclick: () => { S.holo = id; render(true); } }, label))));
    if (S.holo === 'aurabesh') wrap.append(holoAurabesh());
    else if (S.holo === 'words') wrap.append(holoWords());
    else if (S.holo === 'planets') wrap.append(holoPlanets());
    else wrap.append(holoEntries(S.holo));
    return wrap;
  }

  function figureBlock(kind, key) {
    const f = L.figures && L.figures[kind + ':' + key];
    if (!f) return null;
    return h('blockquote', { class: 'note', style: 'margin:0' }, h('p', null, '“' + f.quote + '”'), h('strong', null, f.who), f.src ? h('div', { class: 'sub' }, f.src) : null);
  }

  function refLinks(name, star) {
    const q = encodeURIComponent(name);
    return [
      { text: 'SW', title: 'Open on StarWars.com', href: star || 'https://www.starwars.com/search?q=' + q },
      { text: 'W', title: 'Open on Wookieepedia', href: 'https://starwars.fandom.com/wiki/Special:Search?query=' + q }
    ];
  }

  function classArt(kind, item) {
    const SI = window.SPECIES_IMG; if (!SI || !SI.classes) return [];
    const ck = kind === 'classes' ? item.key : ((D.classes.find((c) => c.name === item.className) || {}).key);
    return (SI.classes[ck] || []).map((f) => SI.classBase + f);
  }

  function holoEntries(kind) {
    const lists = {
      species: { arr: D.species, label: 'Species', pick: (x) => x },
      classes: { arr: D.classes, label: 'Class' },
      subclasses: { arr: D.archetypes, label: 'Subclass' }
    };
    const cfg = lists[kind];
    const sorted = cfg.arr.slice().sort((a, b) => (kind === 'subclasses' ? a.className.localeCompare(b.className) : 0) || a.name.localeCompare(b.name));
    const opts = sorted.map((x) => ({ v: x.key, t: x.name, g: kind === 'subclasses' ? x.className : kind === 'species' ? (x.contentSet === 'core' ? 'Player’s Handbook' : 'Expanded Content') : undefined }));
    const key = S.holoKey[kind] && cfg.arr.find((x) => x.key === S.holoKey[kind]) ? S.holoKey[kind] : opts[0].v;
    const item = cfg.arr.find((x) => x.key === key);
    const pnl = panel(cfg.label + ' entries', field(cfg.label, selectEl(opts, key, (v) => { S.holoKey[kind] = v; render(); }, { id: 'hsel' }), 'hsel'));
    const out = [pnl];
    const e = panel(item.name);
    e.append(h('div', { class: 'facts' }, kind === 'species' ? [item.size && 'Size: ' + cap(item.size), item.homeworld && 'Homeworld: ' + item.homeworld, item.nativeLanguage && 'Language: ' + item.nativeLanguage].filter(Boolean).map((t) => h('span', null, t))
      : kind === 'subclasses' ? h('span', null, item.className) : h('span', null, item.summary)));
    const fig = figureBlock(kind, key);
    if (fig) e.append(fig);
    const SI = window.SPECIES_IMG;
    const sf = kind === 'species' && SI && (SI.local && SI.local[key] || SI.files[key] && SI.base + SI.files[key]);
    e.append(slot('holo:' + kind + ':' + key, { small: true, bare: true, links: refLinks(item.name), hint: 'No picture yet', fallback: kind === 'species' ? (sf || '') : classArt(kind, item) }));
    if (kind === 'species') e.append(mdBox(item.lore), expand('Traits', h('div', null, (item.traits || []).map((t) => expand(t.name, mdBox(t.description))))));
    else if (kind === 'classes') { e.append(mdBox(item.lore)); }
    else e.append(mdBox(item.intro));
    out.push(e);
    if (kind === 'classes') {
      const subs = D.archetypes.filter((x) => x.className === item.name).sort((x, y) => x.name.localeCompare(y.name));
      if (subs.length) {
        const sp = panel('Subclasses');
        sp.append(h('p', { class: 'sub' }, subs.length + ' subclasses. Tap one to open it.'));
        subs.forEach((s) => {
          const body = h('div');
          const d = h('details', null, h('summary', null, s.name), body);
          d.addEventListener('toggle', () => { if (d.open && !body.childNodes.length) body.append(mdBox(s.intro)); });
          sp.append(d);
        });
        out.push(sp);
      }
    }
    return h('div', { class: 'wrap', style: 'gap:14px' }, out);
  }

  function holoAurabesh() {
    const input = h('input', { type: 'text', id: 'typer', placeholder: 'Type here to see it in Aurabesh', autocomplete: 'off', autocapitalize: 'off' });
    const out = h('div', { class: 'aur', style: 'font-size:1.6rem;color:var(--holo);white-space:normal;line-height:1.5;min-height:2.4rem;margin-top:8px', 'aria-hidden': 'true' }, 'aurabesh');
    input.addEventListener('input', () => { out.textContent = input.value; });
    const wrap = h('div', { class: 'wrap' });
    wrap.append(panel('Aurabesh typer', field('Your text', input, 'typer'), out,
      h('p', { class: 'sub' }, S.fontOK ? 'Capital letters use the mirrored forms, so this chart and the headers show everything in lowercase.' : 'The Aurabesh font did not load, so the glyphs are hidden. Check Settings.')));
    const grid = h('div', { class: 'alpha' }, L.aurabesh.map((a) =>
      h('div', { class: 'glyph' }, h('div', { class: 'g', 'aria-hidden': 'true' }, a.en), h('b', null, a.n), h('small', null, a.en))));
    wrap.append(panel('The alphabet', h('p', { class: 'sub' }, 'Thirty-four letters. Each name is followed by its English equivalent. Letters with two-letter equivalents are drawn here as that spelling.'), grid));
    return wrap;
  }

  const WF = { lang: '', tag: '', cont: '', q: '' };
  function holoWords() {
    const G = L.glossary.slice().sort((x, y) => x.w.localeCompare(y.w));
    const uniq = (f) => Array.from(new Set(G.flatMap(f))).sort((a, b) => a.localeCompare(b));
    const langs = uniq((g) => [g.lang]), tags = uniq((g) => g.tags);
    const list = h('div');
    const count = h('p', { class: 'sub', role: 'status', style: 'margin:0' });
    const rows = h('div', { style: 'display:grid;gap:14px' });
    const fbtn = h('button', { class: 'btn sm', type: 'button', 'aria-haspopup': 'dialog' });
    const nActive = () => ['lang', 'tag'].filter((k) => WF[k]).length;
    function chipRow(label, key, vals) {
      const row = h('div', { class: 'chips', role: 'group', 'aria-label': label });
      [['', 'All']].concat(vals.map((v) => (Array.isArray(v) ? v : [v, v]))).forEach(([v, t]) => {
        row.append(h('button', { class: 'chip', type: 'button', 'aria-pressed': String(WF[key] === v), onclick: () => { WF[key] = v; paintChips(); paint(); } }, t));
      });
      return h('div', null, h('div', { class: 'lbl' }, label), row);
    }
    function paintChips() {
      rows.replaceChildren(chipRow('Language', 'lang', langs), chipRow('Tag', 'tag', tags));
      fbtn.textContent = nActive() ? 'Filters (' + nActive() + ')' : 'Filters';
    }
    function openFilters() {
      const done = () => scrim.remove();
      const clear = h('button', { class: 'btn sm', type: 'button', onclick: () => { WF.lang = WF.tag = ''; paintChips(); paint(); } }, 'Clear');
      const scrim = h('div', { class: 'scrim fsheet', role: 'dialog', 'aria-label': 'Word filters', onclick: (e) => { if (e.target === scrim) done(); } },
        h('div', { class: 'fcard' },
          h('div', { class: 'bar' }, h('strong', { style: 'flex:1' }, 'Filter words'), clear, h('button', { class: 'btn sm', type: 'button', onclick: done }, 'Done')),
          h('div', { style: 'padding:12px 16px 16px' }, rows)));
      document.body.append(scrim);
    }
    fbtn.addEventListener('click', openFilters);
    const q = h('input', { type: 'search', id: 'wq', placeholder: 'Search words and meanings', autocomplete: 'off', value: WF.q, 'aria-label': 'Search words' });
    q.addEventListener('input', () => { WF.q = q.value; paint(); });
    function paint() {
      const t = WF.q.trim().toLowerCase();
      const hit = G.filter((g) => (!WF.lang || g.lang === WF.lang) && (!WF.tag || g.tags.includes(WF.tag)) && (!WF.cont || g.cont === WF.cont)
        && (!t || (g.w + ' ' + g.mean + ' ' + g.note).toLowerCase().includes(t)));
      list.replaceChildren(...hit.map((g) => h('div', { class: 'gloss' },
        h('div', { class: 'ghead' }, h('h3', null, g.w, h('span', { class: 'aur', 'aria-hidden': 'true' }, g.w))),
        h('p', { class: 'gtext' }, g.mean, g.note ? h('span', { class: 'sub' }, ' ' + g.note) : null, h('span', { class: 'gmeta' }, ' ' + g.lang + ' · ' + g.tags.join(', '))))));
      if (!hit.length) list.append(h('p', { class: 'empty' }, 'No words match those filters. Clear a filter to see more.'));
      count.textContent = hit.length + ' of ' + G.length + ' words';
      fbtn.textContent = nActive() ? 'Filters (' + nActive() + ')' : 'Filters';
    }
    paintChips(); paint();
    return h('div', { class: 'wrap' }, panel('Words and curses',
      field('Search', q, 'wq'), h('div', { style: 'display:flex;gap:10px;align-items:center;margin:8px 0' }, fbtn, count), list));
  }

  function planetURL(n) { const P = window.PLANET_IMG; return P && P.files[n] ? P.base + P.files[n] : ''; }
  function planetPage(n) { const P = window.PLANET_IMG; return 'https://www.starwars.com/databank/' + (P && P.slugs[n] || encodeURIComponent(n.toLowerCase().replace(/ /g, '-'))); }

  function holoPlanets() {
    const names = L.planets.slice().sort((a, b) => a.localeCompare(b));
    const key = S.holoKey.planets && names.includes(S.holoKey.planets) ? S.holoKey.planets : names[0];
    const sel = panel('Planet entries', field('Planet', selectEl(names.map((n) => ({ v: n, t: n })), key, (v) => { S.holoKey.planets = v; render(); }, { id: 'psel' }), 'psel'));
    const e = panel(key);
    const info = (L.planetInfo || {})[key];
    e.append(slot('holo:planets:' + key, { small: true, bare: true, links: refLinks(key, planetPage(key)), hint: 'No picture yet', fallback: planetURL(key) }));
    if (info) e.append(h('p', { style: 'margin:10px 0 4px' }, info.about), info.places.length ? h('p', { class: 'sub', style: 'margin:0 0 10px' }, 'Notable places: ' + info.places.join(' · ')) : null);
    return h('div', { class: 'wrap', style: 'gap:14px' }, [sel, e]);
  }

  /* ---- settings ---- */
  function exportAll() {
    return { app: 'sw5e-datapad', version: 1, exported: new Date().toISOString(), chars: S.chars, images: S.imgs, cfg: S.cfg };
  }
  async function importAll(text) {
    let o;
    try { o = JSON.parse(text); } catch (e) { toast('That is not a valid backup.'); return; }
    if (!o || o.app !== 'sw5e-datapad' || !Array.isArray(o.chars)) { toast('That file is not a Datapad backup.'); return; }
    o.chars.forEach((c) => {
      const base = R.newCharacter();
      const merged = Object.assign(base, c);
      const i = S.chars.findIndex((x) => x.id === merged.id);
      if (i >= 0) S.chars[i] = merged; else S.chars.push(merged);
      dbPut('chars', merged.id, merged);
    });
    Object.keys(o.images || {}).forEach((k) => setImg(k, o.images[k]));
    toast('Restored ' + o.chars.length + ' character' + (o.chars.length === 1 ? '' : 's') + '.');
    render();
  }

  function viewSettings() {
    const wrap = h('div', { class: 'wrap' });
    const row = (label, ctl) => h('div', { class: 'srow' }, h('span', { class: 'nm' }, label), ctl);
    const toggle = (label, on, set) => { const i = h('input', { type: 'checkbox', checked: on }); i.addEventListener('change', () => set(i.checked)); return h('label', { class: 'srow tg' }, h('span', { class: 'nm' }, label), i); };
    const save = () => dbPut('meta', 'cfg', S.cfg);

    const curHue = typeof S.cfg.hue === 'number' ? S.cfg.hue : BASE_HUE;
    const slider = h('input', { type: 'range', min: 0, max: 360, step: 1, value: Math.round(curHue), class: 'hue', 'aria-label': 'Colour hue' });
    const hexIn = h('input', { type: 'text', class: 'hexin', maxlength: 7, autocomplete: 'off', spellcheck: 'false', 'aria-label': 'Hex colour code' });
    const sw = h('input', { type: 'color', class: 'swatch', 'aria-label': 'Pick a colour' });
    sw.addEventListener('input', () => { const [hh, s] = rgb2hsl(hex2rgb(sw.value)); if (s < 0.05) return; S.cfg.hue = Math.round(hh); slider.value = S.cfg.hue; const x = applyTheme(); hexIn.value = x.toUpperCase(); });
    sw.addEventListener('change', save);
    const show = () => { const x = applyTheme(); hexIn.value = x.toUpperCase(); sw.value = x; };
    slider.addEventListener('input', () => { S.cfg.hue = +slider.value; show(); });
    slider.addEventListener('change', save);
    hexIn.addEventListener('change', () => {
      let v = hexIn.value.trim(); if (v[0] !== '#') v = '#' + v;
      if (/^#[0-9a-fA-F]{3}$/.test(v)) v = '#' + v.slice(1).split('').map((ch) => ch + ch).join('');
      if (!/^#[0-9a-fA-F]{6}$/.test(v)) { toast('Enter a hex code like #6FE6FF.'); show(); return; }
      const [hh, s] = rgb2hsl(hex2rgb(v));
      if (s < 0.05) { toast('That colour is grey. Pick one with some colour in it.'); show(); return; }
      S.cfg.hue = Math.round(hh); slider.value = S.cfg.hue; show(); save();
    });
    const reset = h('button', { class: 'btn sm', type: 'button', onclick: () => { delete S.cfg.hue; slider.value = Math.round(BASE_HUE); show(); save(); } }, 'Reset');
    show();

    const file = h('input', { type: 'file', accept: 'application/json,.json', hidden: true });
    file.addEventListener('change', async () => { const f = file.files && file.files[0]; if (f) await importAll(await f.text()); file.value = ''; });

    wrap.append(panel('Settings',
      h('div', { class: 'lbl' }, 'Colour'),
      slider,
      h('div', { class: 'srow' }, sw, hexIn, reset),
      toggle('Aurabesh under headings', !!S.cfg.aur, (v) => { S.cfg.aur = v; save(); applyAur(); }),
      toggle('Reduce motion', document.body.classList.contains('calm'), (v) => { S.cfg.calm = v; save(); applyMotion(); }),
      h('div', { class: 'lbl', style: 'margin-top:6px' }, 'Backup'),
      h('div', { class: 'btns' },
        h('button', { class: 'btn', type: 'button', onclick: () => {
          const blob = new Blob([JSON.stringify(exportAll())], { type: 'application/json' });
          const a = h('a', { href: URL.createObjectURL(blob), download: 'sw5e-datapad-backup.json' });
          document.body.append(a); a.click(); a.remove(); toast('Backup file created.');
        } }, 'Download'),
        h('button', { class: 'btn', type: 'button', onclick: () => file.click() }, 'Restore'), file),
      !S.ok ? h('div', { class: 'note' }, 'This browser is not saving between visits. Back up before you close the app.') : null,
      h('p', { class: 'sub', style: 'margin:6px 0 0;font-size:.75rem' }, 'Unofficial fan tool. Rules from the SW5e community database. Star Wars is a trademark of Lucasfilm Ltd. Aurebesh font by Pixel Sagas. Version 21.')));
    return wrap;
  }

  const canonView = (n) => () => (window.CANON ? window.CANON[n]() : h('div', { class: 'wrap' }, panel('Canon index', h('p', { class: 'sub' }, 'The canon index is not part of this preview. Open the installed app or the Netlify site.'))));
  const VIEWS = { index: canonView('viewIndex'), timeline: canonView('viewTimeline'), roster: viewRoster, build: viewBuild, holo: viewHolo, settings: viewSettings };

  /* --------------------------------------------------------------- boot */
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); S.installEvt = e; });

  async function init() {
    idb = await openDB();
    S.ok = !!idb;
    if (idb) {
      (await dbEntries('chars')).forEach(([, v]) => { S.chars.push(Object.assign(R.newCharacter(), v)); });
      (await dbEntries('imgs')).forEach(([k, v]) => { S.imgs[k] = v; });
      const cfg = await dbGet('meta', 'cfg'); if (cfg) Object.assign(S.cfg, cfg);
      const last = await dbGet('meta', 'last');
      if (last && S.chars.find((c) => c.id === last)) S.cur = last;
    }
    buildChrome();
    render(true);
    try { const f = await document.fonts.load('16px Aurebesh', 'Aa'); S.fontOK = f.length > 0; } catch (e) { S.fontOK = false; }
    applyTheme(); applyAur(); applyMotion();
    if (S.tab === 'settings' || S.tab === 'holo') render();
    if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol) && document.querySelector('link[rel="manifest"]')) {
      const had = !!navigator.serviceWorker.controller; let done = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => { if (had && !done) { done = true; location.reload(); } });
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  }
  window.DP = { h, panel, field, toast, debounce, icon, selectEl, S, go, render: (r) => render(r) };
  init();
  if (window.CANON && window.CANON.ready) window.CANON.ready();
})();
