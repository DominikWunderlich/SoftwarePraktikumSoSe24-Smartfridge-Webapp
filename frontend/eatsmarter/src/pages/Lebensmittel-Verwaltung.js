import React, { useState } from "react";
import '../sytles/WG-Landingpage.css';
import LebensmittelBO from "../api/LebensmittelBO";
import MasseinheitBO from "../api/MasseinheitBO";
import mengenanzahlBO from "../api/mengenanzahlBO";
import { Link } from "react-router-dom";
import EatSmarterAPI from "../api/EatSmarterAPI";

function Lebensmittelverwaltung() {
    const [formData, setFormData] = useState({
        lebensmittelname: "",
        mengenanzahl: "",
        masseinheit: ""
    });

    const [lebensmittelliste, setLebensmittelliste] = useState([]);
    const [errors, setErrors] = useState({});

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (formData.lebensmittelname.trim() === "" || formData.mengenanzahl.trim() === "" || formData.masseinheit.trim() === "") {
            setErrors({ message: "Bitte füllen Sie alle Felder aus." });
            return;
        }

        const newLebensmittel = new LebensmittelBO(formData.lebensmittelname);
        const newMengenanzahl = new mengenanzahlBO(formData.mengenanzahl);
        const newMasseinheit = new MasseinheitBO(formData.masseinheit);

        console.log("Neues Lebensmittel:", newLebensmittel);
        console.log("Neue Menge:", newMengenanzahl);
        console.log("Neue Maßeinheit:", newMasseinheit);

        EatSmarterAPI.getAPI().addLebensmittel(newLebensmittel, newMengenanzahl, newMasseinheit);

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
            <p>Platzhalter für Navigationsleiste</p>
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

                    <label>Menge</label>
                    <input
                        type="text"
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
                    <datalist id="masseinheit">
                        <option value="Gramm" />
                        <option value="Kilogramm" />
                        <option value="Liter" />
                        {/* Weitere Maßeinheiten können hier hinzugefügt werden */}
                    </datalist>

                    <button className="button" type="button" onClick={handleSubmit}>hinzufügen</button>
                </div>
            </div>
            <div>
                <h2>Eingetragene Lebensmittel</h2>
                {lebensmittelliste.map((lebensmittel, index) => (
                    <div key={index}>
                        <p>Lebensmittel: {lebensmittel.lebensmittelname}</p>
                        <p>Masseinheit: {lebensmittel.masseinheit}</p>
                        <p>Menge: {lebensmittel.mengenanzahl}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Lebensmittelverwaltung;
