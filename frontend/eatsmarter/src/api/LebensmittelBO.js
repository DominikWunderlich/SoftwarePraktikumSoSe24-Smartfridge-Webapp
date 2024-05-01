import BusinessObject from "./BusinessObject";
export default class LebensmittelBO extends BusinessObject{
    constructor(id, lebensmittel_name, aggregatzustand){
        super();
        this.id = id;
        this.lebensmittel_name = lebensmittel_name;
        this.aggregatzustand = aggregatzustand;
    }

    setId(id){
        this.id = id;

    }
    getId() {
        return this.id;
    }

    setLebensmittelname(lebensmittel_name){
        this.lebensmittel_name = lebensmittel_name;
    }
    getLebensmittelname() {
        return this.lebensmittel_name;
    }

    setAggregatszustand(aggregatzustand){
        this.aggregatzustand = aggregatzustand;
    }
    getAggregatszustand(){
        return this.aggregatzustand;
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
