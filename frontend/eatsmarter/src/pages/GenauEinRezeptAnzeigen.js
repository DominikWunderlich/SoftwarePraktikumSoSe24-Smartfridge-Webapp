import React, {useState, useEffect} from "react";
import EatSmarterAPI from "../api/EatSmarterAPI";
import '../sytles/WG-Landingpage.css';
import LebensmittelBO from "../api/LebensmittelBO";
import MasseinheitBO from "../api/MasseinheitBO";
import mengenanzahlBO from "../api/mengenanzahlBO";
import { useParams } from "react-router-dom"; 
import {useNavigate} from "react-router-dom";
import TrimAndLowerCase from "../functions";
import DeleteIcon from '@mui/icons-material/Delete';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import RezeptBO from "../api/RezeptBO";
import Button from '@mui/material/Button';
import NavBar from "../components/NavBar";
import ResponsiveAppBar from "../components/NavBar";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

function GenauEinRezeptAnzeigen(props) {

    const [formData, setFormData] = useState({
        lebensmittelname: "",
        mengenanzahl: "",
        masseinheit: "",
        kuehlschrankId: 0,
        rezeptId: 0
    });

     // fürs Bearbeiten des Lebensmittelobjekts
    const [editFormData, setEditFormData] = useState({
        lebensmittelName: "",
        mengenanzahl: 0,
        masseinheit: "",
        rezeptId: 0
    });

     // fürs Hinzufügen einer eigenen Maßeinheit
     const [customMasseinheitData, setCustomMasseinheitData] = useState({
        masseinheitsname: "",
        umrechnungsfaktor: ""
    });

    const [rezeptLebensmittel, setRezeptLebensmittel] = useState([]);
    const [lebensmittelliste, setLebensmittelliste] = useState([]);
    const [masseinheitenListe, setMasseinheitenListe] = useState([]);
    const [shoppingListElem, setShoppingListElem] = useState([]);
    const [customMasseinheit, setCustomMasseinheit] = useState("");
    const [rezept, setRezept] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isMasseinheitPopupOpen, setIsMasseinheitPopupOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const {rezeptId} = useParams();
    const navigate = useNavigate()
    const currentUser = props.user.email;
    const [editMode, setEditMode] = useState(null);  // Zustand für den Bearbeitungsmodus
    const [editLebensmittelId, setEditLebensmittelId] = useState(null); // Zustand für die Lebensmittel-ID im Bearbeitungsmodus
    const [isEditing, setIsEditing] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showNotAdminPopup, setShowNotAdminPopup] = useState(false);
    const [showNotAdminDeletePopup, setShowNotAdminDeletePopup] = useState(false);

    /* Funktionen für die Formularverarbeitung und aktualisieren der Lebensmittel/Maßeinheitenliste */
    const fetchAdmin = async () => {
        const admin = await EatSmarterAPI.getAPI().checkIfUserIsRezeptAdmin(currentUser, rezeptId);
        if (admin) {
            setIsAdmin(true)
        }
    }

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
        if (name==="anzahlPortionen") {
            setRezept(prevRezept => ({
                ...prevRezept,
                anzahlPortionen: value
            }));
        }
    };

    const handleSubmit = async (event) => {
        if (isAdmin) {
            event.preventDefault();

        if (formData.lebensmittelname.trim() === "" || formData.masseinheit.trim() === "") {
            setErrors({message: "Bitte füllen Sie alle Felder aus."});
            return;
        }

        const newMengenanzahl = new mengenanzahlBO(TrimAndLowerCase(formData.mengenanzahl));
        const newMasseinheit = new MasseinheitBO(
            TrimAndLowerCase(formData.masseinheit),
            0); // 0 steht für den Umrechnungsfaktor.
        const newLebensmittel = new LebensmittelBO(
            TrimAndLowerCase(formData.lebensmittelname),
            TrimAndLowerCase(formData.mengenanzahl),
            TrimAndLowerCase(formData.masseinheit),
            null,
            rezeptId
        );

        try {
            const api = new EatSmarterAPI();
            await api.lebensmittelZuRezeptHinzufuegen(rezeptId, newLebensmittel);
            await api.addMasseinheit(newMasseinheit);
            await api.addMenge(newMengenanzahl);

            setFormData({
                lebensmittelname: "",
                mengenanzahl: "",
                masseinheit: ""
            });
            setErrors({});

            // Aktualisiert die Lebensmittel/Maßeinheitenliste nach dem Hinzufügen
            await fetchRezeptLebensmittel();
            await fetchMasseinheiten();
        } catch (error) {
            console.error("Fehler beim Hinzufügen von Lebensmittel zum Rezept:", error);
        }
    }
        else{
            setShowNotAdminPopup(true);
        }
    }

    /* Funktionen für Daten die, geladen werden müssen */
    const fetchMasseinheiten = async () => {
        try {
            const masseinheiten = await EatSmarterAPI.getAPI().getMasseinheitAll();
            setMasseinheitenListe(masseinheiten);
        } catch (error) {
            console.error("Fehler beim Laden der Maßeinheiten:", error);
        }
    };

    const fetchLebensmittel = async () => {
        try {
            const lebensmittel = await EatSmarterAPI.getAPI().getAllLebensmittelangabe();
            setLebensmittelliste(lebensmittel);
        } catch (error) {
            console.error("Fehler beim Laden der Maßeinheiten:", error);
        }
    };

    const fetchRezeptById = async () => {
        try {
            const api = new EatSmarterAPI();
            const [rezept] = await api.getRezeptById(rezeptId);
            setRezept(rezept);
        } catch (error) {
            console.error("Fehler beim Abrufen des Rezepts:", error);
        }
    };

    const fetchRezeptLebensmittel = async () => {
        try {
            const api = new EatSmarterAPI();
            const lebensmittel = await api.getAllLebensmittelByRezeptId(rezeptId);
            setRezeptLebensmittel(lebensmittel);
        } catch (error) {
            console.error("Fehler beim Abrufen der Lebensmittel:", error);
        }
    };

    useEffect(() => {
        fetchMasseinheiten();
        fetchLebensmittel();
        fetchRezeptById();
        fetchRezeptLebensmittel();
        fetchAdmin();
    }, [rezeptId]);

    /* Funktionen für das Bearbeiten und Speichern Lebensmittel/Maßeinheit/Mengenangabe */
    const handleSaveEdit = async () => {
        try {
            // Erstellen des updated-food-Objekts.
            const updatedLebensmittelInRezept = new LebensmittelBO(
                editFormData.lebensmittelName,
                editFormData.mengenanzahl,
                editFormData.masseinheit,
                null,
                editFormData.rezeptId
            );
            updatedLebensmittelInRezept.id = editLebensmittelId;

            await EatSmarterAPI.getAPI().updateFoodInRezept(updatedLebensmittelInRezept);

            setEditMode(null);
            setEditLebensmittelId(null);

            // Rufen Sie die neuesten Lebensmitteldaten ab und aktualisieren Sie den Zustand
            await fetchRezeptLebensmittel();
        } catch (error) {
            console.error("Fehler beim Aktualisieren:", error);
            setErrors({ message: "Fehler beim Aktualisieren der Lebensmittel." });
        }
    };

    const handleEditChange = (event) => {
        setEditFormData({
            ...editFormData,
            [event.target.name]: event.target.value
        });
    };

    const handleEditMasseinheit = (lebensmittel) => {
        if (isAdmin){
            setEditMode(lebensmittel.id);
            setEditLebensmittelId(lebensmittel.id);

            setEditFormData({
                lebensmittelName: lebensmittel.lebensmittelName,
                mengenanzahl: lebensmittel.mengenanzahl,
                masseinheit: lebensmittel.masseinheit,
                rezeptId: lebensmittel.rezeptId
            });
        }
        else{
            setShowNotAdminPopup(true);
        }
    };

    /* Funktionen zum Kochen -> für eine Einkaufsliste oder Verbrauch von Lebensmittel */
    const handleJetztKochen = async () => {
        try {
            const api = new EatSmarterAPI();
            const shoppingList = await api.sendRezeptIdToBackend(rezeptId, props.user.email);
            setShoppingListElem(shoppingList.flat());
            setIsPopupOpen(true);
        } catch (error) {
            console.error("Fehler beim Senden der Rezept-ID:", error);
            alert("Fehler beim Senden der Rezept-ID.");
        }
    };

    const handleChangePortionenInRezept = async(neueAnzahlPortionen) => {
        try{
            const api = new EatSmarterAPI();
            await api.changePortionenInRezept(rezeptId, neueAnzahlPortionen);
            await fetchRezeptLebensmittel()
        } catch (error) {
            console.error("Fehler beim ändern der Anzahl", error);
            alert("Fehler beim senden der Anzahl");
        }
    }

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setIsMasseinheitPopupOpen(false);
        setShowNotAdminPopup(false);
        setShowNotAdminDeletePopup(false);
    };

    /* Funktionen für das Hinzufügen einer eigenen Maßeinheit */
    const addMasseinheit = async (masseinheitBO) => {
        try {
            const newMasseinheit = await EatSmarterAPI.getAPI().addMasseinheit(masseinheitBO);
            setMasseinheitenListe(prevList => [...prevList, newMasseinheit]);
            
        } catch (error) {
            console.error("Fehler beim Hinzufügen der Maßeinheit:", error);
        }
    };

    const handleCustomMasseinheit = () => {
        setIsMasseinheitPopupOpen(true);
    };

    const handlePopupInputChange = (event) => {
        const { name, value } = event.target;
        setCustomMasseinheitData({
            ...customMasseinheitData,
            [name]: value
        });
    };

    const handleSaveCustomMasseinheit = async () => {
        const { masseinheitsname, umrechnungsfaktor } = customMasseinheitData;

        if (masseinheitsname && umrechnungsfaktor) {
            const newMasseinheit = new MasseinheitBO(
                TrimAndLowerCase(masseinheitsname));
            newMasseinheit.setumrechnungsfaktor(parseFloat(umrechnungsfaktor));

            try {
                await addMasseinheit(newMasseinheit);

                setCustomMasseinheit(masseinheitsname);
                setFormData({
                    ...formData,
                    masseinheit: masseinheitsname
                });
                setIsMasseinheitPopupOpen(false);
                setCustomMasseinheitData({
                    masseinheitsname: "",
                    umrechnungsfaktor: ""
                });

                fetchMasseinheiten();
            } catch (error) {
                console.error("Fehler beim Hinzufügen der benutzerdefinierten Maßeinheit:", error);
            }
        } else {
            alert("Bitte füllen Sie beide Felder aus.");
        }
    };

    /* Funktionen zum Löschen des Rezepts und enthaltender Lebensmittel */
    const handleDelete = async () => {
        if (isAdmin) {
            const response = await EatSmarterAPI.getAPI().deleteRezept(rezeptId);
            console.log("Rezept Lösch-Response", response);
            navigate("/RezeptAnzeigen");
            alert("Das Rezept wurde erfolgreich gelöscht.");
            }
        else {
            setShowNotAdminDeletePopup(true);
            }
        }

        async function deleteLebensmittel(event, lebensmittelId) {
            event.preventDefault()
            if (isAdmin){
                // LebensmittelId ist der Value aus dem button Klick event
                try {
                    await EatSmarterAPI.getAPI().deleteFoodFromRezept(rezeptId, lebensmittelId);
                    setRezeptLebensmittel(prevRezeptLebensmittel => prevRezeptLebensmittel.filter(item => item.id !== parseInt(lebensmittelId, 10)));
                } catch (error) {
                    console.error("Fehler beim Löschen des Lebensmittels:", error);
                }
            }
            else{
                setShowNotAdminPopup(true);
            }
            };

    const handleChangeInstructions = async () => {
        if (isAdmin) {
            const newRecipe = new RezeptBO(
                rezept.rezeptName,
                rezept.anzahlPortionen,
                rezept.rezeptAdmin,
                rezept.wgId,
                rezept.rezeptAnleitung
            )
            newRecipe.setID(rezept.id);
            newRecipe.setWgId(rezept.wgId);
            await EatSmarterAPI.getAPI().updateRezept(newRecipe);
        }
        else {
            setShowNotAdminPopup(true);
        }
    }

    const handleChangeInstruction = (e) => {
        setRezept({
            ...rezept,
            [e.target.name]: e.target.value
        })
    }

    const toggleEditMode = () => {
        if(isAdmin){
            if (isEditing) {
                handleChangeInstructions();
            }
            setIsEditing(!isEditing);
        }
        else{
            setShowNotAdminPopup(true);
        }
    }

    /* Darstellung der Komponente */
    return (
        <div>
            <NavBar currentUser={props.user} onSignOut={props.onSignOut}/><br/><br/>
            <div className='container'>
                {rezept && ( // Nur anzeigen, wenn das Rezept geladen wurde
                    <div className='inner-container'>
                        <h2>Dein Rezept</h2>
                        <div className="mini-container">
                            <p className="blue-mini-container"> {rezept.rezeptName}</p>
                            <div className="in-a-row">
                                <p>Anzahl Portionen:</p>
                                <input
                                    className="mini-input"
                                    type="text"
                                    name="anzahlPortionen"
                                    value={parseInt(rezept.anzahlPortionen) || ""}
                                    onChange={handleChange}
                                />
                                <ChangeCircleIcon onClick={() => handleChangePortionenInRezept(rezept.anzahlPortionen)}/>
                            </div>
                            <div className="in-a-row">
                                <p>Kochanleitung:</p>
                                {isEditing ? (
                                    <textarea className={'input-container'}
                                        name="rezeptAnleitung"
                                        value={rezept.rezeptAnleitung}
                                        onChange={handleChangeInstruction}
                                    />
                                ) : (
                                    <p>{rezept.rezeptAnleitung}</p>
                                )}
                                <button className="mini-input" onClick={toggleEditMode}>
                                     {isEditing ? <TaskAltIcon/> : <ChangeCircleIcon/>}
                                </button>
                            </div>
                            <p>Ersteller: {rezept.rezeptAdmin}</p>
                            {errors.message && <p>{errors.message}</p>}
                            <table>
                            <thead>
                                <tr>
                                    <th>Lebensmittel</th>
                                    <th>Menge</th>
                                    <th>Maßeinheit</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {rezeptLebensmittel.map((lebensmittel, index) => (
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
                                                    <select
                                                        name="masseinheit"
                                                        value={editFormData.masseinheit}
                                                        onChange={handleEditChange}
                                                        className="eingabe"
                                                    >
                                                        <option value="" disabled>Bitte wählen Sie eine Masseinheit
                                                            aus
                                                        </option>
                                                        {masseinheitenListe.map((masseinheit, index) => (
                                                            <option key={index} value={masseinheit.masseinheitsname}>
                                                                {masseinheit.masseinheitsname}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td>
                                                    <TaskAltIcon onClick={() => handleSaveEdit()}/>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td>{lebensmittel.lebensmittelName}</td>
                                                <td>{lebensmittel.mengenanzahl}</td>
                                                <td>{lebensmittel.masseinheit}</td>
                                                <td>
                                                    <ModeEditIcon onClick={() => handleEditMasseinheit(lebensmittel)}/>
                                                </td>
                                            </>
                                        )}
                                        <td>
                                            <DeleteIcon onClick={(event) => deleteLebensmittel(event, lebensmittel.id)}
                                                        aria-label="delete" size="small"/>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
                        <button type="button" onClick={handleJetztKochen}>Jetzt kochen</button>
                    </div>)}
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
                        <div className="input-with-button">
                            <div className="inner-input-with-button">
                                <select
                                    name="masseinheit"
                                    value={formData.masseinheit}
                                    onChange={handleChange}
                                    className="eingabe"
                                >
                                    <option value="" disabled>Bitte wählen Sie eine Masseinheit aus</option>
                                    {masseinheitenListe.map((masseinheit, index) => (
                                        <option key={index} value={masseinheit.masseinheitsname}>
                                            {masseinheit.masseinheitsname}
                                        </option>
                                    ))}
                                </select>
                                <Button onClick={handleCustomMasseinheit} className="edit-icon"  variant="outlined" startIcon={<AddBoxIcon />}>
                                    Maßeinheit
                                </Button>
                            </div>
                        </div>
                    </div>
                        <button className="button" type="button" onClick={handleSubmit}>hinzufügen</button>
                    </div>
                    <br></br>
                    <br></br>
                    <button className="button-uebersicht" type="button" onClick={() => handleDelete(rezept.id)}>
                        Rezept löschen
                    </button>
                </div>
                {isPopupOpen && (
                    <div className="popup">
                        <div className="inner-popup">
                            {shoppingListElem.length === 0 ? (
                                <h3 className="h2-black">Kochen erfolgreich</h3>
                            ) : (
                                <>
                                    <h3 className="h2-black">Fehlende Lebensmittel</h3>
                                    <table>
                                        <thead>
                                        <tr>
                                            <th>Lebensmittel</th>
                                            <th>Menge</th>
                                            <th>Maßeinheit</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {shoppingListElem.map((shoppingList, index) => (
                                            <tr key={index}>
                                                <td>{shoppingList.lebensmittelName}</td>
                                                <td>{shoppingList.mengenanzahl}</td>
                                                <td>{shoppingList.masseinheit}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </>
                            )}
                            <button type="button" onClick={handleClosePopup}>Schließen</button>
                        </div>
                    </div>
                )}
                {isMasseinheitPopupOpen && (
                <div className="popup">
                    <div className="inner-popup">
                        <button className="mini-button" onClick={handleClosePopup}>
                            <ArrowBackIosNewIcon/>
                        </button>
                        <h3 className="h2-black">Lege eine neue Masseinheit an</h3>
                        <div className="blue-mini-container">
                            <div className="formitem">
                                <label>Name der Maßeinheit</label>
                                <input
                                    type="text"
                                    name="masseinheitsname"
                                    value={customMasseinheitData.masseinheitsname}
                                    onChange={handlePopupInputChange}
                                    className="eingabe"
                                />
                                <label>Referenzmenge zu Gramm oder Milliliter</label>
                                <input
                                type="number"
                                name="umrechnungsfaktor"
                                value={customMasseinheitData.umrechnungsfaktor}
                                onChange={handlePopupInputChange}
                                className="eingabe"
                            />
                            </div>
                        </div>
                        <button type="button" onClick={handleSaveCustomMasseinheit}>Speichern</button>
                    </div>
                </div>
            )}
            {showNotAdminPopup && (
                <div className="popup">
                    <div className="inner-popup">
                        <h2 className="h2-black">Nur der Rezeptersteller kann das Rezept verändern.</h2>
                        <button type="button" onClick={handleClosePopup}>Schließen</button>
                    </div>
                </div>
            )
            }

            {showNotAdminDeletePopup && (
                <div className="popup">
                    <div className="inner-popup">
                        <h2 className="h2-black">Nur der Rezeptersteller kann das Rezept löschen.</h2>
                        <button type="button" onClick={handleClosePopup}>Schließen</button>
                    </div>
                </div>
            )
            }
            </div>
        );
    }

export default GenauEinRezeptAnzeigen;
