if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/countryinns-pwa/sw.js').then(() => {
    console.log('Service Worker registered');
  });

  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'OFFLINE') {
      showOfflineBanner();
    }
  });

  function showOfflineBanner() {
    const banner = document.createElement('div');
    banner.textContent = "You're offline – content may be stale.";
    banner.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      background: #ffcc00;
      color: #000;
      text-align: center;
      padding: 0.5em;
      font-weight: bold;
      z-index: 9999;
    `;
    document.body.appendChild(banner);
    setTimeout(() => banner.remove(), 4000);
  }
}
