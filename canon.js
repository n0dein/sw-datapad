/* Canon index: searchable Star Wars canon (characters, planets, species, groups, places, ships, droids,
 * events, media) plus a chronological timeline. Data comes from data/idx_*.json, built from the
 * Wookieepedia database dump (text CC BY-SA, https://starwars.fandom.com). Legends pages are left out. */
(function () {
  'use strict';
  const DP = window.DP;
  if (!DP) return;
  const { h, panel, toast, debounce } = DP;

  const KINDS = [['char', 'Characters'], ['planet', 'Planets'], ['species', 'Species'], ['org', 'Groups'], ['place', 'Places'],
    ['ship', 'Ships'], ['droid', 'Droids'], ['event', 'Events'], ['media', 'Media']];
  const KLAB = { char: 'Character', planet: 'Planet', species: 'Species', org: 'Group', place: 'Place', ship: 'Ship', droid: 'Droid', event: 'Event', media: 'Media' };
  const MLAB = { film: 'Film', tv: 'TV episode', comic: 'Comic', book: 'Book', story: 'Story', game: 'Game' };
  const FILTERS = {
    char: [['er', 'Era'], ['species', 'Species'], ['affiliation', 'Group'], ['type', 'Type'], ['homeworld', 'Homeworld'], ['gender', 'Gender']],
    planet: [['er', 'Era'], ['region', 'Region'], ['climate', 'Climate'], ['terrain', 'Terrain'], ['species', 'Species'], ['affiliation', 'Group']],
    species: [['er', 'Era'], ['class', 'Class'], ['designation', 'Designation'], ['origin', 'Origin'], ['habitat', 'Habitat']],
    org: [['er', 'Era'], ['type', 'Type'], ['affiliation', 'Allied with']],
    place: [['er', 'Era'], ['type', 'Type'], ['affiliation', 'Group']],
    ship: [['er', 'Era'], ['type', 'Type'], ['manufacturer', 'Maker'], ['affiliation', 'Group']],
    droid: [['er', 'Era'], ['class', 'Class'], ['type', 'Type'], ['affiliation', 'Group']],
    event: [['er', 'Era'], ['conflict', 'Conflict'], ['place', 'Place']],
    media: [['er', 'Era'], ['m', 'Media type'], ['s', 'Series']]
  };
  const FACTS = [['type', 'Type'], ['class', 'Class'], ['species', 'Species'], ['gender', 'Gender'], ['homeworld', 'Homeworld'], ['origin', 'Origin'],
    ['designation', 'Designation'], ['affiliation', 'Groups'], ['masters', 'Masters'], ['apprentices', 'Apprentices'], ['region', 'Region'],
    ['sector', 'Sector'], ['system', 'System'], ['climate', 'Climate'], ['terrain', 'Terrain'], ['habitat', 'Habitat'], ['language', 'Languages'],
    ['cities', 'Cities'], ['government', 'Government'], ['leader', 'Leader'], ['headquarters', 'Headquarters'], ['manufacturer', 'Maker'],
    ['owners', 'Owners'], ['conflict', 'Conflict'], ['place', 'Place'], ['side1', 'Side 1'], ['side2', 'Side 2'], ['objective', 'Objective'], ['result', 'Result']];
  const APLAB = { c: 'Characters and droids', s: 'Species', l: 'Places', o: 'Groups', e: 'Events' };

  /* ---------- data ---------- */
  const DATA_V = 'v3';
  let ready = false, loadErr = '', loading = false, progress = '';
  let META = null, ITEMS = [], BYID = [], BYTITLE = new Map(), APPEARS = new Map(), BYKIND = {};

  const ERA = () => (META ? META.eras.map((e) => e[0]) : []);
  const fy = (y) => (y < 0 ? -y + ' BBY' : y + ' ABY');
  const yrs = (y) => (!y ? '' : y[0] === y[1] ? fy(y[0]) : fy(y[0]) + ' to ' + fy(y[1]));

  async function load() {
    if (loading || ready) return;
    loading = true;
    try {
      const names = ['idx_meta', 'idx_char', 'idx_other', 'idx_media'];
      const out = [];
      for (let i = 0; i < names.length; i++) {
        progress = 'Loading canon data (' + (i + 1) + ' of ' + names.length + ')…'; DP.render();
        const r = await fetch('data/' + names[i] + '.' + DATA_V + '.json');
        if (!r.ok) throw new Error(names[i] + ' ' + r.status);
        out.push(await r.json());
      }
      META = out[0];
      ITEMS = out[1].concat(out[2], out[3]);
      BYID = new Array(META.maxid);
      BYKIND = {};
      ITEMS.forEach((e) => {
        BYID[e.i] = e;
        (BYKIND[e.k] = BYKIND[e.k] || []).push(e);
        e._key = (e.t + ' ' + (e.n || '') + ' ' + (e.a ? e.a.join(' ') : '')).toLowerCase();
        BYTITLE.set(e.t.toLowerCase(), e.i);
      });
      ITEMS.forEach((e) => {
        if (e.n) { const k = e.n.toLowerCase(); if (!BYTITLE.has(k)) BYTITLE.set(k, e.i); }
        if (e.a) e.a.forEach((a) => { const k = a.toLowerCase(); if (!BYTITLE.has(k)) BYTITLE.set(k, e.i); });
      });
      (BYKIND.media || []).forEach((m) => {
        if (!m.ap) return;
        Object.keys(m.ap).forEach((g) => m.ap[g].forEach((id) => {
          let l = APPEARS.get(id); if (!l) APPEARS.set(id, l = []);
          l.push(m.i);
        }));
      });
      ready = true; progress = '';
    } catch (e) {
      loadErr = 'The canon data could not be loaded (' + e.message + '). It is available in the installed app and on the Netlify site, not in the Claude preview.';
    }
    loading = false;
    DP.render();
  }

  const rank = (e) => (APPEARS.get(e.i) || []).length;
  const mediaYear = (m) => (m.y ? m.y[0] : null);
  function sortMedia(ids) {
    return ids.map((i) => BYID[i]).filter(Boolean).sort((a, b) => {
      const ya = a.y ? a.y[0] : 1e9, yb = b.y ? b.y[0] : 1e9;
      return ya - yb || (a.r || '').localeCompare(b.r || '') || a.t.localeCompare(b.t);
    });
  }

  /* ---------- shared bits ---------- */
  const ST = { kind: 'char', q: '', filters: {}, shown: 40, detail: null, stack: [], from: '', more: {} };
  const TS = { types: { film: true, tv: true, comic: true, book: true, story: true, game: true, event: false }, era: -1, char: null, q: '', order: 'universe', shown: 80, mode: 'overview', open: new Set() };

  function title() { return ST.detail != null && BYID[ST.detail] ? BYID[ST.detail].n || BYID[ST.detail].t : 'The Holopedia'; }
  function hasDetail() { return ST.detail != null; }
  function back() {
    if (ST.stack.length) ST.detail = ST.stack.pop();
    else { ST.detail = null; if (ST.from) { const f = ST.from; ST.from = ''; DP.go(f); return; } }
    DP.render(true);
  }
  function open(id, from) {
    if (ST.detail != null && DP.S.tab === 'index') ST.stack.push(ST.detail);
    else { ST.stack = []; ST.from = from || ''; }
    ST.detail = id; ST.more = {};
    if (DP.S.tab !== 'index') DP.go('index'); else DP.render(true);
  }
  const wookie = (e) => 'https://starwars.fandom.com/wiki/' + encodeURIComponent(e.t.replace(/ /g, '_')).replace(/%3A/g, ':').replace(/%2C/g, ',');

  function valuesOf(e, f) {
    if (f === 'er') return (e.er || []).map((n) => ERA()[n]);
    if (f === 'm') return e.m ? [MLAB[e.m]] : [];
    if (f === 's' && typeof e.s === 'string') return [e.s];
    const v = e[f]; return Array.isArray(v) ? v : v ? [v] : [];
  }
  function countValues(kind, f) {
    const c = new Map();
    (BYKIND[kind] || []).forEach((e) => valuesOf(e, f).forEach((v) => c.set(v, (c.get(v) || 0) + 1)));
    return [...c.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }

  function openValuePicker(kind, f, label, onPick) {
    const all = countValues(kind, f);
    const input = h('input', { type: 'search', placeholder: 'Search ' + label.toLowerCase(), 'aria-label': 'Search' });
    const body = h('div', { class: 'body' });
    const close = () => scrim.remove();
    const scrim = h('div', { class: 'scrim', role: 'dialog', 'aria-label': label },
      h('div', { class: 'bar' }, input, h('button', { class: 'btn sm', type: 'button', onclick: close }, 'Close')), body);
    function paint() {
      const q = input.value.trim().toLowerCase();
      const list = all.filter(([v]) => !q || v.toLowerCase().includes(q));
      body.replaceChildren(h('button', { class: 'pick', type: 'button', onclick: () => { close(); onPick(null); } }, h('strong', null, 'Any ' + label.toLowerCase())));
      list.slice(0, 200).forEach(([v, n]) => body.append(h('button', { class: 'pick', type: 'button', onclick: () => { close(); onPick(v); } }, h('strong', null, v), h('span', null, n + (n === 1 ? ' entry' : ' entries')))));
      if (list.length > 200) body.append(h('p', { class: 'sub' }, 'Showing 200 of ' + list.length + '. Keep typing to narrow the list.'));
      if (!list.length) body.append(h('p', { class: 'empty' }, 'Nothing matches that search.'));
    }
    input.addEventListener('input', paint); paint();
    document.body.append(scrim); input.focus();
  }

  function pickEntity(kinds, onPick, label) {
    const input = h('input', { type: 'search', placeholder: label || 'Search by name', 'aria-label': 'Search' });
    const body = h('div', { class: 'body' });
    const close = () => scrim.remove();
    const scrim = h('div', { class: 'scrim', role: 'dialog', 'aria-label': 'Choose' },
      h('div', { class: 'bar' }, input, h('button', { class: 'btn sm', type: 'button', onclick: close }, 'Close')), body);
    function paint() {
      const q = input.value.trim().toLowerCase();
      body.replaceChildren();
      if (q.length < 2) { body.append(h('p', { class: 'sub' }, 'Type at least two letters.')); return; }
      search(q, kinds).slice(0, 60).forEach((e) => body.append(h('button', { class: 'pick', type: 'button', onclick: () => { close(); onPick(e); } }, h('strong', null, e.n || e.t), h('span', null, subline(e)))));
    }
    input.addEventListener('input', debounce(paint, 120)); paint();
    document.body.append(scrim); input.focus();
  }

  function search(q, kinds, filters) {
    const toks = q.split(/\s+/).filter(Boolean);
    const out = [];
    (kinds || [ST.kind]).forEach((k) => (BYKIND[k] || []).forEach((e) => {
      for (const t of toks) if (e._key.indexOf(t) < 0) return;
      if (filters) for (const f of Object.keys(filters)) if (valuesOf(e, f).indexOf(filters[f]) < 0) return;
      out.push(e);
    }));
    const ql = q.toLowerCase();
    return out.sort((a, b) => {
      const sa = a.t.toLowerCase() === ql ? 0 : a.t.toLowerCase().startsWith(ql) ? 1 : a._key.indexOf(' ' + ql) >= 0 ? 2 : 3;
      const sb = b.t.toLowerCase() === ql ? 0 : b.t.toLowerCase().startsWith(ql) ? 1 : b._key.indexOf(' ' + ql) >= 0 ? 2 : 3;
      return sa - sb || rank(b) - rank(a) || a.t.length - b.t.length;
    });
  }

  function subline(e) {
    const f = (k, n) => (e[k] || []).slice(0, n || 1);
    let parts;
    switch (e.k) {
      case 'char': parts = [].concat(f('species'), f('homeworld'), f('affiliation'), f('type')); break;
      case 'planet': parts = [].concat(f('region'), f('sector'), f('climate')); break;
      case 'species': parts = [].concat(f('class'), f('origin')); break;
      case 'org': parts = [].concat(f('type'), f('leader')); break;
      case 'ship': parts = [].concat(f('type'), f('manufacturer')); break;
      case 'droid': parts = [].concat(f('class'), f('type'), f('affiliation')); break;
      case 'event': parts = [].concat(e.y ? [yrs(e.y)] : [], f('place')); break;
      case 'media': parts = [MLAB[e.m], e.s, e.y ? yrs(e.y) : (e.r || '').slice(0, 4)]; break;
      default: parts = [].concat(f('affiliation'), f('type'));
    }
    return parts.filter(Boolean).slice(0, 4).join(' · ') || KLAB[e.k];
  }

  /* ---------- Index view ---------- */
  function loadingView() {
    return h('div', { class: 'wrap' }, panel('The Holopedia',
      loadErr ? h('p', { class: 'note' }, loadErr) : h('p', { class: 'sub' }, progress || 'Preparing the canon index…')));
  }

  function viewIndex() {
    if (!ready) { if (!loadErr) load(); return loadingView(); }
    if (ST.detail != null) return viewDetail(ST.detail);
    const wrap = h('div', { class: 'wrap' });
    const results = h('div', { class: 'cresults' });
    const count = h('p', { class: 'sub', style: 'margin:0' });
    const input = h('input', { type: 'search', placeholder: 'Search ' + KINDS.find((k) => k[0] === ST.kind)[1].toLowerCase() + ' by name', 'aria-label': 'Search the index', value: ST.q, autocomplete: 'off' });
    const chips = h('div', { class: 'chips', role: 'group', 'aria-label': 'What to browse' }, KINDS.map(([k, label]) =>
      h('button', { class: 'chip', type: 'button', 'aria-pressed': String(ST.kind === k), onclick: () => { ST.kind = k; ST.filters = {}; ST.shown = 40; DP.render(); } }, label)));
    const active = h('div', { class: 'chips wrapchips' });
    const filterBtn = h('button', { class: 'btn sm', type: 'button', onclick: () => openFilters() }, 'Filters');

    function list() {
      const q = input.value.trim().toLowerCase();
      ST.q = input.value;
      let items;
      if (q) items = search(q, [ST.kind], ST.filters);
      else {
        items = (BYKIND[ST.kind] || []).filter((e) => Object.keys(ST.filters).every((f) => valuesOf(e, f).indexOf(ST.filters[f]) >= 0));
        items.sort((a, b) => rank(b) - rank(a) || a.t.localeCompare(b.t));
      }
      count.textContent = items.length.toLocaleString() + (items.length === 1 ? ' entry' : ' entries') + (q ? '' : ', most featured first');
      results.replaceChildren();
      items.slice(0, ST.shown).forEach((e) => results.append(row(e)));
      if (items.length > ST.shown) results.append(h('button', { class: 'btn', type: 'button', style: 'width:100%', onclick: () => { ST.shown += 60; list(); } }, 'Show more'));
      if (!items.length) results.append(h('p', { class: 'empty' }, 'Nothing matches. Try fewer letters or clear a filter.'));
      active.replaceChildren(...Object.keys(ST.filters).map((f) => {
        const lab = FILTERS[ST.kind].find((x) => x[0] === f);
        return h('button', { class: 'chip on', type: 'button', onclick: () => { delete ST.filters[f]; ST.shown = 40; list(); } }, (lab ? lab[1] : f) + ': ' + ST.filters[f] + '  ×');
      }));
      filterBtn.textContent = Object.keys(ST.filters).length ? 'Filters (' + Object.keys(ST.filters).length + ')' : 'Filters';
    }
    function openFilters() {
      const body = h('div', null);
      const close = () => scrim.remove();
      const scrim = h('div', { class: 'scrim fsheet', role: 'dialog', 'aria-label': 'Filters' }, h('div', { class: 'fcard', style: 'padding:16px' }, body));
      scrim.addEventListener('click', (e) => { if (e.target === scrim) close(); });
      function paint() {
        body.replaceChildren(h('h3', { style: 'color:var(--holo);margin-bottom:10px' }, 'Filter ' + KINDS.find((k) => k[0] === ST.kind)[1].toLowerCase()),
          ...FILTERS[ST.kind].map(([f, label]) => h('button', { class: 'srow pickrow', type: 'button', onclick: () => {
            openValuePicker(ST.kind, f, label, (v) => { if (v == null) delete ST.filters[f]; else ST.filters[f] = v; ST.shown = 40; paint(); list(); });
          } }, h('span', { class: 'nm' }, label), h('span', { class: 'v' }, ST.filters[f] || 'Any'))),
          h('div', { class: 'btns', style: 'margin-top:12px' },
            h('button', { class: 'btn', type: 'button', onclick: () => { ST.filters = {}; paint(); list(); } }, 'Clear all'),
            h('button', { class: 'btn primary', type: 'button', onclick: close }, 'Done')));
      }
      paint(); document.body.append(scrim);
    }
    input.addEventListener('input', debounce(() => { ST.shown = 40; list(); }, 140));
    wrap.append(panel('Search',
      h('p', { class: 'sub', style: 'margin:0 0 8px' }, 'Canon only. ' + ITEMS.length.toLocaleString() + ' entries from Wookieepedia.'),
      input, chips, h('div', { style: 'display:flex;gap:10px;align-items:center;flex-wrap:wrap' }, filterBtn, count), active), results,
      h('p', { class: 'sub credit' }, 'Text from Wookieepedia, licensed CC BY-SA. Names, dates and summaries are condensed from the wiki; each entry links back to its page.'));
    list();
    return wrap;
  }

  function row(e) {
    return h('button', { class: 'crow', type: 'button', onclick: () => open(e.i) },
      h('strong', null, e.n || e.t),
      h('span', { class: 'sub' }, subline(e)),
      e.x ? h('span', { class: 'gtext sum' }, e.x) : null);
  }

  /* ---------- detail ---------- */
  function linkName(text) {
    const id = BYTITLE.get(String(text).toLowerCase());
    if (id == null) return h('span', null, text);
    return h('button', { class: 'lnk', type: 'button', onclick: () => open(id) }, text);
  }
  function linkId(id) {
    const e = BYID[id]; if (!e) return null;
    return h('button', { class: 'lnk', type: 'button', onclick: () => open(id) }, e.n || e.t);
  }
  function moreList(key, ids, make, cap) {
    const shown = ST.more[key] ? ids.length : cap;
    const box = h('div', { class: 'linkcloud' }, ids.slice(0, shown).map(make));
    if (ids.length > shown) box.append(h('button', { class: 'lnk dim', type: 'button', onclick: () => { ST.more[key] = true; DP.render(); } }, '+ ' + (ids.length - shown) + ' more'));
    return box;
  }

  function viewDetail(id) {
    const e = BYID[id];
    const wrap = h('div', { class: 'wrap' });
    if (!e) { ST.detail = null; return viewIndex(); }
    const head = panel(e.n || e.t,
      h('div', { class: 'facts' }, e.k === 'media' ? badge(e.m) : null, h('span', null, (e.k === 'media' ? MLAB[e.m] : KLAB[e.k])), e.k === 'media' && e.s ? h('span', null, e.s) : null,
        e.y ? h('span', null, yrs(e.y)) : null, e.b != null ? h('span', null, 'Born ' + fy(e.b)) : null, e.d != null && e.k === 'char' ? h('span', null, 'Died ' + fy(e.d)) : null,
        e.r ? h('span', null, 'Released ' + e.r) : null),
      e.a && e.a.length ? h('p', { class: 'sub', style: 'margin:6px 0 0' }, 'Also known as: ' + e.a.join(', ')) : null,
      e.x ? h('p', { style: 'margin:10px 0' }, e.x) : null,
      e.er && e.er.length ? h('div', { class: 'chips wrapchips' }, e.er.map((n) => h('span', { class: 'tag' }, ERA()[n]))) : null,
      h('div', { class: 'btns', style: 'margin-top:10px' },
        h('a', { class: 'btn sm', href: wookie(e), target: '_blank', rel: 'noopener noreferrer' }, 'Wookieepedia'),
        e.k === 'media' || e.k === 'event' ? h('a', { class: 'btn sm', href: wikiSearch(e), target: '_blank', rel: 'noopener noreferrer' }, 'Wikipedia') : null,
        e.k === 'media' && (e.m === 'film' || e.m === 'tv') ? h('a', { class: 'btn sm', href: imdbSearch(e), target: '_blank', rel: 'noopener noreferrer' }, 'IMDb') : null));
    wrap.append(head);

    const rows = FACTS.filter(([f]) => e[f] && e[f].length).map(([f, label]) =>
      h('div', { class: 'frow' }, h('div', { class: 'flab' }, label), h('div', { class: 'fval' }, e[f].map((v, i) => h('span', null, i ? ', ' : '', linkName(v))))));
    if (e.k === 'media' && e.by) rows.unshift(h('div', { class: 'frow' }, h('div', { class: 'flab' }, 'Creator'), h('div', { class: 'fval' }, e.by.join(', '))));
    if (rows.length) wrap.append(panel('Facts', h('div', { class: 'facttable' }, rows)));

    if (e.k === 'media' && e.ap) {
      Object.keys(APLAB).filter((g) => e.ap[g]).forEach((g) => wrap.append(panel(APLAB[g] + ' (' + e.ap[g].length + ')', moreList('ap' + g, e.ap[g], linkId, 30))));
    }
    const apps = APPEARS.get(id);
    if (apps && e.k !== 'media') {
      const sorted = sortMedia(apps);
      wrap.append(panel('Appears in (' + sorted.length + ')', h('div', { class: 'list' }, sorted.slice(0, ST.more.apps ? sorted.length : 25).map((m) =>
        h('button', { class: 'crow slim', type: 'button', onclick: () => open(m.i) }, h('strong', null, m.n || m.t), h('span', { class: 'sub' }, subline(m))))),
        sorted.length > 25 && !ST.more.apps ? h('button', { class: 'btn sm', type: 'button', style: 'margin-top:8px', onclick: () => { ST.more.apps = true; DP.render(); } }, 'Show all ' + sorted.length) : null));
    }
    return wrap;
  }

  /* ---------- Timeline ---------- */
  const BADGE = { film: ['M', 'Movie'], tv: ['T', 'TV show'], comic: ['C', 'Comic'], book: ['B', 'Book'], story: ['S', 'Short story'], game: ['G', 'Game'], event: ['E', 'Event'] };
  const TYPE_RANK = { film: 0, tv: 1, event: 2, game: 3, comic: 4, book: 5, story: 6 };
  const ERA_LO = [-1e9, -25000, -500, -100, -19, 0, 5, 34];
  const eraOf = (y) => { let n = 0; ERA_LO.forEach((lo, i) => { if (y >= lo) n = i; }); return n; };
  const SKIP_TITLE = /trilogy|star wars saga|film series|^untitled/i;
  const tkey = (e) => (e.k === 'event' ? 'event' : e.m);
  function badge(t, count) {
    const [ch, label] = BADGE[t] || ['?', ''];
    return h('span', { class: 'bd ' + t, title: label, 'aria-label': label }, ch, count ? h('i', null, '×' + count) : null);
  }
  const extLink = (url, label) => h('a', { class: 'ext', href: url, target: '_blank', rel: 'noopener noreferrer', 'aria-label': label, title: label, onclick: (ev) => ev.stopPropagation() }, '↗');
  const wikiSearch = (e) => 'https://en.wikipedia.org/w/index.php?search=' + encodeURIComponent((e.n || e.t) + ' Star Wars');
  const imdbSearch = (e) => 'https://www.imdb.com/find/?q=' + encodeURIComponent((e.n || e.t) + ' Star Wars');

  function viewTimeline() {
    if (!ready) { if (!loadErr) load(); return loadingView(); }
    const wrap = h('div', { class: 'wrap' });
    const out = h('div', { class: 'tl' });
    const count = h('p', { class: 'sub', style: 'margin:0' });
    const input = h('input', { type: 'search', placeholder: 'Search titles or series', 'aria-label': 'Search the timeline', value: TS.q, autocomplete: 'off' });
    const rerender = () => { TS.focus = null; DP.render(); };
    const typeChips = h('div', { class: 'chips wrapchips' }, ['film', 'tv', 'comic', 'book', 'story', 'game', 'event'].map((t) =>
      h('button', { class: 'chip', type: 'button', 'aria-pressed': String(!!TS.types[t]), onclick: () => { TS.types[t] = !TS.types[t]; rerender(); } }, badge(t), ' ' + BADGE[t][1] + (t === 'tv' ? 's' : 's'))));
    const modeChips = h('div', { class: 'chips' }, [['overview', 'Overview'], ['all', 'Every episode & issue']].map(([m, l]) =>
      h('button', { class: 'chip', type: 'button', 'aria-pressed': String(TS.mode === m), onclick: () => { TS.mode = m; rerender(); } }, l)));
    const eraSel = DP.selectEl([{ v: -1, t: 'All eras' }].concat(ERA().map((n, i) => ({ v: i, t: n }))), TS.era, (v) => { TS.era = +v; TS.focus = null; build(); }, { 'aria-label': 'Era' });
    const orderBtn = h('button', { class: 'btn sm', type: 'button', onclick: () => { TS.order = TS.order === 'universe' ? 'release' : 'universe'; rerender(); } },
      TS.order === 'universe' ? 'Order: story time' : 'Order: release date');
    const charBtn = h('button', { class: 'btn sm', type: 'button', onclick: () => pickEntity(['char', 'droid'], (e) => { TS.char = e.i; rerender(); }, 'Search characters') },
      TS.char != null ? 'Character: ' + (BYID[TS.char].n || BYID[TS.char].t) + '  ×' : 'Pick a character');
    if (TS.char != null) charBtn.onclick = () => { TS.char = null; rerender(); };

    const uni = () => TS.order === 'universe';
    const keyYear = (m) => (uni() ? m.y[0] : +m.r.slice(0, 4));
    const cmp = (a, b) => uni()
      ? a.y[0] - b.y[0] || (TYPE_RANK[tkey(a)] - TYPE_RANK[tkey(b)]) || (a.r || '').localeCompare(b.r || '') || a.t.localeCompare(b.t)
      : a.r.localeCompare(b.r) || (TYPE_RANK[tkey(a)] - TYPE_RANK[tkey(b)]) || a.t.localeCompare(b.t);

    function itemRow(m, nested) {
      const sub = [m.k === 'event' ? '' : (m.s && TS.mode === 'all' ? m.s : ''), uni() ? fy(m.y[0]) : (m.r || '').slice(0, 4)].filter(Boolean).join(' · ');
      const row = h('div', { class: 'trow' + (nested ? ' nested' : '') + (m.t === 'Star Wars: Episode I The Phantom Menace' ? ' tlstart' : '') },
        h('button', { class: 'crow slim', type: 'button', onclick: () => { TS.focus = m.i; open(m.i, 'timeline'); } },
          badge(tkey(m)), h('span', { class: 'tt' }, h('strong', null, m.n || m.t), sub ? h('span', { class: 'sub' }, sub) : null)),
        extLink(wookie(m), 'Open ' + (m.n || m.t) + ' on Wookieepedia'));
      return row;
    }

    function groups(dated) {
      // overview: collapse series into one row; clusters split where a series jumps more than 3 years
      const by = new Map(); const solo = [];
      dated.forEach((m) => {
        if (m.k === 'event' || m.m === 'film' || !m.s) { solo.push({ items: [m], start: m }); return; }
        const k = m.m + '|' + m.s; if (!by.has(k)) by.set(k, []); by.get(k).push(m);
      });
      const gs = solo;
      by.forEach((arr, k) => {
        arr.sort(cmp);
        let cur = [];
        arr.forEach((m) => {
          const prev = cur[cur.length - 1];
          if (prev && Math.abs(m.y[0] - prev.y[0]) > 3 && uni()) { gs.push({ items: cur, start: cur[0], series: arr[0].s }); cur = []; }
          cur.push(m);
        });
        if (cur.length) gs.push({ items: cur, start: cur[0], series: arr[0].s });
      });
      gs.forEach((g) => { if (g.items.length === 1) g.series = null; });
      gs.sort((a, b) => cmp(a.start, b.start));
      return gs;
    }

    function groupRow(g) {
      const first = g.items[0], t = tkey(first);
      const yr = uni() ? yrs([Math.min(...g.items.map((i) => i.y[0])), Math.max(...g.items.map((i) => i.y[0]))]) : '';
      const n = g.items.length;
      const kids = h('div', { class: 'tkids', hidden: true });
      const key = t + '|' + g.series + '|' + first.i;
      const btn = h('button', { class: 'crow slim', type: 'button', 'aria-expanded': 'false' },
        badge(t, n), h('span', { class: 'tt' }, h('strong', null, g.series), h('span', { class: 'sub' }, [n + (t === 'tv' ? ' episodes' : t === 'comic' ? ' issues' : ' entries'), yr].filter(Boolean).join(' · '))), h('span', { class: 'caret' }, '▾'));
      const toggle = () => {
        const open_ = kids.hidden;
        if (open_ && !kids.childNodes.length) g.items.forEach((m) => kids.append(itemRow(m, true)));
        kids.hidden = !open_; btn.setAttribute('aria-expanded', String(open_)); btn.classList.toggle('open', open_);
        if (open_) TS.open.add(key); else TS.open.delete(key);
      };
      btn.onclick = toggle;
      const row = h('div', { class: 'tgroup' }, h('div', { class: 'trow' }, btn, extLink(wookie({ t: g.series }), 'Open ' + g.series + ' on Wookieepedia')), kids);
      if (TS.open.has(key)) toggle();
      return row;
    }

    function build() {
      TS.q = input.value;
      const q = input.value.trim().toLowerCase(), toks = q.split(/\s+/).filter(Boolean);
      let items = [];
      (BYKIND.media || []).forEach((m) => { if (TS.types[m.m] && !SKIP_TITLE.test(m.t)) items.push(m); });
      if (TS.types.event && TS.char == null) (BYKIND.event || []).forEach((m) => items.push(m));
      if (TS.char != null) { const ok = new Set(APPEARS.get(TS.char) || []); items = items.filter((m) => ok.has(m.i)); }
      if (toks.length) items = items.filter((m) => toks.every((t) => (m._key + ' ' + (m.s || '').toLowerCase()).indexOf(t) >= 0));
      if (TS.era >= 0) items = items.filter((m) => m.er && m.er.indexOf(TS.era) >= 0);
      let dated, undated;
      if (uni()) { dated = items.filter((m) => m.y); }
      else { dated = items.filter((m) => m.r && m.k === 'media'); }
      undated = items.length - dated.length;
      dated.sort(cmp);
      const list = TS.mode === 'overview' ? groups(dated) : dated.map((m) => ({ items: [m], start: m }));
      count.textContent = (TS.mode === 'overview' ? list.length.toLocaleString() + ' entries (' + dated.length.toLocaleString() + ' episodes, issues and more)' : dated.length.toLocaleString() + ' entries') +
        (undated ? ', ' + undated.toLocaleString() + ' without a ' + (uni() ? 'story date' : 'release date') : '');
      out.replaceChildren();
      let lastHead = '', lastEra = -1, anchor = null, focusEl = null;
      list.forEach((g) => {
        const m = g.start, key = keyYear(m);
        if (uni()) { const en = eraOf(m.y[0]); if (en !== lastEra) { out.append(h('div', { class: 'tlera' }, ERA()[en])); lastEra = en; } }
        const head = uni() ? fy(m.y[0]) : m.r.slice(0, 4);
        if (head !== lastHead) { out.append(h('div', { class: 'tlhead' }, head)); lastHead = head; }
        const el = g.series ? groupRow(g) : itemRow(m);
        if (!anchor && m.t === 'Star Wars: Episode I The Phantom Menace' && uni()) anchor = out.lastChild.previousSibling && out.lastChild.previousSibling.classList.contains('tlhead') ? out.lastChild.previousSibling : null;
        out.append(el);
        if (!anchor && !uni() && key >= 1999) anchor = out.querySelector('.tlhead:last-of-type');
        if (TS.focus != null && g.items.some((i) => i.i === TS.focus)) focusEl = el;
      });
      if (!anchor && uni()) { const hs = out.querySelectorAll('.tlhead'); hs.forEach((hd) => { if (!anchor && /BBY|ABY/.test(hd.textContent)) { const y = parseInt(hd.textContent, 10) * (/BBY/.test(hd.textContent) ? -1 : 1); if (y >= -32) anchor = hd; } }); }
      const target = focusEl || anchor;
      if (target) setTimeout(() => { try { target.scrollIntoView({ block: 'start' }); } catch (e) {} }, 30);
      if (list.length) out.append(h('div', { class: 'tlfab' },
        h('button', { class: 'btn sm', type: 'button', onclick: () => wrap.scrollIntoView({ block: 'start' }) }, '↑ Filters'),
        anchor ? h('button', { class: 'btn sm', type: 'button', onclick: () => anchor.scrollIntoView({ block: 'start' }) }, '★ Episode I') : null));
      if (!list.length) out.append(h('p', { class: 'empty' }, 'Nothing matches those filters.'));
    }
    input.addEventListener('input', debounce(() => { TS.focus = null; build(); }, 140));
    const legend = h('div', { class: 'tllegend' }, ['film', 'tv', 'comic', 'book', 'story', 'game', 'event'].map((t) => h('span', null, badge(t), BADGE[t][1])));
    wrap.append(panel('Timeline',
      h('p', { class: 'sub', style: 'margin:0 0 8px' }, 'Canon only, in story order (BBY and ABY are before and after the Battle of Yavin) or by release date. It opens at The Phantom Menace; scroll up for earlier or down for later.'),
      modeChips, input, typeChips, h('div', { class: 'tlctl' }, eraSel, orderBtn, charBtn), count, legend), out);
    build();
    return wrap;
  }

  window.CANON = { viewIndex, viewTimeline, title, hasDetail, back, open };
})();
