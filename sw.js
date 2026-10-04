/* Network-first (cache fallback) service worker: updates arrive as soon as you are online, and the datapad still works with no signal.
   Bump VERSION whenever any file changes. */
const VERSION = 'datapad-22';
const FILES = [
  './', 'index.html', 'styles.css', 'data.js', 'lore.js', 'speciesimg.js', 'planetimg.js', 'rules.js', 'app.js', 'canon.js', 'jspdf.min.js', 'pdffont.js', 'pdfexport.js', 'manifest.webmanifest',
  'fonts/Aurebesh.otf', 'fonts/Aurebesh-Bold.otf', 'icons/icon-192.png', 'icons/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION && k !== 'datapad-img' && k !== 'datapad-data').map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const u = new URL(e.request.url);
  if (u.origin !== location.origin) {
    /* Pictures from the web (species art, links you add): keep a copy after the first successful load. */
    if (e.request.destination === 'image') {
      e.respondWith(caches.open('datapad-img').then((c) => c.match(e.request).then((hit) => hit || fetch(e.request).then((r) => { if (r.ok) c.put(e.request, r.clone()); return r; }))));
    }
    return;
  }
  if (u.pathname.indexOf('/data/') >= 0) {
    /* big canon index files: keep them once downloaded; file names carry a version */
    e.respondWith(caches.open('datapad-data').then((c) => c.match(e.request).then((hit) => hit || fetch(e.request).then((r) => { if (r.ok) c.put(e.request, r.clone()); return r; }))));
    return;
  }
  e.respondWith(fetch(e.request, { cache: 'no-cache' }).then((r) => {
    if (r.ok) { const copy = r.clone(); caches.open(VERSION).then((c) => c.put(e.request, copy)); }
    return r;
  }).catch(() => caches.match(e.request).then((hit) => hit || caches.match('index.html'))));
});
