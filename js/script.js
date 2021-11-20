import { alerta } from "./Alerta/alerta.js";
let tempo = new Date(0, 0, 0, 0, 0, 0);
const tabuleiro = document.querySelectorAll(".carta");
let numCartasViradas = 0;
let idCartasViradas = [];
let cronometro;
let tempoCronometro;
const start = function () {
    for (let i = 0; i < tabuleiro.length; i++) {
        document.getElementById(tabuleiro[i].id).onclick = () => { viraCarta(tabuleiro[i].id, i) };
    }
}
const embaralhaCartas = function () {
    const arrayBackground = ["background0", "background0", "background1", "background1", "background2", "background2", "background3", "background3",
        "background4", "background4", "background5", "background5", "background6", "background6", "background7", "background7",
        "background8", "background8", "background9", "background9"];
    for (let i = 0; i < arrayBackground.length; i++) {
        const cartaAleatoria = geraNumerosAleatorios(0, arrayBackground.length);
        [arrayBackground[i], arrayBackground[cartaAleatoria]] = [arrayBackground[cartaAleatoria], arrayBackground[i]];
    }
    return arrayBackground;
}
function geraNumerosAleatorios(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
const viraCarta = function (id, indexCartas) {
    numCartasViradas++;
    idCartasViradas[numCartasViradas - 1] = id;
    if (numCartasViradas === 1) revelaCartaPeloId(id, arrayCartas[indexCartas]);
    else if (numCartasViradas === 2) {
        revelaCartaPeloId(id, arrayCartas[indexCartas]);
        if (idCartasViradas[0] === idCartasViradas[1]) { // clicou na mesma carta
            numCartasViradas--;
            return;
        }
        if (document.getElementById(idCartasViradas[0]).classList[1] ===
            document.getElementById(idCartasViradas[1]).classList[1]) { // acertou as duas cartas
            fimDeJogo();
            resetCartasViradas();
        }
        else {
            resetCartasViradas(true);
        }
    }
}
const startCronometro = function () {
    const barraProgresso = document.getElementById("myBar");
    let width = 1;
    cronometro = setInterval(frame, 5);
    tempoCronometro = setInterval(()=>{tempo.setSeconds(tempo.getSeconds() + 1);}, 1000);
    function frame() {
        if (width >= 100) {
            stopCronometro();
            alerta({ mensagem: "Você perdeu", valueBtn: "restart", funcao: resetGame });
        } else {
            width += 0.001;
            barraProgresso.style.width = width + "%";
        }
    }
}
const stopCronometro = function () {
    clearInterval(cronometro);
    clearInterval(tempoCronometro);
}
const resetGame = function () {
    for (let i = 0; i < tabuleiro.length; i++) {
        const elemento = document.getElementById(tabuleiro[i].id);
        if (!elemento.classList.contains("naoVirada")) {
            elemento.removeAttribute("class");
            elemento.classList.add("carta", "naoVirada");
        }
    }
    document.getElementById("myBar").style.width = 1 + "%";
    arrayCartas = embaralhaCartas();
    startCronometro();
}
const resetCartasViradas = function (param = false) {
    setTimeout(() => {
        if (param === true) {
            ocultaCartaPeloId(idCartasViradas[0]);
            ocultaCartaPeloId(idCartasViradas[1]);
        }
        idCartasViradas[0] = 0;
        idCartasViradas[1] = 0;
        numCartasViradas = 0;
    }, 500);
}
const revelaCartaPeloId = function (id, classFundo) {
    const elemento = document.getElementById(id);
    if (elemento.classList.contains("naoVirada")) {
        elemento.classList.remove("naoVirada");
    }
    if (!elemento.classList.contains(classFundo)) {
        elemento.classList.add(classFundo);
    }
}
const ocultaCartaPeloId = function (id) {
    const elemento = document.getElementById(id);
    if (!elemento.classList.contains("naoVirada")) {
        elemento.removeAttribute("class");
        elemento.classList.add("carta", "naoVirada");
    }
}
const fimDeJogo = function () {
    let numCartasViradasVitoria = 0;
    for (let i = 0; i < tabuleiro.length; i++) {
        if (!document.getElementById(tabuleiro[i].id).classList.contains("naoVirada")) {
            numCartasViradasVitoria++;
            if (numCartasViradasVitoria === tabuleiro.length) {
                stopCronometro();
                alerta({mensagem: "Parabens, você completou em " + tempo.getMinutes() + " minutos e " + tempo.getSeconds() + " segundos." , valueBtn: "Tentar novamente", funcao: resetGame});
            }
        }
        else {
            return;
        }
    }
}
start();
let arrayCartas = embaralhaCartas();
alerta({ mensagem: "Comece o jogo", valueBtn: "Start", funcao: startCronometro });