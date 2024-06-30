import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import EatSmarterAPI from "../api/EatSmarterAPI";
import '../sytles/WG-Landingpage.css';
import NavBar from "../components/NavBar";


function RezepteAnzeigen(props) {
    const [rezepte, setRezepte] = useState([]);
    const emailDerEingeloggtenPerson = props.user.email;
    const [wgId, setWgId] = useState("");

    /* -------- Funktion zum Laden der Rezepte -------- */
    useEffect(() => {
        const fetchRezepte = async () => {
            try {
                const api = new EatSmarterAPI();
                const userWg = await api.getWgByUser(props.user.email); // Ruf die WG des Benutzers ab
                console.log("Huhu")
                console.log(userWg)
                const rezeptList = await api.getRezepteByWg(userWg.id); // Ruf die neuen Rezept-Methode auf
                setRezepte(rezeptList);
                console.log("hier die liste")
                console.log(rezeptList)
            } catch (error) {
                console.error("Fehler beim Abrufen der Rezepte:", error);
            }
        };

        fetchRezepte();
    }, [props.user.email]);  // Abhängigkeit hinzufügen, um den Effekt bei Änderung der E-Mail-Adresse des Benutzers auszulösen

    /* -------- Darstellung der Komponente -------- */
    return (
        <div>
            <NavBar currentUser={props.user} onSignOut={props.onSignOut}></NavBar> <br></br> <br></br>
            <div className='container'>
                <div className='inner-container'>
                <h2>Alle Rezepte der WG</h2>
                {rezepte.map((rezept, index) => (
                    <div key={index}>
                        <Link className="links" to={`/genaueinrezeptAnzeigen/${rezept.id}`}>
                            <div className="list-container">
                                <p className="blue-mini-container">{rezept.rezeptName}</p>
                                <p>Anzahl Portionen: {parseInt(rezept.anzahlPortionen)}</p>
                                <p>Ersteller: {rezept.rezeptAdmin}</p>
                            </div>
                        </Link>
                    </div>
                ))}
                </div>
                <br></br>
                <br></br>
                <Link to="/rezeptErstellen">
                    <button className="button-uebersicht" type="button">Rezept erstellen</button>
                </Link>
            </div>
        </div>
    );
}

export default RezepteAnzeigen;
