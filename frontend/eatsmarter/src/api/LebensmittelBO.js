import BusinessObject from "./BusinessObject";
export default class LebensmittelBO extends BusinessObject{
    constructor(name, menge, masseinheit) {
        super();
        this.lebensmittel_name = name;
        this.menge = menge
        this.masseinheit = masseinheit
    }


    setLebensmittelname(name){
        this.lebensmittel_name = name;
    }
    getLebensmittelname() {
        return this.lebensmittel_name;
    }


    static fromJSON(lebensmittel){
        let result = [];
        console.log("Das ist das übergebene Lebensmittel:", lebensmittel)

        if(Array.isArray(lebensmittel)){
            lebensmittel.foreach((lm)=> {
                console.log("Das ist das lm", lm)
                Object.setPrototypeOf(lm, LebensmittelBO.prototype);
                result.push(lm);
            })
        } else {
            let lm = lebensmittel;
            Object.setPrototypeOf(lm, LebensmittelBO.prototype);
            result.push(lm);
        }
        console.log("Immernoch im fromJSON:", result)
        return result;
        
    }
}
