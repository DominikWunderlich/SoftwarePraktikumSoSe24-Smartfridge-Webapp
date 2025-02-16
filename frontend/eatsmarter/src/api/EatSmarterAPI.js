/** Info: Die grundlegende Struktur unserer EatSmarterAPI wurde vom "Bankprojekt" übernommen  **/


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
    #getRezeptURL = () => `${this.#EatSmarterServerBaseURL}/rezept`;
    #getRezepteByWgURL = (wg_id) => `${this.#EatSmarterServerBaseURL}/rezept/${wg_id}`;
    #getRezeptByIdURL = (rezept_id) => `${this.#EatSmarterServerBaseURL}/rezept/einrezept/${rezept_id}`;
    #lebensmittelZuRezeptURL = (rezept_id) => `${this.#EatSmarterServerBaseURL}/rezeptt/${rezept_id}/lebensmittel`;
    #changeAnzahlPortionenInRezeptURL = (rezept_id) => `${this.#EatSmarterServerBaseURL}/rezept/einrezept/anzahlPortionen/updateundget/${rezept_id}`;
    #updateRezeptURL = (rezept_id) => `${this.#EatSmarterServerBaseURL}/rezept/einrezept/${rezept_id}`;
    #deleteRezeptURL = (rezeptId) => `${this.#EatSmarterServerBaseURL}/rezept/${rezeptId}`;
    #getRezeptAdminURL = (email, rezept_id) => `${this.#EatSmarterServerBaseURL}/rezept/user/${email}/${rezept_id}`;

    changePortionenInRezept(rezept_id, neueAnzahlPortionen){
        return this.#fetchAdvanced(this.#changeAnzahlPortionenInRezeptURL(rezept_id),{
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(neueAnzahlPortionen)
        }).then((responseJSON) => {
            return responseJSON;
        }).catch((error) => {
            console.error("Fehler", error);
            throw error;
        });
    }
    lebensmittelZuRezeptHinzufuegen(rezept_id, newLebensmittel){
        return this.#fetchAdvanced(this.#lebensmittelZuRezeptURL(rezept_id),{
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newLebensmittel)
        }).then((responseJSON) => {
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
    getRezepteByWg(wg_id){
    return this.#fetchAdvanced(this.#getRezepteByWgURL(wg_id), {
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

    deleteRezept(rezeptId) {
        console.log(rezeptId)
        return this.#fetchAdvanced(this.#deleteRezeptURL(rezeptId), {
            method: "DELETE",
            headers: {
                "Accept": "application/json, text/plain",
                "Content-type": "application/json",
            },
            body: JSON.stringify(rezeptId)
        }).then((responseJSON) => {
            return new Promise(function (resolve){
                resolve(responseJSON);
            })
        })

    }

     checkIfUserIsRezeptAdmin(currentUser, rezept_id){
         console.log("api", currentUser)
         return this.#fetchAdvanced(this.#getRezeptAdminURL(currentUser, rezept_id), {
             method: "GET",
             headers: {
                 "Accept": "application/json",
                 "Content-Type": "application/json",
             },
         }).then((response) => {
             console.log("API",response)
             if(response === true){
                 return true;
             }
             else{
                 return false;
             }
         });
     }

     /* Update eines Rezepts */
    updateRezept(rezeptBO){
        return this.#fetchAdvanced(this.#updateRezeptURL(rezeptBO.getID()), {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(rezeptBO)
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

    // Lebensmittel direkt aus dem Kuehlschrank löschen
    #deleteFoodFromFridgeURL = (wg_id, lebensmittel_id) => `${this.#EatSmarterServerBaseURL}/kuehlschrankinhalt/${wg_id}/${lebensmittel_id}`

    #deleteFoodFromRezeptURL = (rezept_id, lebensmittel_id) => `${this.#EatSmarterServerBaseURL}/rezeptinhalt/${rezept_id}/${lebensmittel_id}`

    deleteFoodFromFridge(wg_id, lebensmittel_id){
        return this.#fetchAdvanced(this.#deleteFoodFromFridgeURL(wg_id, lebensmittel_id),{
            method: "DELETE",
            headers: {
                "Accept": "application/json, text/plain",
                "Content-type": "application/json",
            },
            body: JSON.stringify(wg_id, lebensmittel_id)
        }).then((responseJSON) => {
            return new Promise( function(resolve) {
                resolve(responseJSON);
            })
        })

    }

    deleteFoodFromRezept(rezept_id, lebensmittel_id){
        return this.#fetchAdvanced(this.#deleteFoodFromRezeptURL(rezept_id, lebensmittel_id),{
            method: "DELETE",
            headers: {
                "Accept": "application/json, text/plain",
                "Content-type": "application/json",
            },
            body: JSON.stringify(rezept_id, lebensmittel_id)
        }).then((responseJSON) => {
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
    #updateMasseinheitURL = () => `${this.#EatSmarterServerBaseURL}/masseinheit`;


    #updateFoodInFridgeURL = (kid, lebensmittel_id) => `${this.#EatSmarterServerBaseURL}/kuehlschrankinhalt/${kid}/${lebensmittel_id}`
    updateFoodInFridge(updatedLebensmittel) {
        return this.#fetchAdvanced(this.#updateFoodInFridgeURL(updatedLebensmittel.kuehlschrankId, updatedLebensmittel.id), {
            method: "PUT",
            headers: {
                "Accept": "application/json, text/plain",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedLebensmittel)
        }).then((responseJSON) => {
            return new Promise(function(resolve) {
                resolve(responseJSON);
            })
        });
    }

    //Lebensmittel bearbeiten in Rezept
    #updateFoodInRezeptURL = (rezept_id, lebensmittel_id) => `${this.#EatSmarterServerBaseURL}/rezeptinhalt/${rezept_id}/${lebensmittel_id}`;

    updateFoodInRezept(updatedLebensmittelInRezept) {
        return this.#fetchAdvanced(this.#updateFoodInRezeptURL(updatedLebensmittelInRezept.rezeptId, updatedLebensmittelInRezept.id), {
            method: "PUT",
            headers: {
                "Accept": "application/json, text/plain",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedLebensmittelInRezept)
        }).then((responseJSON) => {
            return new Promise(function(resolve) {
                resolve(responseJSON);
            })
        });
    }

    //alle Rezepte die wir in der DB haben im Frontend anzeigen
    

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
        console.log("Eatsmarter 421 responseJSON:", responseJSON)
        let shoppingList = responseJSON.map(data => LebensmittelBO.fromJSON(data));
        return shoppingList;
    }).catch((error) => {
        console.error("Fehler beim Senden der Rezept-ID:", error);
        throw error;
    });
}

    // Wg related URLS
    #addWgURL = () => `${this.#EatSmarterServerBaseURL}/wg`;
    #deleteWgURL = (email) => `${this.#EatSmarterServerBaseURL}/wg/user/${email}`;
    #getWgbyURL = (wgName) => `${this.#EatSmarterServerBaseURL}/wg/${wgName}`;
    #getWgByUserURL = (email) => `${this.#EatSmarterServerBaseURL}/wg/user/${email}`;
    #getPersonByWgURL = (email) => `${this.#EatSmarterServerBaseURL}/wg/wg_bewohner/${email}`;
    #getWgAdminByEmailURL = (email) => `${this.#EatSmarterServerBaseURL}/wg/wgadmin/${email}`;
    #getWgAdminURL = (email) => `${this.#EatSmarterServerBaseURL}/wg/user/wgadmin/${email}`;

       /**
     * API-Aufruf um eine Wg zu erstellen
     * @param wgBO = Das im Frontend erstellte Wg BusinessObject.
     */
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

       /**
     * API-Aufruf um eine Wg anhand des WgNames zu finden
     * @param wgName = Das ist der Name der Wg
     */
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

    /**
     * API-Aufruf, um alle Bewohner der Wg anhand der E-Mail des eingeloggten Users zu finden
     * @param email = E-Mail des eingeloggten Users
     */
    getPersonByWg(email) {
        return this.#fetchAdvanced(this.#getPersonByWgURL(email), {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
        }).then((responseJSON) => {
            let responsePersonBO = PersonBO.fromJSON(responseJSON);
            return new Promise(function(resolve){
                resolve(responsePersonBO);
            });
        });
    }

    /**
     * API-Aufruf um eine Wg anhand des eingeloggten Users zu finden
     * @param email = E-Mail des eingeloggten Users
     */
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

    /**
     * API-Aufruf, um die Wg zu löschen
     * @param email = E-Mail des eingeloggten Users
     */
    deleteWg(email){
        return this.#fetchAdvanced(this.#deleteWgURL(email),{
            method: "DELETE",
            headers: {
                "Accept": "application/json, text/plain",
                "Content-type": "application/json",
            },
            body: JSON.stringify(email)
        }).then((responseJSON) => {
            return new Promise( function(resolve) {
                resolve(responseJSON);
            })
        })
    }

    /**
     * API-Aufruf, um das PersonBo des WgAdmins abzurufen
     * @param email = E-Mail des eingeloggten Users
     */
    getWgAdminByEmail(email){
        return this.#fetchAdvanced(this.#getWgAdminByEmailURL(email), {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
        }).then((responseJSON) => {
            let responsePersonBO = PersonBO.fromJSON(responseJSON);
            return new Promise(function(resolve){
                resolve(responsePersonBO);
            });
        });

    }

    /**
     * API-Aufruf, um zu prüfen, ob der eingeloggte Nutzer, der WgAdmin ist
     * @param currentUser = E-Mail des eingeloggten Users
     */
    checkIfUserIsWgAdmin(currentUser){
         return this.#fetchAdvanced(this.#getWgAdminURL(currentUser), {
             method: "GET",
             headers: {
                 "Accept": "application/json",
                 "Content-Type": "application/json",
             },
         }).then((response) => {
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
    #checkUserURL = (google_id) => `${this.#EatSmarterServerBaseURL}/login/check/${google_id}`;
    #getUserByEmailURL = (email) => `${this.#EatSmarterServerBaseURL}/login/checkemail/${email}`;
    #addPersonToWgURL = (wgId, email) => `${this.#EatSmarterServerBaseURL}/user/person/${wgId}/${email}`;
    #deletePersonFromWgURL = (wgId, personId) => `${this.#EatSmarterServerBaseURL}/user/person/delete/${wgId}/${personId}`;
    #deletePersonURL = (gid) => `${this.#EatSmarterServerBaseURL}/login/${gid}`;


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

    getUserByEmail(email) {
        return this.#fetchAdvanced(this.#getUserByEmailURL(email))
            .then((responseJSON) => {
                let response = PersonBO.fromJSON(responseJSON);
                return new Promise(function (resolve) {
                    resolve(response);
                })
            })
    }

         /**
     * API-Aufruf um einen User auszulesen
     * @param google_id = GoogleID eines Users.
     */
    checkUserByGID(google_id) {
        return this.#fetchAdvanced(this.#checkUserURL(google_id))
            .then((responseJSON) => {
            let response = PersonBO.fromJSON(responseJSON);
            return new Promise(function (resolve) {
                resolve(response);
            })
        })
    }

    addPersonToWg(wgId, email){
        return this.#fetchAdvanced(this.#addPersonToWgURL(wgId, email), {
            method: "PUT",
            headers: {
                "Accept": "application/json, text/plain",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(email)
        }).then((responseJSON) => {
            return new Promise(function(resolve){
                resolve(responseJSON)
            });
        });
    }

    deletePersonFromWg(wgId, personId){
        return this.#fetchAdvanced(this.#deletePersonFromWgURL(wgId, personId),{
            method: "PUT",
            headers: {
                "Accept": "application/json, text/plain",
                "Content-type": "application/json",
            },
            body: JSON.stringify(wgId, personId)
        }).then((responseJSON) => {
            let response = PersonBO.fromJSON(responseJSON)[0];
            return new Promise(function(resolve){
                resolve(response);
            });
        });
    }

    deletePerson(personBO){
        return this.#fetchAdvanced(this.#deletePersonURL(personBO.getgoogleId()), {
            method: "DELETE",
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json',
            },
            body: JSON.stringify(personBO)
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


    #getRezeptByGeneratorURL = (wg_id, kuehlschrank_id) => `${this.#EatSmarterServerBaseURL}/rezept/generator/${wg_id}/${kuehlschrank_id}`;
    getRezeptByGenerator(wg_id, kuehlschrank_id){
    return this.#fetchAdvanced(this.#getRezeptByGeneratorURL(wg_id, kuehlschrank_id),{
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
    }).then((responseJSON) =>{
        let rezept = RezeptBO.fromJSON(responseJSON);
        return new Promise(function(resolve){
            resolve(rezept);
        });
    });
    }

    #getRezeptByRezeptId = (rezept_id) => `${this.#EatSmarterServerBaseURL}/rezept/${rezept_id}`;
    getRezeptById2(rezept_id) {
    return this.#fetchAdvanced(this.#getRezeptByRezeptId(rezept_id), {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
    }).then((responseJSON) => {
        let rezept = RezeptBO.fromJSON(responseJSON);
        return new Promise(function(resolve) {
            resolve(rezept);
        });
    });
}
}
