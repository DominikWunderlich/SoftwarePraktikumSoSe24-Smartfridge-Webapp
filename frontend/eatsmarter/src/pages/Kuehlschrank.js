import React, { useEffect, useState } from "react";
import '../sytles/WG-Landingpage.css';
import LebensmittelBO from "../api/LebensmittelBO";
import MasseinheitBO from "../api/MasseinheitBO";
import mengenanzahlBO from "../api/mengenanzahlBO";
import { Link } from "react-router-dom";
import EatSmarterAPI from "../api/EatSmarterAPI";
import NavBar from "../components/NavBar";



// function Kuehlschrank(props) {

//     const [lebensmittel, setLebensmittel] = useState([]);

//     // API-Aufruf beim Rendern der Komponente
//     console.log(props.kuehlschrank_id)
//     useEffect(() => {
//         // Funktion zum Laden der Lebensmittel vom Server
//         console.log(EatSmarterAPI);
//         const fetchLebensmittel = async () => {
//             try {
//                 // API-Aufruf, um Lebensmittel anhand der Kühlschrank-ID zu erhalten
//                 const lebensmittelListe = await EatSmarterAPI.getLebensmittelByKuehlschrankId(props.kuehlschrank_id);
//                 // Aktualisiere den Zustand mit den erhaltenen Daten 
//                 setLebensmittel(lebensmittelListe);
//             } catch (error) {
//                 console.error("Fehler beim Laden der Lebensmittel:", error);
//             }
//         };

//         // Rufe die Funktion zum Laden der Lebensmittel auf
//         fetchLebensmittel();
//     }, [props.kuehlschrank_id]); // Die Abhängigkeit props.kuehlschrank_id sorgt dafür, dass der Effekt bei Änderungen dieser Prop neu ausgeführt wird
    

function Kuehlschrankinhalt(props) {
    const [formData, setFormData] = useState({
        lebensmittelname: "",
        mengenanzahl: "",
        masseinheit: ""
    });

    const [lebensmittelliste, setLebensmittelliste] = useState([]);
    const [masseinheitenListe, setMasseinheitenListe] = useState([]);
    const [errors, setErrors] = useState({});
    const wg_id = props.wg_id;

    useEffect(() => {
        const fetchLebensmittel = async () => {
            try {
                const lebensmittelListe = await EatSmarterAPI.getAPI().getAllLebensmittelByWgID(wg_id);
                setLebensmittelliste(lebensmittelListe);
            } catch (error) {
                console.error("Fehler beim Laden der Lebensmittel:", error);
            }
        };

        fetchLebensmittel();
    }, [wg_id]); // Abhängigkeit wg_id sorgt dafür, dass der Effekt bei Änderungen dieser Prop neu ausgeführt wird

    return (
        <div>
            <NavBar currentUser={props.user} onSignOut={props.onSignOut}></NavBar> <br></br> <br></br>
            <div className="container">
                <h2>Kühlschrank</h2>
                <div className="inner-container">
                    {errors.message && <p>{errors.message}</p>}
                    <ul>
                        {lebensmittelliste.map((lebensmittel, index) => (
                            <li key={index}>
                                {lebensmittel.lebensmittelname} - {lebensmittel.mengenanzahl} {lebensmittel.masseinheit}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Kuehlschrankinhalt;