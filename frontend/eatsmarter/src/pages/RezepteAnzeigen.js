import React, {useState, useEffect} from "react";
import RezeptBO from "../api/RezeptBO";
import {Link} from "react-router-dom";
import EatSmarterAPI from "../api/EatSmarterAPI";
import '../sytles/WG-Landingpage.css';


//Notiz: Hier ist dieselbe Methode zwei mal implementiert, einmal wie es mit der getRezept MEthode
//aus der EatSmarterAPI funktionieren würde
//und einmal wie es mit der getAllRezepte MEthode aus der EatSmarterAPI funktioniert
//Welche Implementierung besser ist müssen wir mal absprechen, deshalb habe ich die eine Lsg jetzt
//mal nur auskommentiert
//Hier nochmal angucken


{/*
function RezepteAnzeigen() {
    const [rezepte, setRezepte] = useState([]);

    useEffect(() => {
        // Funktion, um Rezepte von der API abzurufen und in den State zu setzen
        const fetchRezepte = async () => {
            try {
                const api = new EatSmarterAPI(); // Erstelle eine Instanz der API
                const fetchedRezepte = await api.getRezept(); // Rufe die Rezepte von der API ab
                setRezepte(fetchedRezepte); // Setze die abgerufenen Rezepte in den State
            } catch (error) {
                console.error("Fehler beim Abrufen der Rezepte:", error);
                // Hier könntest du eine Fehlermeldung anzeigen oder andere Fehlerbehandlung durchführen
            }
        };

        fetchRezepte(); // Rezepte beim ersten Rendern der Komponente abrufen
    }, []);


        return (
        <div>
            <h2>Alle Rezepte anzeigen</h2>
            <div className='container'>
                {rezepte.map((rezept, index) => (
                    <div key={index}>
                        <p>Rezeptname: {rezept.rezeptName}</p>
                        <p>Anzahl Portionen: {rezept.anzahlPortionen}</p>
                        <p>Ersteller: {rezept.rezeptAdmin}</p>
                        <p>Response JSON: {JSON.stringify(rezept)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RezepteAnzeigen;
*/}

function RezepteAnzeigen() {
    const [rezepte, setRezepte] = useState([]);

    useEffect(() => {
        const fetchRezepte = async () => {
            try {
                const api = new EatSmarterAPI();
                const rezeptList = await api.getAllRezepte(); // Ruf die neuen Rezept-Methode auf
                setRezepte(rezeptList);
            } catch (error) {
                console.error("Fehler beim Abrufen der Rezepte:", error);
            }
        };

        fetchRezepte();
    }, []);

    return (
        <div>
            <h2>Alle Rezepte anzeigen</h2>
            <div className='container'>

                {rezepte.map((rezept, index) => (
                    <div key={index} className='rezepteAnzeigenDiv'>
                        <p>Rezeptname: {rezept.rezeptName}</p>
                        <p>Anzahl Portionen: {rezept.anzahlPortionen}</p>
                        <p>Ersteller: {rezept.rezeptAdmin}</p>
                    </div>
                ))}

            </div>
        </div>
    );
}

export default RezepteAnzeigen;
