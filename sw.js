// Service worker — Consulta de Documentos BR163/MS
// Mantém uma cópia do site e da lista para uso sem internet.
// Sempre tenta a internet primeiro; sem conexão, usa a cópia guardada.
const VERSAO = 'projetos-v2-2026-11-13';
const ARQUIVOS_BASE = ['./', './index.html', './documentos.json', './manifest.json', './Aterpa.png', './icon-192.png', './icon-512.png'];
const FONTES = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(VERSAO).then(cache =>
      Promise.all(ARQUIVOS_BASE.map(url => cache.add(new Request(url, { cache: 'reload' })).catch(() => null)))
    )
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(nomes => Promise.all(nomes.filter(n => n !== VERSAO).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', event => {
  if (event.data === 'ATUALIZAR') self.skipWaiting();
});

function chaveDoCache(request) {
  const url = new URL(request.url);
  url.search = '';
  return url.href;
}

async function internetPrimeiro(request, limiteMs = 6000) {
  const cache = await caches.open(VERSAO);
  try {
    const resposta = await Promise.race([
      fetch(request),
      new Promise((_, rej) => setTimeout(() => rej(new Error('tempo esgotado')), limiteMs)),
    ]);
    if (resposta && resposta.ok) cache.put(chaveDoCache(request), resposta.clone());
    return resposta;
  } catch (erro) {
    const guardada = await cache.match(chaveDoCache(request), { ignoreSearch: true })
                  || (request.mode === 'navigate' ? await cache.match('./index.html') : null);
    if (guardada) return guardada;
    throw erro;
  }
}

async function cacheDasFontes(request) {
  const cache = await caches.open(VERSAO);
  const guardada = await cache.match(request);
  if (guardada) return guardada;
  const resposta = await fetch(request);
  if (resposta && (resposta.ok || resposta.type === 'opaque')) cache.put(request, resposta.clone());
  return resposta;
}

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (FONTES.includes(url.hostname)) { event.respondWith(cacheDasFontes(request)); return; }
  if (url.origin !== self.location.origin) return; // SharePoint e servidor local: direto
  event.respondWith(internetPrimeiro(request));
});
