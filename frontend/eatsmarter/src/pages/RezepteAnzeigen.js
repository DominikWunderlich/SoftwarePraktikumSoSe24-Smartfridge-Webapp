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
                console.log(rezeptList)
            } catch (error) {
                console.error("Fehler beim Abrufen der Rezepte:", error);
            }
        };

        fetchRezepte();
    }, [props.user.email]);  // Abhängigkeit hinzufügen, um den Effekt bei Änderung der E-Mail-Adresse des Benutzers auszulösen

    /*<p>Anleitung: {rezept.rezeptAnleitung}</p>
    * Wenn man das einfügt, dann bekommt man die Anleitungen in der Übersichtsseite mit angezeigt
    * Ich hab das aber mal weg gelassen, da ich das an dieser Stelle nicht passend finde*/

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
                <Link to="/rezeptErstellen">
                    <button className="button-uebersicht" type="button">Rezept erstellen</button>
                </Link>
            </div>
        </div>
    );
}

export default RezepteAnzeigen;
