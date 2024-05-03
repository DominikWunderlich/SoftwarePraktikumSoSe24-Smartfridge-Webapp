import BusinessObject from "./BusinessObject";

export default class MasseinheitBO extends BusinessObject{

    // Jedes erstellte BusinessObjekt wird mit folgenden Attributen erstellt
    constructor(masseinheit){
        super();
        this.masseinheit = masseinheit;
    }

    // Get- und Setter:
    setmasseinheit(ms){
        this.masseinheit = ms;
    }

    getEmail(){
        return this.masseinheit;
    }


    // Methode gibt Array oder einzelnes Objekt aus der JSON Struktur zurück
    static fromJSON(masseinheit){
        let result = [];

        // Mehrere Objekte
        if (Array.isArray(masseinheit)){
            masseinheit.forEach((ms) => {
                Object.setPrototypeOf(ms, MasseinheitBO.prototype);
                result.push(ms);
            })
            // Nur ein einzelnes Objekt
        } else {
            let ms = masseinheit;
            Object.setPrototypeOf(ms, MasseinheitBO.prototype);
            result.push(ms);
        }

        return result;
    }
}