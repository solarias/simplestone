if(!self.define){let e,a={};const s=(s,c)=>(s=new URL(s+".js",c).href,a[s]||new Promise((a=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=a,document.head.appendChild(e)}else e=s,importScripts(s),a()})).then((()=>{let e=a[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(c,i)=>{const f=e||("document"in self?document.currentScript.src:"")||location.href;if(a[f])return;let n={};const r=e=>s(e,f),o={module:{uri:f},exports:n,require:r};a[f]=Promise.all(c.map((e=>o[e]||r(e)))).then((e=>(i(...e),n)))}}define(["./workbox-72a2e8a5"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"css/sist_cardNinfo.css",revision:"c564adae6402ab1a8522489eedda6dd6"},{url:"css/sist_main.css",revision:"34e395a5ab1024ee8663106f483dd3d2"},{url:"index.html",revision:"5558e91ead51c40ca61e98ff44810367"},{url:"js/cards.textreplace.json",revision:"18ea2b0f7c9de6f7e8f3295f7da5b63e"},{url:"js/deckstrings.js",revision:"fbbae9b5d3b8b372482e3b43a47712bd"},{url:"js/sist_cardinfo.js",revision:"e88f50fab16f9a26804e7c7a2e58dc70"},{url:"js/sist_data.js",revision:"3df67f58e9495d90581a26e3ccfef7dc"},{url:"js/sist_deckcode.js",revision:"e35c2bbaa2f187833b5ad05a1e2ec2c4"},{url:"js/sist_filterNsearch.js",revision:"2ca3ec18f5887f5425dd183a497eb7da"},{url:"js/sist_icondata.js",revision:"398f50ea3f8300aa81c0ee031b119dd2"},{url:"js/sist_process.js",revision:"cf21d7cdf4bf04e6612f638f42a5f490"},{url:"js/sist_window.js",revision:"e2722a1f38741dc0ee33d8487e41128c"},{url:"manifest.json",revision:"ce8a1dc20bb66651a05dd55c0e95379d"},{url:"notice.json",revision:"55c9c6c48de17ab9a3160aeb9606d8bc"},{url:"package/Chart.min.js",revision:"b5c2301eb15826bf38c9bdcaa3bbe786"},{url:"package/clusterize.css",revision:"4470105f7d5de975d70920842e36c0fe"},{url:"package/clusterize.min.js",revision:"c34c779a35d5fe5797189f9b731e12e9"},{url:"package/fastclick.js",revision:"1cd0bf8fbcefa34999e025477aeff5a4"},{url:"package/font/SpoqaHanSansBold.ttf",revision:"f6e14af67543634042408b4096fe59b2"},{url:"package/font/SpoqaHanSansBold.woff",revision:"4ad74ffe34b23dc2e4e4ab8d1e1871c5"},{url:"package/font/SpoqaHanSansBold.woff2",revision:"76b8c78aef67207eeb8113597ae6e86b"},{url:"package/font/SpoqaHanSansLight.ttf",revision:"8eaaae7e2b62cec82a2fd44de6e7971b"},{url:"package/font/SpoqaHanSansLight.woff",revision:"9e83e4227b99ea4cfd8dcf052b6c9a8b"},{url:"package/font/SpoqaHanSansLight.woff2",revision:"c41494aac6f4ad8bb82042490366c20f"},{url:"package/font/SpoqaHanSansRegular.ttf",revision:"65f1261ac163f9ea841308800fabd5fd"},{url:"package/font/SpoqaHanSansRegular.woff",revision:"5ffec7731901dc0b720f9bf1e541abef"},{url:"package/font/SpoqaHanSansRegular.woff2",revision:"544112e58f9a0c5e61938c3168e6ef50"},{url:"package/font/SpoqaHanSansThin.ttf",revision:"85741cd485c8f9d48eeb55729a4cf84b"},{url:"package/font/SpoqaHanSansThin.woff",revision:"a1a1697fa12d14eaee122f2aeed3215c"},{url:"package/font/SpoqaHanSansThin.woff2",revision:"366a745dd267f46a795e3235d6da8bb1"},{url:"package/localforage.min.js",revision:"886a9146326de8127bdc4024040769bc"},{url:"package/native-toast/native-toast.css",revision:"91ec17ec74c5df53a24dcd3b874e27a2"},{url:"package/native-toast/native-toast.min.js",revision:"19b71e9ba70c5a3f8312a07a4a657151"},{url:"package/no_ie.js",revision:"5131445b85c855c9be568f5b36990321"},{url:"package/OverlayScrollbars.min.css",revision:"64c79f4b4306d5d923cb8bc27a4fc46a"},{url:"package/OverlayScrollbars.min.js",revision:"8e15e670796ba7cd0b75df37ca61170b"},{url:"package/subtool.js",revision:"4103004898f8dfab09c55fe2e606672e"},{url:"package/sweetalert2.css",revision:"fae37b0c2723cf0052be5c64ed7cfaf6"},{url:"package/sweetalert2.min.js",revision:"87b3922204ec61b7729403723e78f536"}],{}),e.registerRoute(/\.(?:png|jpg|jpeg|svg)$/,new e.CacheFirst({cacheName:"images",plugins:[new e.ExpirationPlugin({maxAgeSeconds:864e3})]}),"GET")}));
//# sourceMappingURL=service-worker.js.map
