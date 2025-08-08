const CACHE_NAME = 'autism-observation-app-v1';
const API_CACHE_NAME = 'autism-observation-api-v1';
const STATIC_CACHE_NAME = 'autism-observation-static-v1';

// URLs to cache on install
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// API endpoints that can be cached
const CACHEABLE_API_ENDPOINTS = [
  '/api/observations',
  '/api/students',
  '/api/classes',
  '/api/goals',
  '/api/strategies'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && 
              cacheName !== API_CACHE_NAME && 
              cacheName !== STATIC_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - handle requests
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    // Only cache GET requests for specific endpoints
    if (event.request.method === 'GET' && 
        CACHEABLE_API_ENDPOINTS.some(endpoint => url.pathname.startsWith(endpoint))) {
      event.respondWith(
        caches.open(API_CACHE_NAME).then((cache) => {
          return fetch(event.request)
            .then((response) => {
              // Clone the response before caching
              const responseToCache = response.clone();
              cache.put(event.request, responseToCache);
              return response;
            })
            .catch(() => {
              // If network fails, try to return from cache
              return cache.match(event.request);
            });
        })
      );
    } else {
      // For other API requests (POST, PUT, DELETE), try network first
      event.respondWith(
        fetch(event.request).catch(() => {
          // If network fails, store in IndexedDB for later sync
          if (event.request.method === 'POST' || event.request.method === 'PUT') {
            return storeForLaterSync(event.request);
          }
          return new Response('Network error', { status: 503 });
        })
      );
    }
    return;
  }
  
  // Handle static assets
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        
        return fetch(event.request).then((response) => {
          // Cache new static assets
          if (event.request.url.startsWith(self.location.origin)) {
            const responseToCache = response.clone();
            caches.open(STATIC_CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        });
      })
  );
});

// Store request for later sync
function storeForLaterSync(request) {
  return request.clone().json().then(data => {
    return new Promise((resolve) => {
      // Open IndexedDB
      const request = indexedDB.open('AutismObservationDB', 1);
      
      request.onerror = () => {
        resolve(new Response('Database error', { status: 500 }));
      };
      
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['syncQueue'], 'readwrite');
        const store = transaction.objectStore('syncQueue');
        
        const syncItem = {
          id: Date.now().toString(),
          url: request.url,
          method: request.method,
          data: data,
          timestamp: new Date().toISOString(),
          retryCount: 0
        };
        
        store.add(syncItem);
        
        resolve(new Response(JSON.stringify({ 
          message: 'Stored for later sync',
          syncId: syncItem.id 
        }), { 
          status: 202,
          headers: { 'Content-Type': 'application/json' }
        }));
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('syncQueue')) {
          const objectStore = db.createObjectStore('syncQueue', { keyPath: 'id' });
          objectStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  });
}

// Handle sync events
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-observations') {
    event.waitUntil(syncPendingRequests());
  }
});

// Sync pending requests
function syncPendingRequests() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('AutismObservationDB', 1);
    
    request.onerror = () => reject();
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['syncQueue'], 'readwrite');
      const store = transaction.objectStore('syncQueue');
      const index = store.index('timestamp');
      
      const getAllRequest = index.getAll();
      
      getAllRequest.onsuccess = () => {
        const pendingRequests = getAllRequest.result;
        
        if (pendingRequests.length === 0) {
          resolve();
          return;
        }
        
        const syncPromises = pendingRequests.map(item => {
          return fetch(item.url, {
            method: item.method,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(item.data)
          })
          .then(response => {
            if (response.ok) {
              // Remove from sync queue on success
              store.delete(item.id);
              return response.json();
            } else {
              throw new Error(`Sync failed: ${response.status}`);
            }
          })
          .catch(error => {
            // Increment retry count
            item.retryCount += 1;
            
            // If too many retries, remove from queue
            if (item.retryCount >= 3) {
              store.delete(item.id);
              throw error;
            }
            
            // Update item with new retry count
            store.put(item);
            throw error;
          });
        });
        
        Promise.allSettled(syncPromises)
          .then(results => {
            const successful = results.filter(r => r.status === 'fulfilled').length;
            const failed = results.filter(r => r.status === 'rejected').length;
            
            // Notify clients about sync completion
            self.clients.matchAll().then(clients => {
              clients.forEach(client => {
                client.postMessage({
                  type: 'SYNC_COMPLETE',
                  successful,
                  failed
                });
              });
            });
            
            resolve();
          });
      };
      
      getAllRequest.onerror = () => reject();
    };
  });
}

// Handle message events from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'GET_SYNC_STATUS') {
    // Check sync queue status
    const request = indexedDB.open('AutismObservationDB', 1);
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['syncQueue'], 'readonly');
      const store = transaction.objectStore('syncQueue');
      
      const countRequest = store.count();
      
      countRequest.onsuccess = () => {
        event.ports[0].postMessage({
          type: 'SYNC_STATUS',
          pendingItems: countRequest.result
        });
      };
    };
  }
});