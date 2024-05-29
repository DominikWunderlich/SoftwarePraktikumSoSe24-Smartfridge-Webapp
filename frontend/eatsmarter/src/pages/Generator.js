import React, { useEffect, useState } from "react";
import '../sytles/WG-Landingpage.css';
import LebensmittelBO from "../api/LebensmittelBO";
import MasseinheitBO from "../api/MasseinheitBO";
import mengenanzahlBO from "../api/mengenanzahlBO";
import { Link } from "react-router-dom";
import EatSmarterAPI from "../api/EatSmarterAPI";
import NavBar from "../components/NavBar";
import Lebensmittelverwaltung from "./Lebensmittel-Verwaltung";


function Kuehlschrankinhalt(props) {
    const [formData, setFormData] = useState({
        lebensmittelname: "",
        mengenanzahl: 0,
        masseinheit: ""
    });

    const [lebensmittelliste, setLebensmittelliste] = useState([]);
    const [masseinheitenListe, setMasseinheitenListe] = useState([]);
    const [errors, setErrors] = useState({});
    const [wgId, setWgId] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                // Rufe die Funktion renderCurrentUsersWg auf, um die wgId zu aktualisieren
                await renderCurrentUsersWg();
            } catch (error) {
                console.error("Fehler beim Laden der aktuellen WG des Benutzers:", error);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        async function fetchLebensmittel() {
            try {
                // Stellt sicher dass wgId vorm API-Aufruf nicht 0 ist 
                if (wgId !== null) {
                    const lebensmittelListe = await EatSmarterAPI.getAPI().getAllLebensmittelByWgID(wgId);
                    console.log("lebensmittelliste in kuehlschrank.js ", lebensmittelListe);
                    setLebensmittelliste(lebensmittelListe);
                }
            } catch (error) {
                console.error("Fehler beim Laden der Lebensmittel:", error);
            }
        }
        fetchLebensmittel();
        const fetchMasseinheiten = async () => {
            try {
                const masseinheiten = await EatSmarterAPI.getAPI().getMasseinheitAll();
                setMasseinheitenListe(masseinheiten);
            } catch (error) {
                console.error("Fehler beim Laden der Maßeinheiten:", error);
            }
        };

        fetchMasseinheiten();
    }, [wgId]);

    async function renderCurrentUsersWg() {
        try {
            // Rufe die WG des Benutzers ab und aktualisiere die wgId
            const response = await EatSmarterAPI.getAPI().getWgByUser(props.user.email);
            setWgId(response.id);
        } catch (error) {
            console.error("Fehler beim Laden der aktuellen WG des Benutzers:", error);
        }
    }


    return (
        <div>
            <NavBar currentUser={props.user} onSignOut={props.onSignOut}></NavBar> <br></br> <br></br>
            <div className="container">
                <div className="inner-container">
                    <h2>Generator</h2>
                    <div className="mini-container">
                        <p>Koche ein Rezept deiner Wahl oder lass dir anhand des Kühlschrankinhalts Rezepte vorschlagen und verwerte deine Lebensmittel smart.</p>
                    </div>
                    <Link to="/RezeptAnzeigen">
                        <button className="button" type="button">Rezept deiner Wahl kochen</button>
                    </Link>
                    <button className="button" type="button">Lebensmittelverwertung starten</button>
                </div>
                <br></br>
                <div className="inner-container">
                    <h2>Ergebnisse</h2>
                    <div className="mini-container">
                        <p>Platzhalter für Ergebnisse des Generators</p>
                    </div>
                </div>
                        
            </div>
        </div>
    );
}

export default Kuehlschrankinhalt;
