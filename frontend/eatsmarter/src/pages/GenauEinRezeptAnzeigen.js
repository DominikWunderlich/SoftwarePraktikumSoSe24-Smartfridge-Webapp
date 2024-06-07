import React, {useState, useEffect} from "react";
import EatSmarterAPI from "../api/EatSmarterAPI";
import '../sytles/WG-Landingpage.css';
import NavBar from "../components/NavBar";
import LebensmittelBO from "../api/LebensmittelBO";
import MasseinheitBO from "../api/MasseinheitBO";
import mengenanzahlBO from "../api/mengenanzahlBO";
import { useParams } from "react-router-dom"; // Importing useParams
import {useNavigate} from "react-router-dom";
import TrimAndLowerCase from "../functions";

function GenauEinRezeptAnzeigen(props) {
    const [formData, setFormData] = useState({
        lebensmittelname: "",
        mengenanzahl: "",
        masseinheit: ""
    });

    const [lebensmittelliste, setLebensmittelliste] = useState([]);
    const [masseinheitenListe, setMasseinheitenListe] = useState([]);
    const [errors, setErrors] = useState({});
    const [rezept, setRezept] = useState(null); // Nur ein Rezept anstelle einer Liste von Rezepten
    const [rezepte, setRezepte] = useState([]);
    const [shoppingListElem, setShoppingListElem]  = useState([]);
    const navigate = useNavigate()
    const currentUser = props.user.email;

    const {rezeptId } = useParams(); // Holen der rezeptId aus den Routenparametern
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
            TrimAndLowerCase(formData.lebensmittelname),
            TrimAndLowerCase(formData.mengenanzahl),
            TrimAndLowerCase(formData.masseinheit)
        );
        const newMengenanzahl = new mengenanzahlBO(TrimAndLowerCase(formData.mengenanzahl));
        const newMasseinheit = new MasseinheitBO(TrimAndLowerCase(formData.masseinheit));

        try {
        const api = new EatSmarterAPI();
        await api.lebensmittelZuRezeptHinzufuegen(rezeptId, newLebensmittel);
    } catch (error) {
        console.error("Fehler beim Hinzufügen von Lebensmittel zum Rezept:", error);
        // Handle error
    }

        EatSmarterAPI.getAPI().addMasseinheit(newMasseinheit);
        EatSmarterAPI.getAPI().addMenge(newMengenanzahl);
        EatSmarterAPI.getAPI().addLebensmittel(newLebensmittel);

        setFormData({
            lebensmittelname: "",
            mengenanzahl: "",
            masseinheit: ""
        });
        setErrors({});

        setLebensmittelliste(prevList => [...prevList, newLebensmittel]);
        setMasseinheitenListe(prevList => [...prevList, formData.masseinheit]);
    };

    useEffect(() => {
        const fetchMasseinheiten = async () => {
            try {
                const masseinheiten = await EatSmarterAPI.getAPI().getMasseinheitAll();
                setMasseinheitenListe(masseinheiten);
            } catch (error) {
                console.error("Fehler beim Laden der Maßeinheiten:", error);
            }
        };

        fetchMasseinheiten();


    const fetchLebensmittel = async () => {
        try {
            const lebensmittel = await EatSmarterAPI.getAPI().getAllLebensmittelangabe();
            setLebensmittelliste(lebensmittel);
        } catch (error) {
            console.error("Fehler beim Laden der Maßeinheiten:", error);
        }
    };

        fetchLebensmittel();
}, []);

    useEffect(() => {
        const fetchRezeptById = async () => {
            try {
                const api = new EatSmarterAPI();
                const [rezept] = await api.getRezeptById(rezeptId); // Verwenden der dynamischen rezeptId
                setRezept(rezept);
            } catch (error) {
                console.error("Fehler beim Abrufen des Rezepts:", error);
            }
        };

        fetchRezeptById();
    }, [rezeptId]); // Beachte die Abhängigkeit von rezeptId

    const [rezeptLebensmittel, setRezeptLebensmittel] = useState([]);
    useEffect(() => {
        const fetchRezeptLebensmittel = async () => {
            try {
                const api = new EatSmarterAPI();
                const lebensmittel = await api.getAllLebensmittelByRezeptId(rezeptId);
                setRezeptLebensmittel(lebensmittel);
            } catch (error) {
                console.error("Fehler beim Abrufen der Lebensmittel:", error);
            }
        };
        fetchRezeptLebensmittel();
    }, [rezeptId]);

    const handleJetztKochen = async () => {
        try {
            const api = new EatSmarterAPI();
            const shoppingList = await api.sendRezeptIdToBackend(rezeptId, props.user.email);
            setShoppingListElem(shoppingList.flat());
            alert("Rezept wurde an das Backend gesendet!");
        } catch (error) {
            console.error("Fehler beim Senden der Rezept-ID:", error);
            alert("Fehler beim Senden der Rezept-ID.");
        }
    };


    // const handleDelete = async () => {
    //     const isAdmin = await EatSmarterAPI.getAPI().checkIfUserIsRezeptAdmin(props.user);
    //     if (isAdmin) {
    //         await EatSmarterAPI.getAPI().updatedRezept(rezept);
    //     } else {
    //         alert("Nur der Ersteller kann Rezept löschen");
    //     }
    // };

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
                            {errors.message && <p>{errors.message}</p>}
                            <table>
                                <thead>
                                <tr>
                                    <th>Lebensmittelname</th>
                                    <th>Mengenanzahl</th>
                                    <th>Maßeinheit</th>
                                </tr>
                                </thead>
                                <tbody>
                                {rezeptLebensmittel.map((lebensmittel, index) => (
                                    <tr key={index}>
                                        <td>{lebensmittel.lebensmittelname}</td>
                                        <td>{lebensmittel.mengenanzahl}</td>
                                        <td>{lebensmittel.masseinheit}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <h2>Kochanleitung</h2>
                        <div className='mini-container'>
                            <p>{rezept.rezeptAnleitung}</p>
                        </div>
                        <h2>Einkaufsliste</h2>
                        <div className="mini-container">
                            <ul>
                                {shoppingListElem.map((shoppingList, index) => (
                                    <li key={index}>
                                        {/*TODO: Bei der Mengenanzahl muss das Minus noch weg*/}
                                        {`${shoppingList.lebensmittelname} ${shoppingList.mengenanzahl} ${shoppingList.masseinheit} `}
                                    </li>
                                ))}
                            </ul>
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
        </div>
    );
}

export default GenauEinRezeptAnzeigen;