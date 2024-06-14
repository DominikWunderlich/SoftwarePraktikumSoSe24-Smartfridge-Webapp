import React, { useEffect, useState } from "react";
import '../sytles/WG-Landingpage.css';
import LebensmittelBO from "../api/LebensmittelBO";
import EatSmarterAPI from "../api/EatSmarterAPI";
import NavBar from "../components/NavBar";
import TrimAndLowerCase from "../functions";
import MasseinheitBO from "../api/MasseinheitBO";

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
    const [customMasseinheit, setCustomMasseinheit] = useState("");
    const [editMode, setEditMode] = useState(null);  // Zustand für den Bearbeitungsmodus
    const [editFormData, setEditFormData] = useState({
        lebensmittelName: "",
        mengenanzahl: 0,
        masseinheit: "",
        kuehlschrankId: 0,
        rezeptId: 0
    });

    useEffect(() => {
        async function fetchData() {
            try {
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
            const response = await EatSmarterAPI.getAPI().getWgByUser(props.user.email);
            setWgId(response.id);
        } catch (error) {
            console.error("Fehler beim Laden der aktuellen WG des Benutzers:", error);
        }
    }

    const handleCustomMasseinheit = () => {
        const customMasseinheit = prompt("Geben Sie Ihre eigene Maßeinheit ein:");
        if (customMasseinheit) {
            const grammMenge = prompt(`Geben Sie die Menge in Gramm für 1 ${customMasseinheit} ein:`);
            if (grammMenge) {
                setCustomMasseinheit(customMasseinheit);
                setFormData({
                    ...formData,
                    masseinheit: customMasseinheit
                });
            }
        }
    };

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleEditChange = (event) => {
        setEditFormData({
            ...editFormData,
            [event.target.name]: event.target.value
        });
    };

    const handleEditMasseinheit = (lebensmittel) => {
        setEditMode(lebensmittel.id);

        setEditFormData({
            lebensmittelName: lebensmittel.lebensmittelName,
            mengenanzahl: lebensmittel.mengenanzahl,
            masseinheit: lebensmittel.masseinheit,
            kuehlschrankId: lebensmittel.kuehlschrankId,
            rezeptId: lebensmittel.rezeptId
        });
    };
    const handleSaveEdit = async (lebensmittelId) => {
        try {
            // Erstellen des updated-food-Objekts.
            const updatedLebensmittel = new LebensmittelBO(
                editFormData.lebensmittelName,
                editFormData.mengenanzahl,
                editFormData.masseinheit,
                editFormData.kuehlschrankId,
                editFormData.rezeptId
            );
            updatedLebensmittel.id = lebensmittelId;

            await EatSmarterAPI.getAPI().updateFoodInFridge(updatedLebensmittel);
            setLebensmittelliste(prevList =>
                prevList.map(item =>
                    item.id === lebensmittelId ? updatedLebensmittel : item
                )
            );
            setEditMode(null);
        } catch (error) {
            console.error("Fehler beim Aktualisieren:", error);
            setErrors({ message: "Fehler beim Aktualisieren der Lebensmittel." });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (formData.lebensmittelName.trim() === "" || formData.masseinheit.trim() === "") {
            setErrors({ message: "Bitte füllen Sie alle Felder aus." });
            return;
        }

        const newLebensmittel = new LebensmittelBO(
            TrimAndLowerCase(formData.lebensmittelName),
            TrimAndLowerCase(formData.mengenanzahl),
            TrimAndLowerCase(formData.masseinheit),
            wgId,
            null
        );

        console.log("Neues Lebensmittel:", newLebensmittel);
        console.log("Übergebene wgId in test_kuehlschrank:", wgId)
        EatSmarterAPI.getAPI().addFoodToFridge(newLebensmittel, wgId);

        setFormData({
            lebensmittelName: "",
            mengenanzahl: 0,
            masseinheit: ""
        });
        setErrors({});
    };

    async function deleteLebensmittel(event) {
        event.preventDefault();
        let lebensmittelId = event.target.value;
        await EatSmarterAPI.getAPI().deleteFoodFromFridge(wgId, lebensmittelId);
        window.location.reload();
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
                                        {editMode === lebensmittel.id ? (
                                            <>
                                                <td>
                                                    <input
                                                        type="text"
                                                        name="lebensmittelName"
                                                        value={editFormData.lebensmittelName}
                                                        onChange={handleEditChange}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        name="mengenanzahl"
                                                        value={editFormData.mengenanzahl}
                                                        onChange={handleEditChange}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        name="masseinheit"
                                                        value={editFormData.masseinheit}
                                                        onChange={handleEditChange}
                                                    />
                                                </td>
                                                <td>
                                                    <button onClick={() => handleSaveEdit(lebensmittel.id)}>Speichern</button>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td>{lebensmittel.lebensmittelName}</td>
                                                <td>{lebensmittel.mengenanzahl}</td>
                                                <td>{lebensmittel.masseinheit}</td>
                                                <td>
                                                    <button onClick={() => handleEditMasseinheit(lebensmittel)}>Bearbeiten</button>
                                                </td>
                                            </>
                                        )}
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
                        <button className="button" type="button" onClick={handleCustomMasseinheit}>Eigene neue Maßeinheit eingeben</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Kuehlschrankinhalt;