// -------------------------------
// 1️⃣ Service Worker Registration
// -------------------------------
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/countryinns-pwa/service-worker.js')
    .then(() => console.log('Service Worker registered'))
    .catch(err => console.error('SW registration failed:', err));

  // Listen for offline messages from SW
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'OFFLINE') {
      showOfflineBanner();
    }
  });
}

// -------------------------------
// 2️⃣ Offline Banner
// -------------------------------
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

// -------------------------------
// 3️⃣ OneSignal Push Notifications
// -------------------------------
(function initOneSignal() {
  const script = document.createElement('script');
  script.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';
  script.defer = true;
  document.head.appendChild(script);

  script.onload = () => {
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    OneSignalDeferred.push(async function(OneSignal) {
      await OneSignal.init({
        appId: "7977fb9a-37d8-477a-bf9c-43cd5634a064",
        notifyButton: { enable: true } // optional bell prompt
      });
      console.log('OneSignal initialized');
    });
  };
})();
