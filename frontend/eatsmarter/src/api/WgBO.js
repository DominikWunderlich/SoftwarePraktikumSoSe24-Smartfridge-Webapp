import BusinessObject from "./BusinessObject";

export default class WgBO extends BusinessObject{

    // Jedes erstellte WG-BusinessObjekt wird mit folgenden Attributen erstellt
    constructor(aWgName, aWgBewohner, aWgAdmin){
        super();
        this.wgName = aWgName;
        this.wgBewohner = aWgBewohner;
        this.wgAdmin = aWgAdmin;
    }

    // Setzen und Aufruf von den Attributen des WgBusinessObjects
    setWgName(aWgName){
        this.wgName = aWgName;
    }

    getWgName(){
        return this.wgName;
    }

    setWGBewohner(aWgBewohner){
        this.wgBewohner = aWgBewohner;
    }

    getWGBewohner(){
        return this.wgBewohner;
    }

    setWgAdmin(aWgAdmin){
        this.wgAdmin = aWgAdmin;
    }
    getWgAdmin(){
        return this.wgAdmin;
    }

    // Methode gibt Array mit den WgBOs aus der JSON Struktur zurück
    static fromJSON(wgs){
        let result = [];

        // Mehrere Objekte
        if (Array.isArray(wgs)){
            wgs.forEach((w) => {
                Object.setPrototypeOf(w, WgBO.prototype);
                result.push(w);
            })
            // Nur ein einzelnes Objekt
        } else {
            let w = wgs;
            Object.setPrototypeOf(w, WgBO.prototype);
            result.push(w);
        }

        return result;
    }
}