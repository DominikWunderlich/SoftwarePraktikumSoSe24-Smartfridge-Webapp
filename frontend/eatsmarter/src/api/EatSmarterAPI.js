import BusinessObject from "./BusinessObject";
import WgBO from "./WgBO";
import PersonBO from "./PersonBO";
import RezeptBO from "./RezeptBO";
import LebensmittelBO from "./LebensmittelBO";
import mengenanzahlBO from "./mengenanzahlBO";
import MasseinheitBO from "./MasseinheitBO";
import EinkaufslisteBO from "./EinkaufslisteBO";

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

    #getRezeptURL = () => `${this.#EatSmarterServerBaseURL}/rezept`;


    //Ich glaube die getRezepteByWg Methode stimmt
    #getRezepteByWgURL = (wg_name) => `${this.#EatSmarterServerBaseURL}/rezept/${wg_name}`;
    #getRezeptByIdURL = (rezept_id) => `${this.#EatSmarterServerBaseURL}/rezept/einrezept/${rezept_id}`;

    #lebensmittelZuRezeptURL = (rezept_id) => `${this.#EatSmarterServerBaseURL}/rezeptt/${rezept_id}/lebensmittel`;

    lebensmittelZuRezeptHinzufuegen(rezept_id, newLebensmittel){
        return this.#fetchAdvanced(this.#lebensmittelZuRezeptURL(rezept_id),{
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newLebensmittel)
        }).then((responseJSON) => {
            // Hier könntest du die Antwort verarbeiten, falls benötigt
            return responseJSON;
        }).catch((error) => {
            console.error("Fehler beim Hinzufügen von Lebensmittel zum Rezept:", error);
            throw error;
        });
    }

    getRezeptById(rezept_id){
    return this.#fetchAdvanced(this.#getRezeptByIdURL(rezept_id),{
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
    }).then((response) =>{
        let rezept = RezeptBO.fromJSON(response);
        return new Promise(function(resolve){
            resolve(rezept);
        });
    });
    }
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

    //Rezept löschen deleteRezept
    #deleteRezeptURL = (rezeptId) => `${this.#EatSmarterServerBaseURL}/rezept/${rezeptId}`;


    deleteRezept(rezeptId) {
        return this.#fetchAdvanced(this.#deleteRezeptURL(rezeptId), {
            method: "DELETE",
            headers: {
                "Accept": "application/json, text/plain",
                "Content-type": "application/json",
            }
        }).then((response) => {
            if (!response.ok) {
                throw new Error(`Fehler beim Löschen des Rezepts mit ID ${rezeptId}: ${response.statusText}`);
            }
            return response.json();
        }).then((responseJSON) => {
            let removedRezeptBO = RezeptBO.fromJSON(responseJSON)[0];
            return new Promise(function(resolve) {
                resolve(removedRezeptBO);
            });
        });
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

    #getLebensmittelbyURL =()=> `${this.#EatSmarterServerBaseURL}/lebensmittelverwaltung/<LebensmittelName>`;

    getLebensmittelbyName(lebensmittel_name) {
        return this.#fetchAdvanced(this.#getLebensmittelbyURL(),{
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

    #getMasseinheitAll =()=> `${this.#EatSmarterServerBaseURL}/masseinheit`;

    getMasseinheitAll() {
        return this.#fetchAdvanced(this.#getMasseinheitAll(), {
            method: "GET",
            headers: {
                "Accept": "application/json, text/plain",
                "Content-type": "application/json",
            },
        }).then((responseJSON) => {
            return MasseinheitBO.fromJSON(responseJSON);
        });
    }


    #getAllLebensmittelangabe =()=> `${this.#EatSmarterServerBaseURL}/lebensmittelverwaltung`;

    getAllLebensmittelangabe() {
        return this.#fetchAdvanced(this.#getAllLebensmittelangabe(), {
            method: "GET",
            headers: {
                "Accept": "application/json, text/plain",
                "Content-type": "application/json",
            },
        }).then((responseJSON) => {
            console.log("Response in Eatsmarterapi", responseJSON)
            return LebensmittelBO.fromJSON(responseJSON);
        });
    }


    #getAllLebensmittelByWgURL = (wg_id) => `${this.#EatSmarterServerBaseURL}/kuehlschrankinhalt/${wg_id}`;
    #getAllLebensmittelByRezeptURL = (rezept_id) => `${this.#EatSmarterServerBaseURL}/rezeptt/${rezept_id}/lebensmittel`;

    getAllLebensmittelByRezeptId(rezept_id){
        console.log("API URL getallLebensmittel:", this.#getAllLebensmittelByRezeptURL(rezept_id));
        return this.#fetchAdvanced(this.#getAllLebensmittelByRezeptURL(rezept_id), {
            method: "GET",
            headers: {
                "Accept": "application/json, text/plain",
                "Content-type": "application/json",
            },
        }).then((responseJSON) => {
            console.log("Response in Eatsmarterapi", responseJSON);
            return LebensmittelBO.fromJSON(responseJSON);
        });
    }
    getAllLebensmittelByWgID(wg_id) {
        console.log("API URL getallLebensmittel:", this.#getAllLebensmittelByWgURL(wg_id));
        return this.#fetchAdvanced(this.#getAllLebensmittelByWgURL(wg_id), {
            method: "GET",
            headers: {
                "Accept": "application/json, text/plain",
                "Content-type": "application/json",
            },
        }).then((responseJSON) => {
            console.log("Response in Eatsmarterapi", responseJSON);
            return LebensmittelBO.fromJSON(responseJSON);
        });
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
    #sendRezeptIdToBackendURL = (rezept_id, email) => `${this.#EatSmarterServerBaseURL}/rezept/send/${rezept_id}/${email}`;

    sendRezeptIdToBackend(rezept_id, email) {
    return this.#fetchAdvanced(this.#sendRezeptIdToBackendURL(rezept_id, email), {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        }
    }).then((responseJSON) => {
        // TODO: Error-Handling wenn alle Lebensmittel eines Rezepts verfügbar sind. Siehe Notion
        // https://www.notion.so/b3d6e4807e684ff3a68df0da32a4704d?v=151fa08464574a0592e2126cf6399ae9&p=25f590eba1204f288536d5b9a9e35e96&pm=s
        let shoppingList = responseJSON.map(data => EinkaufslisteBO.fromJSON(data));
        return shoppingList;
    }).catch((error) => {
        console.error("Fehler beim Senden der Rezept-ID:", error);
        throw error;
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

    // Kühlschrank related API-Calls:
    #addFoodToFridgeURL = (wgid) => `${this.#EatSmarterServerBaseURL}/kuehlschrankinhalt/${wgid}`;

    addFoodToFridge(BO, wgid){
        return this.#fetchAdvanced(this.#addFoodToFridgeURL(wgid), {
            method: "POST",
            headers: {
                "Accept": "application/json, text/plain",
                "Content-type": "application/json",
            },
            body: JSON.stringify(BO, wgid)
        }).then((responseJSON) => {
            let responseLebensmittelBO = LebensmittelBO.fromJSON(responseJSON)[0];
            return new Promise(function(resolve){
                resolve(responseLebensmittelBO);
            })
        })
    }
    #kuehlschrankInhaltByIdURL = (wg_id) => `${this.#EatSmarterServerBaseURL}/kuehlschrankinhalt/${wg_id}`;
    /**
     * API-Aufruf um den Inhalt eines Kühlschranks anhand seiner ID auszulesen
     * @param id = ID eines Kühlschranks.
     */
    getLebensmittelByKuehlschrankId(wg_id) {
        console.log("API-Aufruf URL:", this.#kuehlschrankInhaltByIdURL(wg_id));
        return this.#fetchAdvanced(this.#kuehlschrankInhaltByIdURL(wg_id), {
            method: "GET",
            headers: {
                "Accept": "application/json, text/plain",
                "Content-type": "application/json",
            }
        }).then((responseJSON) => {
            // Die JSON-Antwort in eine Liste von LebensmittelBO-Objekten umwandeln
            return LebensmittelBO.fromJSON(responseJSON);
        }).catch((error) => {
            console.error("Fehler beim Abrufen der Lebensmittel im Kühlschrank:", error);
            throw error; // Fehler weitergeben
        });
    }
}
