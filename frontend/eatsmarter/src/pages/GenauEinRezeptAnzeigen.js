import React, {useState, useEffect} from "react";
import RezeptBO from "../api/RezeptBO";
import {Link} from "react-router-dom";
import EatSmarterAPI from "../api/EatSmarterAPI";
import '../sytles/WG-Landingpage.css';
import NavBar from "../components/NavBar";

function GenauEinRezeptAnzeigen(props) {
    return (
        <div>
            <NavBar currentUser={props.user} onSignOut={props.onSignOut}></NavBar> <br></br> <br></br>
            <h2>Ein Rezept Anzeigen</h2>
            Hier soll der Rezeptname, anzahl Portionen angezeigt werden
            <div className='container'>
                <p>Lebensmittel 1 + Menge + Maßeinheit</p>
                <p>Lebensmittel 2 + Menge + Maßeinheit</p>
                <p>Hier sollen die Lebensmittel diese Rezepts angezeigt werden Hier GET Abfrage hin</p>
                <p>Frage: Wie finde ich heraus welches Rezept ich angeklickt habe?</p>
                <p>Mit einem getEinRezeptbyRezeptId oder so. Und die rezept_id wird beim Klick drauf übergeben</p>
            </div>
        </div>
    );

}
export default GenauEinRezeptAnzeigen;