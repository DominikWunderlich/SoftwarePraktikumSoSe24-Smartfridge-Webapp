import React, {useState, useEffect} from "react";
import RezeptBO from "../api/RezeptBO";
import {Link} from "react-router-dom";
import EatSmarterAPI from "../api/EatSmarterAPI";
import '../sytles/WG-Landingpage.css';

//Hier nochmal angucken
function RezepteAnzeigen() {
    const [rezepte, setRezepte] = useState([]);

    useEffect(() => {
        // Hier rufen wir die Methode getRezept() der EatSmarterAPI auf, um alle Rezepte abzurufen
        EatSmarterAPI.getAPI().getRezept()
            .then((rezeptData) => {
                // Hier aktualisieren wir den State mit den empfangenen Rezepten
                setRezepte(rezeptData);
                console.log(rezeptData);
                //Hier zeigt es an, dass es 2 Arrays gibt beide vom typ rezeptBO
            })
            .catch((error) => {
                console.error("Fehler beim Abrufen der Rezepte:", error);
            });
    }, []);


        return (
        <div>
            <h2>Alle Rezepte anzeigen</h2>
            <div className='container'>
            {rezepte.map((rezept, index) => (
                <div key={index}>
                    <p>Rezeptname: {rezept.rezeptname}</p>
                    <p>Anzahl Portionen: {rezept.anzahlportionen}</p>
                    <p>Ersteller: {rezept.rezeptadmin}</p>
                </div>
            ))}
            </div>
        </div>
    );
}

export default RezepteAnzeigen;