module.exports = {
  globDirectory: './',
  globPatterns: [
    '**/*.{html,json,js,css}'
  ],
  swDest: './service-worker.js',

  runtimeCaching: [{
    urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
    handler: 'CacheFirst',
    options: {
      cacheName: 'images',
      expiration: {
        maxAgeSeconds: 10 * 24 * 60 * 60
      }
    }
  }]
};
