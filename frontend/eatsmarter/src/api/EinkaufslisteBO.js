import BusinessObject from "./BusinessObject";

export default class EinkaufslisteBO extends BusinessObject{

    // Jedes erstellte BusinessObjekt wird mit folgenden Attributen erstellt
    constructor(bez){
        super();
        this.bezeichnung = bez;
    }

    // Get- und Setter:
    setBezeichnung(e){
        this.bezeichnung = e;
    }

    getBezeichnung(){
        return this.bezeichnung;
    }

    // Methode gibt Array oder einzelnes Objekt aus der JSON Struktur zurück
    static fromJSON(shoppinglist){
        let result = [];

        // Mehrere Objekte
        if (Array.isArray(shoppinglist)){
            shoppinglist.forEach((p) => {
                Object.setPrototypeOf(p, EinkaufslisteBO.prototype);
                result.push(p);
            })
            // Nur ein einzelnes Objekt
        } else {
            let l = shoppinglist;
            Object.setPrototypeOf(l, EinkaufslisteBO.prototype);
            result.push(l);
        }

        return result;
    }
}