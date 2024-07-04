import React, {useEffect, useState} from "react";
import '../sytles/WG-Landingpage.css';
import {Link} from "react-router-dom";
import EatSmarterAPI from "../api/EatSmarterAPI";
import NavBar from "../components/NavBar";
import InfoIcon from '@mui/icons-material/Info';


function Generator(props) {
    const [kuehlschrankId, setKuehlschrankId] = useState();
    const [wgId, setWgId] = useState();
    const [rezepte, setRezepte] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [PopUpOpen, setPopUpOpen] = useState(false);


    /* -------- Funktionen zum Laden des Kuehlschrankinhaltes sowie Anzeigen der Rezepte -------- */
    async function renderCurrentKuehlschrank() {
        await EatSmarterAPI.getAPI().getWgByUser(props.user.email)
            .then(response => {
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

    const openInfoIcon = () => {
        setPopUpOpen(true);
    }

    const closeInfoIcon = () => {
        setPopUpOpen(false);
    }

    /* -------- Darstellung der Komponente -------- */
    return (
        <div>
            <NavBar currentUser={props.user} onSignOut={props.onSignOut}></NavBar> <br></br> <br></br>
            <div className='container'>
                <div className='inner-container'>
                    <div className="input-nutzername">
                        <div className="in-a-row">
                            <h2>Alle verfügbaren Rezepte</h2>
                            <InfoIcon className="info-icon-white" onClick={openInfoIcon}></InfoIcon>
                        </div>
                    </div>
                    {rezepte.map((rezepte, index) => (
                        <div key={index}>
                            <Link className="links" to={`/genaueinrezeptAnzeigen/${rezepte.id}`}>
                                <div className="list-container">
                                    <p className="blue-mini-container">{rezepte.rezeptName}</p>
                                    <p>Anzahl Portionen: {parseInt(rezepte.anzahlPortionen)}</p>
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
            {/* Popup für den Fall, dass keine Rezepte gefunden wurden, sowie Info Popup */}
            {showPopup && (
                <div className="popup">
                    <div className="inner-popup">
                        <h3 className="h2-black">Keine Rezepte gefunden.</h3>
                        <p>Kaufe etwas ein, um deine Rezepte kochen zu können!</p>
                        <button type="Button" onClick={closePopup}>Schließen</button>
                    </div>
                </div>
            )}
            {PopUpOpen && (
                <div className="popup">
                    <div className="inner-popup">
                        <h3 className="h2-black">Info</h3>
                        <p className="h2-black"> Der Genrator filtert, welche Rezepte Sie anhand der enthaltenden Lebensmittel im Kühlschrank kochen können.</p>
                        <button type="button" onClick={closeInfoIcon}>Schließen</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Generator;
