import { Guerriero } from "./interfacesTS/interfaces";
import { statusBattle } from "../ts/app";
import { combattente } from "./combattente";

export class cyborg extends combattente {
    public GifTrasformation: string;
    public gifKamehameha: string;
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
        GifTrasformation: string,
        gifKamehameha: string
    ) {
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

        this.GifTrasformation = GifTrasformation;
        this.gifKamehameha = gifKamehameha;
        this.IsTranformed = false;
    }

    public PerfectCell() {
        this.pv += 50;
        this.forza += 18;
        this.agilita += 20;
        this.difesa += 25;
        this.IsTranformed = true;
        this.cambiaImmagineCellFinal();
    }

    protected cambiaImmagineCellFinal() {
        statusBattle.innerHTML = "";
        if (this.nome.toLowerCase().includes("cell")) {
            //immagine sarà questa
            this.image = "cell_final_form.jpg";
            this.AnimationGif(this.GifTrasformation, this.nome);
            statusBattle.innerHTML += "Cell raggiunge la forma perfetta!";
        }
    }

    protected AnimationGif(gif: string, charName: string) {
        statusBattle.innerHTML += `<img id='my-id-is-${charName}' style='width: 70%;height: 100%;' src="/imgs/${gif}" alt="">`;
    }

    public SuperKamehameha(enemy: Guerriero) {
        try {
            statusBattle.innerHTML = "";
            let possibilitaColpo = Math.floor(Math.random() * this.precisione + Math.random());

            if (enemy.pv <= 0) {
                return;
            }

            if (this.tentativi <= 0 || this.tentativi === 1) {
                statusBattle.innerHTML = "Cell è troppo stanco per effettuare una Kamehameha. Riposati e riprova.";
                return;
            }

            if (possibilitaColpo <= this.precisione) {
                let danno: number;
                this.AnimationGif(this.gifKamehameha, this.nome);
                // controllo colpo critico: se parte corpo colpita (estratta da array === a punto debole nemico) danno raddoppiato.
                let parteCorpoColpita: string = this.CriticalHit();
                console.log("parte corpo colpita", parteCorpoColpita);
                console.log("punto critico nemico", enemy.puntoCritico);
                statusBattle.innerHTML += `Cell Effettua SuperKamehameha contro ${enemy.nome}. <br>`;
                this.forza += 10;
                this.tentativi = this.tentativi - 3;
                if (parteCorpoColpita === enemy.puntoCritico) {
                    statusBattle.innerHTML += `DANNO CRITICO. <br>`;
                    danno = this.forza / (enemy.difesa / 2) + this.forza;
                } else {
                    danno = this.forza / (enemy.difesa / 2) + this.forza;
                }
                danno = parseFloat(danno.toFixed(2));
                enemy.pv -= danno;
                statusBattle.innerHTML += `Danni inflitti ${danno}`;
                this.vitaRimanenteNemico(enemy);
                this.GainExp(enemy);
                this.forza -= 10;
            } else {
                statusBattle.innerHTML = "il colpo non è andato a segno.";
                this.vitaRimanenteNemico(enemy);
            }
        } catch (err) {
            console.error(err);
        }
    }
}
