import React, {useState, useEffect} from "react";
import EatSmarterAPI from "../api/EatSmarterAPI";
import '../sytles/WG-Landingpage.css';
import NavBar from "../components/NavBar";
import LebensmittelBO from "../api/LebensmittelBO";
import MasseinheitBO from "../api/MasseinheitBO";
import mengenanzahlBO from "../api/mengenanzahlBO";
import { useParams } from "react-router-dom"; 
import {useNavigate} from "react-router-dom";
import TrimAndLowerCase from "../functions";


function GenauEinRezeptAnzeigen(props) {

    const [formData, setFormData] = useState({
        lebensmittelname: "",
        mengenanzahl: "",
        masseinheit: ""
    });

    const [rezeptLebensmittel, setRezeptLebensmittel] = useState([]);
    const [lebensmittelliste, setLebensmittelliste] = useState([]);
    const [masseinheitenListe, setMasseinheitenListe] = useState([]);
    const [shoppingListElem, setShoppingListElem]  = useState([]);
    const [rezept, setRezept] = useState(null); 
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const {rezeptId } = useParams();
    const navigate = useNavigate()
    const currentUser = props.user.email;
    
    /* Funktionen für die Formularverarbeitung und aktualisieren der Lebensmittel/Maßeinheitenliste */
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

        const newMengenanzahl = new mengenanzahlBO(TrimAndLowerCase(formData.mengenanzahl));
        const newMasseinheit = new MasseinheitBO(TrimAndLowerCase(formData.masseinheit));
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
    };

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
    }, [rezeptId]);
   
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

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };


    /* Funktionen zum Löschen des Rezepts und enthaltender Lebensmittel */
    const handleDelete = async () => {
        const isAdmin = await EatSmarterAPI.getAPI().checkIfUserIsRezeptAdmin(currentUser);
        console.log("Frontend", isAdmin);
        console.log(currentUser)

        if(isAdmin){
            await EatSmarterAPI.getAPI().deleteRezept(rezeptId)
                .then(() => {
                    navigate("/RezeptAnzeigen");
                })
        }
        else{
            alert("Nur der Ersteller kann das Rezept löschen");
        }
    };

    async function deleteLebensmittel (event){
        event.preventDefault()
        // LebensmittelId ist der Value aus dem button Klick event
        let lebensmittelId = event.target.value
        try {
            await EatSmarterAPI.getAPI().deleteFoodFromRezept(rezeptId, lebensmittelId);
            setRezeptLebensmittel(prevRezeptLebensmittel => prevRezeptLebensmittel.filter(item => item.id !== parseInt(lebensmittelId, 10)));
        } catch (error) {
            console.error("Fehler beim Löschen des Lebensmittels:", error);
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
                            <p>Anzahl Portionen: {rezept.anzahlPortionen}</p>
                            <p>Ersteller: {rezept.rezeptAdmin}</p>
                            <p>WG: {rezept.wgName}</p>
                            <p>Zubereitung: {rezept.rezeptAnleitung}</p>
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
                                {rezeptLebensmittel.map((lebensmittel, index) => (
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
                    </div>
                    <button className="button" type="button" onClick={handleSubmit}>hinzufügen</button>
                </div>
                <br></br>
                <br></br>
                <button className="button-uebersicht" type="button" onClick={() => handleDelete(rezept.id)}>Rezept löschen</button>
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
                                            <th>Lebensmittelname</th>
                                            <th>Mengenanzahl</th>
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
        </div>
    );
}

export default GenauEinRezeptAnzeigen;