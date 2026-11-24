/* Al-Furqan Academie service worker: offline pages + cached audio */
const C = 'furqan-v1';
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET' || r.headers.has('range')) return;
  var u = new URL(r.url);
  if (u.origin !== location.origin) return;
  if (u.pathname.indexOf('/audio/') === 0 || u.pathname.indexOf('/icons/') === 0) {
    /* recordings never change (name = hash of the text): cache first */
    e.respondWith(caches.open(C).then(function (c) {
      return c.match(r).then(function (m) {
        return m || fetch(r).then(function (res) { if (res.status === 200) c.put(r, res.clone()); return res; });
      });
    }));
    return;
  }
  /* pages and data: always try the network first, fall back to the saved copy offline */
  e.respondWith(fetch(r).then(function (res) {
    if (res.status === 200) { var cl = res.clone(); caches.open(C).then(function (c) { c.put(r, cl); }); }
    return res;
  }).catch(function () { return caches.match(r, { ignoreSearch: true }); }));
});
