import React, { useState } from "react";
import '../sytles/WG-Landingpage.css';

function Lebensmittelverwaltung() {
    const [masseinheit, setMasseinheit] = useState("");
    const [menge, setMenge] = useState("");

    const handleMasseinheitChange = (event) => {
        setMasseinheit(event.target.value);
    };

    const handleMengeChange = (event) => {
        setMenge(event.target.value);
    };

    return (
        <div>
            <p>Platzhalter für Navigationsleiste</p>
            <div className='container'>
                <h2>Lebensmittel hinzufügen</h2>
                <div className='formitem'>
                    <label>Lebensmittelname</label>
                    <input type="text" className="eingabe"></input>
                    
                    <label>Menge</label>
                    <input
                        type="number"
                        value={menge}
                        onChange={handleMengeChange}
                        className="eingabe"
                     />
                     <label>Maßeinheit</label>
                    <input
                        list="masseinheit"
                        value={masseinheit}
                        onChange={handleMasseinheitChange}
                        className="eingabe"
                    />
                    <datalist id="masseinheit">
                        <option value="Gramm" />
                        <option value="Kilogramm" />
                        <option value="Liter" />
                        {/*weitere Maßeinheiten können hier hinzugefügt werden*/}
                    </datalist>   
                    
                    <button className="button" type="button" onClick={() => alert('Lebensmittel wurde hinzugefügt')}>hinzufügen</button>
                </div>
            </div>
        </div>
    );
}

export default Lebensmittelverwaltung;
