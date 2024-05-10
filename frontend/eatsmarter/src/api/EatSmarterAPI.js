import BusinessObject from "./BusinessObject";
import WgBO from "./WgBO";
import PersonBO from "./PersonBO";
import RezeptBO from "./RezeptBO";
import LebensmittelBO from "./LebensmittelBO";
import mengenanzahlBO from "./mengenanzahlBO";
import MasseinheitBO from "./MasseinheitBO";

export default class EatSmarterAPI{

    // Singleton instance
    static #api = null;

    /**
     * Get the singleton instance
     */
    static getAPI(){
        if (this.#api == null){
            this.#api = new EatSmarterAPI();
        }
        return this.#api;
    }

    /**
     * Returns a Promise which resolves to a json object.
     * The Promise returned from fetch() won’t reject on HTTP error status even if the response is an HTTP 404 or 500.
     * fetchAdvanced throws an Error also an server status errors
     */
    #fetchAdvanced = (url, init) => fetch(url, init)
        .then(res => {
            // The Promise returned from fetch() won’t reject on HTTP error status even if the response is an HTTP 404 or 500.
            if (!res.ok){
                throw Error(`${res.status} ${res.statusText}`);
            }
            return res.json()
        })

    // Local python backend
    #EatSmarterServerBaseURL = "/system";

    // Rezept related URLS
    #addRezeptURL = () => `${this.#EatSmarterServerBaseURL}/rezept`;
    #deleteRezeptURL = () => `${this.#EatSmarterServerBaseURL}/rezept/<rezept_name>`;
    #getRezeptURL = () => `${this.#EatSmarterServerBaseURL}/rezept`;


    //Ich glaube die getRezepteByWg Methode stimmt
    #getRezepteByWgURL = (wg_name) => `${this.#EatSmarterServerBaseURL}/rezept/${wg_name}`;

    getRezepteByWg(wg_name){
    return this.#fetchAdvanced(this.#getRezepteByWgURL(wg_name), {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
    }).then((response) => {
        let rezepte = RezeptBO.fromJSON(response);
        return new Promise(function (resolve){
            resolve(rezepte);
        });
    });
    }
    //also bis hier
    addRezept(rezeptBO){
        return this.#fetchAdvanced(this.#addRezeptURL(), {
            method: "POST",
            headers: {
                "Accept": "application/json, text/plain",
                "Content-type": "application/json",
            },
            body: JSON.stringify(rezeptBO)
        }).then((responseJSON) => {
            let responseRezeptBO = RezeptBO.fromJSON(responseJSON)[0];
            return new Promise(function(resolve){
                resolve(responseRezeptBO);
            })
        })
    }
    // Lebensmittel related URLS
    #addLebensmittelURL = () => `${this.#EatSmarterServerBaseURL}/lebensmittelverwaltung`;
    #deleteLebensmittelURL = () => `${this.#EatSmarterServerBaseURL}/lebensmittelverwaltung/<Lebensmittel_name>`;

    addLebensmittel(BO){
        return this.#fetchAdvanced(this.#addLebensmittelURL(), {
            method: "POST",
            headers: {
                "Accept": "application/json, text/plain",
                "Content-type": "application/json",
            },
            body: JSON.stringify(BO)
        }).then((responseJSON) => {
            let responseLebensmittelBO = LebensmittelBO.fromJSON(responseJSON)[0];
            return new Promise(function(resolve){
                resolve(responseLebensmittelBO);
            })
        })
    }

    #getLebensmittebyURL =()=> `${this.#EatSmarterServerBaseURL}/lebensmittelverwaltung/<LebensmittelName>`;

    getLebensmittelbyName(lebensmittel_name) {
        return this.#fetchAdvanced(this.#getLebensmittebyURL(),{
            method: "GET",
            headers: {
                "Accept": "application/json, text/plain",
                "Content-type": "application/json",
            },
            body: JSON.stringify(lebensmittel_name)
        }).then((responseJSON)=> {
            let responseLebensmittelBO = LebensmittelBO.fromJSON(responseJSON)[0];
            return new Promise(function(resolve){
                resolve(responseLebensmittelBO);
            })
        })
    }

    deleteLebensmittelByName(lebensmittel_name){
        return this.#fetchAdvanced(this.#deleteLebensmittelURL(),{
            method: "DELETE",
            headers: {
                "Accept": "application/json, text/plain",
                "Content-type": "application/json",
            },
            body: JSON.stringify(lebensmittel_name)
        }).then((responseJSON) => {
            let removedLebensmittelBO = LebensmittelBO.fromJSON(responseJSON)[0];
            return new Promise( function(resolve) {
                resolve(responseJSON);
            })
        })
    }


        // Menge related API Calls
    #addMengeURL = () => `${this.#EatSmarterServerBaseURL}/menge`;
    #deleteMengeURL = () => `${this.#EatSmarterServerBaseURL}/menge/<menge>`;
    
    addMenge(mengenBO){
        return this.#fetchAdvanced(this.#addMengeURL(), {
            method: "POST",
            headers: {
                "Accept": "application/json, text/plain",
                "Content-type": "application/json",
            },
            body: JSON.stringify(mengenBO)
        }).then((responseJSON) => {
            let responsemengenanzahlBO= mengenanzahlBO.fromJSON(responseJSON)[0];
            return new Promise(function(resolve){
                resolve(responsemengenanzahlBO);
            })
        })
    }
    
    #getMengebyURL =()=> `${this.#EatSmarterServerBaseURL}/menge/<menge>`;
    
    getMengebyName(menge) {
        return this.#fetchAdvanced(this.#getMengebyURL(),{
            method: "GET",
            headers: {
                "Accept": "application/json, text/plain",
                "Content-type": "application/json",
            },
            body: JSON.stringify(menge)
            }).then((responseJSON)=> {
                let responsemengenanzahlBO = mengenanzahlBO.fromJSON(responseJSON)[0];
                return new Promise(function(resolve){
                    resolve(responsemengenanzahlBO);
                })
            })
        }
    
    deleteMengeByName(menge){
        return this.#fetchAdvanced(this.#deleteMengeURL(),{
            method: "DELETE",
            headers: {
                "Accept": "application/json, text/plain",
                "Content-type": "application/json",
            },
            body: JSON.stringify(menge)
        }).then((responseJSON) => {
            let removedmengenanzahlBO = mengenanzahlBO.fromJSON(responseJSON)[0];
            return new Promise( function(resolve) {
                resolve(responseJSON);
            })
        })
    }

// Masseinheit related API Calls
    #addMasseinheitURL = () => `${this.#EatSmarterServerBaseURL}/masseinheit`;
    #deleteMasseinheitURL = () => `${this.#EatSmarterServerBaseURL}/masseinheit/<masseinheit>`;

    addMasseinheit(meinheitBO){
        return this.#fetchAdvanced(this.#addMasseinheitURL(), {
            method: "POST",
            headers: {
                "Accept": "application/json, text/plain",
                "Content-type": "application/json",
            },
            body: JSON.stringify(meinheitBO)
        }).then((responseJSON) => {
            let responseMasseinheitBO= MasseinheitBO.fromJSON(responseJSON)[0];
            return new Promise(function(resolve){
                resolve(responseMasseinheitBO);
            })
        })
    }

    #getMasseinheitbyURL =()=> `${this.#EatSmarterServerBaseURL}/masseinheit/<masseinheit>`;

    getMasseinheitbyName(masseinheit) {
        return this.#fetchAdvanced(this.#getMasseinheitbyURL(),{
            method: "GET",
            headers: {
                "Accept": "application/json, text/plain",
                "Content-type": "application/json",
            },
            body: JSON.stringify(masseinheit)
        }).then((responseJSON)=> {
            let responseMasseinheitBO = MasseinheitBO.fromJSON(responseJSON)[0];
            return new Promise(function(resolve){
                resolve(responseMasseinheitBO);
            })
        })
    }

    deleteMasseinheitByName(masseinheit){
        return this.#fetchAdvanced(this.#deleteMasseinheitURL(),{
            method: "DELETE",
            headers: {
                "Accept": "application/json, text/plain",
                "Content-type": "application/json",
            },
            body: JSON.stringify(masseinheit)
        }).then((responseJSON) => {
            let removedMasseinheitBO = MasseinheitBO.fromJSON(responseJSON)[0];
            return new Promise( function(resolve) {
                resolve(responseJSON);
            })
        })
    }


    //Ich füge hier jetzt eine getAllRezepte Methode ein, die soll eigentlich genau das gleiche machen
    //wie die getRezept Methode, nämlich alle Rezepte die wir in der DB haben im Frontend anzeigen
    //die getRezept Methode funktioniert nur leider nicht und mit der getAllRezepte Methode geht es
    //seltsamerweise. Eine von beiden muss noch rausgelöscht werden
    //Ich verstehe nicht ganz wie die getAllRezepte Methode und die getRezept Methode sich
    //unterscheiden und wieso die eine funktioniert und die andere nicht.
    //Ich habe mich beim erstellen an einem älteren Projekt inspirieren lassen und das einfach ein bisschen
    //umgebaut.

    async getAllRezepte() {
        try {
            const responseJSON = await this.#fetchAdvanced(this.#getRezeptURL(), {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                }
            });
            return responseJSON; // Gib die Rezepte direkt zurück, ohne sie zu verarbeiten
        } catch (error) {
            console.error("Fehler beim Abrufen der Rezepte:", error);
            throw error;
        }
    }

    getRezept() {

    return this.#fetchAdvanced(this.#getRezeptURL(), {
        method: "GET",
        headers: {
            "Accept": "application/json",
        }
    }).then((responseJSON) => {
        console.log(responseJSON);
        // Hier die empfangenen Daten in das gewünschte Format konvertieren
        let rezeptList = responseJSON.map(rezeptData => RezeptBO.fromJSON(rezeptData));
        console.log(rezeptList)
        return rezeptList;
    }).catch((error) => {
        console.error("Fehler beim Abrufen der Rezepte:", error);
        throw error; // Fehler weitergeben
    });
}

    // Wg related URLS
    #addWgURL = () => `${this.#EatSmarterServerBaseURL}/wg`;
    #deleteWgURL = (wgName) => `${this.#EatSmarterServerBaseURL}/wg/user/${wgName}`;
    #getWgbyURL = (wgName) => `${this.#EatSmarterServerBaseURL}/wg/${wgName}`;
    #getWgByUserURL = (email) => `${this.#EatSmarterServerBaseURL}/wg/user/${email}`;
    #updateWgURL = (wgBo) => `${this.#EatSmarterServerBaseURL}/wg`;

     addWg(wgBO){
        return this.#fetchAdvanced(this.#addWgURL(), {
            method: "POST",
            headers: {
                "Accept": "application/json, text/plain",
                "Content-type": "application/json",
            },
            body: JSON.stringify(wgBO)
        }).then((responseJSON) => {
            let responseWgBO = WgBO.fromJSON(responseJSON)[0];
            return new Promise(function(resolve){
                resolve(responseWgBO);
            })
        })
    }


    updateWg(wgBO){
    return this.#fetchAdvanced(this.#updateWgURL(wgBO), {
        method: "PUT",
        headers: {
            "Accept": "application/json, text/plain",
            "Content-type": "application/json",
        },
        body: JSON.stringify(wgBO)
    }).then((responseJSON) => {
        let responseWgBO = WgBO.fromJSON(responseJSON)[0];
        return new Promise(function(resolve){
            resolve(responseWgBO);
        })
    })
}
    getWGbyName(wgName) {
        return this.#fetchAdvanced(this.#getWgbyURL(wgName), {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
        }).then((responseJSON) => {
            let responseWgBO = WgBO.fromJSON(responseJSON)[0];
            return new Promise(function(resolve){
                resolve(responseWgBO);
            });
        });
    }

    getWgByUser(email){
        return this.#fetchAdvanced(this.#getWgByUserURL(email), {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
        }).then((response) => {
            let responseWgBO = WgBO.fromJSON(response)[0];
            return new Promise(function (resolve){
                resolve(responseWgBO);
            });
        });
    }

    deleteWgByName(wgName){
        return this.#fetchAdvanced(this.#deleteWgURL(wgName),{
            method: "DELETE",
            headers: {
                "Accept": "application/json, text/plain",
                "Content-type": "application/json",
            },
            body: JSON.stringify(wgName)
        }).then((responseJSON) => {
            // console.log("Entfernte Wg", responseJSON)
            return new Promise( function(resolve) {
                resolve(responseJSON);
            })
        })
    }

    // Wg-attribute related
    #getWgAdminURL = (email) => `${this.#EatSmarterServerBaseURL}/wg/user/wgAdmin/${email}`;

    checkIfUserIsWgAdmin(currentUser){
        // console.log("api", currentUser)
         return this.#fetchAdvanced(this.#getWgAdminURL(currentUser), {
             method: "GET",
             headers: {
                 "Accept": "application/json",
                 "Content-Type": "application/json",
             },
         }).then((response) => {
             // console.log("API",response)
             if(response === true){
                 return true;
             }
             else{
                 return false;
             }
        });

    }


    // User related API-Calls:
    #addUserURL = () => `${this.#EatSmarterServerBaseURL}/login`;
    #getUserURL = (google_id) => `${this.#EatSmarterServerBaseURL}/login/${google_id}`;
    addUser(personBO){
        return this.#fetchAdvanced(this.#addUserURL(), {
            method: "POST",
            headers: {
                "Accept": "application/json, text/plain",
                "Content-type": "application/json",
            },
            body: JSON.stringify(personBO)
        }).then((responseJSON) => {
            let response = PersonBO.fromJSON(responseJSON)[0];
            return new Promise(function(resolve){
                resolve(response);
            })
        })
    }

     /**
     * API-Aufruf um einen User auszulesen
     * @param google_id = GoogleID eines Users.
     */
    getUserByGID(google_id) {
        return this.#fetchAdvanced(this.#getUserURL(google_id))
            .then((responseJSON) => {
            let response = PersonBO.fromJSON(responseJSON);
            return new Promise(function (resolve) {
                resolve(response);
            })
        })
    }




}