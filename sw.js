self.addEventListener("install", () => {
  console.log("✅ Service Worker instalado.");
});

self.addEventListener("activate", () => {
  console.log("✅ Service Worker ativado.");
});

self.addEventListener("push", function (event) {
  console.log("📨 Push recebido!");

  let data = { title: "Nova previsão", body: "Confira a nova previsão da dúzia!" };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: "/icone.png",
    badge: "/badge.png"
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});