const VAPID_PUBLIC_KEY = 'BGO8ScfswYI69ck8pCErweZVXygY6_pKvmxMB09nh0hW_oO-h3eZhxlMs3PMzAvdftvqTCe47do9AcvnWUJavMw';

// Converte a chave VAPID para formato correto
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

// Registra o service worker e inscreve o push
async function initPush() {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Workers não são suportados neste navegador.');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js');
    console.log('[SW] Registrado:', registration);

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('Permissão de notificação negada.');
      return;
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    });

    console.log('[PUSH] Inscrição feita:', subscription);

    // Envia para backend
    const res = await fetch('https://SEU_BACKEND/api/salvar-inscricao', {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (res.ok) {
      console.log('[PUSH] Inscrição enviada com sucesso para o backend.');
    } else {
      console.error('[PUSH] Falha ao enviar inscrição:', await res.text());
    }
  } catch (err) {
    console.error('[ERRO] push:', err);
  }
}

// Inicializa
initPush();
