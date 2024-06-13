import React, { useEffect, useState } from "react";
import '../sytles/WG-Landingpage.css';
import LebensmittelBO from "../api/LebensmittelBO";
import EatSmarterAPI from "../api/EatSmarterAPI";
import NavBar from "../components/NavBar";
import TrimAndLowerCase from "../functions";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';


function Kuehlschrankinhalt(props) {
    
    const [formData, setFormData] = useState({
        lebensmittelName: "",
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

        if (formData.lebensmittelName.trim() === "" || formData.masseinheit.trim() === "" || isNaN(formData.mengenanzahl)) {
            setErrors({ message: "Bitte füllen Sie alle Felder aus." });
            return;
        }

        const newLebensmittel = new LebensmittelBO(
            TrimAndLowerCase(formData.lebensmittelName),
            formData.mengenanzahl,
            TrimAndLowerCase(formData.masseinheit),
            wgId,
            null
        );

        try {
            await EatSmarterAPI.getAPI().addFoodToFridge(newLebensmittel, wgId);

            // Kurze Verzögerung einfügen, um sicherzustellen, dass die Datenbankoperation abgeschlossen ist
            setTimeout(async () => {
                const lebensmittelListe = await EatSmarterAPI.getAPI().getAllLebensmittelByWgID(wgId);
                setLebensmittelliste(lebensmittelListe);
            }, 500); // 500 ms Verzögerung

            // Zurücksetzen des Formulars nach dem Hinzufügen
            setFormData({
                lebensmittelName: "",
                mengenanzahl: 0,
                masseinheit: ""
            });
            setErrors({});
        } catch (error) {
            console.error("Fehler beim Hinzufügen des Lebensmittels:", error);
        }
    };

     async function deleteLebensmittel (event){
        event.preventDefault()
        // LebensmittelId ist der Value aus dem button Klick event
        let lebensmittelId = event.target.value
        try {
            await EatSmarterAPI.getAPI().deleteFoodFromFridge(wgId, lebensmittelId);
            setLebensmittelliste(prevLebensmittelliste => prevLebensmittelliste.filter(item => item.id !== parseInt(lebensmittelId, 10)));
        } catch (error) {
            console.error("Fehler beim Löschen des Lebensmittels:", error);
        }
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
                                        <td>{lebensmittel.lebensmittelName}</td>
                                        <td>{lebensmittel.mengenanzahl}</td>
                                        <td>{lebensmittel.masseinheit}</td>
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
                            name="lebensmittelName"
                            list="lebensmittel"
                            value={formData.lebensmittelName}
                            onChange={handleChange}
                            className="eingabe"
                        />
                        <datalist id="lebensmittel">
                            {lebensmittelliste.map((lebensmittel, index) => (
                                <option key={index} value={lebensmittel.lebensmittelName} />
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
