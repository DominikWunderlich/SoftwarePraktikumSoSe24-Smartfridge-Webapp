import BusinessObject from "./BusinessObject";
export default class LebensmittelBO extends BusinessObject{
    constructor(lebensmittel_name, menge, masseinheit) {
        super();
        this.lebensmittel_name = lebensmittel_name;
        this.menge = menge
        this.masseinheit = masseinheit
    }


    setLebensmittelname(lebensmittel_name){
        this.lebensmittel_name = lebensmittel_name;
    }
    getLebensmittelname() {
        return this.lebensmittel_name;
    }


    static fromJSON(lebensmittel_name){
        let result = [];

        if(Array.isArray(lebensmittel_name)){
            lebensmittel_name.foreach((lm)=> {
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
