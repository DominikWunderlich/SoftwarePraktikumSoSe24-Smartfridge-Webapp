import BusinessObject from "./BusinessObject";
import WgBO from "./WgBO";

export default class EatSmarterAPI{

    // Singleton instance
    static #api = null;

    // Local python backend
    // TODO: REPLACE "/" with local python backend
    #EatSmarterServerBaseUR = "/";

    // Wg related URLS
    // TODO: Add Wg related URLS e.g. for post, update & get


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

    // TODO: Add POST method for WG






}