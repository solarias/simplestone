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
    "revision": "2c421a4c83b34da326a655bdd8360062"
  },
  {
    "url": "css/sist_main.css",
    "revision": "7549273bd9b7c92336fa87469febd8e2"
  },
  {
    "url": "history/cards_collectible_11.4.json",
    "revision": "4233b7cd1d030c4bde6451cd163fb4bb"
  },
  {
    "url": "index.html",
    "revision": "ad653f2d8c33a907b02e9d65016a5b74"
  },
  {
    "url": "js_newset/cards.BOOMSDAY.json",
    "revision": "cbb97ce3e0f80b868431d18dbf0d37a4"
  },
  {
    "url": "js/cards.collectible.json",
    "revision": "87c665ef436d4e5a8fab502f9fa0bb8d"
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
    "revision": "d67962ea0e0cfa6c57bae200ebc31cde"
  },
  {
    "url": "js/sist_data.js",
    "revision": "5eed408ad64de0bd171c59fbbc9ea46c"
  },
  {
    "url": "js/sist_deckcode.js",
    "revision": "21e9995993b9aed4fe5b1dd26b642c64"
  },
  {
    "url": "js/sist_filterNsearch.js",
    "revision": "7233f0f17798f140116a7816fc0e6679"
  },
  {
    "url": "js/sist_icondata.js",
    "revision": "398f50ea3f8300aa81c0ee031b119dd2"
  },
  {
    "url": "js/sist_process.js",
    "revision": "e08418659c59ca4f25be9353d608c9cd"
  },
  {
    "url": "js/sist_window.js",
    "revision": "1008c9cfe2f998cb80993284c3db2759"
  },
  {
    "url": "localtest/metadeck_archetype.json",
    "revision": "6194a6e87d36e738f1ad6e358608e5fc"
  },
  {
    "url": "localtest/metadeck_hot_standard.json",
    "revision": "9bae4aa7642802d89aff3d97f02fd028"
  },
  {
    "url": "localtest/metadeck_hot_wild.json",
    "revision": "8650951207413a8d86f9009511089d8f"
  },
  {
    "url": "localtest/metadeck_update.json",
    "revision": "001139bfe890e655ce6875b77f942c82"
  },
  {
    "url": "localtest/metadeck_winrate_standard.json",
    "revision": "85d06075040413817dd698b339b2a4de"
  },
  {
    "url": "localtest/metadeck_winrate_wild.json",
    "revision": "e8fb4e8fb9526855349199184caf2887"
  },
  {
    "url": "manifest.json",
    "revision": "ce8a1dc20bb66651a05dd55c0e95379d"
  },
  {
    "url": "notice.json",
    "revision": "b2a85412282dc4ce02782a59f942ae82"
  },
  {
    "url": "package/Chart.min.js",
    "revision": "02c4ffbe5ddf310174120fa063bad884"
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
    "revision": "91ec17ec74c5df53a24dcd3b874e27a2"
  },
  {
    "url": "package/native-toast/native-toast.min.js",
    "revision": "19b71e9ba70c5a3f8312a07a4a657151"
  },
  {
    "url": "package/no_ie.js",
    "revision": "5131445b85c855c9be568f5b36990321"
  },
  {
    "url": "package/subtool.js",
    "revision": "4103004898f8dfab09c55fe2e606672e"
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
