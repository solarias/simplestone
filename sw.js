
//workbox 불러오기
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js');

//실행 체크
if (workbox) {
    self.__precacheManifest = [
      "./index.html"
    ].concat(self.__precacheManifest || []);
    workbox.precaching.suppressWarnings();
    workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

    //캐시 설정
    workbox.routing.registerRoute(
      new RegExp('.*\.html'),
      workbox.strategies.networkFirst()
    );
    workbox.routing.registerRoute(
      new RegExp('.*\.css'),
      workbox.strategies.networkFirst()
    );
    workbox.routing.registerRoute(
      new RegExp('.*\.js'),
      workbox.strategies.networkFirst()
    );
    workbox.routing.registerRoute(
      new RegExp('.*\.json'),
      workbox.strategies.networkFirst()
    );
    workbox.routing.registerRoute(
      /\.(?:png|gif|jpg|jpeg|svg)$/,
      workbox.strategies.cacheFirst({
        cacheName: 'images',
        plugins: [
          new workbox.expiration.Plugin({
            maxAgeSeconds: 10 * 24 * 60 * 60, //10 Days
          }),
        ],
      }),
    );
}
