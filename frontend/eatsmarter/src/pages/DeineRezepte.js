import React, { useState, useEffect } from "react";
import EatSmarterAPI from "../api/EatSmarterAPI";
import { useParams } from "react-router-dom";
import '../sytles/WG-Landingpage.css';

function deineRezepte() {


    return (
        <div>
            <p>Platzhalter für Navigationsleiste</p>
            <div className='container'>
                <h2>Hier werden deine Rezepte angezeigt</h2>
                <div className='rezepteAnzeigenDiv'>
                    <p>Hier sollen die bisher erstellten Rezepte des Benutzers angezeigt werden</p>
                </div>
                <div>
                    <button type={"submit"}>Rezept erstellen</button>
                    {/* <!-- Link zur Rezept erstellen Seite muss hier noch hinzugefügt werden --> */}
                </div>

            </div>
        </div>
    );
}

export default deineRezepte;