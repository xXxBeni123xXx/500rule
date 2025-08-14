const CACHE_NAME = 'astrocalc-v2.4.0';
const STATIC_CACHE = 'astrocalc-static-v2.4.0';
const DYNAMIC_CACHE = 'astrocalc-dynamic-v2.4.0';
const API_CACHE = 'astrocalc-api-v2.4.0';

// Essential files to cache
const staticAssets = [
  '/',
  '/index.html',
  '/manifest.json',
  '/astro-icon.svg',
  '/icon-192.png',
  '/icon-512.png'
];

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(staticAssets);
      })
      .catch((error) => {
        console.error('Failed to cache static assets:', error);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName.startsWith('astrocalc-') && 
                   cacheName !== STATIC_CACHE && 
                   cacheName !== DYNAMIC_CACHE && 
                   cacheName !== API_CACHE;
          })
          .map((cacheName) => {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
  );
  self.clients.claim();
});

// Helper function to determine cache strategy
function getCacheStrategy(request) {
  const url = new URL(request.url);
  
  // API calls - network first, cache fallback
  if (url.pathname.startsWith('/api/')) {
    return 'network-first';
  }
  
  // Static assets - cache first
  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|gif|woff2?)$/)) {
    return 'cache-first';
  }
  
  // HTML pages - network first for freshness
  if (request.mode === 'navigate' || url.pathname.endsWith('.html')) {
    return 'network-first';
  }
  
  // Default to network first
  return 'network-first';
}

// Fetch event - implement different caching strategies
self.addEventListener('fetch', (event) => {
  // Skip non-http(s) requests
  if (!event.request.url.startsWith('http')) {
    return;
  }

  const strategy = getCacheStrategy(event.request);

  if (strategy === 'cache-first') {
    // Cache first strategy
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }
          
          return fetch(event.request).then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200) {
              return response;
            }
            
            const responseToCache = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(event.request, responseToCache);
            });
            
            return response;
          });
        })
    );
  } else {
    // Network first strategy
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache successful responses
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            const cacheToUse = event.request.url.includes('/api/') ? API_CACHE : DYNAMIC_CACHE;
            
            caches.open(cacheToUse).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Try to serve from cache when offline
          return caches.match(event.request).then((response) => {
            if (response) {
              return response;
            }
            
            // Fallback to index.html for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            
            // Return a custom offline page or response
            return new Response('Offline - Content not available', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
        })
    );
  }
});

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-api-data') {
    event.waitUntil(syncApiData());
  }
});

async function syncApiData() {
  // Implement background sync logic here
  console.log('Background sync triggered');
}

// Handle messages from the app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            return caches.delete(cacheName);
          })
        );
      })
      );
    }
});
