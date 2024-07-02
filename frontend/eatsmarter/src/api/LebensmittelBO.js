import BusinessObject from "./BusinessObject";

export default class LebensmittelBO extends BusinessObject{
    constructor(lebensmittelName, menge, masseinheit, kuehlschrankId, rezeptId) {
        super();
        this.lebensmittelName = lebensmittelName;
        this.masseinheit = masseinheit;
        this.menge = parseFloat(menge);
        this.kuehlschrankId = kuehlschrankId;
        this.rezeptId = rezeptId;
    }

    getLebensmittelname() {
        return this.lebensmittelName;
    }
    setLebensmittelname(lebensmittelName){
        this.lebensmittelName = lebensmittelName;
    }

    getMenge(menge){
        return this.menge;
    }

    setMenge(menge){
        this.mengen = menge;
    }

    getMasseinheit(){
        return this.masseinheit;
    }

    setMasseinheit(masseinheit){
        this.masseinheit= masseinheit;
    }

    getKuehlschrankId(){
        return this.kuehlschrankId;
    }

    setKuehlschrankId(kuehlschrankId){
        this.kuehlschrankId = kuehlschrankId;
    }

    getRezeptId(){
        return this.rezeptId;
    }

    setRezeptId(rezeptId){
        this.rezeptId = rezeptId;
    }

    static fromJSON(lebensmittel_name){
        let result = [];

        if(Array.isArray(lebensmittel_name)){
            lebensmittel_name.forEach((lm)=> {
                Object.setPrototypeOf(lm, LebensmittelBO.prototype);
                result.push(lm);
            });
        }else{
            let lm = lebensmittel_name;
            Object.setPrototypeOf(lm, LebensmittelBO.prototype);
            result.push(lm);
        }

        return result;
        
    }
}
