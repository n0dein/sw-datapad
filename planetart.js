/* Original, generated planet pictures for the Holopedia. Drawn in code (no photos or
   film stills): a simple hologram-style render for each world, built from a few
   colours and features. Everything is a small inline SVG, so it works offline. */
(function () {
  function rng(seed) { let s = 0; for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  const P = {
    'Alderaan': ['#3b78b8', '#5aa66a', '#e8eef5', 'clouds caps'],
    'Batuu': ['#6a5a3a', '#4f6b3a', '#8a7a52', 'clouds moon'],
    'Bespin': ['#e8a76a', '#f1d0a0', '#c76f5a', 'bands glow:#ffb070'],
    'Cantonica': ['#c9a063', '#a8763c', '#e0c48a', 'dunes lights'],
    'Christophsis': ['#3a7ea0', '#7fd0e0', '#b8f0ff', 'crystals glow:#9fe8ff'],
    'Coruscant': ['#8a8f9a', '#b8bcc6', '#5a5f6a', 'lights glow:#ffd890'],
    'Corellia': ['#4a86b0', '#6f9a58', '#d8d4c0', 'clouds'],
    'Crait': ['#ece9e2', '#b83a2a', '#d8d4cc', 'streaks'],
    'Dagobah': ['#3f5a32', '#2a3d28', '#6f7f4a', 'clouds:0.55'],
    'Dathomir': ['#5a2a3a', '#8a3a4a', '#2a1a28', 'cracks glow:#d04060'],
    'Endor': ['#3f7a3a', '#2a5530', '#7aa05a', 'clouds moon giant'],
    'Exegol': ['#3a2a3a', '#6a2a2a', '#1a1218', 'cracks glow:#e03030'],
    'Felucia': ['#8a4aa0', '#d070c0', '#3a8a6a', 'clouds spots'],
    'Geonosis': ['#b0583a', '#d08060', '#7a3a2a', 'dunes spots'],
    'Hoth': ['#eaf4fa', '#b8d4e6', '#8aa8c0', 'clouds caps'],
    'Jakku': ['#d8a860', '#b88040', '#e8c888', 'dunes'],
    'Jedha': ['#c8b090', '#a89070', '#e0d0b0', 'dunes crystals moon'],
    'Kamino': ['#5a7a9a', '#8aa4bc', '#3a4a62', 'clouds:0.7 swirl'],
    'Kashyyyk': ['#3a7a3a', '#2a5a2a', '#6a9a4a', 'clouds'],
    'Kessel': ['#6a6a72', '#4a4a52', '#8a7a62', 'dunes spots'],
    'Lothal': ['#7a9a52', '#c0a468', '#4a6a3a', 'clouds'],
    'Malachor': ['#6a6a70', '#8a8a90', '#3a3a40', 'cracks spots'],
    'Mandalore': ['#8a8a8a', '#a89868', '#5a6a58', 'spots clouds:0.3'],
    'Mon Cala': ['#2a6aa8', '#4a9ac8', '#e0f0f8', 'clouds:0.5 swirl'],
    'Mustafar': ['#2a2a2e', '#e8581a', '#f0a030', 'cracks glow:#ff7a20'],
    'Mygeeto': ['#a8c8e8', '#d8ecf8', '#6a8aa8', 'crystals caps'],
    'Naboo': ['#4a9a5a', '#3a78b0', '#e8e8d8', 'clouds'],
    'Nevarro': ['#7a4a32', '#a85a3a', '#3a2a2a', 'cracks spots'],
    'Onderon': ['#4a8a4a', '#7a5a3a', '#d0d8c0', 'clouds moon'],
    'Ord Mantell': ['#8a7a5a', '#5a6a7a', '#a09a80', 'clouds:0.4 spots'],
    'Ryloth': ['#b87a52', '#d09a6a', '#6a3a2a', 'dunes'],
    'Saleucami': ['#6a8a5a', '#8a7a4a', '#4a5a4a', 'clouds spots'],
    'Scarif': ['#3aa8c0', '#e8d8a8', '#4a9a5a', 'clouds:0.5'],
    'Takodana': ['#4a9a5a', '#3a78a0', '#7ab070', 'clouds'],
    'Tatooine': ['#e0b068', '#c88a42', '#f0d090', 'dunes suns'],
    'Umbara': ['#2a2a48', '#4a3a6a', '#1a1a2a', 'clouds:0.4 glow:#8a6aff'],
    'Utapau': ['#a88a6a', '#c8a880', '#6a5a42', 'dunes pits'],
    'Yavin 4': ['#4a8a4a', '#2a5a3a', '#7aa05a', 'clouds giant'],
    'Zeffo': ['#6a8a7a', '#a0b090', '#3a4a48', 'spots clouds:0.3']
  };
  const cache = {};
  function art(name) {
    if (cache[name]) return cache[name];
    const p = P[name]; if (!p) return '';
    const [c1, c2, c3] = p; const f = {}; p[3].split(' ').forEach((t) => { const [k, v] = t.split(':'); f[k] = v === undefined ? true : v; });
    const r = rng(name), W = 400, H = 300, cx = f.giant ? 150 : 200, cy = 150, R = f.giant ? 78 : 96;
    const o = [];
    o.push('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><defs>');
    o.push('<radialGradient id="g" cx="35%" cy="32%" r="80%"><stop offset="0" stop-color="' + c3 + '"/><stop offset=".45" stop-color="' + c1 + '"/><stop offset="1" stop-color="' + c2 + '"/></radialGradient>');
    o.push('<radialGradient id="t" cx="30%" cy="30%" r="85%"><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".82"/></radialGradient>');
    o.push('<radialGradient id="a" cx="50%" cy="50%" r="50%"><stop offset=".86" stop-color="' + (f.glow || '#6fe6ff') + '" stop-opacity=".0"/><stop offset=".95" stop-color="' + (f.glow || '#6fe6ff') + '" stop-opacity=".45"/><stop offset="1" stop-color="' + (f.glow || '#6fe6ff') + '" stop-opacity="0"/></radialGradient>');
    o.push('<radialGradient id="gi" cx="35%" cy="35%" r="75%"><stop offset="0" stop-color="#f6c58a"/><stop offset="1" stop-color="#b86a3a"/></radialGradient>');
    o.push('<clipPath id="c"><circle cx="' + cx + '" cy="' + cy + '" r="' + R + '"/></clipPath></defs>');
    o.push('<rect width="400" height="300" fill="#040b12"/>');
    for (let i = 0; i < 70; i++) o.push('<circle cx="' + (r() * W).toFixed(1) + '" cy="' + (r() * H).toFixed(1) + '" r="' + (0.3 + r() * 1.1).toFixed(2) + '" fill="#cfefff" opacity="' + (0.25 + r() * 0.6).toFixed(2) + '"/>');
    if (f.giant) { o.push('<circle cx="330" cy="70" r="85" fill="url(#gi)"/>'); for (let i = 0; i < 5; i++) o.push('<ellipse cx="330" cy="' + (30 + i * 22) + '" rx="85" ry="5" fill="#8a4a2a" opacity=".25" clip-path="circle(85px at 330px 70px)"/>'); }
    if (f.suns) { [[70, 60, 22], [105, 85, 14]].forEach(([x, y, s]) => o.push('<circle cx="' + x + '" cy="' + y + '" r="' + s * 2.2 + '" fill="#ffe9b0" opacity=".18"/><circle cx="' + x + '" cy="' + y + '" r="' + s + '" fill="#fff4d0"/>')); }
    o.push('<circle cx="' + cx + '" cy="' + cy + '" r="' + (R + 14) + '" fill="url(#a)"/>');
    o.push('<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="url(#g)"/>');
    o.push('<g clip-path="url(#c)">');
    const L = cx - R, T = cy - R, S = R * 2;
    if (f.bands) for (let i = 0; i < 9; i++) o.push('<rect x="' + L + '" y="' + (T + i * S / 9 + r() * 6).toFixed(1) + '" width="' + S + '" height="' + (8 + r() * 12).toFixed(1) + '" fill="' + (i % 2 ? c2 : c3) + '" opacity="' + (0.25 + r() * 0.3).toFixed(2) + '"/>');
    if (f.dunes) for (let i = 0; i < 7; i++) o.push('<ellipse cx="' + (L + r() * S).toFixed(1) + '" cy="' + (T + r() * S).toFixed(1) + '" rx="' + (30 + r() * 40).toFixed(1) + '" ry="' + (6 + r() * 10).toFixed(1) + '" fill="' + (i % 2 ? c2 : c3) + '" opacity=".4"/>');
    if (f.spots) for (let i = 0; i < 9; i++) o.push('<circle cx="' + (L + r() * S).toFixed(1) + '" cy="' + (T + r() * S).toFixed(1) + '" r="' + (4 + r() * 12).toFixed(1) + '" fill="' + (i % 2 ? c2 : c3) + '" opacity=".45"/>');
    if (f.pits) for (let i = 0; i < 6; i++) o.push('<circle cx="' + (L + r() * S).toFixed(1) + '" cy="' + (T + r() * S).toFixed(1) + '" r="' + (3 + r() * 6).toFixed(1) + '" fill="#2a1e14" opacity=".7"/>');
    if (f.streaks) for (let i = 0; i < 6; i++) o.push('<path d="M' + (L + r() * S).toFixed(0) + ' ' + (T + r() * S).toFixed(0) + ' q ' + (r() * 40 - 20).toFixed(0) + ' ' + (r() * 40 - 20).toFixed(0) + ' ' + (r() * 60 - 30).toFixed(0) + ' ' + (r() * 60 - 30).toFixed(0) + '" stroke="' + c2 + '" stroke-width="' + (2 + r() * 3).toFixed(1) + '" fill="none" opacity=".7"/>');
    if (f.cracks) for (let i = 0; i < 9; i++) { let x = L + r() * S, y = T + r() * S, d = 'M' + x.toFixed(0) + ' ' + y.toFixed(0); for (let k = 0; k < 4; k++) { x += r() * 30 - 15; y += r() * 30 - 15; d += ' L' + x.toFixed(0) + ' ' + y.toFixed(0); } o.push('<path d="' + d + '" stroke="' + (f.glow || c2) + '" stroke-width="1.8" fill="none" opacity=".85"/>'); }
    if (f.crystals) for (let i = 0; i < 12; i++) { const x = L + r() * S, y = T + r() * S, h = 8 + r() * 14; o.push('<polygon points="' + x.toFixed(0) + ',' + (y - h).toFixed(0) + ' ' + (x + 4).toFixed(0) + ',' + y.toFixed(0) + ' ' + (x - 4).toFixed(0) + ',' + y.toFixed(0) + '" fill="' + c3 + '" opacity=".75"/>'); }
    if (f.lights) for (let i = 0; i < 160; i++) o.push('<circle cx="' + (L + r() * S).toFixed(1) + '" cy="' + (T + r() * S).toFixed(1) + '" r=".9" fill="' + (f.glow || '#ffd890') + '" opacity="' + (0.4 + r() * 0.6).toFixed(2) + '"/>');
    if (f.swirl) o.push('<ellipse cx="' + (cx - 20) + '" cy="' + (cy + 10) + '" rx="46" ry="22" fill="none" stroke="#e8f4ff" stroke-width="3" opacity=".35"/><ellipse cx="' + (cx - 20) + '" cy="' + (cy + 10) + '" rx="26" ry="11" fill="none" stroke="#e8f4ff" stroke-width="3" opacity=".35"/>');
    if (f.clouds) { const a = f.clouds === true ? 0.45 : parseFloat(f.clouds); for (let i = 0; i < 11; i++) o.push('<ellipse cx="' + (L + r() * S).toFixed(1) + '" cy="' + (T + r() * S).toFixed(1) + '" rx="' + (16 + r() * 34).toFixed(1) + '" ry="' + (3 + r() * 6).toFixed(1) + '" fill="#fff" opacity="' + (a * (0.5 + r() * 0.5)).toFixed(2) + '"/>'); }
    if (f.caps) o.push('<ellipse cx="' + cx + '" cy="' + (T + 4) + '" rx="' + R * 0.55 + '" ry="14" fill="#fff" opacity=".85"/><ellipse cx="' + cx + '" cy="' + (T + S - 4) + '" rx="' + R * 0.5 + '" ry="12" fill="#fff" opacity=".85"/>');
    o.push('<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="url(#t)"/></g>');
    o.push('<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="none" stroke="#6fe6ff" stroke-opacity=".35" stroke-width="1"/>');
    if (f.moon) o.push('<circle cx="' + (cx + R + 42) + '" cy="' + (cy - R * 0.55) + '" r="13" fill="#9aa2aa"/><circle cx="' + (cx + R + 38) + '" cy="' + (cy - R * 0.55 - 3) + '" r="13" fill="#040b12" opacity=".35"/>');
    o.push('<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + (R + 28) + '" ry="' + (R + 28) + '" fill="none" stroke="#6fe6ff" stroke-opacity=".12" stroke-dasharray="3 5"/>');
    o.push('</svg>');
    return (cache[name] = 'data:image/svg+xml;utf8,' + encodeURIComponent(o.join('')));
  }
  window.PLANET_ART = art;
})();
