import React, {useState, useEffect} from "react";
import RezeptBO from "../api/RezeptBO";
import {Link} from "react-router-dom";
import EatSmarterAPI from "../api/EatSmarterAPI";
import '../sytles/WG-Landingpage.css';
import NavBar from "../components/NavBar";


//Notiz: Hier ist dieselbe Methode zwei mal implementiert, einmal wie es mit der getRezept MEthode
//aus der EatSmarterAPI funktionieren würde
//und einmal wie es mit der getAllRezepte MEthode aus der EatSmarterAPI funktioniert
//Welche Implementierung besser ist müssen wir mal absprechen, deshalb habe ich die eine Lsg jetzt
//mal nur auskommentiert
//Hier nochmal angucken


function RezepteAnzeigen(props) {
    const [rezepte, setRezepte] = useState([]);
    const emailDerEingeloggtenPerson = props.user.email;
    const [wgName, setWgName] = useState(""); //brauche ich diese Zeile?

    useEffect(() => {
        const fetchRezepte = async () => {
            try {
                const api = new EatSmarterAPI();
                const userWg = await api.getWgByUser(props.user.email); // Ruf die WG des Benutzers ab
                const rezeptList = await api.getRezepteByWg(userWg.wgName); // Ruf die neuen Rezept-Methode auf
                setRezepte(rezeptList);
            } catch (error) {
                console.error("Fehler beim Abrufen der Rezepte:", error);
            }
        };

        fetchRezepte();
    }, [props.user.email]);  // Abhängigkeit hinzufügen, um den Effekt bei Änderung der E-Mail-Adresse des Benutzers auszulösen

    return (
        <div>
            <NavBar currentUser={props.user} onSignOut={props.onSignOut}></NavBar> <br></br> <br></br>
            <h2>Alle Rezepte anzeigen</h2>
            <div className='container'>
                <h2>Alle Rezepte anzeigen</h2>
                {rezepte.map((rezept, index) => (
                    <Link key={index} to={`/genaueinrezeptAnzeigen/${rezept.id}`}>
                        <div className='inner-container'>
                            <p>Rezeptname: {rezept.rezeptName}</p>
                            <p>Anzahl Portionen: {rezept.anzahlPortionen}</p>
                            <p>Ersteller: {rezept.rezeptAdmin}</p>
                            <p>WG: {rezept.wgName}</p>
                        </div>
                    </Link> 
                ))}
                <br></br>
                 <Link to="/rezeptErstellen">
                    <button type="button">Rezept erstellen</button>
                </Link>
            </div>
        </div>
    );
}

export default RezepteAnzeigen;
