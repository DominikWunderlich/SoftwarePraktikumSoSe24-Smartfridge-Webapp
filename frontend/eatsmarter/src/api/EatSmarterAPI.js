import BusinessObject from "./BusinessObject";
import WgBO from "./WgBO";
import PersonBO from "./PersonBO";
import RezeptBO from "./RezeptBO";
import LebensmittelBO from "./LebensmittelBO";

export default class EatSmarterAPI{

    // Singleton instance
    static #api = null;

    // Local python backend
    #EatSmarterServerBaseURL = "/system";

    // Rezept related URLS
    #addRezeptURL = () => `${this.#EatSmarterServerBaseURL}/rezept`;
    #deleteRezeptURL = () => `${this.#EatSmarterServerBaseURL}/rezept/<rezept_name>`;

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
    #deleteLebensmittelURL = () => `${this.#EatSmarterServerBaseURL}/lebensmittelverwaltung/<LebensmittelName>`;

    addLebensmittel(LebensmittelBO){
        return this.#fetchAdvanced(this.#addLebensmittelURL(), {
            method: "POST",
            headers: {
                "Accept": "application/json, text/plain",
                "Content-type": "application/json",
            },
            body: JSON.stringify(LebensmittelBO)
        }).then((responseJSON) => {
            let responseLebensmittelBO = LebensmittelBO.fromJSON(responseJSON)[0];
            return new Promise(function(resolve){
                resolve(responseLebensmittelBO);
            })
        })
    }

    #getLebensmittebyURL =()=> `${this.#EatSmarterServerBaseURL}/lebensmittelverwaltung/<LebensmittelName>`;

    getLebensmittelbyName(lebensmittelname) {
        return this.#fetchAdvanced(this.#getLebensmittebyURL(),{
            method: "GET",
            headers: {
                "Accept": "application/json, text/plain",
                "Content-type": "application/json",
            },
            body: JSON.stringify(lebensmittelname)
        }).then((responseJSON)=> {
            let responseLebensmittelBO = LebensmittelBO.fromJSON(responseJSON)[0];
            return new Promise(function(resolve){
                resolve(responseLebensmittelBO);
            })
        })
    }

    deleteLebensmittelByName(lebensmittelname){
        return this.#fetchAdvanced(this.#deleteLebensmittelURL(),{
            method: "DELETE",
            headers: {
                "Accept": "application/json, text/plain",
                "Content-type": "application/json",
            },
            body: JSON.stringify(lebensmittelname)
        }).then((responseJSON) => {
            let removedLebensmittelBO = LebensmittelBO.fromJSON(responseJSON)[0];
            return new Promise( function(resolve) {
                resolve(responseJSON);
            })
        })
    }

    // Wg related URLS
    #addWgURL = () => `${this.#EatSmarterServerBaseURL}/wg`;
    #deleteWgURL = () => `${this.#EatSmarterServerBaseURL}/wg/<wg_name>`;

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

    #getWgbyURL = () => `${this.#EatSmarterServerBaseURL}/wg/<wg_name>`;

    getWGbyName(name) {
        return this.#fetchAdvanced(this.#getWgbyURL(), {
            method: "GET",
            headers: {
                "Accept": "application/json, text/plain",
                "Content-type": "application/json",
            },
            body: JSON.stringify(name)
        }).then((responseJSON) => {
            let responseWgBO = WgBO.fromJSON(responseJSON)[0];
            return new Promise(function(resolve){
                resolve(responseWgBO);
            })
        })
    }

    deleteWgByName(wgName){
        return this.#fetchAdvanced(this.#deleteWgURL(),{
            method: "DELETE",
            headers: {
                "Accept": "application/json, text/plain",
                "Content-type": "application/json",
            },
            body: JSON.stringify(wgName)
        }).then((responseJSON) => {
            let removedWgBO = WgBO.fromJSON(responseJSON)[0];
            return new Promise( function(resolve) {
                resolve(responseJSON);
            })
        })
    }


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

    // User related API-Calls:
    #addUserURL = () => `${this.#EatSmarterServerBaseURL}/login`;
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



}