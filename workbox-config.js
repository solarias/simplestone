module.exports = {
  "globDirectory": "./",
  "globPatterns": [
    "**/*.{css,json,html,js,ttf,woff,woff2}"
  ],
  "swDest": "service-worker.js",

  "runtimeCaching": [{
    "urlPattern": /\.(?:png|jpg|jpeg|svg)$/,
    "handler": 'CacheFirst',
    "options": {
      "cacheName": 'images',
      "expiration": {
        "maxAgeSeconds": 10 * 24 * 60 * 60
      }
    }
  }]
};
