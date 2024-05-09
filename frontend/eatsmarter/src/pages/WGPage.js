import React, {useEffect, useState} from "react";
import EatSmarterAPI from "../api/EatSmarterAPI";
import '../sytles/WG-Landingpage.css';
import {isRouteErrorResponse, useNavigate} from "react-router-dom";
import NavBar from "../components/NavBar";
import WgBO from "../api/WgBO";


function WGPage(props) {
    const currentUser = props.user.email;
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

    const handleAddMember = async() => {
        //TODO: Überprüfung, ob bewohner schon in der Wg implementieren
        const updatedWg = {...wg};
        updatedWg.wgBewohner += `,${addNewMemberEmail}`;

        await EatSmarterAPI.getAPI().updateWg(currentUser, updatedWg)
            .then((responseWgBO) => {
                console.log("Das ist das Ergebnis der update", responseWgBO);
                if (responseWgBO.wgName !== null && responseWgBO.wgBewohner !== null && responseWgBO.wgAdmin !== null) {
                    setWg(responseWgBO);
                } else {
                    alert("Nur der Ersteller kann Mitglieder hinzufügen");
                }
            });
        // Am Ende wird das Input Feld geleert
            setAddNewMemberEmail("");
    }

    // Handle Methode um Wg-Bewohner zu entfernen
    const handleDeleteMember = async () => {
        const updatedWg = {...wg};
        // Bewohner aus der Liste entfernen
        updatedWg.wgBewohner = updatedWg.wgBewohner.split(',').filter(email => email.trim() !== deleteNewMemberEmail).join(',');

        await EatSmarterAPI.getAPI().updateWg(currentUser, updatedWg)
            .then((responseWgBO) => {
                console.log("Das ist das Ergebnis der update", responseWgBO);
                if (responseWgBO.wgName !== null && responseWgBO.wgBewohner !== null && responseWgBO.wgAdmin !== null) {
                    setWg(responseWgBO);
                } else {
                    alert("Nur der Ersteller kann Mitglieder entfernen");
                }
            });
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
            <NavBar currentUser={props.user} onSignOut={props.onSignOut}></NavBar> <br></br> <br></br>
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
