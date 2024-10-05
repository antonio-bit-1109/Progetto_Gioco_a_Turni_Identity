import { Frost_Demon } from "./Frost_demon";
import { Sayan } from "./Sayan";
import { canzone } from "./canzone";
import { combattente } from "./combattente";
import { cyborg } from "./cyborg";
import { pozione } from "./pozione";
import { sfondoFetch } from "./fetches/sfondoFetch";
import { Guerriero } from "./interfacesTS/interfaces";
import VolumeUp from "../public/svgs/volume-up-fill.svg";
import VolumeMute from "../public/svgs/volume-mute-fill.svg";
import { Majin } from "./Majin";

const pozioneVita_sm = new pozione(20, "pozioneVita_sm");
const pozioneVita_md = new pozione(50, "pozioneVita_md");
const pozioneVita_lg = new pozione(80, "pozioneVita_lg");

const pozioneDifesa_sm = new pozione(30, "pozioneDifesa_sm");
const pozioneDifesa_md = new pozione(35, "pozioneDifesa_md");
const pozioneDifesa_lg = new pozione(40, "pozioneDifesa_lg");

const pozioneAttacco_sm = new pozione(25, "pozioneAttacco_sm");
const pozioneAttacco_md = new pozione(35, "pozioneAttacco_md");
const pozioneAttacco_lg = new pozione(40, "pozioneAttacco_lg");

const pozionePrecisione_sm = new pozione(30, "pozionePrecisione_sm");
const pozionePrecisione_md = new pozione(60, "pozionePrecisione_md");
const pozionePrecisione_lg = new pozione(90, "pozionePrecisione_lg");

export const ArrayItemIniziale: pozione[] = [];

ArrayItemIniziale.push(
    pozioneVita_sm,
    pozioneVita_md,
    pozioneVita_lg,
    pozioneDifesa_sm,
    pozioneDifesa_md,
    pozioneDifesa_lg,
    pozioneAttacco_sm,
    pozioneAttacco_md,
    pozioneAttacco_lg,
    pozionePrecisione_sm,
    pozionePrecisione_md,
    pozionePrecisione_lg
);

const Goku = new Sayan(
    "Goku",
    20,
    45,
    5,
    0,
    35,
    100,
    "saiyan",
    "calmo",
    "fronte",
    89,
    "goku.webp", // goku base
    "goku_super_gif.webp", //goku super sayan if
    "kamehameha_goku_gif.gif" //kamehameha gif
);
const Vegeta = new Sayan(
    "Vegeta",
    20,
    38,
    5,
    0,
    40,
    100,
    "saiyan",
    "irascibile",
    "braccio sinistro",
    92,
    "vegeta.png", //vegeta foto base
    "vegeta_super_gif.gif", // gif vegeta suepr sayan
    "final_flash_gif.gif" // gif final flash
);
const Freezer = new Frost_Demon(
    "Freezer",
    22,
    35,
    5,
    2,
    20,
    100,
    "Frost Demon",
    "irascibile",
    "coda",
    90,
    "freezer.jpg", // foto base
    "super_freezer_gif.gif", // gif super freezer
    "frieza_final_attack.gif" // gif attacco finale
);
const Cell = new cyborg(
    "Cell",
    25,
    30,
    5,
    1,
    28,
    100,
    "cyborg",
    "esuberante",
    "stomaco",
    91,
    "cell_2_form.webp", // cell base
    "cell_final_transformation_gif.gif", // cell final form gif
    "cell_super_kamehameha.gif" // cell superkamehameha gif
);
const SuperBuu = new Majin(
    "Super-Buu",
    15,
    30,
    5,
    0,
    44,
    100,
    "Majin",
    "furioso",
    "fianco destro",
    75,
    "super-Buu.jpg", // forma base
    "super_buu_absorb_gotenks.gif", //gif trasformazione
    "super_buu_(gotenks)_mankuoseppo.gif" //gif cannonne speciale
);
//
//
export const appElement = document.getElementById("app");

// ricavo dal localStorage eventuale immagine salvata come sfondo

const ArrayPersonaggi: Guerriero[] = [];
ArrayPersonaggi.push(Goku, Vegeta, Freezer, Cell, SuperBuu);

const h1 = document.createElement("h1");
const h3 = document.createElement("h3");
const customModal = document.createElement("div");
let PlayersDiv = document.createElement("div");
customModal.classList.add("styleCustomModal");

// let personaggioUtente: any | combattente = null;
// let personaggioComputer: any | combattente = null;

// array contenente i due personaggi che combatteranno
let ArrayScontroPersonaggi: Guerriero[] = [];

let startMatch = false;
const divGiocatore = document.createElement("section");
divGiocatore.classList.add("divPlayer1");
divGiocatore.id = "player1";

//
const divOpponent = document.createElement("section");
divOpponent.classList.add("divPlayer2");
divOpponent.id = "player2";
//
export const statusBattle = document.createElement("div");
statusBattle.classList.add("statusDivStyle", "fs-1", "text-center", "fw-bolder", "d-flex", "align-items-start");

let WhoIsturn: number = 1;

// creazione input group sfruttando classi bootstrap

//div contenitore
const inputGroup = document.createElement("div");
inputGroup.classList.add("input-group", "m-auto", "w-50");
// input element
const input = document.createElement("input");
input.type = "text";
input.placeholder = "Choose the map for the fight.";
input.classList.add("form-control");
input.setAttribute("aria-label", "input to choose the background");
// button element
const buttonRequestFetch = document.createElement("button");
buttonRequestFetch.classList.add("btn", "btn-outline-warning");
buttonRequestFetch.innerText = "Cambia Sfondo";
buttonRequestFetch.type = "button";
buttonRequestFetch.id = "buttonSearch";
//append children
inputGroup.append(input);
inputGroup.append(buttonRequestFetch);
//
//------------------------- ELEMENTI GLOBALI SOPRA ---------------------------------------------------------
//
//

document.addEventListener("DOMContentLoaded", () => {
    if (appElement) {
        appElement.classList.add("appElementStyle");
        start();
        chooseYourCharacter();
        appElement?.append(statusBattle);
    }
});

const start = () => {
    appElement?.append(h1);
    appElement?.append(h3);
    appElement?.append(inputGroup);
    // cambio dello sfondo chiamando API di pexels
    buttonRequestFetch.addEventListener("click", () => {
        sfondoFetch(input.value);
    });
    h1.innerHTML = "Benvenuto Al fighters-Z Game.";
    h3.innerHTML = "Scegli il tuo Figther.";
    h1.classList.add("stileh1");
    h3.classList.add("stileh3");
};

const chooseYourCharacter = () => {
    PlayersDiv.classList.add("text-center");

    for (let i = 0; i < ArrayPersonaggi.length; i++) {
        let wrapper = document.createElement("section");
        wrapper.classList.add(
            "bg-white",
            "d-inline-block",
            "text-center",
            "m-3",
            "rounded-5",
            "p-3",
            "hoverAnimation",
            "larghezza"
        );

        const buttonChooseCharacter = document.createElement("button");
        buttonChooseCharacter.classList.add("btn", "btn-transparent");
        buttonChooseCharacter.append(wrapper);
        // button.innerHTML = "Scegli Personaggio";
        // button.classList.add("my-3");

        let charImage = document.createElement("img");
        charImage.src = `/imgs/${ArrayPersonaggi[i].image}`;
        charImage.classList.add("imgDimension0");
        wrapper.append(charImage);

        let textWrapper = document.createElement("div");

        let nome = document.createElement("h5");
        nome.innerHTML = `${ArrayPersonaggi[i].nome}`;
        nome.classList.add("text-dark", "fs-1");
        textWrapper.append(nome);

        let pv = document.createElement("p");
        pv.innerHTML = ` PV : ${ArrayPersonaggi[i].pv}`;
        pv.classList.add("text-dark");
        textWrapper.append(pv);

        let difesa = document.createElement("p");
        difesa.innerHTML = ` DEF : ${ArrayPersonaggi[i].difesa}`;
        difesa.classList.add("text-dark");
        textWrapper.append(difesa);

        let lv = document.createElement("p");
        lv.innerHTML = ` LVL : ${ArrayPersonaggi[i].livello}`;
        lv.classList.add("text-dark");
        textWrapper.append(lv);

        let forza = document.createElement("p");
        forza.innerHTML = ` ATK : ${ArrayPersonaggi[i].forza}`;
        forza.classList.add("text-dark");
        textWrapper.append(forza);

        let agilita = document.createElement("p");
        agilita.innerHTML = ` DEX : ${ArrayPersonaggi[i].agilita}`;
        agilita.classList.add("text-dark");
        textWrapper.append(agilita);

        let precisione = document.createElement("p");
        precisione.innerHTML = ` AIM : ${ArrayPersonaggi[i].precisione}`;
        precisione.classList.add("text-dark");
        textWrapper.append(precisione);

        let puntoCritico = document.createElement("p");
        puntoCritico.innerHTML = ` WEAKNESS : ${ArrayPersonaggi[i].puntoCritico}`;
        puntoCritico.classList.add("text-dark");

        textWrapper.append(puntoCritico);

        let razza = document.createElement("p");
        razza.innerHTML = ` RACE : ${ArrayPersonaggi[i].razza}`;
        razza.classList.add("text-dark");

        textWrapper.append(razza);

        let inventario = document.createElement("div");
        inventario.innerHTML = ` Inventario : ${ArrayPersonaggi[i].inventario.map(
            (item) => `${item.nome} <br> +${item.valore}`
        )}`;
        inventario.classList.add("text-dark");

        buttonChooseCharacter.addEventListener(
            "click",
            ((character) => {
                return () => {
                    //scelgo il mio personaggio
                    PersonaggioScelto(character);
                    //rimuovo il personaggio che ho scelto dall array globale dei personaggi.
                    TogliPersonaggioSceltoArray(character);
                    //scelgo player opponent
                    OpponentPLayer(ArrayPersonaggi);
                };
            })(ArrayPersonaggi[i])
        );

        textWrapper.append(inventario);
        wrapper.append(textWrapper);
        // wrapper.append(button);
        PlayersDiv.append(buttonChooseCharacter);
    }
    appElement?.append(PlayersDiv);
};

//  cerco il personaggio che il primo utente ha scelto e lo rimuovo dall'array su cui poi il computer sceglierà l'avversario ( no stessi personaggi combattono tra loro)
const TogliPersonaggioSceltoArray = (personaggioScelto: Guerriero) => {
    const filteredArray = ArrayPersonaggi.filter((personaggio) => personaggio.nome !== personaggioScelto.nome);
    ArrayPersonaggi.splice(0, ArrayPersonaggi.length, ...filteredArray);
    console.log(ArrayPersonaggi);
};

const PersonaggioScelto = function (character: Guerriero) {
    const buttonStartMatch = document.createElement("button");
    buttonStartMatch.innerHTML = "Start Match";
    buttonStartMatch.classList.add("btnStartMatch_Style", "py-2", "fs-1");

    buttonStartMatch.addEventListener("click", () => {
        customModal.classList.add("d-none");
        customModal.classList.remove("display-1", "text-warning", "fw-bolder", "d-flex", "flex-column", "gap-3");
        customModal.innerHTML = "";
        // sistemo il DOM e lo inizializzo con i due personaggi scelti
        startMatch = true;
        // startMatch && DamoseLeBotte(personaggioUtente, personaggioComputer);
        startMatch && DamoseLeBotte(ArrayScontroPersonaggi);
    });

    customModal.innerHTML = `Hai scelto ${character.nome}`;
    customModal.classList.add("display-1", "text-warning", "fw-bolder", "d-flex", "flex-column", "gap-3");
    customModal.append(buttonStartMatch);
    appElement?.append(customModal);
    // personaggioUtente = character;
    ArrayScontroPersonaggi.push(character);
    // console.log(personaggioUtente);
};

// scelta dell'avversario basato su un numero random usato come indice casuale per trovare avversario
const OpponentPLayer = (array: Guerriero[]) => {
    let randomNum = Math.floor(Math.random() * array.length);
    let avversario: combattente = array[randomNum];
    ArrayScontroPersonaggi.push(avversario);
    // personaggioComputer = avversario;
    // console.log(personaggioComputer);
    console.log(ArrayScontroPersonaggi);
};

// creo i div contenenti info dei due personaggi e attacco event listeners che richiamano i metodi necessari per il combattimento
const DamoseLeBotte = (arraycombattenti: Guerriero[]) => {
    // creo dei bottoni per gestire l'audio del lettore musicale.
    const btnWrapperImageVolumeOn = document.createElement("button");
    btnWrapperImageVolumeOn.classList.add("btn", "btn-transparent");
    const ImageVolumeUp = document.createElement("img");
    ImageVolumeUp.src = `${VolumeUp}`;

    btnWrapperImageVolumeOn.append(ImageVolumeUp);
    btnWrapperImageVolumeOn.addEventListener("click", () => {
        muteMusic();
        btnWrapperImageVolumeOn.remove();
        appElement?.prepend(btnWrapperImageVolumeOff);
    });

    const btnWrapperImageVolumeOff = document.createElement("button");
    btnWrapperImageVolumeOff.classList.add("btn", "btn-transparent");
    const ImageVolumeMute = document.createElement("img");

    ImageVolumeMute.src = `${VolumeMute}`;
    btnWrapperImageVolumeOff.append(ImageVolumeMute);
    btnWrapperImageVolumeOff.addEventListener("click", () => {
        PlayMusic();
        btnWrapperImageVolumeOff.remove();
        appElement?.prepend(btnWrapperImageVolumeOn);
    });

    h1.innerHTML = ` Combattimento tra ${arraycombattenti[0].nome} e ${arraycombattenti[1].nome}`;
    h3.innerHTML = "";
    PlayersDiv.innerHTML = "";
    PlayersDiv.classList.add("d-flex", "gap-4");
    PlayersDiv.append(divGiocatore);
    divGiocatore.classList.add("w-50");
    PlayersDiv.append(divOpponent);
    divOpponent.classList.add("w-50");
    inputGroup.classList.add("d-none");

    RiproduzioneMusica();
    appElement?.prepend(btnWrapperImageVolumeOn);

    for (let i = 0; i < 2; i++) {
        // Creazione del div esterno per la progress bar
        const progressDiv = document.createElement("div");
        progressDiv.classList.add("progress");

        // Creazione del div interno per la barra di progresso
        const progressBar = document.createElement("div");
        progressBar.classList.add("progress-bar", "progress-bar-striped", "progress-bar-animated", "bg-success");
        progressBar.setAttribute("role", "progressbar");

        let vitaPlayer;
        if (i === 0) {
            vitaPlayer = arraycombattenti[0].pv;
            progressBar.style.width = `${vitaPlayer}%`;
        } else {
            vitaPlayer = arraycombattenti[1].pv;
            progressBar.style.width = `${vitaPlayer}%`;
        }

        progressBar.setAttribute("aria-valuenow", `${vitaPlayer.toString()}`);
        progressBar.setAttribute("aria-valuemin", "0");
        progressBar.setAttribute("aria-valuemax", "100");

        // Aggiunta della barra di progresso al div esterno
        progressDiv.appendChild(progressBar);

        if (i === 0) {
            divGiocatore.append(progressDiv);
            populateDiv(arraycombattenti[0], divGiocatore, arraycombattenti[1]);
            setInterval(() => aggiornaProgressBar(arraycombattenti[0], progressBar, divGiocatore), 500); // Aggiorna ogni 1 secondo
        } else {
            divOpponent.append(progressDiv);
            populateDiv(arraycombattenti[1], divOpponent, arraycombattenti[0]);
            setInterval(() => aggiornaProgressBar(arraycombattenti[1], progressBar, divOpponent), 500); // Aggiorna ogni 1 secondo
        }
    }
};

function aggiornaProgressBar(
    playerDanneggiato: Guerriero,
    progressBar: HTMLElement,
    divGiocatoreSconfitto: HTMLElement
) {
    let vitaAttuale = playerDanneggiato.pv;

    if (vitaAttuale > 50) {
        progressBar.style.width = `${vitaAttuale}%`;
        progressBar.classList.add("bg-success");
        progressBar.classList.remove("bg-warning");
        progressBar.classList.remove("bg-danger");
        progressBar.setAttribute("aria-valuenow", vitaAttuale.toString());

        if (vitaAttuale > 100) {
            progressBar.classList.add("bg-primary");
            progressBar.classList.remove("bg-success");
            progressBar.classList.remove("bg-warning");
            progressBar.classList.remove("bg-danger");
        }
    }

    if (vitaAttuale < 50) {
        progressBar.style.width = `${vitaAttuale}%`;
        progressBar.classList.remove("bg-success");
        progressBar.classList.add("bg-warning");
        progressBar.setAttribute("aria-valuenow", vitaAttuale.toString());
    }

    if (vitaAttuale < 25) {
        progressBar.style.width = `${vitaAttuale}%`;
        progressBar.classList.remove("bg-warning");
        progressBar.classList.add("bg-danger");
        progressBar.setAttribute("aria-valuenow", vitaAttuale.toString());
    }

    // se dopo un attacco la vita del nemico arriva a zero, e se questo attacco era una immagine gif con un animazione visibile, aspetto che termini questa "animazione" e solo dopo visualizzo il custom modal con il messaggio di player "X" sconfitto
    if (vitaAttuale < 0) {
        vitaAttuale = 0;

        progressBar.style.width = `${vitaAttuale}%`;
        progressBar.setAttribute("aria-valuenow", vitaAttuale.toString());

        // se l'immagine che contiene la gif all interno del div StatusBattle è display :none (quindi la gif ha terminato "l'animazione")
        //faccio visualizzare il custom modal con sconfitta del player con 0 vita.
        const ImgGif = statusBattle.querySelector("img");
        console.log(ImgGif);

        // se l'immagine contenente la gif è andata in display none ( e ci va solo una volta terminata "l'animazione") , oppure l'immagine contenente la gif non è presente nel DOM , mostra modal di avvenuta sconfitta. in entrambi i casi ricarica la pagina dopo 4s
        if (ImgGif?.style.display === "none" || !ImgGif) {
            if (!customModal.querySelector(".messaggio-sconfitta")) {
                divGiocatoreSconfitto.append(customModal);
                customModal.classList.remove("d-none");
                customModal.classList.remove("styleCustomModal");
                customModal.classList.add("styleCustomModal_1");
                customModal.classList.add("text-danger");
                let messaggioSconfitta = document.createElement("h3");
                messaggioSconfitta.classList.add("messaggio-sconfitta");
                messaggioSconfitta.classList.add("positionMessaggioSconfitta");
                messaggioSconfitta.innerHTML = "SCONFITTA";
                customModal.append(messaggioSconfitta);
            }
            // una volta che in custom modal appare il messaggio di sconfitta di uno de player ricarico la finestra.
            setTimeout(() => {
                window.location.reload();
            }, 4000);
        }
    }

    progressBar.style.width = `${vitaAttuale}%`;
    progressBar.setAttribute("aria-valuenow", vitaAttuale.toString());
}
//---------------------------------- FUNZIONI PER ASSOCIARE LA PARAMETRO CHARACTHER IL TIPO SPECIFICATO DALLA CLASSE -----
const goSuperSaiyan = (character: Guerriero) => {
    if ((character as Sayan).IsTranformed) {
        return (statusBattle.innerText = "Sei già trasformato.");
    }
    changeTurn(ArrayScontroPersonaggi);
    DisabilitaBottoni();
    return (character as Sayan).superSayan();
};

const GoSuperFreezer = (character: Guerriero) => {
    if ((character as Frost_Demon).IsTranformed) {
        return (statusBattle.innerText = "Sei già trasformato.");
    }
    changeTurn(ArrayScontroPersonaggi);
    DisabilitaBottoni();
    return (character as Frost_Demon).superFreezer();
};

const GoPerfectCell = (character: Guerriero) => {
    if ((character as cyborg).IsTranformed) {
        return (statusBattle.innerText = "Sei già trasformato.");
    }
    changeTurn(ArrayScontroPersonaggi);
    DisabilitaBottoni();
    return (character as cyborg).PerfectCell();
};

const GoSuperBuuAbsorb_Gotenks = (character: Guerriero) => {
    if ((character as Majin).IsTranformed) {
        return (statusBattle.innerText = "Sei già trasformato.");
    }
    changeTurn(ArrayScontroPersonaggi);
    DisabilitaBottoni();
    return (character as Majin).SuperBuu_absorb_Gotenks();
};

// attacco finale di un saiyan diversificato a seconda che sia goku o vegeta
const doSaiyanFinalAttack = (character: Guerriero, enemy: Guerriero) => {
    if (character.nome.toLowerCase() === "goku") {
        if ((character as Sayan).IsTranformed) {
            (character as Sayan).Kamehameha(enemy);
            changeTurn(ArrayScontroPersonaggi);
            DisabilitaBottoni();
            return;
        } else {
            statusBattle.innerText = "Devi prima trasformati per poter usare questo attacco.";
            return;
        }
    }

    if (character.nome.toLowerCase() === "vegeta") {
        if ((character as Sayan).IsTranformed) {
            (character as Sayan).FinalFlash(enemy);
            changeTurn(ArrayScontroPersonaggi);
            DisabilitaBottoni();
            return;
        } else {
            statusBattle.innerText = "Devi prima trasformati per poter usare questo attacco.";
            return;
        }
    }
};

const doSuperKamehameha = (character: Guerriero, enemy: Guerriero) => {
    if (character.nome.toLowerCase().includes("cell")) {
        if ((character as cyborg).IsTranformed) {
            (character as cyborg).SuperKamehameha(enemy);
            changeTurn(ArrayScontroPersonaggi);
            DisabilitaBottoni();
            return;
        } else {
            statusBattle.innerText = "Devi prima trasformati per poter usare questo attacco.";
            return;
        }
        // return (character as cyborg).SuperKamehameha(enemy);
    }
};

const doMankuoseppo = (character: Guerriero, enemy: Guerriero) => {
    if (character.nome.toLowerCase().includes("buu")) {
        if ((character as Majin).IsTranformed) {
            (character as Majin).Mankuoseppo(enemy);
            changeTurn(ArrayScontroPersonaggi);
            DisabilitaBottoni();
            return;
        } else {
            statusBattle.innerText = "Devi prima trasformati per poter usare questo attacco.";
            return;
        }
        // return (character as cyborg).SuperKamehameha(enemy);
    }
};

const FreezerFinalAttack = (character: Guerriero, enemy: Guerriero) => {
    if (character.nome.toLowerCase() === "freezer") {
        if ((character as Frost_Demon).IsTranformed) {
            (character as Frost_Demon).FinalAttack_planet_breaker(enemy);
            changeTurn(ArrayScontroPersonaggi);
            DisabilitaBottoni();
            cambiaSfondoNamekDistrutta();
            return;
        } else {
            statusBattle.innerText = "Devi prima trasformati per poter usare questo attacco.";
            return;
        }
    }
};

const removeGIfTrasformazione = (nomeGuerriero: Guerriero, durataAnimazione: number) => {
    setTimeout(() => {
        let GifDaRimuovere = document.getElementById(`my-id-is-${nomeGuerriero.nome}`);
        if (GifDaRimuovere === null) {
            console.error("immagine è null.");
        } else {
            GifDaRimuovere.style.display = "none";
        }
    }, durataAnimazione);
};

// ------------------------------   ---------------------------    ---------------------------   -----------------------
// TUTTI I NUOVI BOTTONI RELATIVI ALLE TRASFORMAZIONI ED ATTACCHI INSERITI QUI
const populateDiv = (character: Guerriero, divPlayer1: HTMLElement, enemy: Guerriero) => {
    // all inizio della partita è il turno del primo giocatore
    h3.innerHTML = `È il turno di ${ArrayScontroPersonaggi[0].nome}`.toUpperCase();
    h3.classList.add("display-3");

    const btnCalcio = document.createElement("button");
    btnCalcio.innerText = "Calcio";

    const btnPugno = document.createElement("button");
    btnPugno.innerText = "Pugno";

    const btnRiposo = document.createElement("button");
    btnRiposo.innerText = "Fagiolo di Balzar";

    const btnCercaOggetti = document.createElement("button");
    btnCercaOggetti.innerText = "Cerca Oggetti";

    const btnControllaInventario = document.createElement("button");
    btnControllaInventario.innerText = "Controlla inventario";

    // const btnCheckTentativiRimastiRicerca = document.createElement("button");
    // btnCheckTentativiRimastiRicerca.innerText = "Fatica Accumulata";

    const statusPG = document.createElement("button");
    statusPG.innerText = "STATUS PG";

    let charImage = document.createElement("img");
    charImage.src = `/imgs/${character.image}`;
    charImage.id = `id-${character.nome}`;
    charImage.classList.add("imgDimension");

    let buttonsWrapper = document.createElement("div");

    buttonsWrapper.append(
        btnCalcio,
        btnPugno,
        btnRiposo,
        btnCercaOggetti,
        btnControllaInventario,
        // btnCheckTentativiRimastiRicerca,
        statusPG
    );

    // se il personaggio giocato è della razza saiyan hanno la possibilità di avere il bottone super sayan
    if (character.razza.toLowerCase() === "saiyan") {
        const btnSuperSayan = document.createElement("button");
        btnSuperSayan.innerText = "SUPER SAYAN";
        divPlayer1.append(btnSuperSayan);
        btnSuperSayan.addEventListener("click", () => {
            goSuperSaiyan(character);

            // trova immagine nel dom e sostituiscila con quella da ssj
            let ImmagineCambiata = document.getElementById(`id-${character.nome}`) as HTMLImageElement;
            if (ImmagineCambiata === null) {
                console.error("nodo del DOM è null.");
            } else {
                ImmagineCambiata.src = `/imgs/${character.image}`;
            }

            // trova la gif della trasformazione e rimuovila dopo 5s
            if (character.nome.toLowerCase() === "goku") {
                removeGIfTrasformazione(character, 6300);
            }
            if (character.nome.toLowerCase() === "vegeta") {
                removeGIfTrasformazione(character, 7800);
            }
        });

        // se il giocatore è goku ha il il bottone per fare la kamehameha
        if (character.nome.toLowerCase() === "goku") {
            const btnKamehameha = document.createElement("button");
            btnKamehameha.innerText = "KAMEHAMEHA";
            divPlayer1.append(btnKamehameha);
            btnKamehameha.addEventListener("click", () => {
                // cambia turno e disabilita bottoni spostati dentro doFinalAttack()
                doSaiyanFinalAttack(character, enemy);
                //rimuovere la gif dell attacco speciale
                rimuoviGifAttaccoSpeciale(character, 4400);
            });
        }

        // se il personaggio è vegeta può effettuare un final Flash
        if (character.nome.toLowerCase() === "vegeta") {
            const btnFinalFlash = document.createElement("button");
            btnFinalFlash.innerText = "Final Flash";
            divPlayer1.append(btnFinalFlash);
            btnFinalFlash.addEventListener("click", () => {
                doSaiyanFinalAttack(character, enemy);
                //rimuovere la gif dell attacco speciale
                rimuoviGifAttaccoSpeciale(character, 2550);
            });
        }
    }

    // se il personaggio è di tipo frost demon (freezer e simili)
    if (character.razza.toLowerCase() === "frost demon") {
        const btnSuperFreezer = document.createElement("button");
        btnSuperFreezer.innerText = "100% POWER";
        divPlayer1.append(btnSuperFreezer);
        btnSuperFreezer.addEventListener("click", () => {
            // checkThisGuerrieroIsSayan_AndGoSuper(character);
            GoSuperFreezer(character);

            // trova immagine nel dom e sostituiscila con quella da ssj
            let ImmagineCambiata = document.getElementById(`id-${character.nome}`) as HTMLImageElement;
            if (ImmagineCambiata === null) {
                console.error("nodo del DOM è null.");
            } else {
                ImmagineCambiata.src = `/imgs/${character.image}`;
            }

            // trova la gif della trasformazione e rimuovila dopo 5s
            if (character.nome.toLowerCase() === "freezer") {
                removeGIfTrasformazione(character, 4300);
            }
        });

        const btnFinalAttack = document.createElement("button");
        btnFinalAttack.innerText = "planet breaker";
        divPlayer1.append(btnFinalAttack);
        btnFinalAttack.addEventListener("click", () => {
            FreezerFinalAttack(character, enemy);
            rimuoviGifAttaccoSpeciale(character, 3050);
        });
    }

    // se il personaggio è di tipo cyborg (cell) e simili
    if (character.razza.toLowerCase() === "cyborg") {
        const btnCellFinalForm = document.createElement("button");
        btnCellFinalForm.innerText = "ABSORB C18";
        divPlayer1.append(btnCellFinalForm);
        btnCellFinalForm.addEventListener("click", () => {
            GoPerfectCell(character);

            // trova immagine nel dom e sostituiscila con quella da ssj
            let ImmagineCambiata = document.getElementById(`id-${character.nome}`) as HTMLImageElement;
            if (ImmagineCambiata === null) {
                console.error("nodo del DOM è null.");
            } else {
                ImmagineCambiata.src = `/imgs/${character.image}`;
            }

            // trova la gif della trasformazione e rimuovila dopo X secondi
            if (character.nome.toLowerCase().includes("cell")) {
                removeGIfTrasformazione(character, 3600);
            }
        });

        const btnSuperKamehameha = document.createElement("button");
        btnSuperKamehameha.innerText = "Super Kamehameha";
        divPlayer1.append(btnSuperKamehameha);
        btnSuperKamehameha.addEventListener("click", () => {
            doSuperKamehameha(character, enemy);
            rimuoviGifAttaccoSpeciale(character, 4800);
        });
    }

    if (character.razza.toLowerCase() === "majin") {
        const btnSuperBuuAbsorb_Gotenks = document.createElement("button");
        btnSuperBuuAbsorb_Gotenks.innerText = "ABSORB Gotenks";
        divPlayer1.append(btnSuperBuuAbsorb_Gotenks);
        btnSuperBuuAbsorb_Gotenks.addEventListener("click", () => {
            GoSuperBuuAbsorb_Gotenks(character);

            // trova immagine nel dom e sostituiscila con quella da ssj
            let ImmagineCambiata = document.getElementById(`id-${character.nome}`) as HTMLImageElement;
            if (ImmagineCambiata === null) {
                console.error("nodo del DOM è null.");
            } else {
                ImmagineCambiata.src = `/imgs/${character.image}`;
            }

            // trova la gif della trasformazione e rimuovila dopo X secondi
            if (character.nome.toLowerCase().includes("buu")) {
                removeGIfTrasformazione(character, 9000);
            }
        });

        const btnMankuoseppo = document.createElement("button");
        btnMankuoseppo.innerText = "Mankuoseppo";
        divPlayer1.append(btnMankuoseppo);
        btnMankuoseppo.addEventListener("click", () => {
            doMankuoseppo(character, enemy);
            rimuoviGifAttaccoSpeciale(character, 3020);
        });
    }

    divPlayer1.classList.add("bg-light");
    divPlayer1.append(charImage);
    divPlayer1.append(buttonsWrapper);
    divPlayer1.append(btnCalcio);
    divPlayer1.append(btnPugno);
    divPlayer1.append(btnRiposo);
    divPlayer1.append(btnCercaOggetti);
    divPlayer1.append(btnControllaInventario);
    // divPlayer1.append(btnCheckTentativiRimastiRicerca);
    divPlayer1.append(statusPG);

    // all inizio del match disabilita i bottoni del secondo giocatore
    DisabilitaBottoni();

    btnCalcio.addEventListener("click", () => {
        character.calcio(enemy);
        changeTurn(ArrayScontroPersonaggi);
        DisabilitaBottoni();
    });

    btnPugno.addEventListener("click", () => {
        character.Pugno(enemy);
        changeTurn(ArrayScontroPersonaggi);
        DisabilitaBottoni();
    });

    btnRiposo.addEventListener("click", () => {
        character.Fagiolo_Balzar();
        changeTurn(ArrayScontroPersonaggi);
        DisabilitaBottoni();
    });

    btnCercaOggetti.addEventListener("click", () => {
        character.lookAround();
        // changeTurn(ArrayScontroPersonaggi);
    });

    btnControllaInventario.addEventListener("click", () => {
        character.checkInventario();
        // changeTurn(ArrayScontroPersonaggi);
    });

    // btnCheckTentativiRimastiRicerca.addEventListener("click", () => {
    //     character.CheckTentativiRimasti();
    //     // changeTurn(ArrayScontroPersonaggi);
    // });

    statusPG.addEventListener("click", () => {
        character.stats();
        // changeTurn(ArrayScontroPersonaggi);
    });
};

const cambiaSfondoNamekDistrutta = () => {
    if (appElement === null) {
        console.error("elemento app element non trovato.");
        return;
    }

    appElement.style.backgroundImage = "url(/imgs/destroied_namek_sfondo.gif)";
};

// funzione per disattivare ad ogni turno i bottoni degli attacchi dell avversario
const DisabilitaBottoni = () => {
    if (WhoIsturn === 1) {
        // prendo il div dell opponent e ne disabilito i bottoni se WhoIsTurn : number = 1
        const opponentDiv = document.getElementById("player2");
        const ButtonsInDIvOpponent = opponentDiv?.querySelectorAll("button");
        ButtonsInDIvOpponent?.forEach((btn) => (btn.disabled = true));
        // viceversa il giocatore in turno ha i bottoni premibili
        const divPlayerOne = document.getElementById("player1");
        const ButtonsInDivPlayer1 = divPlayerOne?.querySelectorAll("button");
        ButtonsInDivPlayer1?.forEach((btn) => (btn.disabled = false));
        return;
    }

    //viceversa se WhoIsturn = 2 disabilito i bottoni del giocatore1
    if (WhoIsturn === 2) {
        const divPlayerOne = document.getElementById("player1");
        const ButtonsInDivPlayer1 = divPlayerOne?.querySelectorAll("button");
        ButtonsInDivPlayer1?.forEach((btn) => (btn.disabled = true));
        // ed il giocatore 2 ha i bottoni premibili
        const opponentDiv = document.getElementById("player2");
        const ButtonsInDIvOpponent = opponentDiv?.querySelectorAll("button");
        ButtonsInDIvOpponent?.forEach((btn) => (btn.disabled = false));
        return;
    }
};

const rimuoviGifAttaccoSpeciale = (character: Guerriero, timeTimeout: number) => {
    let GifDaRimuovere = document.getElementById(`my-id-is-${character.nome}`);
    if (GifDaRimuovere) {
        setTimeout(() => {
            if (GifDaRimuovere === null) {
                console.error("immagine è null.");
            } else {
                GifDaRimuovere.style.display = "none";
            }
        }, timeTimeout);
    }
};

const changeTurn = (array: Guerriero[]) => {
    if (WhoIsturn === 2) {
        WhoIsturn = 1;
        h3.innerHTML = `È il turno di ${array[0].nome}`.toUpperCase();
        return;
    }

    if (WhoIsturn === 1) {
        WhoIsturn = 2;
        h3.innerHTML = `È il turno di ${array[1].nome}`.toUpperCase();
        return;
    }
};

let indexCanzoneInRiproduzione: number = 0;

const randomiseThePlaylistQueue = (array: canzone[]) => {
    // parte dalla fine dell array
    // ALGORITMO FISHER-YATES PER RANDOMIZZARE ARRAY
    for (let i = array.length - 1; i > 0; i--) {
        let randomIndex = Math.floor(Math.random() * (i + 1));
        let currentSong = array[i];
        array[i] = array[randomIndex];
        array[randomIndex] = currentSong;
    }

    return array;
};

const RiproduzioneMusica = () => {
    //creaiamo degli oggetti canzone
    let canzone1 = new canzone("heavy Dust", "/audio/song0.mp3");
    let canzone0 = new canzone("Prelude to Storm", "/audio/song1.mp3");
    let canzone2 = new canzone("Begin The Fight", "/audio/song2.mp3");
    let canzone3 = new canzone("The Strongest", "/audio/song3.mp3");
    let canzone4 = new canzone("Test your might", "/audio/mortal_Kombat.mp3");
    //creo array che contiene canzoni
    const playlist: canzone[] = [];
    playlist.push(canzone1, canzone2, canzone0, canzone3, canzone4);

    // randomizzazione indici canzoni nell array
    const shuffledArray = randomiseThePlaylistQueue(playlist);

    // creiamo un playerMusicale per musica combattimento
    const MusicPLayer = document.createElement("audio");
    MusicPLayer.setAttribute("controls", "");
    MusicPLayer.id = "musicplayer";
    MusicPLayer.autoplay = true;
    MusicPLayer.hidden = true;
    MusicPLayer.volume = 0.2;

    const SourceMusic = document.createElement("source");
    SourceMusic.src = shuffledArray[indexCanzoneInRiproduzione].src;
    SourceMusic.type = "audio/mpeg";
    MusicPLayer.append(SourceMusic);

    MusicPLayer.addEventListener("ended", () => {
        indexCanzoneInRiproduzione++;
        if (indexCanzoneInRiproduzione === shuffledArray.length + 1) {
            indexCanzoneInRiproduzione = 0;
            // RiproduzioneMusica();
        }
        SourceMusic.src = shuffledArray[indexCanzoneInRiproduzione].src;
        MusicPLayer.load(); // Carica la nuova canzone
        MusicPLayer.play(); // Riproduce la nuova canzone
    });

    appElement?.append(MusicPLayer);
};

const muteMusic = () => {
    const MusicPlayer = document.getElementById("musicplayer");
    (MusicPlayer as HTMLAudioElement).volume = 0;
};

const PlayMusic = () => {
    const MusicPlayer = document.getElementById("musicplayer");
    (MusicPlayer as HTMLAudioElement).volume = 0.2;
};
