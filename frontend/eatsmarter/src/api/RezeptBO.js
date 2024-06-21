import BusinessObject from "./BusinessObject";

export default class RezeptBO extends BusinessObject{

    // Jedes erstellte Rezept-BusinessObjekt wird mit folgenden Attributen erstellt
    constructor(aRezeptName, aAnzahlPortionen, aRezeptAdmin, aWgId, aRezeptAnleitung){
        super();
        this.rezeptName = aRezeptName;
        this.anzahlPortionen = aAnzahlPortionen;
        this.rezeptAdmin = aRezeptAdmin;
        this.wgId = aWgId;
        this.rezeptAnleitung = aRezeptAnleitung;
    }

    // Setzen und Aufruf von den Attributen des RezeptBusinessObjects
    setRezeptName(aRezeptName){
        this.rezeptName = aRezeptName;
    }

    getRezeptName(){
        return this.rezeptName;
    }

    setAnzahlPortionen(aAnzahlPortionen){
        this.anzahlPortionen = aAnzahlPortionen;
    }

    getAnzahlPortionen(){
        return this.anzahlPortionen;
    }

    setRezeptAdmin(aRezeptAdmin){
        this.rezeptAdmin = aRezeptAdmin;
    }
    getRezeptAdmin(){
        return this.rezeptAdmin;
    }

    setWgId(aWgId){
        this.wgId=aWgId;
    }

    getWgId(){
        return this.wgId;
    }

    setRezeptAnleitung(aRezeptAnleitung){
        this.rezeptAnleitung=aRezeptAnleitung;
    }

    getRezeptAnleitung(){
        return this.rezeptAnleitung;
    }

    // Methode gibt Array mit den RezeptBOs aus der JSON Struktur zurück
    static fromJSON(rezepte){
        let result = [];

        // Mehrere Objekte
        if (Array.isArray(rezepte)){
            rezepte.forEach((r) => {
                Object.setPrototypeOf(r, RezeptBO.prototype);
                result.push(r);
            })
            // Nur ein einzelnes Objekt
        } else {
            let r = rezepte;
            Object.setPrototypeOf(r, RezeptBO.prototype);
            result.push(r);
        }

        return result;
    }


    static fromJSON(rzt){
        let result = [];

        // Mehrere Objekte
        if (Array.isArray(rzt)){
            rzt.forEach((r) => {
                Object.setPrototypeOf(r, RezeptBO.prototype);
                result.push(r);
            })
            // Nur ein einzelnes Objekt
        } else {
            let r = rzt;
            Object.setPrototypeOf(r, RezeptBO.prototype);
            result.push(r);
        }

        return result;
    }
    
 }   