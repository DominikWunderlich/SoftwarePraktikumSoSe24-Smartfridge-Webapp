import React from "react";
import '../sytles/WG-Landingpage.css';

function Lebensmittelverwaltung() {
    return (
        <div>
            <p>Platzhalter für Navigationsleiste</p>
            <div className='container'>
                <h2>Lebensmittel hinzufügen</h2>
                <div className='formitem'>
                    <label>Lebensmittelname</label>
                    <input type="text" className="eingabe"></input>
                    <button className="button" type="button" onClick={() => alert('Lebensmittel wurde hinzugefügt')}>hinzufügen</button>
                </div>
            </div>
        </div>
    );
}

export default Lebensmittelverwaltung;

