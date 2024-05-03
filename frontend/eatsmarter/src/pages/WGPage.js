import React, {useEffect, useState} from "react";
import EatSmarterAPI from "../api/EatSmarterAPI";
import '../sytles/WG-Landingpage.css';
import { useNavigate } from "react-router-dom";


function WGPage(props) {
    const [wg, setWg] = useState(null)
    const[addNewMemberEmail, setAddNewMemberEmail] = useState("");
    const[deleteNewMemberEmail, setDeleteNewMemberEmail] = useState("");
    const navigate = useNavigate()
    async function renderCurrentUsersWg(){
        await EatSmarterAPI.getAPI().getWgByUser(props.user.email)
            .then(response => {
                setWg(response);
            })
            .catch(error => {
                console.error(error);
            });

    }
    useEffect(() => {
        renderCurrentUsersWg()
    }, []);

    // Handle Methode um Wg-Bewohner hinzuzufügen
    const handleAddMember = async () => {
        // wgDaten mit neuer Mail aktualiesiern

        // Überprüfen, ob die E-Mail-Adresse bereits in der Liste der WG-Bewohner enthalten ist
        if (wg && wg.wgBewohner.includes(addNewMemberEmail)) {
            alert("Dieser Nutzer ist bereits in der WG");
        }
        else{
            // E-Mail des eingeloggten Users
            let currentUser = props.user.email
            // E-Mail des wgAdmins
            let wgAdmin = wg.wgAdmin

        // Wenn der currentUser der wgAdmin ist, dann WgBewohner hinzufügen
        if(currentUser === wgAdmin){
             const updatedWg = {...wg};
             updatedWg.wgBewohner += `,${addNewMemberEmail}`;

             try{
                 await EatSmarterAPI.getAPI().updateWg(updatedWg);
                 setWg(updatedWg);
             }
             catch(error){
                 console.error(error);
             }
        }

        // Alert ausgeben, dass nur der Ersteller die Wg bearbeiten darf
        // TODO: Bei Bedarf, Alert durch was schöneres ersetzen
        else{
            alert("Nur der Ersteller kann die Wg bearbeiten")
        }
        }
         // Am Ende wird das Input Feld geleert
            setAddNewMemberEmail("");
    };


    // Handle Methode um Wg-Bewohner zu entfernen
    const handleDeleteMember = async () => {
        // E-Mail des eingeloggten Users
        let currentUser = props.user.email
        // E-Mail des wgAdmins
        let wgAdmin = wg.wgAdmin

        // Wenn der currentUser der wgAdmin ist, dann WgBewohner löschen
        if(currentUser === wgAdmin){
             const updatedWg = {...wg};
                // Bewohner aus der Liste entfernen
                updatedWg.wgBewohner = updatedWg.wgBewohner.split(',').filter(email => email.trim() !== deleteNewMemberEmail).join(',');

             try{
                 await EatSmarterAPI.getAPI().updateWg(updatedWg);
                 setWg(updatedWg);
             }
             catch(error){
                 console.error(error);
             }
        }
        // Alert ausgeben, dass nur der Ersteller die Mitglieder entfernen darf
        // TODO: Bei Bedarf, Alert durch was schöneres ersetzen
        else{
            alert("Nur der Ersteller kann Mitglieder entfernen")
        }
          // Am Ende wird das Input Feld geleert
            setDeleteNewMemberEmail("");
    };

    const handleDeleteWG = () => {

        let currentUser = props.user.email
        let wgAdmin = wg.wgAdmin
        let wgName = wg.wgName

        if(currentUser===wgAdmin){
            EatSmarterAPI.getAPI().deleteWgByName(wgName)
            navigate("/registerWg")

        }
        else{
            alert("Nur der Ersteller kann die WG löschen")
        }
    }

    return (
        <div>
            {/*TODO: Mit Navbar ersetzen*/}
            <p>Platzhalter für NavBar</p>
            <div className='container'>
                {/*Abfrage, ob wg nicht null*/}
                {wg && (
                    <div>
                        <h2>Aktuelle WG: {wg.wgName}</h2>
                        <p>Bewohner: </p>
                        {/*TODO: Wenn die Liste in DB nicht mehr als string sondern als Liste, dann map-Methode und forEach*/}
                        <p>
                            {wg.wgBewohner.split(',').map((bewohner, index) => (
                                <li key={index}>{bewohner.trim()}</li>
                            ))}
                        </p>
                        <p>Ersteller der WG: {wg.wgAdmin}</p>
                    </div>
                )}
                <form id="addBewohner">
                    <h2></h2>
                    <label>Mitglied hinzufügen: </label>
                    <input
                        type="email"
                        value={addNewMemberEmail}
                        onChange={(event) => {
                            setAddNewMemberEmail(event.target.value)
                        }}
                    />
                    <button type="button" onClick={handleAddMember}>+</button>
                    <div className='formitem'>
                    </div>
                </form>

                <form id="deleteBewohner">
                    <h2></h2>
                    <label>Mitglied entfernen: </label>
                    <input
                        type="email"
                        value={deleteNewMemberEmail}
                        onChange={(event) => {
                            setDeleteNewMemberEmail(event.target.value)
                        }}
                    />
                    <button type="button" onClick={handleDeleteMember}>-</button>
                    <div className='formitem'>
                    </div>

                    <button type="button" onClick={handleDeleteWG}>WG löschen</button>
                </form>
            </div>
        </div>
    );
}

export default WGPage;
