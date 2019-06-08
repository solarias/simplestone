/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "css/sist_cardNinfo.css",
    "revision": "e403828c65dd4424e53b5ef3d83a0cb1"
  },
  {
    "url": "css/sist_main.css",
    "revision": "10d1532e1c2a41f377c514fbd19b5ea9"
  },
  {
    "url": "history/cards_collectible_11.4.json",
    "revision": "4233b7cd1d030c4bde6451cd163fb4bb"
  },
  {
    "url": "index.html",
    "revision": "a23fce10a08a891d64f40026c39b146a"
  },
  {
    "url": "js_newset/cards.BOOMSDAY.json",
    "revision": "cbb97ce3e0f80b868431d18dbf0d37a4"
  },
  {
    "url": "js/cards.collectible.json",
    "revision": "d9caed79e1bf3833765f8f2d1cdbdd80"
  },
  {
    "url": "js/cards.textreplace.json",
    "revision": "18ea2b0f7c9de6f7e8f3295f7da5b63e"
  },
  {
    "url": "js/deckstrings.js",
    "revision": "c98fdae77879aaad1e79946d66e053f0"
  },
  {
    "url": "js/sist_cardinfo.js",
    "revision": "f31dc362bcc5f1c4b271a080233a4a40"
  },
  {
    "url": "js/sist_data.js",
    "revision": "ffce61957cfd55337c8f87499378aeaa"
  },
  {
    "url": "js/sist_deckcode.js",
    "revision": "f345350e33a2eb1edc6143bef5f1d5f0"
  },
  {
    "url": "js/sist_filterNsearch.js",
    "revision": "a0768fd94b47fc037087045f15fee348"
  },
  {
    "url": "js/sist_icondata.js",
    "revision": "398f50ea3f8300aa81c0ee031b119dd2"
  },
  {
    "url": "js/sist_process.js",
    "revision": "b1ebae61400601481f8023a0ba932667"
  },
  {
    "url": "js/sist_window.js",
    "revision": "cffffa4d3308bee64d42e7006904205e"
  },
  {
    "url": "manifest.json",
    "revision": "ce8a1dc20bb66651a05dd55c0e95379d"
  },
  {
    "url": "notice.json",
    "revision": "3991d1857566a577d053d3ef5ef97194"
  },
  {
    "url": "package/clusterize.css",
    "revision": "4470105f7d5de975d70920842e36c0fe"
  },
  {
    "url": "package/clusterize.min.js",
    "revision": "c34c779a35d5fe5797189f9b731e12e9"
  },
  {
    "url": "package/fastclick.js",
    "revision": "1cd0bf8fbcefa34999e025477aeff5a4"
  },
  {
    "url": "package/font/SpoqaHanSansBold.ttf",
    "revision": "f6e14af67543634042408b4096fe59b2"
  },
  {
    "url": "package/font/SpoqaHanSansBold.woff",
    "revision": "4ad74ffe34b23dc2e4e4ab8d1e1871c5"
  },
  {
    "url": "package/font/SpoqaHanSansBold.woff2",
    "revision": "76b8c78aef67207eeb8113597ae6e86b"
  },
  {
    "url": "package/font/SpoqaHanSansLight.ttf",
    "revision": "8eaaae7e2b62cec82a2fd44de6e7971b"
  },
  {
    "url": "package/font/SpoqaHanSansLight.woff",
    "revision": "9e83e4227b99ea4cfd8dcf052b6c9a8b"
  },
  {
    "url": "package/font/SpoqaHanSansLight.woff2",
    "revision": "c41494aac6f4ad8bb82042490366c20f"
  },
  {
    "url": "package/font/SpoqaHanSansRegular.ttf",
    "revision": "65f1261ac163f9ea841308800fabd5fd"
  },
  {
    "url": "package/font/SpoqaHanSansRegular.woff",
    "revision": "5ffec7731901dc0b720f9bf1e541abef"
  },
  {
    "url": "package/font/SpoqaHanSansRegular.woff2",
    "revision": "544112e58f9a0c5e61938c3168e6ef50"
  },
  {
    "url": "package/font/SpoqaHanSansThin.ttf",
    "revision": "85741cd485c8f9d48eeb55729a4cf84b"
  },
  {
    "url": "package/font/SpoqaHanSansThin.woff",
    "revision": "a1a1697fa12d14eaee122f2aeed3215c"
  },
  {
    "url": "package/font/SpoqaHanSansThin.woff2",
    "revision": "366a745dd267f46a795e3235d6da8bb1"
  },
  {
    "url": "package/localforage.min.js",
    "revision": "886a9146326de8127bdc4024040769bc"
  },
  {
    "url": "package/native-toast/native-toast.css",
    "revision": "7f964a320c7e3886f01a442efd692d03"
  },
  {
    "url": "package/native-toast/native-toast.min.js",
    "revision": "5d79368048de8a8cc70e9b5175ba5a1b"
  },
  {
    "url": "package/no_ie.js",
    "revision": "5131445b85c855c9be568f5b36990321"
  },
  {
    "url": "package/subtool.js",
    "revision": "015d1a6b74ecf766b550b8ec2fe910f4"
  },
  {
    "url": "package/sweetalert2.css",
    "revision": "fae37b0c2723cf0052be5c64ed7cfaf6"
  },
  {
    "url": "package/sweetalert2.min.js",
    "revision": "87b3922204ec61b7729403723e78f536"
  },
  {
    "url": "workbox-config.js",
    "revision": "a3611699b8991ed91d68e050cb09779a"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/\.(?:png|jpg|jpeg|svg)$/, new workbox.strategies.CacheFirst({ "cacheName":"images", plugins: [new workbox.expiration.Plugin({ maxAgeSeconds: 864000, purgeOnQuotaError: false })] }), 'GET');
