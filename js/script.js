import { alerta } from "./Cria_alerta/alerta.js";
let tempo;
const tabuleiro = document.querySelectorAll(".flipper");
let numCartasViradas = 0;
let cartasViradas = [];
let cronometro;
let quantidadeAcertos;
const tempoMaximoPartida = 60;
let numeroJogadas;
let jogando = false;
let progresso;
let inicioPartida = new Date(0, 0, 0, 0, 0, 0)
const start = function () {
    document.getElementById("cronometro").innerHTML = `00:00`;
    document.getElementById("jogadas").innerHTML = `0 JOGADAS`;
    jogando = true;
    tempo = 0;
    inicioPartida = new Date(0, 0, 0, 0, 0, 0);
    progresso = 0;
    numeroJogadas = 0;
    embaralhaCartas();
    for (let i = 0; i < tabuleiro.length; i++) {
        tabuleiro[i].style.transform = "rotateY(180deg)";
    }
    setTimeout(() => {
        for (let i = 0; i < tabuleiro.length; i++) {
            tabuleiro[i].style.transform = "rotateY(0deg)";
        }
        setTimeout(() => {
            for (let i = 0; i < tabuleiro.length; i++) {
                tabuleiro[i].onclick = () => {
                    viraCarta(tabuleiro[i], i);
                }
            }
            startCronometro();
        }, 100);
    }, 1000);
}
const embaralhaCartas = function () {
    const arrayBackground = ["background0", "background0", "background1", "background1", "background2", "background2", "background3", "background3",
        "background4", "background4", "background5", "background5", "background6", "background6", "background7", "background7",
        "background8", "background8", "background9", "background9"];
    for (let i = 0; i < arrayBackground.length; i++) {
        const cartaAleatoria = geraNumerosAleatorios(0, arrayBackground.length);
        [arrayBackground[i], arrayBackground[cartaAleatoria]] = [arrayBackground[cartaAleatoria], arrayBackground[i]];
    }
    for (let i = 0; i < tabuleiro.length; i++) {
        const elemento = tabuleiro[i].children[1].children[0];
        if (elemento.classList.length > 1) {
            elemento.classList.remove(elemento.classList.item("1"));
        }
        elemento.classList.add(arrayBackground[i]);
    }
}
function geraNumerosAleatorios(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
const viraCarta = function (cartaSelecionada) {
    const cor = cartaSelecionada.children[1].children[0].id;
    if (jogando) {
        numCartasViradas++;
        cartasViradas[numCartasViradas - 1] = cartaSelecionada;
        if (numCartasViradas === 1) revelaCarta(cartaSelecionada);
        else if (numCartasViradas === 2) {
            numeroJogadas++;
            document.getElementById("jogadas").innerHTML = `${numeroJogadas} JOGADAS`;
            const carta0 = cartasViradas[0].children[1].children[0];
            const carta1 = cartasViradas[1].children[1].children[0];
            revelaCarta(cartaSelecionada);
            if (carta0.id === carta1.id) { // clicou na mesma carta
                numCartasViradas--;
                return;
            }
            if (carta0.classList[1] ===
                carta1.classList[1]) { // acertou as duas cartas
                cartasViradas[0].onclick = null;
                cartasViradas[1].onclick = null;
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
        inicioPartida.setSeconds(inicioPartida.getSeconds() + 1);
        tempo++;
        document.getElementById("cronometro").innerHTML = `${inicioPartida.getMinutes().toLocaleString('pt', { minimumIntegerDigits: 2 })}:${inicioPartida.getSeconds().toLocaleString('pt', { minimumIntegerDigits: 2 })}`;
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
        tabuleiro[i].style.transform = "rotateY(0deg)";
    }
    setTimeout(start, 2000);
    document.getElementById("myBar").style.width = 0 + "%";
}
const resetCartasViradas = function (param = false) {
    setTimeout(() => {
        if (param === true) {
            ocultaCarta();
        }
        cartasViradas[0] = 0;
        cartasViradas[1] = 0;
        numCartasViradas = 0;
    }, 500);
}
const revelaCarta = function (cartaSelecionada) {
    cartaSelecionada.style.transform = "rotateY(180deg)";
}
const ocultaCarta = function () {
    cartasViradas[0].style.transform = "rotateY(0deg)";
    cartasViradas[1].style.transform = "rotateY(0deg)";
}
const fimDeJogo = function () {
    quantidadeAcertos = 0;
    for (let i = 0; i < tabuleiro.length; i++) {
        if (tabuleiro[i].onclick !== null) {
            return;
        }
        else {
            quantidadeAcertos++;
        }
    }
    if (quantidadeAcertos === tabuleiro.length) {
        stopCronometro();
        escondeMostraInputsPlacar();
    }
}
const escondeMostraInputsPlacar = function () {
    document.querySelector("#inputsPlacar").classList.toggle("hidden");
}
const registraPessoaPlacar = function (nickname) {
    const recorde = `<tr><td>${nickname.toUpperCase()}</td><td>${inicioPartida.getMinutes().toLocaleString('pt', { minimumIntegerDigits: 2 })}:${inicioPartida.getSeconds().toLocaleString('pt', { minimumIntegerDigits: 2 })}</td><td>${numeroJogadas}</td></tr>`
    guardaMemoria(recorde);
    imprimePlacar();
}
const guardaMemoria = function (recorde) {
    const memoria = localStorage.getItem("game");
    if (memoria !== null) {
        try {
            const arrayLocal = JSON.parse(memoria);
            if (typeof arrayLocal === "object" && typeof arrayLocal.length !== "undefined") {
                arrayLocal.push(recorde);
                localStorage.setItem("game", JSON.stringify(arrayLocal));
            }
            else {
                localStorage.setItem("game", JSON.stringify(new Array));
                guardaMemoria(recorde);
            }
        } catch (error) {
            localStorage.setItem("game", JSON.stringify(new Array));
            guardaMemoria(recorde);
        }
    }
    else {
        localStorage.setItem("game", JSON.stringify(new Array));
        guardaMemoria(recorde);
    }
}
const imprimePlacar = function () {
    const local = localStorage.getItem("game");
    if (local !== null) {
        try {
            const arrayLocal = JSON.parse(local);
            if (typeof arrayLocal === "object") {
                document.getElementById("placar").innerHTML = arrayLocal.join("");
            }
        } catch (error) {
            localStorage.setItem("game", JSON.stringify(new Array));
        }
    }
}
document.getElementById("btnPlacar").onclick = () => {
    const nickname = document.getElementById("nicknamePlacar").value;
    registraPessoaPlacar(nickname);
    escondeMostraInputsPlacar();
    if (quantidadeAcertos === tabuleiro.length) {
        alerta({
            mensagem: "Parabéns, você ganhou",
            valueBtn: "Tentar novamente",
            funcao: resetGame
        });
    }
}
imprimePlacar();
// escondeMostraInputsPlacar();
alerta({
    mensagem: "Comece o jogo.",
    valueBtn: "Start",
    funcao: start
});