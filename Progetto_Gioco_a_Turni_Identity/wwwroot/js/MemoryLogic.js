// eseguo lo script al caricamento degli elementi html
document.addEventListener("DOMContentLoaded", function () {
    const audio = new Audio("/audios/nyan_cat.mp3");
    audio.play();
    // array contenente i due valori delle card da confrontare per verificare se sono la stessa card o no.
    const arrayTupla = [];
    const arrayTemp = [];
    const arrDomElem = [];
    //creo un array statico di percorsi immagine
    const arrImg = [
        "/imgs/gif1.webp",
        "/imgs/gif2.webp",
        "/imgs/gif3.webp",
        "/imgs/gif4.webp",
        "/imgs/gif5.webp",
        "/imgs/gif6.webp",
        "/imgs/gif7.webp",
        "/imgs/gif8.webp",
        "/imgs/gif9.webp",
        "/imgs/gif10.webp",
        "/imgs/gif11.webp",
        "/imgs/gif12.webp",
    ];

    // sequenza delle funzioni da chiamare.
    createModal();
    // startClock();
    const imageArray = CreateArrayImgs(arrImg);
    const arrayMischiato = shuffleArray(imageArray);
    InsertImagesIntoBoxes(arrayMischiato);
    addListenerToBoxes(arrayTupla, arrayTemp, arrDomElem);
});

// function startClock() {
//     let clock = document.getElementById("clock");
//     let id1;
//     let sec = 0;
//     let min = 0;
//     if (sec >= 10) {
//         clearInterval(id1);
//         setInterval(() => {
//             sec++;
//             clock.innerHTML = `0${min}:${sec}`;
//         }, 1000);
//         return;
//     }
//     id1 = setInterval(() => {
//         sec++;
//         clock.innerHTML = `0${min}:0${sec}`;
//     }, 1000);
// }

// creo un array di immagini
function CreateArrayImgs(arrImg) {
    const arr = [];
    arrImg.forEach((path, i) => {
        let imageElem1 = document.createElement("img");
        let imageElem2 = document.createElement("img");

        imageElem1.src = path;
        imageElem1.alt = `immagine${i}`;
        imageElem1.classList.add("imgStyle");
        imageElem1.classList.add("invisible");

        imageElem2.src = path;
        imageElem2.alt = `immagine${i}`;
        imageElem2.classList.add("imgStyle");
        imageElem2.classList.add("invisible");

        arr.push(imageElem1);
        arr.push(imageElem2);
    });
    return arr;
}

// prendo l'array e mischio gli elementi al suo interno
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// inserisco le immagini all'interno dei .box
function InsertImagesIntoBoxes(arrayImgs) {
    // const arrayMischiato = shuffleArray(arrayImgs);

    let allBoxes = document.querySelectorAll(".box");
    allBoxes.forEach((box, i) => {
        box.appendChild(arrayImgs[i]);
    });
}

// aggiungo gli event listener ai .box contenenti le immagini
function addListenerToBoxes(arrayTupla, arrayTemp, arrDomElem) {
    let allBoxes = document.querySelectorAll(".box");
    allBoxes.forEach((box, i) => {
        box.classList.add("pointer");

        // --- EVENTO CLICK DELLA CARD --- GESTISCI CORRETTAMENTE LA CRONOLOGIA DI EVENTI
        box.addEventListener("click", (e) => {
            console.log("click");
            DoStuff(e, box, arrayTupla, arrayTemp, arrDomElem);
        });
    });
}

function DoStuff(e, box, arrayTupla, arrayTemp, arrDomElem) {
    const card = flippaCard(e);

    if (card) {
        // pusho l'elemento html trovato in questo array degli elementi html
        arrDomElem.push(card);
        console.log(card);
        console.log(arrDomElem);
    }
    const alt = mostraImage(card);

    if (arrayTupla.length < 2) {
        arrayTupla.push(alt);
        console.log(arrayTupla);
    }

    if (arrayTupla.length === 2) {
        controlloEsito(arrayTupla, arrDomElem);
    }
}

function flippaCard(e) {
    const box = e.currentTarget;
    box.classList.add("flip");
    return box;
}

function mostraImage(card) {
    const image = card.querySelector("img");
    image ? image.classList.remove("invisible") : console.error("immagine da mostrare non trovata");

    if (!image.classList.contains("invisible")) {
        console.log("classe invisible tolta con successo");
    }

    return image.alt;
}

function controlloEsito(arrayTupla, arrDomElem) {
    const [first, second] = arrayTupla;
    if (first === second) {
        console.log("hai trovato le due card uguali.");
        showModal();
        unShowModal();
        resetArray(arrayTupla);
        resetArray(arrDomElem);
        return;
    }

    if (first !== second) {
        console.log("non hai trovato le due card uguali.");
        setTimeout(() => {
            resetCard(arrDomElem);
            resetArray(arrayTupla);
            resetArray(arrDomElem);
        }, 800);
    }
}

function resetArray(array) {
    array.length = 0;
}

function resetCard(arrDomElem) {
    arrDomElem.forEach((domElem) => {
        domElem.classList.remove("flip");
        const card = domElem.querySelector("img");
        card.classList.add("invisible");
    });
}

function createModal() {
    const modal = document.createElement("div");
    modal.id = "modal";
    modal.classList.add("modalStyle", "d-none");
    modal.innerHTML = "GOOD :)";

    document.body.appendChild(modal);
    console.log("modale creato");
}

function showModal() {
    let modal = document.getElementById("modal");
    if (modal) {
        modal.classList.remove("d-none");
    }
}

function unShowModal() {
    let modal = document.getElementById("modal");
    setTimeout(() => {
        modal.classList.add("d-none");
    }, 1500);
}
