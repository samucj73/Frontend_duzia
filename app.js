
const DUZIA_URL = "https://roleta-backend.onrender.com/previsao-duzia";
const DUZIA_ELEMENT = document.getElementById("duzia");
let ultimaDuzia = null;

async function buscarPrevisao() {
  try {
    const response = await fetch(DUZIA_URL);
    const data = await response.json();
    const duzia = data.duzia_prevista;

    if (duzia !== null) {
      DUZIA_ELEMENT.textContent = `🔮 Dúzia prevista: ${duzia}`;
      if (duzia !== ultimaDuzia) {
        ultimaDuzia = duzia;
        enviarNotificacao(`Nova previsão: dúzia ${duzia}`);
      }
    } else {
      DUZIA_ELEMENT.textContent = "⏳ IA ainda treinando...";
    }
  } catch (err) {
    DUZIA_ELEMENT.textContent = "❌ Erro ao buscar previsão.";
  }
}

function enviarNotificacao(msg) {
  if (Notification.permission === "granted") {
    navigator.serviceWorker.getRegistration().then(reg => {
      if (reg) {
        reg.showNotification(msg);
      }
    });
  }
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}

Notification.requestPermission();

buscarPrevisao();
setInterval(buscarPrevisao, 60000); // Atualiza a cada 1 minuto
