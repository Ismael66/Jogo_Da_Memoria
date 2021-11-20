const tabuleiro = document.querySelectorAll(".carta");
let numCartasViradas = 0;
let idCartasViradas = [];
const start = function () {
    for (let i = 0; i < tabuleiro.length; i++) {
        document.getElementById(tabuleiro[i].id).onclick = () => { viraCarta(tabuleiro[i].id, i) };
    }
}
const embaralhaCartas = function () {
    const array = ["background0", "background0", "background1", "background1", "background2", "background2", "background3", "background3",
        "background4", "background4", "background5", "background5", "background6", "background6", "background7", "background7",
        "background8", "background8", "background9", "background9"];
    for (let i = 0; i < array.length; i++) {
        const cartaAleatoria = geraNumerosAleatorios(0, array.length);
        [array[i], array[cartaAleatoria]] = [array[cartaAleatoria], array[i]];
    }
    return array;
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
            if (numCartasViradasVitoria === tabuleiro.length) alert("parabens");
        }
        else {
            return;
        }
    }
}
start();
const arrayCartas = embaralhaCartas();