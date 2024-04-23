import React, {useState} from "react";
import RezeptBO from "../api/RezeptBO";
import {Link} from "react-router-dom";
import EatSmarterAPI from "../api/EatSmarterAPI";
import '../sytles/WG-Landingpage.css';

function RezeptErstellen(){

    const [formData, setFormData] = useState({
        rezeptname: "",
        anzahlportionen: "",
        rezeptadmin: ""
    })

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const handleChange = (event) => {
        if (event.target.name === 'isAccepted') {
            setFormData({...formData, [event.target.name]: event.target.checked});
        } else {
            setFormData({...formData, [event.target.name]: event.target.value });
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!Object.keys(errors).length) {
            const newRezept = new RezeptBO(
                formData.rezeptname,
                formData.anzahlportionen,
                formData.rezeptadmin,
            );
            console.log(newRezept)
            console.log(".... starting to create a API-Call (EatSmarterAPI)")
            EatSmarterAPI.getAPI()
                .addRezept(newRezept)
        }
    };


    return (
        <div>
            <p>Platzhalter für Navigationsleiste</p>
            <div className='container'>
                <form onSubmit={handleSubmit}>
                    <h2>Erstelle ein Rezept!</h2>
                    <div className='formitem'>
                        <label>Name deines Rezepts: </label>
                        <input
                            type={"text"}
                            name={"rezeptname"}
                            value={formData.rezeptname}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='formitem'>
                        <label>Anzahl Personen: </label>
                        <input
                            type={"text"}
                            name={"anzahlportionen"}
                            value={formData.anzahlportionen}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='formitem'>
                        <label>Füge einen Ersteller hinzu:</label>
                        <input
                            type={"text"}
                            name={"rezeptadmin"}
                            value={formData.rezeptadmin}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <button type={"submit"}>Bestätigen</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RezeptErstellen;