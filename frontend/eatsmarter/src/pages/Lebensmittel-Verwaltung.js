import React, { useState } from "react";
import '../sytles/WG-Landingpage.css';
import LebensmittelBO from "../api/LebensmittelBO";
import {Link} from "react-router-dom";
import EatSmarterAPI from "../api/EatSmarterAPI";

// function Lebensmittelverwaltung() {
//     const [lebensmittel_name, setLebensmittelname] = useState("");
//     const [masseinheit, setMasseinheit] = useState("");
//     const [menge, setMenge] = useState("");
//     const [lebensmittelliste, setLebensmittelliste] = useState([]);

//     const handleLebensmittelnameChange = (event) => {
//         setLebensmittelName(event.target.value);
//     };

//     const handleMasseinheitChange = (event) => {
//         setMasseinheit(event.target.value);
//     };

//     const handleMengeChange = (event) => {
//         setMenge(event.target.value);
//     };

//     const handleHinzufuegenClick = () => {
//         const newLebensmittel = {lebensmittel_name, masseinheit, menge};
        
//         setLebensmittelliste([...lebensmittelliste, newLebensmittel]);
//         alert('Lebensmittel wurde hinzugefügt');
//         setLebensmittelname("");
//         // setMenge("");
//         // setMasseinheit("");
//     };


//     const handleSubmit = (event) => {
//         event.preventDefault();

//         lebensmittelliste.forEach(lebensmittel => {
//             const newLebensmittel = new LebensmittelBO(lebensmittel.lebensmittelName);
//             EatSmarterAPI.getAPI().addLebensmittel(newLebensmitteBO)
//             .then(Response=> {
//                 console.log('Lebensmittel gespeichert:', response);

//             })
//             .catch(error => {
//                 console.error('Fehler beim speichern', error);
//             })
//         })
//     };


//     return (
//         <div>
//             <p>Platzhalter für Navigationsleiste</p>
//             <div className='container'>
//                 <h2>Lebensmittel hinzufügen</h2>
//                 <div className='formitem'>
//                     <label>Lebensmittelname</label>
//                     <input type="text" className="eingabe" value={lebensmittel_name} onChange={handleLebensmittelnameChange}></input>
                    
//                     <label>Menge</label>
//                     <input
//                         type="number"
//                         value={menge}
//                         onChange={handleMengeChange}
//                         className="eingabe"
//                      />
//                      <label>Maßeinheit</label>
//                     <input
//                         list="masseinheit"
//                         value={masseinheit}
//                         onChange={handleMasseinheitChange}
//                         className="eingabe"
//                     />
//                     <datalist id="masseinheit">
//                         <option value="Gramm" />
//                         <option value="Kilogramm" />
//                         <option value="Liter" />
//                         {/*weitere Maßeinheiten können hier hinzugefügt werden*/}
//                     </datalist>   
                    
//                     <button className="button" type="button" onClick={handleHinzufuegenClick}>hinzufügen</button>
//                 </div>
//             </div>
//             <div>
//                 <h2>Eingetragene Lebensmittel</h2>
//                 {lebensmittelliste.map((lebensmittel, index)=> (
//                     <div key={index}>
//                         <p>Lebensmittel: {lebensmittel.lebensmittel_name}</p>
//                         <p>Masseinheit: {lebensmittel.masseinheit}</p>
//                         <p>Menge: {lebensmittel.menge}</p>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

// export default Lebensmittelverwaltung;



function Lebensmittelverwaltung() {
    const [lebensmittelName, setLebensmittelName] = useState(""); 
    const [masseinheit, setMasseinheit] = useState("");
    const [menge, setMenge] = useState("");
    const [lebensmittelliste, setLebensmittelliste] = useState([]);

    const handleLebensmittelNameChange = (event) => {
        setLebensmittelName(event.target.value);
    };

    const handleMasseinheitChange = (event) => {
        setMasseinheit(event.target.value);
    };

    const handleMengeChange = (event) => {
        setMenge(event.target.value);
    };

    const handleHinzufuegenClick = () => {
        const newLebensmittel = {lebensmittelName, masseinheit, menge};
        setLebensmittelliste([...lebensmittelliste, newLebensmittel]);
        alert('Lebensmittel wurde hinzugefügt');
        setLebensmittelName("");
        setMenge("");
        setMasseinheit("");
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        lebensmittelliste.forEach(lebensmittel => {
            const newLebensmittelBO = new LebensmittelBO(lebensmittel.lebensmittelName);
            EatSmarterAPI.getAPI().addLebensmittel(newLebensmittelBO)
                .then(response => {
                    console.log("Lebensmittel erfolgreich gespeichert:", response);
                })
                .catch(error => {
                    console.error("Fehler beim Speichern des Lebensmittels:", error);
                });
        });
    };

    return (
        <div>
            <p>Platzhalter für Navigationsleiste</p>
            <div className='container'>
                <h2>Lebensmittel hinzufügen</h2>
                <div className='formitem'>
                    <label>Lebensmittelname</label>
                    <input type="text" className="eingabe" value={lebensmittelName} onChange={handleLebensmittelNameChange}></input>
                    
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
                        <p>Lebensmittel: {lebensmittel.lebensmittelName}</p> {/* Hier auch lebensmittelName korrigieren */}
                        <p>Masseinheit: {lebensmittel.masseinheit}</p>
                        <p>Menge: {lebensmittel.menge}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Lebensmittelverwaltung;
