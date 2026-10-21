// Service worker: un pequeño programa que el navegador deja corriendo
// "detrás" de la página. Lo usamos para guardar una copia del juego y que
// se pueda jugar sin internet.

const CACHE = "ahorcado-v1";

// Al instalarse, guardamos la página principal.
self.addEventListener("install", (evento) => {
  evento.waitUntil(caches.open(CACHE).then((cache) => cache.add("/")));
  self.skipWaiting();
});

// Al activarse, borramos copias de versiones viejas.
self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((nombres) => Promise.all(nombres.filter((n) => n !== CACHE).map((n) => caches.delete(n))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (evento) => {
  const { request } = evento;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  // Páginas: primero internet (para tener lo más nuevo); si no hay, la copia.
  if (request.mode === "navigate") {
    evento.respondWith(
      fetch(request)
        .then((respuesta) => {
          const copia = respuesta.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copia));
          return respuesta;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match("/"))),
    );
    return;
  }

  // Archivos (código, estilos, letras, íconos): primero la copia, que es
  // más rápida; si no está, la bajamos de internet y la guardamos.
  evento.respondWith(
    caches.match(request).then(
      (guardado) =>
        guardado ||
        fetch(request).then((respuesta) => {
          if (respuesta.ok) {
            const copia = respuesta.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copia));
          }
          return respuesta;
        }),
    ),
  );
});
