
//workbox 불러오기
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js');
//실행 체크
if (workbox)
    console.log(`Yay! Workbox is loaded 🎉`);
else
    console.log(`Boo! Workbox didn't load 😬`);

//정적 파일 설정 (향후 공부하면서 세부 설정)
/*
workbox.routing.registerRoute(
  new RegExp('.*\.js'),
  workbox.strategies.networkFirst()
);
workbox.routing.registerRoute(
  new RegExp('.*\.json'),
  workbox.strategies.networkFirst()
);
workbox.routing.registerRoute(
  /.*\.css/,// Cache CSS files
  workbox.strategies.staleWhileRevalidate({// Use cache but update in the background ASAP
    cacheName: 'css-cache',// Use a custom cache name
  })
);
workbox.routing.registerRoute(
 /\.(?:png|gif|jpg|jpeg|svg)$/,
 workbox.strategies.cacheFirst({
   cacheName: 'images',
   plugins: [
     new workbox.expiration.Plugin({
       maxEntries: 60,
       maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
     }),
   ],
 }),
);
*/
