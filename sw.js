/* Cache agar halaman tetap bisa dibuka ulang saat internet putus (suara tetap tidak bisa dikirim offline). */
const C='osis-v1';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  const ok=u.origin===location.origin||/^(www|fonts)\.gstatic\.com$|^fonts\.googleapis\.com$|jsdelivr\.net$/.test(u.hostname);
  if(!ok)return;
  e.respondWith(fetch(r).then(res=>{if(res.ok||res.type==='opaque'){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res})
    .catch(()=>caches.match(r).then(m=>m||caches.match('./index.html')||caches.match('./'))));
});
