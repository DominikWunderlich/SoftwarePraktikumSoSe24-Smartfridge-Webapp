import React, { useEffect, useState } from "react";
import '../sytles/WG-Landingpage.css';
import LebensmittelBO from "../api/LebensmittelBO";
import EatSmarterAPI from "../api/EatSmarterAPI";
import NavBar from "../components/NavBar";
import TrimAndLowerCase from "../functions";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import Button from '@mui/material/Button';

function Kuehlschrankinhalt(props) {

    // fürs Lebensmittelobjekt
    const [formData, setFormData] = useState({
        lebensmittelName: "",
        mengenanzahl: 0,
        masseinheit: ""
    });

    // fürs Bearbeiten des Lebensmittelobjekts
    const [editFormData, setEditFormData] = useState({
        lebensmittelName: "",
        mengenanzahl: 0,
        masseinheit: "",
        kuehlschrankId: 0,
        rezeptId: 0
    });

    const [lebensmittelliste, setLebensmittelliste] = useState([]);
    const [masseinheitenListe, setMasseinheitenListe] = useState([]);
    const [errors, setErrors] = useState({});
    const [wgId, setWgId] = useState(null);
    const [customMasseinheit, setCustomMasseinheit] = useState("");
    const [editMode, setEditMode] = useState(null);  // Zustand für den Bearbeitungsmodus
    
    /* Funktionen für die Formularverarbeitung und aktualisieren der Lebensmittel/Maßeinheitenliste */
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
            const lebensmittelListe = await EatSmarterAPI.getAPI().getAllLebensmittelByWgID(wgId);
            
            // Zurücksetzen des Formulars nach dem Hinzufügen
            setFormData({
                lebensmittelName: "",
                mengenanzahl: 0,
                masseinheit: ""
            });
            setErrors({});

            // Aktualisieren der Lebensmittelliste
            await setLebensmittelliste(lebensmittelListe);
        } catch (error) {
            console.error("Fehler beim Hinzufügen des Lebensmittels:", error);
        }
    };

    /* Funktionen für Daten die, geladen werden müssen */
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

    const fetchMasseinheiten = async () => {
        try {
            const masseinheiten = await EatSmarterAPI.getAPI().getMasseinheitAll();
            setMasseinheitenListe(masseinheiten);
        } catch (error) {
            console.error("Fehler beim Laden der Maßeinheiten:", error);
        }
    };

    useEffect(() => {
        fetchLebensmittel();
        fetchMasseinheiten();
    }, [wgId]);

   /* Funktionen für das Laden der aktuellen WG des Benutzers */
   async function renderCurrentUsersWg() {
        try {
            const response = await EatSmarterAPI.getAPI().getWgByUser(props.user.email);
            setWgId(response.id);
        } catch (error) {
            console.error("Fehler beim Laden der aktuellen WG des Benutzers:", error);
        }
    }

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

    /* Funktionen für das Bearbeiten und Speichern Lebensmittel/Maßeinheit/Mengenangabe */
    const handleEditChange = (event) => {
        setEditFormData({
            ...editFormData,
            [event.target.name]: event.target.value
        });
    };

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

            await fetchLebensmittel();
        } catch (error) {
            console.error("Fehler beim Aktualisieren:", error);
            setErrors({ message: "Fehler beim Aktualisieren der Lebensmittel." });
        }
    };

    /* Funktionen zum Löschen des Rezepts und enthaltender Lebensmittel */
    async function deleteLebensmittel (lebensmittelId){
        try {
            await EatSmarterAPI.getAPI().deleteFoodFromFridge(wgId, lebensmittelId);
            setLebensmittelliste(prevLebensmittelliste => prevLebensmittelliste.filter(item => item.id !== parseInt(lebensmittelId, 10)));
        } catch (error) {
            console.error("Fehler beim Löschen des Lebensmittels:", error);
        }
    }

     /* Darstellung der Komponente */
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
                                                    <TaskAltIcon onClick={() => handleSaveEdit(lebensmittel.id)}/>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td>{lebensmittel.lebensmittelName}</td>
                                                <td>{lebensmittel.mengenanzahl}</td>
                                                <td>{lebensmittel.masseinheit}</td>
                                                <td>
                                                    <ModeEditIcon onClick={() => handleEditMasseinheit(lebensmittel)} />
                                                </td>
                                            </>
                                        )}
                                        <td>
                                            <DeleteIcon onClick={() => deleteLebensmittel(lebensmittel.id)} />
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
                        <div className="input-with-button">
                            <div className="inner-input-with-button">
                                <input
                                    type="text"
                                    name="masseinheit"
                                    list="masseinheiten"
                                    value={formData.masseinheit}
                                    onChange={handleChange}
                                    className="eingabe"
                                />
                                <Button onClick={handleCustomMasseinheit} className="edit-icon"  variant="outlined" startIcon={<ModeEditIcon />}>
                                    eigene Maßeinheit
                                </Button>
                            </div>
                        </div>
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