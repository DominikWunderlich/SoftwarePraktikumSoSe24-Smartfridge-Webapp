import React, { useState } from "react";
import '../sytles/WG-Landingpage.css';

function Lebensmittelverwaltung() {
    const [Masseinheit, set_menge] = useState("");

    const handleMaßeinheitChange = (event) => {
        set_masseinheit(event.target.value);
    };

    const handleMengeChange = (event) => {
        set_menge(event.target.value);
    };

    return (
        <div>
            <p>Platzhalter für Navigationsleiste</p>
            <div className='container'>
                <h2>Lebensmittel hinzufügen</h2>
                <div className='formitem'>
                    <label>Lebensmittelname</label>
                    <input type="text" className="eingabe"></input>
                    <label>Maßeinheit</label>
                    <input
                        list="masseinheit"
                        value={Maßeinheit}
                        onChange={handleMaßeinheitChange}
                        className="eingabe"
                    />
                    <datalist id="masseinheit">
                        <option value="Gramm" />
                        <option value="Kilogramm" />
                        <option value="Liter" />
                        {/*weitere Maßeinheiten können hier hinzugefügt werden*/}
                    </datalist>
                    <label>Menge</label>
                    <input
                        type="nuber"
                        value={menge}
                        onChange={handleMengeChange}
                        className="eingabe"
                     />   
                    <button className="button" type="button" onClick={() => alert('Lebensmittel wurde hinzugefügt')}>hinzufügen</button>
                </div>
            </div>
        </div>
    );
}

export default Lebensmittelverwaltung; 