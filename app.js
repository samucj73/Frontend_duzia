const API_BASE = "https://roleta-backend.onrender.com";
const VAPID_PUBLIC_KEY = "BGO8ScfswYI69ck8pCErweZVXygY6_pKvmxMB09nh0hW_oO-h3eZhxlMs3PMzAvdftvqTCe47do9AcvnWUJavMw";

let ultimaData = null;
let duziaPrevista = null;
let acertos = 0;

const duziaMap = {
  0: "🎯 Zero",
  1: "1ª Dúzia (1–12)",
  2: "2ª Dúzia (13–24)",
  3: "3ª Dúzia (25–36)"
};

function getDuzia(numero) {
  if (numero === 0) return 0;
  if (numero >= 1 && numero <= 12) return 1;
  if (numero >= 13 && numero <= 24) return 2;
  if (numero >= 25 && numero <= 36) return 3;
  return null;
}

function formatarData(isoString) {
  const d = new Date(isoString);
  return d.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
}

async function carregarPrevisao() {
  try {
    const res = await fetch(`${API_BASE}/previsao-duzia`);
    const data = await res.json();
    duziaPrevista = data.duzia_prevista;
    document.getElementById("previsao").textContent = `🔮 Previsão da IA: ${duziaMap[duziaPrevista]}`;
  } catch (e) {
    console.error("Erro ao carregar previsão:", e);
    document.getElementById("previsao").textContent = "⚠️ Erro ao carregar previsão.";
  }
}

async function carregarUltimoResultado() {
  try {
    const res = await fetch(`${API_BASE}/ver-historico`);
    const data = await res.json();
    const historico = data.historico || [];

    if (historico.length === 0) return;

    const ultimo = historico[historico.length - 1];
    if (ultimo.timestamp === ultimaData) return; // nada novo

    ultimaData = ultimo.timestamp;

    const duziaResultado = getDuzia(ultimo.number);
    const acertou = duziaPrevista !== null && duziaResultado === duziaPrevista;

    if (acertou) {
      acertos++;
      document.getElementById("acertos").textContent = `✅ Você acertou! Total: ${acertos}`;
    } else {
      document.getElementById("acertos").textContent = `❌ Último resultado não corresponde à previsão.`;
    }

    document.getElementById("resultado").innerHTML = `
      🎲 Número sorteado: <strong>${ultimo.number}</strong><br>
      🧠 Dúzia: <strong>${duziaMap[duziaResultado]}</strong><br>
      🎨 Cor: <strong>${ultimo.color || "Desconhecida"}</strong><br>
      🕒 Horário: <strong>${formatarData(ultimo.timestamp)}</strong>
    `;
  } catch (e) {
    console.error("Erro ao carregar resultado:", e);
  }
}

async function initPush() {
  if (!('serviceWorker' in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.register("/service-worker.js");
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    });

    await fetch(`${API_BASE}/api/salvar-inscricao`, {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: { "Content-Type": "application/json" }
    });

    console.log("✅ Push registrado.");
  } catch (err) {
    console.error("[PUSH] Erro:", err);
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

document.addEventListener("DOMContentLoaded", async () => {
  await carregarPrevisao();
  await carregarUltimoResultado();
  setInterval(carregarUltimoResultado, 5000);
  await initPush();
});