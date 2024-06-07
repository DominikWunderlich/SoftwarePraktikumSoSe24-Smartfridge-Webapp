import React, {useEffect, useState} from "react";
import '../sytles/WG-Landingpage.css';
import {Link} from "react-router-dom";
import EatSmarterAPI from "../api/EatSmarterAPI";
import NavBar from "../components/NavBar";
import {func} from "prop-types";


function Generator(props) {
    const [kuehlschrankId, setKuehlschrankId] = useState()
    const [wgName, setWgName] = useState()
    const [rezepte, setRezepte] = useState([]);


    async function renderCurrentKuehlschrank() {
        await EatSmarterAPI.getAPI().getWgByUser(props.user.email)
            .then(response => {
                setWgName(response.wgName);
                setKuehlschrankId(response.id)
            })
            .catch(error => {
                console.error(error);
            });
    }

    useEffect(() => {
        renderCurrentKuehlschrank()
    }, []);

    async function showRezepte() {
        const rezeptListe = await EatSmarterAPI.getAPI().getRezeptByGenerator(wgName, kuehlschrankId);
        console.log("Rezept IDs:", rezeptListe);
    }


    return (
        <div>
            <NavBar currentUser={props.user} onSignOut={props.onSignOut}></NavBar> <br></br> <br></br>
            <div className='container'>
            <div className='inner-container'>
            <h2>Alle verfügbaren Rezepte</h2>
                {rezepte.map((rezept, index) => (
                    <div key={index}>
                        <Link className="links" to={`/rezept/${rezept.id}`}>
                            <div className="list-container">
                                <p className="blue-mini-container">{rezept.rezeptName}</p>
                                <p>Anzahl Portionen: {rezept.anzahlPortionen}</p>
                                <p>Ersteller: {rezept.rezeptAdmin}</p>
                                <p>WG: {rezept.wgName}</p>
                            </div>
                        </Link>
                    </div>
                ))}
                </div>
                <br></br>
                <br></br>
                <button onClick={showRezepte} className="button-uebersicht" type="button">Generator starten</button>
            </div>
        </div>
    );
}
export default Generator;
