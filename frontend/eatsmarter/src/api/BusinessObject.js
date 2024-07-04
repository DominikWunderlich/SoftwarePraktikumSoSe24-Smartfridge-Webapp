/** Info: Der Großteil aus diesem Code wurde vom "Bankprojekt" übernommen  **/

/**
 * Basisklasse für alle BusinessObjekte mit Id per default
 */

export default class BusinessObject{
    // Null Constructor
    constructor() {
        this.id = 0;
    }

    // Id für das BusinessObjekt setzen
    setID(aId){
        this.id = aId;
    }

    // Id des BusinessObjekts ausgeben
    getID(){
        return this.id;
    }

    // Objekt als String ausgeben - Nützlich fürs debugging
    toString(){
        let result = "";
        for (var prop in this){
            result += prop + ": " + this[prop] + " ";
        }
        return result;
    }
}