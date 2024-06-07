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

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleEditMasseinheit = async (lebensmittelId) => {
        const newMasseinheit = prompt("Neue Maßeinheit eingeben:");
        if (newMasseinheit) {
            try {
                const updatedMasseinheit = new MasseinheitBO(newMasseinheit);
                console.log(updatedMasseinheit)
                console.log(lebensmittelId)
                await EatSmarterAPI.getAPI().updateMasseinheit(lebensmittelId, updatedMasseinheit);
                setLebensmittelliste(prevList => prevList.map(item => 
                    item.id === lebensmittelId ? { ...item, masseinheit: newMasseinheit } : item
                ));
            } catch (error) {
                console.error("Fehler beim Aktualisieren:", error);
                setErrors({ message: "Fehler beim Aktualisieren der Maßeinheit." });
            }
        }
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

    // Mit dieser Funktion kann das Lebensmittel aus dem Kuehlschrank gelöscht werden
    async function deleteLebensmittel (event){
        event.preventDefault()
        // LebensmittelId ist der Value aus dem button Klick event
        let lebensmittelId = event.target.value
        // console.log("Das ist die Lebensmittel id welche gelöscht werden soll", lebensmittelId)
        // console.log("Das ist die kuehlschrank_id", wgId)
        await EatSmarterAPI.getAPI().deleteFoodFromFridge(wgId, lebensmittelId)
        // Reload page nachdem Lebensmittel erfolgreich gelöscht wurde
        window.location.reload()
    }

    
    return (
        <div>
            <NavBar currentUser={props.user} onSignOut={props.onSignOut}></NavBar> <br></br> <br></br>
            <div className="container">
                <div className="inner-container">
                <h2>Kühlschrank</h2>
                    <div className="mini-container">
                        {errors.message && <p>{errors.message}</p>}
                        <table>
                            <thead>
                                <tr>
                                    <th>Lebensmittelname</th>
                                    <th>Mengenanzahl</th>
                                    <th>Maßeinheit</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {lebensmittelliste.map((lebensmittel, index) => (
                                    <tr key={index}>
                                        <td>{lebensmittel.lebensmittelname}</td>
                                        <td>{lebensmittel.mengenanzahl}</td>
                                        <td>{lebensmittel.masseinheit}</td>
                                        <td><button onClick={() => handleEditMasseinheit(lebensmittel.id)}>Bearbeiten</button></td>
                                        <td>
                                            <button value={lebensmittel.id} onClick={deleteLebensmittel}>-</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <br></br>
                <div className="inner-container">
                    <div className='formitem'>
                        <h2>Lebensmittel hinzufügen</h2>
                        {errors.message && <p>{errors.message}</p>}
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
        </div>
    );
}

export default Kuehlschrankinhalt;
