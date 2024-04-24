import BusinessObject from "./BusinessObject";
export default class LebensmittelBO extends BusinessObject{
    constructor(id, lebensmittelname, aggregatszustand);{
        super();
        this.id = id;
        this.lebensmittelname = lebensmittelname;
        this.aggregatszustand = aggregatszustand;
    }

    setId(id){
        this.id = id;

    }
    getId() {
        return this.id;
    }

    setLebensmittel(lebensmittelname);{
        this.lebensmittelname = lebensmittelname;
    }
    getLebensmittelname() {
        return this.lebensmittelname;
    }

    setAggregatszustand(aggregatszustand){
        this.aggregatszustand = aggregatszustand;
    }
    getAggregatszustand(){
        return this.aggregatszustand;
    }

    static fromJSON(lebensmittelname){
        let result = [];

        if(Array.isArray(lebensmittelname)){
            lebensmittelname.foreach((lm)=> {
                Object.setPrototypeOf(lm, LebensmittelBO.prototype);
                result.push(lm);
            });
        }else{
            let lm = lebensmittelname;
            Object.setPrototypeOf(lm, LebensmittelBO.prototype);
            result.push(lm);
        }

        return result;
        
    }
}
