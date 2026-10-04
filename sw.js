/* Cache-first service worker so the datapad works with no signal.
   Bump VERSION whenever any file changes. */
const VERSION = 'datapad-8';
const FILES = [
  './', 'index.html', 'styles.css', 'data.js', 'lore.js', 'speciesimg.js', 'planetimg.js', 'rules.js', 'app.js', 'manifest.webmanifest',
  'fonts/Aurebesh.otf', 'fonts/Aurebesh-Bold.otf', 'icons/icon-192.png', 'icons/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION && k !== 'datapad-img').map((k) => caches.delete(k)))).then(() => self.clients.claim()));
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
  e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request)));
});
