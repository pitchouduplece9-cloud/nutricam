// NutriCam Service Worker v2
const CACHE = 'nutricam-v2';

const URLS = [
  '/nutricam-hub.html',
  '/nutricam-world-recipes.html',
  '/nutricam-chatbot.html',
  '/nutricam-recipes-detail.html',
  '/nutricam-community.html',
  '/nutricam-dashboard.html',
  '/nutricam-install.html',
  '/manifest.json',
  '/nutricam-icon-192.png',
  '/nutricam-icon-512.png'
];

// Installation — mise en cache
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(URLS)).catch(() => {})
  );
  self.skipWaiting();
});

// Activation — nettoyage anciens caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — cache first, puis réseau
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).catch(() => caches.match('/nutricam-hub.html'));
    })
  );
});
