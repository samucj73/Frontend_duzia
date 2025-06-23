self.addEventListener("push", function (event) {
  console.log("📨 Push recebido!");

  let payload = {
    title: "Previsão de Dúzia",
    body: "Confira a nova previsão!"
  };

  if (event.data) {
    try {
      const received = event.data.json();
      payload.body = `🔮 Nova previsão: ${received.duzia || received.body || "Desconhecida"}`;
    } catch (e) {
      payload.body = event.data.text();
    }
  }

  const options = {
    body: payload.body,
    icon: "/icone.png",
    badge: "/badge.png"
  };

  event.waitUntil(
    self.registration.showNotification(payload.title, options)
  );
});
