import React, {useEffect, useState} from "react";
import EatSmarterAPI from "../api/EatSmarterAPI";
import '../sytles/WG-Landingpage.css';


function WGPage(props) {
    const [wg, setWg] = useState(null)
    const[newMemberEmail, setNewMemberEmail] = useState("");
    async function renderCurrentUsersWg(){
        await EatSmarterAPI.getAPI().getWgByUser(props.user.email)
            .then(response => {
                console.log("Das ist die atuelle Wg des Nutzer: ", response)
                setWg(response);
            })
            .catch(error => {
                console.error(error);
            });

    }
    useEffect(() => {
        renderCurrentUsersWg()
    }, []);

    const handleAddMember = async () => {
        // wgDaten mit neuer Mail aktualiesiern
        const updatedWg = {...wg};
        updatedWg.wgBewohner += `,${newMemberEmail}`;
        // das ist die Email im Input Feld
        console.log("Neue email adresse im Frontend: ", newMemberEmail)

        try{
            await EatSmarterAPI.getAPI().updateWg(updatedWg);
            setWg(updatedWg);
        }
        catch(error){
            console.error(error);
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
                        onChange={ (event) => {
                            setNewMemberEmail(event.target.value)}}
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
