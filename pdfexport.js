/* Character PDF export. Builds a printable character booklet with jsPDF.
   Layout: cover, contents, overview, then species, languages, equipment, feats, class,
   powers, background and story. Sections with nothing in them are left out. */
(function () {
  const PW = 612, PH = 792, M = 54, CW = PW - 2 * M, FOOT = 40;

  const clean = (s) => String(s == null ? '' : s)
    .replace(/[‘’‛]/g, "'").replace(/[“”]/g, '"').replace(/−/g, '-').replace(/[●•]/g, '-')
    .replace(/→/g, '->').replace(/[–—]/g, ' - ').replace(/…/g, '...')
    .replace(/[^\x09\x0A\x20-\x7E\xA0-\xFF]/g, '');
  const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : '');
  const fmt = (n) => (n >= 0 ? '+' : '') + n;
  const hex2rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

  /* rules text (markdown-ish) -> flat blocks */
  function blocks(src) {
    const strip = (s) => clean(s).replace(/\*\*\*(.+?)\*\*\*/g, '$1').replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/(^|[\s(])_(.+?)_(?=[\s).,;:]|$)/g, '$1$2').replace(/(^|[\s(])\*(?!\s)(.+?)\*(?=[\s).,;:]|$)/g, '$1$2');
    const lines = String(src || '').replace(/\r/g, '').split('\n');
    const out = [];
    let i = 0;
    while (i < lines.length) {
      const ln = lines[i];
      if (!ln.trim()) { i++; continue; }
      let m;
      if ((m = /^(#{1,6})\s+(.*)$/.exec(ln))) { out.push({ t: 'h', s: strip(m[2]) }); i++; }
      else if (/^_{3,}$|^-{3,}$/.test(ln.trim())) i++;
      else if (/^\s*[-*]\s+/.test(ln)) {
        while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) { out.push({ t: 'li', s: strip(lines[i].replace(/^\s*[-*]\s+/, '')) }); i++; }
      } else if (/^\s*\|/.test(ln)) {
        const rows = [];
        while (i < lines.length && /^\s*\|/.test(lines[i])) { rows.push(lines[i]); i++; }
        rows.filter((r) => !/^\s*\|[\s:|-]+\|?\s*$/.test(r)).forEach((r, k) => out.push({ t: 'row', b: k === 0, s: strip(r.trim().replace(/^\||\|$/g, '').split('|').map((x) => x.trim()).join('   |   ')) }));
      } else {
        const buf = [];
        while (i < lines.length && lines[i].trim() && !/^(#{1,6}\s|\s*[-*]\s|\s*\||_{3,}$|-{3,}$)/.test(lines[i].trim())) { buf.push(lines[i]); i++; }
        if (!buf.length) { buf.push(ln); i++; }
        out.push({ t: 'p', s: strip(buf.join(' ')) });
      }
    }
    return out;
  }

  function loadImage(src) {
    return new Promise((res) => {
      if (!src) return res(null);
      const im = new Image();
      im.crossOrigin = 'anonymous';
      im.onload = () => {
        try {
          const cv = document.createElement('canvas');
          cv.width = im.naturalWidth; cv.height = im.naturalHeight;
          const g = cv.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, cv.width, cv.height); g.drawImage(im, 0, 0);
          res({ data: cv.toDataURL('image/jpeg', 0.9), w: cv.width, h: cv.height });
        } catch (e) { res(null); }
      };
      im.onerror = () => res(null);
      im.src = src;
    });
  }

  async function make(ctx) {
    const { c, d, D, L, R } = ctx;
    const { jsPDF } = window.jspdf;
    const accent = hex2rgb(ctx.accent || '#0b7a96');
    const warm = hex2rgb('#9a3b12');
    const ink = [28, 32, 38], soft = [96, 104, 112], rule = [190, 198, 205];
    const cover = await loadImage(ctx.cover);
    const name = clean(c.name || 'Unnamed character');

    function build(tocPages) {
      const doc = new jsPDF({ unit: 'pt', format: 'letter' });
      let aur = false;
      if (ctx.aur && window.AUR_TTF) {
        try { doc.addFileToVFS('Aurebesh.ttf', window.AUR_TTF); doc.addFont('Aurebesh.ttf', 'Aurebesh', 'normal'); aur = true; } catch (e) { aur = false; }
      }
      const toc = [];
      let y = M;
      const color = (rgb) => doc.setTextColor(rgb[0], rgb[1], rgb[2]);
      const newPage = () => { doc.addPage(); y = M; };
      const ensure = (h) => { if (y + h > PH - FOOT) newPage(); };
      const aurLine = (txt, size, x, align) => {
        if (!aur) return false;
        doc.setFont('Aurebesh', 'normal'); doc.setFontSize(size); color(accent);
        doc.text(clean(txt).toLowerCase(), x, y, { align: align || 'left', maxWidth: CW }); doc.setFont('helvetica', 'normal');
        return true;
      };

      let forceBreak = true;
      function h1(t) {
        /* sections flow one after another; start a new page only when there is little room left */
        if (forceBreak || y > PH - FOOT - 190) { newPage(); y += 6; } else y += 26;
        forceBreak = false;
        doc.setFont('helvetica', 'bold'); doc.setFontSize(19); color(accent); doc.text(clean(t), M, y);
        toc.push({ lvl: 1, text: clean(t), page: doc.getNumberOfPages() });
        y += 5; doc.setDrawColor(accent[0], accent[1], accent[2]); doc.setLineWidth(1.2); doc.line(M, y, M + CW, y);
        y += 11;
        if (aurLine(t, 9, M)) y += 8;
        y += 6; doc.setFont('helvetica', 'normal');
      }
      function h2(t, inToc) {
        ensure(56);
        y += 12; doc.setFont('helvetica', 'bold'); doc.setFontSize(13); color(ink);
        const lines = doc.splitTextToSize(clean(t), CW);
        doc.text(lines, M, y);
        if (inToc !== false) toc.push({ lvl: 2, text: clean(t), page: doc.getNumberOfPages() });
        y += lines.length * 15 - 2; doc.setDrawColor(rule[0], rule[1], rule[2]); doc.setLineWidth(0.6); doc.line(M, y, M + CW, y);
        y += 4; doc.setFont('helvetica', 'normal');
      }
      function h3(t) {
        ensure(38);
        y += 15; doc.setFont('helvetica', 'bold'); doc.setFontSize(11); color(accent);
        const lines = doc.splitTextToSize(clean(t), CW); doc.text(lines, M, y);
        y += lines.length * 13 + 2; doc.setFont('helvetica', 'normal');
      }
      function para(t, o) {
        o = o || {};
        const size = o.size || 9.5, lh = size * 1.32, x = M + (o.indent || 0);
        doc.setFont('helvetica', o.bold ? 'bold' : o.italic ? 'italic' : 'normal'); doc.setFontSize(size); color(o.color || ink);
        const lines = doc.splitTextToSize(clean(t), CW - (o.indent || 0) - (o.hang || 0));
        lines.forEach((ln, i) => {
          ensure(lh);
          if (i === 0) y += size; else y += lh;
          doc.text(ln, x + (o.hang || 0), y);
        });
        y += (o.after == null ? 5 : o.after) + (lines.length ? 0 : 0);
        doc.setFont('helvetica', 'normal');
      }
      function bullet(t, lvl, o) {
        o = o || {};
        const size = o.size || 9.5, lh = size * 1.32, ind = 12 + (lvl || 0) * 16;
        doc.setFont('helvetica', 'normal'); doc.setFontSize(size); color(o.color || ink);
        const lines = doc.splitTextToSize(clean(t), CW - ind - 4);
        lines.forEach((ln, i) => {
          ensure(lh);
          y += i === 0 ? size : lh;
          if (i === 0) { doc.setFillColor(accent[0], accent[1], accent[2]); doc.circle(M + ind - 8, y - size * 0.32, lvl ? 1.2 : 1.8, 'F'); }
          doc.text(ln, M + ind, y);
        });
        y += 3;
      }
      function rich(src, o) {
        blocks(src).forEach((b) => {
          if (b.t === 'h') h3(b.s);
          else if (b.t === 'li') bullet(b.s, 0, o);
          else if (b.t === 'row') para(b.s, { size: 9, bold: b.b, after: 1, indent: 4 });
          else para(b.s, o);
        });
      }
      function noteFor(key, label) {
        const t = c.notes && c.notes[key];
        if (t && String(t).trim()) { h3(label || 'Notes'); String(t).split(/\n+/).forEach((p) => p.trim() && para(p, { after: 4 })); }
      }
      function facts(arr) {
        const a = arr.filter(Boolean); if (!a.length) return;
        para(a.join('    '), { color: soft, size: 9.5, after: 8 });
      }

      /* ---- cover ---- */
      y = 96;
      doc.setFont('helvetica', 'bold'); doc.setFontSize(32); color(accent);
      const nl = doc.splitTextToSize(name.toUpperCase(), CW);
      nl.forEach((ln) => { doc.text(ln, PW / 2, y, { align: 'center' }); y += 38; });
      y -= 22;
      if (aur) { y += 14; aurLine(name, 11, PW / 2, 'center'); y += 4; }
      y += 16;
      if (cover) {
        const maxW = 340, maxH = 360, k = Math.min(maxW / cover.w, maxH / cover.h);
        const w = cover.w * k, hh = cover.h * k;
        doc.addImage(cover.data, 'JPEG', (PW - w) / 2, y, w, hh);
        doc.setDrawColor(accent[0], accent[1], accent[2]); doc.setLineWidth(1); doc.rect((PW - w) / 2, y, w, hh);
        y += hh + 28;
      } else y += 20;
      const sub = [d.species && d.species.name, d.cls ? d.cls.name + (d.arch ? ' (' + d.arch.name + ')' : '') : ''].filter(Boolean).join('  -  ');
      doc.setFont('helvetica', 'bold'); doc.setFontSize(14); color(warm);
      doc.text(clean(sub || 'Character').toUpperCase(), PW / 2, y, { align: 'center', maxWidth: CW }); y += 20;
      doc.setFont('helvetica', 'normal'); doc.setFontSize(11); color(soft);
      doc.text('Level ' + d.lvl + (d.bg ? '   |   ' + clean(d.bg.name) + ' background' : ''), PW / 2, y, { align: 'center' }); y += 18;
      if (c.concept) { doc.setFont('helvetica', 'italic'); doc.setFontSize(11); color(ink); const cl = doc.splitTextToSize(clean(c.concept), CW - 80); doc.text(cl, PW / 2, y, { align: 'center' }); }

      /* ---- contents placeholder pages ---- */
      for (let i = 0; i < tocPages; i++) newPage();

      /* ---- overview ---- */
      h1('Overview');
      const box = (x, w, top, hgt, big, small) => {
        doc.setDrawColor(accent[0], accent[1], accent[2]); doc.setLineWidth(0.8); doc.rect(x, top, w, hgt);
        doc.setFont('helvetica', 'bold'); doc.setFontSize(15); color(ink); doc.text(clean(String(big)), x + w / 2, top + hgt / 2 + 1, { align: 'center' });
        doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); color(soft); doc.text(clean(small).toUpperCase(), x + w / 2, top + hgt - 5, { align: 'center' });
      };
      const vit = [[d.ac, 'AC'], [d.hp == null ? '-' : d.hp, 'HP'], [fmt(d.prof), 'Prof'], [fmt(d.initiative), 'Init'], [d.passivePerception, 'Pass. Perc.'], [d.hitDie ? d.lvl + 'd' + d.hitDie : '-', 'Hit dice']];
      const bw = (CW - 5 * 8) / 6;
      vit.forEach((v, i) => box(M + i * (bw + 8), bw, y, 44, v[0], v[1]));
      y += 44 + 12;
      const ab = R.ABIL;
      ab.forEach((a, i) => {
        const x = M + i * (bw + 8);
        doc.setDrawColor(rule[0], rule[1], rule[2]); doc.setLineWidth(0.8); doc.rect(x, y, bw, 62);
        doc.setFont('helvetica', 'bold'); doc.setFontSize(8); color(accent); doc.text(clean(a.a).toUpperCase(), x + bw / 2, y + 11, { align: 'center' });
        doc.setFontSize(17); color(ink); doc.text(fmt(d.mods[a.k]), x + bw / 2, y + 33, { align: 'center' });
        doc.setFont('helvetica', 'normal'); doc.setFontSize(9); color(soft); doc.text(String(d.scores[a.k]), x + bw / 2, y + 45, { align: 'center' });
        doc.setFontSize(7.5); color(d.saveProf[a.k] ? accent : soft); doc.text('Save ' + fmt(d.saves[a.k]) + (d.saveProf[a.k] ? ' *' : ''), x + bw / 2, y + 56, { align: 'center' });
      });
      y += 62 + 6;
      para('* proficient saving throw.  AC: ' + clean(d.acLabel) + '.  Hit points use the class average per level.', { size: 8, color: soft, after: 10 });
      if (d.casting) {
        h3(d.casting.type === 'force' ? 'Forcecasting' : 'Techcasting');
        d.casting.rows.forEach((r) => bullet(r.label + ':  save DC ' + r.dc + ',  attack ' + fmt(r.atk)));
      }
      h3('Skills');
      const half = Math.ceil(d.skills.length / 2), top0 = y + 4;
      [d.skills.slice(0, half), d.skills.slice(half)].forEach((col, ci) => {
        let yy = top0; const x = M + ci * (CW / 2 + 6), w = CW / 2 - 6;
        col.forEach((s) => {
          doc.setFont('helvetica', s.proficient ? 'bold' : 'normal'); doc.setFontSize(9.5); color(s.proficient ? ink : soft);
          doc.text((s.expert ? '** ' : s.proficient ? '* ' : '   ') + clean(s.name) + ' (' + s.ab.toUpperCase() + ')', x, yy + 9);
          doc.text(fmt(s.bonus), x + w, yy + 9, { align: 'right' });
          doc.setDrawColor(230, 234, 238); doc.setLineWidth(0.4); doc.line(x, yy + 13, x + w, yy + 13);
          yy += 16;
        });
        if (ci === 0) y = Math.max(y, yy);
      });
      y = top0 + half * 16 + 6;
      para('* proficient   ** expertise', { size: 8, color: soft });
      noteFor('abilities', 'Notes on abilities'); noteFor('skills', 'Notes on skills');

      /* ---- species ---- */
      if (d.species) {
        const sp = d.species;
        h1('Species: ' + sp.name);
        facts([sp.size && 'Size: ' + cap(sp.size), sp.homeworld && 'Homeworld: ' + sp.homeworld, sp.nativeLanguage && 'Language: ' + sp.nativeLanguage]);
        (sp.traits || []).forEach((t) => { h2(t.name); rich(t.description); });
        noteFor('species');
      }

      /* ---- languages and proficiencies ---- */
      if (c.langs || c.tools || (d.species && d.species.nativeLanguage) || (d.cls && d.cls.proficiencies)) {
        h1('Languages and Proficiencies');
        const langs = [d.species && d.species.nativeLanguage, c.langs].filter(Boolean).join(', ');
        if (langs) { h2('Languages'); para(langs); }
        if (c.tools) { h2('Tools'); para(c.tools); }
        const p = d.cls && d.cls.proficiencies;
        if (p) {
          const rows = [['Armor', p.armor], ['Weapons', p.weapons], ['Tools', p.tools]].filter((r) => r[1] && (!Array.isArray(r[1]) || r[1].length));
          if (rows.length) { h2('From your class', false); rows.forEach((r) => bullet(r[0] + ': ' + (Array.isArray(r[1]) ? r[1].join(', ') : r[1]))); }
        }
      }

      /* ---- equipment ---- */
      if (c.gear.length || c.credits) {
        h1('Equipment');
        c.gear.forEach((g) => {
          const it = D.equipment.find((e) => e.key === g.key); if (!it) return;
          const atk = R.attackFor(it, d);
          const extra = atk ? '   (' + fmt(atk.hitProf) + ' to hit, ' + atk.dmg + ' ' + atk.type + ')' : it.armorClass ? '   (AC ' + it.armorClass + ')' : '';
          bullet(it.name + (g.qty > 1 ? ' x' + g.qty : '') + (g.eq ? ' [equipped]' : '') + extra);
        });
        para('Credits: ' + (c.credits || 0) + (d.weight ? '     Carried weight: ' + Math.round(d.weight * 10) / 10 + ' lb' : ''), { color: soft, size: 9.5 });
        noteFor('gear');
      }

      /* ---- feats ---- */
      const feats = c.feats.map((f) => D.feats.find((x) => x.key === f.key)).filter(Boolean);
      if (feats.length) {
        h1('Feats');
        feats.forEach((f) => { h2(f.name); rich(f.description); });
        noteFor('feats');
      }

      /* ---- class ---- */
      if (d.cls) {
        h1('Class: ' + d.cls.name + (d.arch ? ' - ' + d.arch.name : ''));
        const saves = (d.cls.proficiencies && d.cls.proficiencies.savingThrows || []).map((s) => cap(String(s)));
        facts(['Level ' + d.lvl, d.hitDie && 'Hit die: d' + d.hitDie, saves.length && 'Saving throws: ' + saves.join(', ')]);
        const bySrc = {};
        d.features.forEach((f) => { (bySrc[f.src] = bySrc[f.src] || []).push(f); });
        Object.keys(bySrc).forEach((src, i) => {
          if (i > 0) { h2(src, true); }
          bySrc[src].forEach((f) => { (i > 0 ? h3 : h2)(f.n + '  (level ' + f.l + ')'); rich(f.d); });
        });
        noteFor('class');
      }

      /* ---- powers ---- */
      const powers = c.powers.map((p) => D.powers.find((x) => x.key === p.key)).filter(Boolean).sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
      if (powers.length) {
        h1('Powers');
        powers.forEach((p) => {
          h3(p.name + '  -  ' + (p.level ? 'level ' + p.level : 'at-will') + ' ' + p.powerType);
          para([p.castingTime && p.castingTime.text, p.range, p.duration].filter(Boolean).join('  |  '), { size: 8.5, color: soft, after: 3 });
          rich(p.description);
        });
        noteFor('powers');
      }

      /* ---- background and story ---- */
      const story = [];
      L.story.forEach((sec) => sec.q.forEach((q) => { const a = c.story[q.id]; if (a && (a.c || a.t)) story.push([q.t, [a.c, a.t].filter(Boolean).join(' - ')]); }));
      const bt = c.bgText || {};
      if (d.bg || bt.trait || bt.ideal || bt.bond || bt.flaw) {
        h1('Background' + (d.bg ? ': ' + d.bg.name : ''));
        if (d.bg && d.bg.feature) { h2(d.bg.feature.name); rich(d.bg.feature.description); }
        [['Personality trait', 'trait'], ['Ideal', 'ideal'], ['Bond', 'bond'], ['Flaw', 'flaw']].forEach(([l, k]) => { if (bt[k]) { h3(l); para(bt[k]); } });
        noteFor('background');
      }
      const general = c.notes && String(c.notes.general || '').trim();
      if (story.length || general || (c.notes && String(c.notes.story || '').trim())) {
        h1('Backstory');
        story.forEach(([q, a]) => { h3(q); para(a); });
        noteFor('story', 'Your story notes');
        if (general) { h2('Notes', true); general.split(/\n+/).forEach((p) => p.trim() && para(p, { after: 5 })); }
      }
      return { doc, toc, aur };
    }

    /* pass 1 finds how many contents pages are needed; pass 2 lays out with the real page numbers */
    const first = build(1);
    const perPage = Math.floor((PH - FOOT - M - 40) / 17);
    const tocPages = Math.max(1, Math.ceil((first.toc.length + 1) / perPage));
    const { doc, toc, aur } = build(tocPages);

    doc.setPage(2);
    let y = M + 6;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(19); doc.setTextColor(accent[0], accent[1], accent[2]); doc.text('Contents', M, y);
    y += 5; doc.setDrawColor(accent[0], accent[1], accent[2]); doc.setLineWidth(1.2); doc.line(M, y, M + CW, y); y += 22;
    let pg = 2;
    toc.forEach((e) => {
      if (y > PH - FOOT - 8) { pg++; doc.setPage(pg); y = M + 6; }
      const ind = e.lvl === 2 ? 14 : 0;
      doc.setFont('helvetica', e.lvl === 1 ? 'bold' : 'normal'); doc.setFontSize(e.lvl === 1 ? 10.5 : 9.5); doc.setTextColor(ink[0], ink[1], ink[2]);
      if (e.lvl === 1) y += 4;
      const label = doc.splitTextToSize(e.text, CW - ind - 40)[0];
      doc.text(label, M + ind, y);
      const tw = doc.getTextWidth(label), pn = String(e.page), pw = doc.getTextWidth(pn);
      doc.setDrawColor(rule[0], rule[1], rule[2]); doc.setLineWidth(0.6); doc.setLineDashPattern([0.5, 2.5], 0);
      doc.line(M + ind + tw + 4, y, M + CW - pw - 4, y); doc.setLineDashPattern([], 0);
      doc.text(pn, M + CW, y, { align: 'right' });
      y += 15;
    });

    /* footers */
    const n = doc.getNumberOfPages();
    for (let i = 2; i <= n; i++) {
      doc.setPage(i); doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(soft[0], soft[1], soft[2]);
      doc.text(name + '   |   page ' + i, PW / 2, PH - 26, { align: 'center' });
    }
    doc.setProperties({ title: name, subject: 'SW5e character', creator: 'SW5e Datapad' });
    return doc.output('blob');
  }

  window.PDFX = { make };
})();
