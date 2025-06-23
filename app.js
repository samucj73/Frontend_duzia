// Verifica suporte a Service Worker e Push API
if ('serviceWorker' in navigator && 'PushManager' in window) {
  navigator.serviceWorker.register('service-worker.js')
    .then(registration => {
      console.log('Service Worker registrado:', registration);

      // Solicita permissão para notificações
      return Notification.requestPermission();
    })
    .then(permission => {
      if (permission !== 'granted') {
        throw new Error('Permissão para notificações negada');
      }
      // Aguarda o service worker estar pronto
      return navigator.serviceWorker.ready;
    })
    .then(registration => {
      // Sua chave pública VAPID (exemplo - gere a sua!)
      const vapidPublicKey = 'SUA_CHAVE_PUBLICA_VAPID_AQUI';

      // Converte a chave para Uint8Array
      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

      // Inscreve o usuário no Push
      return registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey
      });
    })
    .then(subscription => {
      console.log('Usuário inscrito no push:', subscription);

      // TODO: envie 'subscription' para seu backend para salvar e usar no envio de notificações push
    })
    .catch(err => {
      console.error('Erro no registro de push:', err);
    });
} else {
  console.warn('Push messaging não suportado neste navegador');
}

// Função para converter chave VAPID
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
