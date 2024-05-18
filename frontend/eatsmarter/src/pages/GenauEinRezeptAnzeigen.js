import React, {useState, useEffect} from "react";
import RezeptBO from "../api/RezeptBO";
import {Link} from "react-router-dom";
import EatSmarterAPI from "../api/EatSmarterAPI";
import '../sytles/WG-Landingpage.css';
import NavBar from "../components/NavBar";
import LebensmittelBO from "../api/LebensmittelBO";
import MasseinheitBO from "../api/MasseinheitBO";
import mengenanzahlBO from "../api/mengenanzahlBO";
import { useParams } from "react-router-dom"; // Importing useParams

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

    const { rezeptId } = useParams(); // Holen der rezeptId aus den Routenparametern
    console.log(rezeptId)
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
        const newMengenanzahl = new mengenanzahlBO(formData.mengenanzahl);
        const newMasseinheit = new MasseinheitBO(formData.masseinheit);

        try {
        const api = new EatSmarterAPI();
        console.log("hi")
        console.log(newLebensmittel)
        console.log(rezeptId)
        console.log("ciao")
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
        const fetchRezeptById = async () => {
            try {
                const api = new EatSmarterAPI();
                const [rezept] = await api.getRezeptById(rezeptId); // Verwenden der dynamischen rezeptId
                setRezept(rezept);
                console.log(rezept);
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

    return (
        <div>
            <NavBar currentUser={props.user} onSignOut={props.onSignOut}/><br/><br/>
            <div className='container'>
                {rezept && ( // Nur anzeigen, wenn das Rezept geladen wurde
                <div className='inner-container'>
                    <h2>Dein Rezept</h2>
                    <p>Rezeptname: {rezept.rezeptName}</p>
                    <p>Anzahl Portionen: {rezept.anzahlPortionen}</p>
                    <p>Ersteller: {rezept.rezeptAdmin}</p>
                    <p>WG: {rezept.wgName}</p>
                </div> )}
                <br></br>
                <div className="inner-container">
                    <h2>Lebensmittel im Rezept</h2>
                    <ul>
                        {rezeptLebensmittel.map((lebensmittel, index) => (
                            <li key={index}>
                                {`${lebensmittel.lebensmittelname} ${lebensmittel.mengenanzahl} ${lebensmittel.masseinheit}`}
                            </li>
                        ))}
                    </ul>
                </div>
                <br></br>
                <div className='formitem'>
                    <h2>Lebensmittel hinzufügen</h2>
                    {errors.message && <p>{errors.message}</p>}
                    <label>Lebensmittelname</label>
                    <input
                        type="text"
                        name="lebensmittelname"
                        value={formData.lebensmittelname}
                        onChange={handleChange}
                        className="eingabe"
                    />
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
                            list="masseinheit"
                            value={formData.masseinheit}
                            onChange={handleChange}
                            className="eingabe"
                    />
                    <button className="button" type="button" onClick={handleSubmit}>hinzufügen</button>
                </div>
            </div>
        </div>
    );
}

export default GenauEinRezeptAnzeigen;