import React, { useEffect, useState } from "react";
import '../sytles/WG-Landingpage.css';
import LebensmittelBO from "../api/LebensmittelBO";
import MasseinheitBO from "../api/MasseinheitBO";
import mengenanzahlBO from "../api/mengenanzahlBO";
import { Link } from "react-router-dom";
import EatSmarterAPI from "../api/EatSmarterAPI";
import NavBar from "../components/NavBar";

function Lebensmittelverwaltung(props) {
    const [formData, setFormData] = useState({
        lebensmittelname: "",
        mengenanzahl: "",
        masseinheit: ""
    });

    const [lebensmittelliste, setLebensmittelliste] = useState([]);
    const [masseinheitenListe, setMasseinheitenListe] = useState([]);
    const [errors, setErrors] = useState({});

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
    
            const updatedLebensmittelangabe = await EatSmarterAPI.getAPI().getAllLebensmittelangabe();
            setLebensmittelliste([...lebensmittelliste, updatedLebensmittelangabe.lebensmittel]);
            setMasseinheitenListe([...masseinheitenListe, updatedLebensmittelangabe.masseinheit]);
        } catch (error) {
            console.error("Fehler beim Hinzufügen von Lebensmittel:", error);
            setErrors({ message: "Fehler beim Hinzufügen von Lebensmittel. Bitte versuchen Sie es erneut." });
        }
    
        // Zurücksetzen des Formulars nach dem Hinzufügen
        setFormData({
            lebensmittelname: "",
            mengenanzahl: "",
            masseinheit: ""
        });
        setErrors({});
    };
    

    return (
        <div>
            <NavBar currentUser={props.user} onSignOut={props.onSignOut}></NavBar> <br></br> <br></br>
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
                    {/* Dropdown-Menü für vorhandene Lebensmittel */}

                    <datalist id="lebensmittel">
                        {lebensmittelliste.map((lebensmittel, index) => (
                            <option key={index} value={lebensmittel} />
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

            <div>
                <div className="container">
                    <h2>Eingetragene Lebensmittel</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Lebensmittel</th>
                                <th>Menge</th>
                                <th>Maßeinheit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lebensmittelliste.map((lebensmittel, index) => (
                                <tr key={index}>
                                    <td>{lebensmittel.lebensmittel_name}</td>
                                    <td>{lebensmittel.menge}</td>
                                    <td>{lebensmittel.masseinheit}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Lebensmittelverwaltung;