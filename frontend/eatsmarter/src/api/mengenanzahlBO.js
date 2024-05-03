import BusinessObject from "./BusinessObject";

export default class mengenanzahlBO extends BusinessObject{

    // Jedes erstellte BusinessObjekt wird mit folgenden Attributen erstellt
    constructor(menge){
        super();
        this.menge = menge;
    }

    // Get- und Setter:
    setMenge(m){
        this.menge = m;
    }

    getMenge(){
        return this.menge;
    }

    
    // Methode gibt Array oder einzelnes Objekt aus der JSON Struktur zurück
    static fromJSON(menge){
        let result = [];

        // Mehrere Objekte
        if (Array.isArray(menge)){
            menge.forEach((m) => {
                Object.setPrototypeOf(m, mengenanzahlBO.prototype);
                result.push(m);
            })
            // Nur ein einzelnes Objekt
        } else {
            let m = menge;
            Object.setPrototypeOf(m, mengenanzahlBO.prototype);
            result.push(m);
        }

        return result;
    }
}