import { IPhotos } from "../interfacesTS/interfaces";
import { appElement } from "../app";

export const sfondoFetch = async (city: string): Promise<null | string> => {
    try {
        const response = await fetch(`https://api.pexels.com/v1/search?query=${city}`, {
            method: "GET",
            headers: {
                Authorization: "7Ye7PHnNDdVmd43T5cthTwaF0I2AipmjtizxjFtVcXnzQIgCqJYlTLXP",
                "Content-type": "application/json",
            },
        });

        if (!response.ok) {
            if (response.status > 400 && response.status < 500) {
                throw new Error("non riusciamo a trovare le fotuzze.");
            }

            if (response.status === 429) {
                throw new Error("429 infame, per te solo le lame!");
            }

            if (response.status >= 500) {
                throw new Error("errore del server.");
            }
        }

        const goodResponse = await response.json();
        const photos: IPhotos[] = goodResponse.photos;

        let randomNum = Math.floor(Math.random() * photos.length);

        console.log(photos[randomNum].src.large2x);
        localStorage.setItem("sfondo", JSON.stringify(photos[randomNum].src.large2x));
        cambiaSfondo();
        return photos[randomNum].src.large2x;
    } catch (err) {
        console.error(err);
        return null;
    }
};

const cambiaSfondo = () => {
    let localStorageSfondo = localStorage.getItem("sfondo");

    if (appElement) {
        if (localStorageSfondo) {
            appElement.style.backgroundImage = `url(${localStorageSfondo})`;
        }
        appElement.classList.add("appElementStyle");
    }
};
