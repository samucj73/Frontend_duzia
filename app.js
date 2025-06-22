const DUZIA_URL = "https://roleta-backend.onrender.com/previsao-duzia";
const DUZIA_ELEMENT = document.getElementById("duzia");
let ultimaDuzia = null;

const VAPID_PUBLIC_KEY = "BMLWcXFiI-MBDtb71z33MzL-vAJ9K-1mF2m7kRQz7g1G_vTr7IzpIhZ8LDZLCfMDe7vnxjwFbyXkWqDy1tKqkHsY";

async function iniciarNotificacoes() {
  if ("serviceWorker" in navigator && "PushManager" in window) {
    const registration = await navigator.serviceWorker.register("/sw.js");
    console.log("✅ Service Worker registrado:", registration);

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });

      await fetch("https://roleta-backend.onrender.com/api/salvar-inscricao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription)
      });

      console.log("📬 Inscrição enviada ao backend.");
    }
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function buscarPrevisao() {
  try {
    const response = await fetch(DUZIA_URL);
    const data = await response.json();
    const duzia = data.duzia_prevista;

    if (duzia !== null) {
      DUZIA_ELEMENT.textContent = `🔮 Dúzia prevista: ${duzia}`;
      if (duzia !== ultimaDuzia) {
        ultimaDuzia = duzia;
        console.log("📢 Nova previsão detectada:", duzia);
      }
    } else {
      DUZIA_ELEMENT.textContent = "⏳ IA ainda treinando...";
    }
  } catch (err) {
    DUZIA_ELEMENT.textContent = "❌ Erro ao buscar previsão.";
  }
}

iniciarNotificacoes();
buscarPrevisao();
setInterval(buscarPrevisao, 60000);