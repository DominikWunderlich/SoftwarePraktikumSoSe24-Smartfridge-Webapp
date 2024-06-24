import React, {useEffect, useState} from "react";
import '../sytles/WG-Landingpage.css';
import {Link} from "react-router-dom";
import EatSmarterAPI from "../api/EatSmarterAPI";
import NavBar from "../components/NavBar";
import {func} from "prop-types";


function Generator(props) {
    const [kuehlschrankId, setKuehlschrankId] = useState()
    const [wgId, setWgId] = useState()
    const [rezepte, setRezepte] = useState([]);
    const [showPopup, setShowPopup] = useState(false);



    async function renderCurrentKuehlschrank() {
        await EatSmarterAPI.getAPI().getWgByUser(props.user.email)
            .then(response => {
                console.log("hi")
                console.log(response)
                console.log(response.id)
                console.log(response.wgName)
                setWgId(response.id);
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
        const rezeptListe = await EatSmarterAPI.getAPI().getRezeptByGenerator(wgId, kuehlschrankId);
        console.log("Rezept IDs:", rezeptListe);
        setRezepte(rezeptListe)
        if (rezeptListe.length === 0) {
        setShowPopup(true);
        } else {
            setShowPopup(false);
        }
    }

     function closePopup() {
        setShowPopup(false);
    }


    return (
        <div>
            <NavBar currentUser={props.user} onSignOut={props.onSignOut}></NavBar> <br></br> <br></br>
            <div className='container'>
            <div className='inner-container'>
            <h2>Alle verfügbaren Rezepte</h2>
                {rezepte.map((rezepte, index) => (
                    <div key={index}>
                        <Link className="links" to={`/genaueinrezeptAnzeigen/${rezepte.id}`}>
                            <div className="list-container">
                                <p className="blue-mini-container">{rezepte.rezeptName}</p>
                                <p>Anzahl Portionen: {rezepte.anzahlPortionen}</p>
                                <p>Ersteller: {rezepte.rezeptAdmin}</p>
                                <p>WG: {rezepte.wgId}</p>
                            </div>
                        </Link>
                    </div>
                ))}
                </div>
                <br></br>
                <br></br>
                <button onClick={showRezepte} className="button-uebersicht" type="button">Generator starten</button>
            </div>
            {showPopup && (
                <div className="popup">
                    <div className="inner-popup">
                        <h1 className="h2-black">Keine Rezepte gefunden</h1>
                        <p>Kaufe etwas ein, um deine Rezepte kochen zu können!<span className="large-emoji">🙊</span></p>
                        <button onClick={closePopup}>Schließen</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Generator;
