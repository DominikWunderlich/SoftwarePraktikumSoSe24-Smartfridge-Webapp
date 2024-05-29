import React, {useEffect, useState} from "react";
import EatSmarterAPI from "../api/EatSmarterAPI";
import '../sytles/WG-Landingpage.css';
import {useNavigate} from "react-router-dom";
import NavBar from "../components/NavBar";


function WGPage(props) {
    const currentUser = props.user.email;
    const [wg, setWg] = useState(null)
    const [addNewMemberEmail, setAddNewMemberEmail] = useState("");
    const [deleteNewMemberEmail, setDeleteNewMemberEmail] = useState("");
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

    // Handler-Function, um Mitglieder als Admin hinzuzufügen
    const handleAddMember = async() => {
        const updatedWg = {...wg};
        updatedWg.wgBewohner += `,${addNewMemberEmail}`;

        const isAdmin = await EatSmarterAPI.getAPI().checkIfUserIsWgAdmin(currentUser);
           if(isAdmin){
               await EatSmarterAPI.getAPI().updateWg(updatedWg)
               renderCurrentUsersWg()
           }
           else{
               alert("Nur der Ersteller kann Mitglieder hinzufügen");
           }
           setAddNewMemberEmail("");
    }

    // Handler-Function, um Mitglieder als Admin zu entfernen
    const handleDeleteMember = async()  => {
           const updatedWg = {...wg};
           // Bewohner aus der Liste entfernen
           updatedWg.wgBewohner = updatedWg.wgBewohner.split(',').filter(email => email.trim() !== deleteNewMemberEmail).join(',');

           const isAdmin = await EatSmarterAPI.getAPI().checkIfUserIsWgAdmin(currentUser);
           // console.log("wg", isAdmin)
           if(isAdmin){
               await EatSmarterAPI.getAPI().updateWg(updatedWg)
               renderCurrentUsersWg()
           }
           else{
               alert("Nur der Ersteller kann Mitglieder entfernen");
           }
           setDeleteNewMemberEmail("");
    }

     // Handler-Function, um die Wg als Admin zu löschen
    const handleDeleteWG = async () => {
        const isAdmin = await EatSmarterAPI.getAPI().checkIfUserIsWgAdmin(currentUser);
        // console.log("Frontend", isAdmin);

        if(isAdmin){
            await EatSmarterAPI.getAPI().deleteWgByName(currentUser)
                .then(() => {
                    navigate("/registerWg");
                })
        }
        else{
            alert("Nur der Ersteller kann die Wg löschen");
        }
    }

    
    return (
        <div>
            <NavBar currentUser={props.user} onSignOut={props.onSignOut}></NavBar> <br></br> <br></br>
            <div className='container'>
                {/*Abfrage, ob wg nicht null*/}
                {wg && (
                <div className="inner-container">
                    <div className="formitem">
                        <h2>Infos der {wg.wgName}</h2>
                        <label>Bewohner: </label>
                        <p className="mini-container">
                            {wg.wgBewohner.split(',').map((bewohner, index) => (
                                <li key={index}>{bewohner.trim()}</li>
                            ))}
                        </p>
                    </div>
                    <br></br>
                    <div className="formitem">
                        <label>Ersteller der WG: </label>
                        <p className="mini-container">{wg.wgAdmin}</p>
                    </div>
                </div>
                )}
                <br></br>
                <div className="inner-container">
                    <h2>WG-Verwaltung</h2>
                    <div className="formitem">
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
                            <button type="button" onClick={handleAddMember}>hinzufügen</button>
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
                            <button type="button" onClick={handleDeleteMember}>entfernen</button>
                            <div className='formitem'>
                            </div>
                        </form>
                    </div>
                </div>
                <br></br>
                <br></br>
                <button className="button-uebersicht" type="button" onClick={handleDeleteWG}>WG löschen</button>
            </div>
        </div>
    );
}

export default WGPage;
