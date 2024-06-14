import React, {useEffect, useState} from "react";
import EatSmarterAPI from "../api/EatSmarterAPI";
import '../sytles/WG-Landingpage.css';
import {useNavigate} from "react-router-dom";
import NavBar from "../components/NavBar";
import TrimAndLowerCase from "../functions";
import {render} from "@testing-library/react";
import PersonBO from "../api/PersonBO";


function WGPage(props) {
    const currentUser = props.user.email;
    const [wg, setWg] = useState(null)
    const [addNewMemberEmail, setAddNewMemberEmail] = useState("");
    const [deleteNewMemberEmail, setDeleteNewMemberEmail] = useState("");
    const [personList, setPersonList] = useState([])
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

    async function renderPersonList(){
        await EatSmarterAPI.getAPI().getPersonByWg(props.user.email)
            .then(response => {
                console.log("Response 31", response)
                setPersonList(response);
        })
            .catch(error => {
                console.error(error);
            });
    }

    useEffect(() => {
        renderCurrentUsersWg();
        renderPersonList();
}, []);

    // Funktion zum Überprüfen der E-Mail-Validität
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };


    const handleAddMember = async() => {

        const isAdmin = await EatSmarterAPI.getAPI().checkIfUserIsWgAdmin(props.user.email)

        if (isAdmin) {
            if (!isValidEmail(addNewMemberEmail)) {
                alert("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
            }
            else{
                let userExist = await EatSmarterAPI.getAPI().getUserByEmail(TrimAndLowerCase(addNewMemberEmail));
                console.log(userExist)

                if (userExist.length === 0) {
                    alert("Diese eingetragene E-Mail Adresse hat noch kein Account angelegt. Um einen Bewohner hinzufügen zu können, muss sich die Person in unserem System anmelden.")
                } else {
                    const response = await EatSmarterAPI.getAPI().addWgBewohner(currentUser, TrimAndLowerCase(addNewMemberEmail));
                    console.log("Repsonse im wgpage", response)
                    if (response) {
                        renderCurrentUsersWg();
                        renderPersonList();
                    }
                }
                setAddNewMemberEmail("");
            }
        }
        else{
            alert("Nur der Ersteller kann Mitglieder entfernen")
        }
    }



   const handleDeleteMember = async() => {
          if (!isValidEmail(deleteNewMemberEmail)) {
            alert("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
            return;
        }
        const response = await EatSmarterAPI.getAPI().deleteWgBewohner(currentUser, TrimAndLowerCase(deleteNewMemberEmail));
        console.log("Repsonse im wgpage", response)
        if(response){
            renderCurrentUsersWg();
            renderPersonList();
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
                        <h2>Bewohner der WG</h2>
                        <div className="mini-container">
                            <table>
                                <thead>
                                <tr>
                                    <th>Nutzername</th>
                                    <th>Nachname</th>
                                    <th>Vorname</th>
                                    <th>Email</th>
                                </tr>
                                </thead>
                                <tbody>
                                {personList.map((person, index) => (
                                    <tr key={index}>
                                        <td>{person.userName}</td>
                                        <td>{person.lastName}</td>
                                        <td>{person.firstName}</td>
                                        <td>{person.email}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>

                        </div>
                        <br></br>
                        <div className="formitem">
                            <label>Ersteller der WG: </label>
                            <p className="mini-info-container">{wg.wgAdmin}</p>
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
