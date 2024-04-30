import React, { useState } from "react";
import '../sytles/WG-Landingpage.css';

function Lebensmittelverwaltung() {
    const [lebensmittelname, setLebensmittelname] = useState("");
    const [masseinheit, setMasseinheit] = useState("");
    const [menge, setMenge] = useState("");
    const [lebensmittelliste, setLebensmittelliste] = useState([]);

    const handleLebensmittelnameChange = (event) => {
        setLebensmittelname(event.target.value);
    };

    const handleMasseinheitChange = (event) => {
        setMasseinheit(event.target.value);
    };

    const handleMengeChange = (event) => {
        setMenge(event.target.value);
    };

    const handleHinzufuegenClick = () => {
        setLebensmittelliste([...lebensmittelliste, {lebensmittelname, masseinheit, menge}]);
        alert('Lebensmittel wurde hinzugefügt');
        setLebensmittelname("");
        setMenge("");
        setMasseinheit("");
    };

    return (
        <div>
            <p>Platzhalter für Navigationsleiste</p>
            <div className='container'>
                <h2>Lebensmittel hinzufügen</h2>
                <div className='formitem'>
                    <label>Lebensmittelname</label>
                    <input type="text" className="eingabe" value={lebensmittelname} onChange={handleLebensmittelnameChange}></input>
                    
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
                    
                    <button className="button" type="button" onClick={handleHinzufuegenClick}>hinzufügen</button>
                </div>
            </div>
            <div>
                <h2>Eingetragene Lebensmittel</h2>
                {lebensmittelliste.map((lebensmittel, index)=> (
                    <div key={index}>
                        <p>Lebensmittel: {lebensmittel.lebensmittelname}</p>
                        <p>Masseinheit: {lebensmittel.masseinheit}</p>
                        <p>Menge: {lebensmittel.menge}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Lebensmittelverwaltung;
