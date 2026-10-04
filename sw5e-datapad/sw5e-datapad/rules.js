/* Read-only rules layer.
 *
 * Everything here applies SW5e's published rules to a character's choices.
 * Nothing edits rules data. Skill/ability pairs come from the Using Ability
 * Scores chapter, point buy from the Step-by-Step chapter, and casting DCs
 * from the Force and Tech Casting chapter of the Player's Handbook.
 */
(function (root) {
  'use strict';

  const ABIL = [
    { k: 'str', n: 'Strength', a: 'STR' },
    { k: 'dex', n: 'Dexterity', a: 'DEX' },
    { k: 'con', n: 'Constitution', a: 'CON' },
    { k: 'int', n: 'Intelligence', a: 'INT' },
    { k: 'wis', n: 'Wisdom', a: 'WIS' },
    { k: 'cha', n: 'Charisma', a: 'CHA' }
  ];
  const FULL = { strength: 'str', dexterity: 'dex', constitution: 'con', intelligence: 'int', wisdom: 'wis', charisma: 'cha' };

  const SKILLS = [
    ['Acrobatics', 'dex'], ['Animal Handling', 'wis'], ['Athletics', 'str'], ['Deception', 'cha'],
    ['Insight', 'wis'], ['Intimidation', 'cha'], ['Investigation', 'int'], ['Lore', 'int'],
    ['Medicine', 'wis'], ['Nature', 'int'], ['Perception', 'wis'], ['Performance', 'cha'],
    ['Persuasion', 'cha'], ['Piloting', 'int'], ['Sleight of Hand', 'dex'], ['Stealth', 'dex'],
    ['Survival', 'wis'], ['Technology', 'int']
  ];

  const STD_ARRAY = [15, 14, 13, 12, 10, 8];
  const POINT_COST = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };
  const POINT_BUDGET = 27;

  const mod = (s) => Math.floor((s - 10) / 2);
  const fmt = (n) => (n >= 0 ? '+' : '−') + Math.abs(n);

  function parseSkills(text) {
    text = text || '';
    const from = SKILLS.map((s) => s[0]).filter((n) => new RegExp('\\b' + n + '\\b', 'i').test(text));
    const m = /choose\s+(one|two|three|four|\d)/i.exec(text);
    const words = { one: 1, two: 2, three: 3, four: 4 };
    const choose = m ? words[m[1].toLowerCase()] || parseInt(m[1], 10) : 0;
    return { choose, from };
  }

  function newCharacter() {
    const id = 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    return {
      id, v: 1, created: Date.now(), updated: Date.now(),
      name: '', concept: '', level: 1,
      speciesKey: '', asiOpt: 0, asiPicks: {},
      classKey: '', archetypeKey: '', backgroundKey: '',
      method: 'standard',
      base: { str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 },
      misc: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 },
      classSkills: [], bgSkills: [], skillX: {},
      tools: '', langs: '',
      gear: [], credits: 0, acOverride: '',
      powers: [], feats: [],
      bgText: { trait: '', ideal: '', bond: '', flaw: '' },
      story: {}, notes: {}
    };
  }

  function speciesBonuses(sp, c) {
    const out = { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 };
    if (!sp || !sp.abilityScoreIncreaseOptions) return out;
    const opts = sp.abilityScoreIncreaseOptions;
    const oi = Math.min(c.asiOpt || 0, opts.length - 1);
    const opt = opts[oi];
    (opt ? opt.increases : []).forEach((inc, i) => {
      const pick = c.asiPicks ? c.asiPicks[oi + ':' + i] : null;
      let keys = [];
      if (inc.anyAbilityCount) keys = Array.isArray(pick) ? pick.filter((x, j) => x && pick.indexOf(x) === j).slice(0, inc.anyAbilityCount) : [];
      else if (inc.abilities && inc.abilities.length === 1) keys = [FULL[inc.abilities[0]]];
      else if (inc.abilities) keys = [pick || FULL[inc.abilities[0]]];
      keys.forEach((k) => { if (k && out[k] !== undefined) out[k] += inc.amount; });
    });
    return out;
  }

  function weaponAbility(it, mods) {
    const props = (it.properties || []).join(' ').toLowerCase();
    const cls = (it.weaponClassification || '').toLowerCase();
    const ranged = /range/.test(props) || /blaster/.test(cls);
    if (/finesse/.test(props)) return mods.dex >= mods.str ? 'dex' : 'str';
    return ranged ? 'dex' : 'str';
  }

  function derive(D, c) {
    const by = (arr, k) => (k ? arr.find((x) => x.key === k) : null);
    const species = by(D.species, c.speciesKey);
    const cls = by(D.classes, c.classKey);
    const arch = by(D.archetypes, c.archetypeKey);
    const bg = by(D.backgrounds, c.backgroundKey);
    const lvl = Math.max(1, Math.min(20, c.level || 1));

    const spb = speciesBonuses(species, c);
    const scores = {}, mods = {};
    ABIL.forEach(({ k }) => {
      scores[k] = (c.base[k] || 10) + spb[k] + (c.misc[k] || 0);
      mods[k] = mod(scores[k]);
    });

    const row = cls ? (cls.progression || []).find((r) => r.level === lvl) : null;
    const prof = row ? row.proficiencyBonus : 2 + Math.floor((lvl - 1) / 4);
    const archRow = arch && arch.progression ? arch.progression.find((r) => r.level === lvl) : null;

    const saveProf = {};
    ABIL.forEach(({ k }) => { saveProf[k] = false; });
    if (cls) cls.proficiencies.savingThrows.forEach((s) => { saveProf[FULL[s]] = true; });
    const saves = {};
    ABIL.forEach(({ k }) => { saves[k] = mods[k] + (saveProf[k] ? prof : 0); });

    const bgSk = bg ? parseSkills(bg.skillProficiencies) : { choose: 0, from: [] };
    const locked = {};
    if (bg && bgSk.choose === 0) bgSk.from.forEach((n) => { locked[n] = 'background'; });
    (c.bgSkills || []).forEach((n) => { locked[n] = locked[n] || 'background'; });
    (c.classSkills || []).forEach((n) => { locked[n] = locked[n] ? locked[n] + ' + class' : 'class'; });

    const skills = SKILLS.map(([name, ab]) => {
      const x = (c.skillX && c.skillX[name]) || 0;
      const proficient = !!locked[name] || x >= 1;
      const expert = x >= 2;
      const bonus = mods[ab] + (expert ? prof * 2 : proficient ? prof : 0);
      return { name, ab, bonus, proficient, expert, src: locked[name] || (x >= 1 ? 'chosen' : '') };
    });
    const perception = skills.find((s) => s.name === 'Perception');

    let hp = null, hitDie = null;
    if (cls) {
      const h = cls.hitPoints;
      hitDie = h.dieFaces;
      hp = h.atFirstLevelValue + mods.con + (lvl - 1) * (h.atHigherLevelsAverage + mods.con);
      hp = Math.max(lvl, hp);
    }

    // equipment lookups
    const eqByKey = (k) => D.equipment.find((e) => e.key === k);
    let acBase = 10 + mods.dex, acLabel = 'Unarmored', shield = 0, armorPick = null;
    let weight = 0;
    (c.gear || []).forEach((g) => {
      const it = eqByKey(g.key);
      if (!it) return;
      weight += (it.weight || 0) * (g.qty || 1);
      if (!g.eq || it.category !== 'armor') return;
      if (it.armorClassification === 'shield') {
        const n = parseInt(it.armorClass, 10);
        shield += isNaN(n) ? 0 : n;
        return;
      }
      const mm = /(\d+)/.exec(it.armorClass || '');
      if (!mm) return;
      let v = +mm[1];
      if (/dex/i.test(it.armorClass)) {
        const cap = /max\s*(\d+)/i.exec(it.armorClass);
        let d = mods.dex;
        if (cap) d = Math.min(d, +cap[1]);
        v += d;
      }
      if (!armorPick || v > armorPick.v) armorPick = { v, name: it.name };
    });
    if (armorPick) { acBase = armorPick.v; acLabel = armorPick.name; }
    const acOv = parseInt(c.acOverride, 10);
    const ac = !isNaN(acOv) ? acOv : acBase + shield;

    // casting
    const ct = arch && arch.casterType && arch.casterType !== 'none' ? arch.casterType : cls ? cls.casterType : 'none';
    let casting = null;
    if (ct === 'force') {
      casting = {
        type: 'force',
        rows: [
          { label: 'Light side powers (Wisdom)', ab: 'wis' },
          { label: 'Dark side powers (Charisma)', ab: 'cha' },
          { label: 'Universal powers (Wisdom or Charisma, your choice)', ab: mods.wis >= mods.cha ? 'wis' : 'cha', best: true }
        ].map((r) => ({ label: r.label, dc: 8 + prof + mods[r.ab], atk: prof + mods[r.ab] }))
      };
    } else if (ct === 'tech') {
      casting = { type: 'tech', rows: [{ label: 'Tech powers (Intelligence)', dc: 8 + prof + mods.int, atk: prof + mods.int }] };
    }

    const features = [];
    if (cls) cls.features.forEach((f) => { if ((f.l || 1) <= lvl) features.push({ src: cls.name, l: f.l || 1, n: f.n, d: f.d }); });
    if (arch) arch.features.forEach((f) => { if ((f.l || 1) <= lvl) features.push({ src: arch.name, l: f.l || 1, n: f.n, d: f.d }); });

    return {
      species, cls, arch, bg, lvl, spb, scores, mods, prof, row, archRow, saves, saveProf,
      skills, bgSk, passivePerception: 10 + perception.bonus,
      hp, hitDie, ac, acLabel: !isNaN(acOv) ? 'Set by you' : acLabel + (shield ? ' + shield' : ''),
      initiative: mods.dex, weight, casting, features
    };
  }

  function attackFor(it, d) {
    if (it.category !== 'weapon' || !it.damage) return null;
    const ab = weaponAbility(it, d.mods);
    const m = d.mods[ab];
    return { ab, hit: m, hitProf: m + d.prof, dmg: it.damage.numberOfDice + 'd' + it.damage.dieFaces + (m ? ' ' + fmt(m) : ''), type: it.damage.type };
  }

  /* Tiny markdown renderer for rules text. Input is escaped first. */
  function md(src) {
    const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const inline = (s) => esc(s)
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[\s(>])_(.+?)_(?=[\s).,;:<]|$)/g, '$1<em>$2</em>')
      .replace(/(^|[\s(>])\*(?!\s)(.+?)\*(?=[\s).,;:<]|$)/g, '$1<em>$2</em>');
    const lines = String(src || '').replace(/\r/g, '').split('\n');
    const out = [];
    let i = 0;
    while (i < lines.length) {
      const ln = lines[i];
      if (!ln.trim()) { i++; continue; }
      let m;
      if ((m = /^(#{1,6})\s+(.*)$/.exec(ln))) {
        out.push('<h' + (m[1].length <= 3 ? 3 : 4) + '>' + inline(m[2]) + '</h' + (m[1].length <= 3 ? 3 : 4) + '>');
        i++;
      } else if (/^_{3,}$|^-{3,}$/.test(ln.trim())) {
        out.push('<hr>'); i++;
      } else if (/^\s*[-*]\s+/.test(ln)) {
        const items = [];
        while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) { items.push('<li>' + inline(lines[i].replace(/^\s*[-*]\s+/, '')) + '</li>'); i++; }
        out.push('<ul>' + items.join('') + '</ul>');
      } else if (/^\s*\|/.test(ln)) {
        const rows = [];
        while (i < lines.length && /^\s*\|/.test(lines[i])) { rows.push(lines[i]); i++; }
        const cells = (r) => r.trim().replace(/^\||\|$/g, '').split('|').map((x) => x.trim());
        const body = rows.filter((r) => !/^\s*\|[\s:|-]+\|?\s*$/.test(r));
        const head = cells(body[0] || '');
        out.push('<table><thead><tr>' + head.map((x) => '<th>' + inline(x) + '</th>').join('') + '</tr></thead><tbody>' +
          body.slice(1).map((r) => '<tr>' + cells(r).map((x) => '<td>' + inline(x) + '</td>').join('') + '</tr>').join('') + '</tbody></table>');
      } else {
        const buf = [];
        while (i < lines.length && lines[i].trim() && !/^(#{1,6}\s|\s*[-*]\s|\s*\||_{3,}$|-{3,}$)/.test(lines[i].trim())) { buf.push(lines[i]); i++; }
        if (!buf.length) { buf.push(ln); i++; }
        out.push('<p>' + inline(buf.join(' ')) + '</p>');
      }
    }
    return out.join('');
  }

  const api = { ABIL, FULL, SKILLS, STD_ARRAY, POINT_COST, POINT_BUDGET, mod, fmt, parseSkills, newCharacter, speciesBonuses, derive, attackFor, md };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.RULES = api;
})(typeof window !== 'undefined' ? window : globalThis);
