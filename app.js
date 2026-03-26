if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/countryinns-pwa/service-worker.js?v=7')
    .then(() => console.log('Service Worker registered v7'))
    .catch(err => console.error(err));
}
