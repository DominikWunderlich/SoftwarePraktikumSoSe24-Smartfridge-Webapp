import React, {useState, useEffect} from "react";
import RezeptBO from "../api/RezeptBO";
import {Link} from "react-router-dom";
import EatSmarterAPI from "../api/EatSmarterAPI";
import '../sytles/WG-Landingpage.css';
import NavBar from "../components/NavBar";
import LebensmittelBO from "../api/LebensmittelBO";
import MasseinheitBO from "../api/MasseinheitBO";
import mengenanzahlBO from "../api/mengenanzahlBO";

function GenauEinRezeptAnzeigen(props) {
    const [formData, setFormData] = useState({
        lebensmittelname: "",
        mengenanzahl: "",
        masseinheit: ""
    });

    const [lebensmittelliste, setLebensmittelliste] = useState([]);
    const [masseinheitenListe, setMasseinheitenListe] = useState([]);
    const [errors, setErrors] = useState({});

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = (event) => {
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

        console.log("Neues Lebensmittel:", newLebensmittel);
        console.log("Neue Menge:", newMengenanzahl);
        console.log("Neue Maßeinheit:", newMasseinheit);

        EatSmarterAPI.getAPI().addMasseinheit(newMasseinheit);
        EatSmarterAPI.getAPI().addMenge(newMengenanzahl);
        EatSmarterAPI.getAPI().addLebensmittel(newLebensmittel);


        // Zurücksetzen des Formulars nach dem Hinzufügen
        setFormData({
            lebensmittelname: "",
            mengenanzahl: "",
            masseinheit: ""
        });
        setErrors({});

        setLebensmittelliste(prevList => [...prevList, newLebensmittel]);
        setMasseinheitenListe(prevList => [...prevList, formData.masseinheit]);
    };
    return (
        <div>
            <NavBar currentUser={props.user} onSignOut={props.onSignOut}></NavBar> <br></br> <br></br>
            <h2>Ein Rezept Anzeigen</h2>
            Hier soll der Rezeptname, anzahl Portionen angezeigt werden
            <div className="container">
                <h2>Eingetragene Lebensmittel</h2>
                <table>
                    <thead>
                    <tr>
                        <th>Lebensmittel</th>
                        <th>Menge</th>
                        <th>Masseinheit</th>
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
            <div className='container'>
                <h2>Lebensmittel hinzufügen</h2>
                {errors.message && <p>{errors.message}</p>}
                <div className='formitem'>

                    <label>Lebensmittelname</label>
                    <input
                        type="text"
                        name="lebensmittelname"
                        value={formData.lebensmittelname}
                        onChange={handleChange}
                        className="eingabe"
                    />
                    {/* Dropdown-Menü für vorhandene Lebensmittel */}
                    <select
                        name="lebensmittelname"
                        value={formData.lebensmittelname}
                        onChange={handleChange}
                        className="eingabe"
                    >

                        {lebensmittelliste.map((lebensmittel, index) => (
                            <option key={index} value={lebensmittel.lebensmittel_name}>
                                {lebensmittel.lebensmittel_name}
                            </option>
                        ))}
                    </select>

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
                    {/* Dropdown-Menü für eingegebene Maßeinheiten */}
                    <select
                        name="masseinheit"
                        value={formData.masseinheit}
                        onChange={handleChange}
                        className="eingabe"
                    >
                        {masseinheitenListe.map((masseinheit, index) => (
                            <option key={index} value={masseinheit}>
                                {masseinheit}
                            </option>
                        ))}
                    </select>


                    <button className="button" type="button" onClick={handleSubmit}>hinzufügen</button>
                </div>
            </div>
        </div>
    );

}

export default GenauEinRezeptAnzeigen;