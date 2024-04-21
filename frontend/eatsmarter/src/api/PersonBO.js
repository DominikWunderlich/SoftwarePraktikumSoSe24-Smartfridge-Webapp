import BusinessObject from "./BusinessObject";

export default class PersonBO extends BusinessObject{

    // Jedes erstellte BusinessObjekt wird mit folgenden Attributen erstellt
    constructor(email, userName, lastName, firstName, googleId){
        super();
        this.email = email;
        this.userName = userName;
        this.lastName = lastName;
        this.firstName = firstName;
        this.googleId = googleId;
    }

    // Get- und Setter:
    setEmail(e){
        this.email = e;
    }

    getEmail(){
        return this.email;
    }

    setuserName(u){
        this.userName = u;
    }

    getuserName(){
        return this.userName;
    }

    setlastName(lastname){
        this.lastName = lastname;
    }
    getlastName(){
        return this.lastName;
    }

    setfirstName(f){
        this.firstName = f;
    }
    getfirstName(){
        return this.firstName;
    }

    setgoogleId(gid){
        this.googleId = gid;
    }
    getgoogleId(){
        return this.googleId;
    }

    // Methode gibt Array oder einzelnes Objekt aus der JSON Struktur zurück
    static fromJSON(persons){
        let result = [];

        // Mehrere Objekte
        if (Array.isArray(persons)){
            persons.forEach((p) => {
                Object.setPrototypeOf(p, PersonBO.prototype);
                result.push(p);
            })
            // Nur ein einzelnes Objekt
        } else {
            let p = persons;
            Object.setPrototypeOf(p, PersonBO.prototype);
            result.push(p);
        }

        return result;
    }
}