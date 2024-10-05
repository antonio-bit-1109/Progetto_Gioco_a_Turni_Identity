import { Guerriero } from "./interfacesTS/interfaces";
import { statusBattle } from "../ts/app";
import { combattente } from "./combattente";

export class Majin extends combattente {
    public GifTranformation: string;
    public GifFinalAttack: string;
    public IsTranformed: boolean;
    constructor(
        nome: string,
        forza: number,
        difesa: number,
        livello: number,
        esperienza: number,
        agilita: number,
        pv: number,
        razza: string,
        temperamento: string,
        puntoCritico: string,
        precisione: number,
        image: string,
        GifTranformation: string, // Parametro aggiuntivo per la nuova proprietà
        GifFinalAttack: string
    ) {
        // Chiama il costruttore della classe base con i parametri necessari
        super(
            nome,
            forza,
            difesa,
            livello,
            esperienza,
            agilita,
            pv,
            razza,
            temperamento,
            puntoCritico,
            precisione,
            image
        );

        // Assegna il valore alla nuova proprietà
        this.GifTranformation = GifTranformation;
        this.GifFinalAttack = GifFinalAttack;
        this.IsTranformed = false;
    }

    public SuperBuu_absorb_Gotenks() {
        this.pv += 70;
        this.forza += 14;
        this.agilita += 18;
        this.difesa += 33;
        this.IsTranformed = true;
        this.cambiaImmagineSuperBuu_Gotenks();
    }

    protected cambiaImmagineSuperBuu_Gotenks() {
        statusBattle.innerHTML = "";
        if (this.nome.toLowerCase().includes("buu")) {
            //immagine sarà questa
            this.image = "superBUU-absorbed-gotenks.jpg";
            this.AnimationGif(this.GifTranformation, this.nome);
            statusBattle.innerHTML += "Super Buu ha assorbito Gotenks!";
        }
    }

    protected AnimationGif(gif: string, charName: string) {
        statusBattle.innerHTML += `<img id='my-id-is-${charName}' style='width: 70%;height: 100%;' src="/imgs/${gif}" alt="">`;
    }

    public Mankuoseppo(enemy: Guerriero) {
        try {
            statusBattle.innerHTML = "";
            let possibilitaColpo = Math.floor(Math.random() * this.precisione + Math.random());

            if (enemy.pv <= 0) {
                return;
            }

            if (this.tentativi <= 0 || this.tentativi === 1) {
                statusBattle.innerHTML = "super Buu è troppo stanco per effettuare un Mankuoseppo. Riposati e riprova.";
                return;
            }

            if (possibilitaColpo <= this.precisione) {
                let danno: number;
                this.AnimationGif(this.GifFinalAttack, this.nome);
                // controllo colpo critico: se parte corpo colpita (estratta da array === a punto debole nemico) danno raddoppiato.
                let parteCorpoColpita: string = this.CriticalHit();
                console.log("parte corpo colpita", parteCorpoColpita);
                console.log("punto critico nemico", enemy.puntoCritico);
                statusBattle.innerHTML += `Super Buu Effettua Mankuoseppo contro ${enemy.nome}. <br>`;
                this.forza += 16;
                this.tentativi = this.tentativi - 3;
                if (parteCorpoColpita === enemy.puntoCritico) {
                    statusBattle.innerHTML += `DANNO CRITICO. <br>`;
                    danno = (this.forza * 2.2) / (enemy.difesa / 2) + this.forza;
                } else {
                    danno = this.forza + 10 / (enemy.difesa / 2) + this.forza;
                }
                danno = parseFloat(danno.toFixed(2));
                enemy.pv -= danno;
                statusBattle.innerHTML += `Danni inflitti ${danno}`;
                this.vitaRimanenteNemico(enemy);
                this.GainExp(enemy);
                this.forza -= 16;
                this.difesa -= 8;
            } else {
                statusBattle.innerHTML = "il colpo non è andato a segno.";
                this.vitaRimanenteNemico(enemy);
            }
        } catch (err) {
            console.error(err);
        }
    }
}
