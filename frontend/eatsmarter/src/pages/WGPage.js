import React, {useEffect, useState} from "react";
import EatSmarterAPI from "../api/EatSmarterAPI";
import '../sytles/WG-Landingpage.css';


function WGPage(props) {
    const [wg, setWg] = useState(null)
    const[newMemberEmail, setNewMemberEmail] = useState("");
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

        // E-Mail des eingeloggten Users
        let currentUser = props.user.email
        // E-Mail des wgAdmins
        let wgAdmin = wg.wgAdmin

        // Wenn der currentUser der wgAdmin ist, dann WgBewohner hinzufügen
        if(currentUser === wgAdmin){
             const updatedWg = {...wg};
             updatedWg.wgBewohner += `,${newMemberEmail}`;

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
    };

    return (
        <div>
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
                <form>
                    <h2></h2>
                    <label>Mitglied hinzufügen: </label>
                    <input
                        type="email"
                        value={newMemberEmail}
                        onChange={ (event) => {setNewMemberEmail(event.target.value)}}
                    />
                    <button type="button" onClick={handleAddMember}>+</button>
                    <div className='formitem'>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default WGPage;
