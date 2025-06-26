
let jogando = false;
let totalAcertos = 0;

const startBtn = document.getElementById("startBtn");
const resultadoDiv = document.getElementById("resultado");
const acertosSpan = document.getElementById("acertos");

const sorteios = [
  { numero: 13, duzia: "2ª Dúzia" },
  { numero: 7, duzia: "1ª Dúzia" },
  { numero: 20, duzia: "2ª Dúzia" }
];

startBtn.onclick = () => {
  jogando = true;
  totalAcertos = 0;
  acertosSpan.textContent = "0";
  resultadoDiv.style.display = "block";
  startBtn.disabled = true;

  let i = 0;
  const intervalo = setInterval(() => {
    if (i >= sorteios.length) {
      clearInterval(intervalo);
      startBtn.disabled = false;
      startBtn.textContent = "Jogar Novamente";
      jogando = false;
      return;
    }

    const sorteio = sorteios[i];
    document.getElementById("sorteado").textContent = sorteio.numero;

    if (jogando && sorteio.duzia === "2ª Dúzia") {
      totalAcertos++;
      acertosSpan.textContent = totalAcertos;

      const sound = document.getElementById("coinSound");
      sound.currentTime = 0;
      sound.play();
    }

    i++;
  }, 2000);
};
