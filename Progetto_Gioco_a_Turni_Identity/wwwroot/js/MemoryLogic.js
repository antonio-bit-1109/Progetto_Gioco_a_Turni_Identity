// dichiaro globale id del setInterval
// per bloccarlo una volta vinto la partita. 
let id;

document.addEventListener("DOMContentLoaded", function () {

    //array contenente i due file audio da riprodurre
    const audioFiles = ["/audios/nyan_cat.mp3", "/audios/oYEah.mp3"]
    let currentIndex = 0;
    let isFlipped = [];

    //oggetto che conterrà i riferimento alle carte gemelle 
/*    let twinCards = {}*/

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
    startClock();
    const imageArray = CreateArrayImgs(arrImg);
    const arrayMischiato = shuffleArray(imageArray);
    InsertImagesIntoBoxes(arrayMischiato);
    addListenerToBoxes(arrayTupla, arrayTemp, arrDomElem, isFlipped);
    startMusic(audioFiles, currentIndex)

});

function startMusic(audioFiles, currentIndex) {

    const audio = new Audio(audioFiles[currentIndex]);
    audio.play();
}

function AllCArdFlipped(isFlipped) {

    const cards = document.querySelectorAll(".box");
    let esito = true;
    cards.forEach(card => {
        if (!card.classList.contains("flip")) {
            esito = false;
        }
    })

    if (esito) {
       /* YouWon();*/
        clearInterval(id);
        showModalFinalTime()
        sendVictory();
    }
    console.log("non tutti i box sono girati")
}

async function sendVictory() {
    const protocol = window.location.protocol;
    const host = window.location.hostname;
    const port = window.location.port;

    let now = Date.now();
    let tempoCompletamento = document.getElementById("clock").innerHTML;
    // invia dati partita vinta al server
    const sendData = fetch(`${protocol}//${host}:${port}/User/DataPartiteUser`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify( { tempoCompletamento: tempoCompletamento, oraComplet: now , game:"Memory" })
    })
    
}

//const protocol = window.location.protocol;
//const host = window.location.hostname;
//const port = window.location.port;

//console.log(protocol,host,port)

function showModalFinalTime() {
  
    const modal = document.getElementById("modal");
    const clock = document.getElementById("clock");
    modal.classList.remove("modalStyle");
    modal.classList.add("modalStyleFinal");

    if (!modal) {
        console.log("non trovo il modale per mostrare il messaggio di vittoria."); 
    }
    modal.innerHTML = `HAI VINTO COMPLIMENTI!<br> Hai completato la sfida in: ${clock.innerHTML}`;
    modal.classList.remove("d-none");

}

function startClock() {
    const clock = document.getElementById("clock");

    incrementLogic(clock)
}

function incrementLogic(clock) {
    let secDx = 0;
    let secSn = 0;
    let minDx = 0;
    let minSn = 0;

    id =  setInterval(() => {
        secDx++;
        if (secDx > 9) {
            secSn++;
            secDx = 0;
        }

        if (secSn > 5) {
            secSn = 0
            secDx = 0
            minDx++
        }

        if (minDx > 9) {
            minSn = 5
            minDx = 9
            secSn = 5
            secDx = 9
        }

        clock.innerHTML = `${minSn}${minDx}:${secSn}${secDx}`

    }, 1000)
}

// creo un array di immagini
function CreateArrayImgs(arrImg) {
    const arr = [];
    arrImg.forEach((path, i) => {
        let imageElem1 = document.createElement("img");
        let imageElem2 = document.createElement("img");

        imageElem1.src = path;
        imageElem1.alt = `immagine${ i }`;
        imageElem1.classList.add("imgStyle");
        imageElem1.classList.add("invisible");

        imageElem2.src = path;
        imageElem2.alt = `immagine${ i }`;
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
function addListenerToBoxes(arrayTupla, arrayTemp, arrDomElem, isFlipped) {
    let allBoxes = document.querySelectorAll(".box");

    // Definisci handleClick una sola volta
    function handleClick(e) {
        const box = e.currentTarget; // Ottieni la carta corrente

        // Controlla se la carta è già girata
        if (box.classList.contains("flip")) {
            console.log("Carta già girata, nessuna azione.");
            return; // Se la carta è già girata, esci dalla funzione
        }

        console.log("click");
        DoStuff(e, box, arrayTupla, arrayTemp, arrDomElem);
        AllCArdFlipped(isFlipped);
    }

    // Ciclo su tutte le carte e aggiungo il listener
    allBoxes.forEach((box, i) => {
        box.classList.add("pointer");

        // Aggiungi il listener senza ridefinire handleClick
        box.addEventListener("click", handleClick);
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

        const cards = document.querySelectorAll(".box");
        let allFlipped = false;
        cards.forEach(card => {
            if (card.classList.contains("flip")) {
                esito = true;
            }

            if (!card.classList.contains("flip")) {
                esito = false;
            }
        })

           if (allFlipped === false) {
              showModal();
              unShowModal();
           }
/*        if (!allFlipped) {*/

/*        }*/

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