const CACHE='couple-wellness-v1';
const ASSETS=['/','/index.html','/app.css','/app.js','/manifest.webmanifest','/icon-192.png','/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(self.clients.claim());});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).pathname.startsWith('/api/'))return;e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));});
self.addEventListener('push',e=>{let data={title:'건강한 하루',body:'오늘의 루틴을 확인하세요.',url:'/'};try{data={...data,...e.data.json()};}catch{}e.waitUntil(self.registration.showNotification(data.title,{body:data.body,icon:'/icon-192.png',badge:'/icon-192.png',tag:'routine-'+data.title,renotify:true,data:{url:data.url}}));});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(async clients=>{const c=clients[0];if(c){await c.focus();return c.navigate('/');}return self.clients.openWindow('/');}));});
