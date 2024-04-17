import React, {useState} from "react";
import WgBO from "../api/WgBO";
import {Link} from "react-router-dom";
import EatSmarterAPI from "../api/EatSmarterAPI";
import '../sytles/WG-Landingpage.css';

function WGLandingpage() {
    const [formData, setFormData] = useState({
        wgname: "",
        wgbewohner: "",
        wgadmin: ""
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
            const newWG = new WgBO(
                formData.wgname,
                formData.wgbewohner,
                formData.wgadmin,
            );
            console.log(newWG)
            console.log(".... starting to create a API-Call (EatSmarterAPI)")
            EatSmarterAPI.getAPI()
                .addWg(newWG)
        }
    };

    return (
        <div>
            <p>Diese Seite wird die zukünftigte WG Landingpage.</p>
            <div class='container'>
                <form onSubmit={handleSubmit}>
                    <h2>Erstelle eine WG!</h2>
                    <div>
                        <label>Name deiner WG: </label>
                        <input
                            type={"text"}
                            name={"wgname"}
                            value={formData.wgname}
                            onChange={handleChange}
                        />
                    </div>
                    <div class='formitem'>
                        <label>Füge einen Mitbewohner deiner WG hinzu: </label>
                        <input
                            type={"text"}
                            name={"wgbewohner"}
                            value={formData.wgbewohner}
                            onChange={handleChange}
                        />
                    </div>
                    <div class='formitem'>
                        <label>Füge einen Admin deiner WG hinzu:</label>
                        <input
                            type={"text"}
                            name={"wgadmin"}
                            value={formData.wgadmin}
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
};

export default WGLandingpage;
