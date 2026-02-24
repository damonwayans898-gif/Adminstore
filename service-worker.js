const CACHE_NAME = 'AdminStore-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/login.html',
  '/registro.html',
  '/painel.html',
  '/pos.html',
  '/scanner.html',
  '/manifest.json'
];

// Instalar Service Worker e cachear arquivos
self.addEventListener('install', event => {
  console.log('Service Worker instalado');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Cache aberto');
      return cache.addAll(urlsToCache).catch(err => {
        console.log('Erro ao cachear:', err);
      });
    })
  );
  self.skipWaiting();
});

// Ativar Service Worker e limpar caches antigos
self.addEventListener('activate', event => {
  console.log('Service Worker ativado');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deletando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estratégia Network First, Fall back to Cache
self.addEventListener('fetch', event => {
  // Para requisições API, tentar rede primeiro
  if (event.request.url.includes('supabase') || event.request.url.includes('api')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cachear respostas bem-sucedidas
          if (response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Se falhar, tentar cache
          return caches.match(event.request);
        })
    );
  } else {
    // Para outros recursos, cache first
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request).then(response => {
          // Cachear novas respostas
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          return response;
        });
      })
    );
  }
});

// Tratamento de mensagens para sincronização
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SYNC_VENDAS') {
    console.log('Sincronizando vendas...');
    // Implementar lógica de sincronização de vendas offline
  }
});

// Background Sync para vendas offline
self.addEventListener('sync', event => {
  if (event.tag === 'sync-vendas') {
    event.waitUntil(
      syncVendas()
    );
  }
});

async function syncVendas() {
  try {
    const db = await openIndexedDB();
    const vendas = await getAllFromIDB('vendas');
    
    for (const venda of vendas) {
      if (!venda.sincronizado) {
        await fetch('/api/vendas', {
          method: 'POST',
          body: JSON.stringify(venda),
          headers: { 'Content-Type': 'application/json' }
        });
        await updateInIDB('vendas', { ...venda, sincronizado: true });
      }
    }
  } catch (error) {
    console.error('Erro ao sincronizar:', error);
  }
}

function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('AdminStore', 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('vendas')) {
        db.createObjectStore('vendas', { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getAllFromIDB(storeName) {
  const db = await openIndexedDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function updateInIDB(storeName, data) {
  const db = await openIndexedDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(data);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
