import React, { useState, useEffect } from "react";
import '../sytles/WG-Landingpage.css';
import EatSmarterAPI from "../api/EatSmarterAPI";
import NavBar from "../components/NavBar";


function Kuehlschrank(props) {

    const [lebensmittel, setLebensmittel] = useState([]);

    // API-Aufruf beim Rendern der Komponente
    useEffect(() => {
        // Funktion zum Laden der Lebensmittel vom Server
        const fetchLebensmittel = async () => {
            try {
                // API-Aufruf, um Lebensmittel anhand der Kühlschrank-ID zu erhalten
                const lebensmittelListe = await EatSmarterAPI.getLebensmittelByKuehlschrankId(props.kuehlschrank_id);
                // Aktualisiere den Zustand mit den erhaltenen Daten
                setLebensmittel(lebensmittelListe);
            } catch (error) {
                console.error("Fehler beim Laden der Lebensmittel:", error);
            }
        };

        // Rufe die Funktion zum Laden der Lebensmittel auf
        fetchLebensmittel();
    }, [props.kuehlschrank_id]); // Die Abhängigkeit props.kuehlschrank_id sorgt dafür, dass der Effekt bei Änderungen dieser Prop neu ausgeführt wird

    return (
        <div>
            <NavBar currentUser={props.user} onSignOut={props.onSignOut}></NavBar> <br></br> <br></br>
            <div className="container">
                <h2>Kühlschrank</h2>
                <div className="inner-container">
                    <p>test1</p>
                </div>
            </div>
        </div>
    );
}

export default Kuehlschrank;