import React, { useEffect, useState } from "react";
import '../sytles/WG-Landingpage.css';
import LebensmittelBO from "../api/LebensmittelBO";
import MasseinheitBO from "../api/MasseinheitBO";
import mengenanzahlBO from "../api/mengenanzahlBO";
import { Link } from "react-router-dom";
import EatSmarterAPI from "../api/EatSmarterAPI";
import NavBar from "../components/NavBar";


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

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (formData.lebensmittelname.trim() === "" || formData.masseinheit.trim() === "") {
            setErrors({ message: "Bitte füllen Sie alle Felder aus." });
            return;
        }

        const newLebensmittel = new LebensmittelBO(
            formData.lebensmittelname,
            formData.mengenanzahl,
            formData.masseinheit
        );

        try {
            await EatSmarterAPI.getAPI().addMasseinheit(new MasseinheitBO(formData.masseinheit));
            await EatSmarterAPI.getAPI().addMenge(new mengenanzahlBO(formData.mengenanzahl));
            await EatSmarterAPI.getAPI().addLebensmittel(newLebensmittel);

        } catch (error) {
            console.error("Fehler beim Hinzufügen von Lebensmittel:", error);
            setErrors({ message: "Fehler beim Hinzufügen von Lebensmittel. Bitte versuchen Sie es erneut." });
        }
        console.log("Neues Lebensmittel:", newLebensmittel);
        console.log("Übergebene wgId in test_kuehlschrank:", wgId)
        EatSmarterAPI.getAPI().addFoodToFridge(newLebensmittel, wgId);


        // Zurücksetzen des Formulars nach dem Hinzufügen
        setFormData({
            lebensmittelname: "",
            mengenanzahl: 0,
            masseinheit: ""
        });
        setErrors({});
    };

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
                               {`${lebensmittel.lebensmittelname} ${lebensmittel.mengenanzahl} ${lebensmittel.masseinheit}`}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className='container'>
                <h2>Lebensmittel hinzufügen</h2>
                {errors.message && <p>{errors.message}</p>}
                <div className='formitem'>

                    <label>Lebensmittelname</label>
                    <input
                        type="text"
                        name="lebensmittelname"
                        list="lebensmittel"
                        value={formData.lebensmittelname}
                        onChange={handleChange}
                        className="eingabe"
                    />
                    <datalist id="lebensmittel">
                        {lebensmittelliste.map((lebensmittel, index) => (
                            <option key={index} value={lebensmittel.lebensmittelname} />
                        ))}
                    </datalist>
                    <label>Menge</label>
                    <input
                        type="number"
                        name="mengenanzahl"
                        value={formData.mengenanzahl}
                        onChange={handleChange}
                        className="eingabe"
                    />

                    <label>Maßeinheit</label>
                    <input
                        type="text"
                        name="masseinheit"
                        list="masseinheiten"
                        value={formData.masseinheit}
                        onChange={handleChange}
                        className="eingabe"
                    />
                    <datalist id="masseinheiten">
                        {masseinheitenListe.map((masseinheit, index) => (
                            <option key={index} value={masseinheit.masseinheitsname} />
                        ))}
                    </datalist>
                    <button className="button" type="button" onClick={handleSubmit}>hinzufügen</button>
                </div>
            </div>
        </div>
    );
}

export default Kuehlschrankinhalt;
