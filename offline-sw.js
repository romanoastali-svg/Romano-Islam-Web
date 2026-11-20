const CACHE='romano-islam-portal-20261120';
const FILES=["", "assets/romano-data.js", "assets/romano-pages.js", "assets/web-original.css", "assets/modular-layout.css", "assets/web-labels.js", "assets/web-menu.js", "readers/korkut-reader.js"];

self.addEventListener('install',event=>{event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(FILES.map(path=>new Request(new URL(path,self.registration.scope),{cache:'reload'})));await self.skipWaiting();})());});
self.addEventListener('activate',event=>{event.waitUntil(self.clients.claim());});
self.addEventListener('fetch',event=>{const request=event.request,url=new URL(request.url),root=new URL(self.registration.scope);if(request.method!=='GET'||url.origin!==root.origin||!url.pathname.startsWith(root.pathname)||url.pathname.startsWith(new URL('data/',root).pathname))return;event.respondWith((async()=>{const cache=await caches.open(CACHE);try{const response=await fetch(request);if(response.ok)await cache.put(request,response.clone());return response;}catch(error){const saved=await cache.match(request,{ignoreSearch:true});if(saved)return saved;throw error;}})());});
