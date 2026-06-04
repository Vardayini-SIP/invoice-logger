const CACHE_NAME = 'cdf-invoice-v3';
const ASSETS = [
  '/invoice-logger/',
  '/invoice-logger/index.html',
  '/invoice-logger/manifest.json',
  '/invoice-logger/icon-192.png',
  '/invoice-logger/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('powerplatform.com') ||
      e.request.url.includes('googleapis.com')) {
    return e.respondWith(fetch(e.request));
  }
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).catch(() => caches.match('/invoice-logger/index.html'));
    })
  );
});
