// DAAN KGP Service Worker - PWA Support
const CACHE_NAME = 'daankgp-v1';
const STATIC_CACHE = 'daankgp-static-v1';
const DYNAMIC_CACHE = 'daankgp-dynamic-v1';

// Assets to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://res.cloudinary.com/dhv0sckmq/image/upload/v1769529398/Logo_NoBG_op55cy.avif'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[Service Worker] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
          .map((key) => {
            console.log('[Service Worker] Removing old cache:', key);
            return caches.delete(key);
          })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip API requests - always fetch from network
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(
          JSON.stringify({ error: 'Network error. Please try again.' }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      })
    );
    return;
  }

  // Skip external resources (Cloudinary, Google Fonts, etc.)
  if (!url.origin.includes(self.location.origin)) {
    // For external resources, try network first, then cache
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clonedResponse = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, clonedResponse);
          });
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // For navigation requests (HTML pages), use network first
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clonedResponse = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, clonedResponse);
          });
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // For other requests, try cache first, then network
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Update cache in background
        fetch(request).then((response) => {
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, response);
          });
        });
        return cachedResponse;
      }

      // Not in cache, fetch from network
      return fetch(request).then((response) => {
        const clonedResponse = response.clone();
        caches.open(DYNAMIC_CACHE).then((cache) => {
          cache.put(request, clonedResponse);
        });
        return response;
      });
    })
  );
});

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);
  if (event.tag === 'sync-forms') {
    event.waitUntil(syncForms());
  }
});

async function syncForms() {
  // Placeholder for future form sync logic
  console.log('[Service Worker] Syncing forms...');
}

// Push notifications support (for future use)
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  const title = data.title || 'DAAN KGP';
  const options = {
    body: data.body || 'New notification from DAAN KGP',
    icon: 'https://res.cloudinary.com/dhv0sckmq/image/upload/v1769529398/Logo_NoBG_op55cy.avif',
    badge: 'https://res.cloudinary.com/dhv0sckmq/image/upload/v1769529398/Logo_NoBG_op55cy.avif',
    vibrate: [100, 50, 100],
    data: data.url || '/'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data));
});
