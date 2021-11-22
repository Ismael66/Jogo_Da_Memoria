import { alerta } from "./Cria_alerta/alerta.js";
let tempo;
const tabuleiro = document.querySelectorAll(".carta");
let numCartasViradas = 0;
let idCartasViradas = [];
let cronometro;
const tempoMaximoPartida = 60;
let numeroJogadas;
let jogando = false;
let progresso;
let arrayCartas;
let inicioPartida;
const start = function () {
    jogando = true;
    tempo = 0;
    inicioPartida = new Date();
    progresso = 0; 
    numeroJogadas = 0;
    arrayCartas = embaralhaCartas();
    startCronometro();
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
    if (jogando) {
        numCartasViradas++;
        idCartasViradas[numCartasViradas - 1] = id;
        if (numCartasViradas === 1) revelaCartaPeloId(id, arrayCartas[indexCartas]);
        else if (numCartasViradas === 2) {
            numeroJogadas++;
            const carta0 = document.getElementById(idCartasViradas[0]);
            const carta1 = document.getElementById(idCartasViradas[1]);
            revelaCartaPeloId(id, arrayCartas[indexCartas]);
            if (idCartasViradas[0] === idCartasViradas[1]) { // clicou na mesma carta
                numCartasViradas--;
                return;
            }
            if (carta0.classList[1] ===
                carta1.classList[1]) { // acertou as duas cartas
                carta0.onclick = () => { };
                carta1.onclick = () => { };
                resetCartasViradas();
                fimDeJogo();
            }
            else {
                resetCartasViradas(true);
            }
        }
    }
}
const startCronometro = function () {
    const barraProgresso = document.getElementById("myBar");
    barraProgresso.style.backgroundColor = "green";
    cronometro = setInterval(() => {
        controlaBarraProgresso();
        tempo++;
    }, 1000);
}
const controlaBarraProgresso = function () {
    const barraProgresso = document.getElementById("myBar");
    if (tempo >= tempoMaximoPartida) {
        stopCronometro();
        jogando = false;
        alerta({
            mensagem: "Você perdeu",
            valueBtn: "restart",
            funcao: resetGame
        });
        return;
    }
    else if (tempo >= (tempoMaximoPartida * 0.8)) {
        barraProgresso.style.backgroundColor = "red";
    }
    else if (tempo >= (tempoMaximoPartida * 0.5)) {
        barraProgresso.style.backgroundColor = "yellow";
    }
    progresso += (100 / tempoMaximoPartida);
    barraProgresso.style.width = progresso + "%";
}
const stopCronometro = function () {
    clearInterval(cronometro);
}
const resetGame = function () {
    for (let i = 0; i < tabuleiro.length; i++) {
        const elemento = document.getElementById(tabuleiro[i].id);
        if (!elemento.classList.contains("naoVirada")) {
            elemento.removeAttribute("class");
            elemento.classList.add("carta", "naoVirada");
        }
    }
    document.getElementById("myBar").style.width = 0 + "%";
    start();
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
    const elemento = document.getElementById(id)
    if (!elemento.classList.contains("naoVirada")) {
        elemento.removeAttribute("class");
        elemento.classList.add("carta", "naoVirada");
    }
}
const fimDeJogo = function () {
    let quantidadeAcertos = 0;
    for (let i = 0; i < tabuleiro.length; i++) {
        if (document.getElementById(tabuleiro[i].id).classList.contains("naoVirada")) {
            return;
        }
        else{
            quantidadeAcertos++;
        }
    }
    if (quantidadeAcertos === tabuleiro.length) {
        const tempoPartida = new Date().getTime() - inicioPartida.getTime();
        const msg = `Parabéns, você completou em ${Math.floor((tempoPartida / 60000))}:${Math.floor(tempoPartida / 1000)},
        com ${numeroJogadas} tentativas.`
        stopCronometro();
        alerta({
            mensagem: msg,
            valueBtn: "Tentar novamente",
            funcao: resetGame
        });
    }
}
alerta({
    mensagem: "Comece o jogo.",
    valueBtn: "Start",
    funcao: start
});