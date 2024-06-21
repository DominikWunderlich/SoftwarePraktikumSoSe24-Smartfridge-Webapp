import React, {useEffect, useState} from "react";
import EatSmarterAPI from "../api/EatSmarterAPI";
import '../sytles/WG-Landingpage.css';
import {useNavigate} from "react-router-dom";
import NavBar from "../components/NavBar";
import TrimAndLowerCase from "../functions";


function WGPage(props) {
    const currentUser = props.user.email;
    const [wg, setWg] = useState(null)
    const [addNewMemberEmail, setAddNewMemberEmail] = useState("");
    const [personList, setPersonList] = useState([])
    const navigate = useNavigate()
    const [wgAdmin, setWgAdmin] = useState([])
    const [showAdminAddPopup, setShowAdminAddPopup] = useState(false);
    const [showAdminDeletePopup, setShowAdminDeletePopup] = useState(false);
    const [showAdminDeleteWgPopup, setShowAdminDeleteWgPopup] = useState(false);
    const [showNotExistUserPopup, setNotExistUserPopup] = useState(false);
    const [showNoValidEmailPopup, setShowNoValidEmailPopup] = useState(false);

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
                setPersonList(response);
        })
            .catch(error => {
                console.error(error);
            });
    }

    async function renderWgAdmin(){
        await EatSmarterAPI.getAPI().getWgAdminByEmail(props.user.email)
            .then(response => {
                setWgAdmin(response)
            })
            .catch(error => {
                console.error(error);
            });
    }

    useEffect(() => {
        renderCurrentUsersWg();
        renderPersonList();
        renderWgAdmin();
}, []);

    // Funktion zum Überprüfen der E-Mail-Validität
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };


      /**
     * Handler-Function, um als Admin Mitglieder zur WG hinzuzufügen
     */
    const handleAddMember = async() => {

        const isAdmin = await EatSmarterAPI.getAPI().checkIfUserIsWgAdmin(props.user.email)

        if (isAdmin) {
            if (!isValidEmail(addNewMemberEmail)) {
                setShowNoValidEmailPopup(true)
            }
            else{
                let userExist = await EatSmarterAPI.getAPI().getUserByEmail(TrimAndLowerCase(addNewMemberEmail));

                if (userExist.length === 0) {
                    setNotExistUserPopup(true)
                } else {
                    // const response = await EatSmarterAPI.getAPI().addWgBewohner(currentUser, TrimAndLowerCase(addNewMemberEmail));
                    await EatSmarterAPI.getAPI().addPersonToWg(wg.id, TrimAndLowerCase(addNewMemberEmail))
                    renderCurrentUsersWg();
                    renderPersonList();
                    renderWgAdmin();
                }
                setAddNewMemberEmail("");
            }
        }
        else{
            setShowAdminAddPopup(true);
        }

    }

      /**
     * Handler-Function, um als Admin Mitglieder aus der Wg zu entfernen
     */
    const handleDeleteMember = async(event) => {

        const isAdmin = await EatSmarterAPI.getAPI().checkIfUserIsWgAdmin(props.user.email)
        let personId = event.target.value

        if (isAdmin){
            await EatSmarterAPI.getAPI().deletePersonFromWg(wg.id, personId)
            renderCurrentUsersWg();
            renderPersonList();
            renderWgAdmin();
        }
        else{
            setShowAdminDeletePopup(true);
        }

    }


    /**
     * Handler-Function, um die Wg als Admin zu löschen
     */
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
            setShowAdminDeleteWgPopup(true);
        }
    }

    /**
     * Diese Funktion ermöglicht es die Popups auf Buttonclick wieder zu schließen.
     */
    function closePopup() {
        setShowAdminAddPopup(false);
        setShowAdminDeleteWgPopup(false);
        setShowAdminDeletePopup(false);
        setNotExistUserPopup(false);
        setShowNoValidEmailPopup(false);
    }


    return (
        <div>
            <NavBar currentUser={props.user} onSignOut={props.onSignOut}></NavBar> <br></br> <br></br>
            <div className='container'>
                {/*Abfrage, ob wg nicht null*/}
                {wg && (
                    <div className="inner-container">
                        <h2>Infos der WG {wg.wgName}</h2>
                        <h2>Bewohner der WG</h2>
                        <div className="mini-container">
                            <table>
                                <thead>
                                <tr>
                                    <th>Nutzername</th>
                                    <th>Nachname</th>
                                    <th>Vorname</th>
                                    <th>Email</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {personList.map((person, index) => (
                                    <tr key={index}>
                                        <td>{person.userName}</td>
                                        <td>{person.lastName}</td>
                                        <td>{person.firstName}</td>
                                        <td>{person.email}</td>
                                        <td>
                                            <button value={person.id} onClick={handleDeleteMember}>-</button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <br></br>
                            <h2>Ersteller der WG</h2>
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
                                    {wgAdmin.map((person, index) => (
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
                    </div>
                )}
                <br></br>
                <div className="inner-container">
                    <h2>Mitglied hinzufügen</h2>
                    <div className="formitem">
                        <form id="addBewohner">
                            <h2></h2>
                            <label>Bitte Geben Sie die Google-Mail des neuen Bewohners an: </label>
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
                    </div>
                </div>
                <br></br>
                <br></br>
                <button className="button-uebersicht" type="button" onClick={handleDeleteWG}>WG löschen</button>
            </div>
             {showAdminAddPopup && (
                <div className="popup">
                    <div className="inner-popup">
                        <h1 className="h2-black">Nur der Ersteller kann Mitglieder hinzufügen!</h1>
                        <button onClick={closePopup}>Schließen</button>
                    </div>
                </div>
            )}

            {showAdminDeletePopup && (
                <div className="popup">
                    <div className="inner-popup">
                        <h1 className="h2-black">Nur der Ersteller kann Mitglieder löschen!</h1>
                        <button onClick={closePopup}>Schließen</button>
                    </div>
                </div>
            )}

            {showAdminDeleteWgPopup && (
                <div className="popup">
                    <div className="inner-popup">
                        <h1 className="h2-black">Nur der Ersteller kann die Wg löschen!</h1>
                        <button onClick={closePopup}>Schließen</button>
                    </div>
                </div>
            )}

            {showNotExistUserPopup && (
                <div className="popup">
                    <div className="inner-popup">
                        <h1 className="h2-black">Diese eingetragene E-Mail Adresse hat noch keinen Account angelegt.
                            <br/>
                            Um einen Bewohner hinzufügen zu können, muss sich die Person zuvor in unserem System anmelden.
                        </h1>
                        <button onClick={closePopup}>Schließen</button>
                    </div>
                </div>
            )}

           {showNoValidEmailPopup && (
            <div className="popup">
                <div className="inner-popup">
                    <h1 className="h2-black">Bitte geben Sie eine gültige E-Mail-Adresse ein.</h1>
                    <button onClick={closePopup}>Schließen</button>
                </div>
            </div>
        )}
        </div>
    );
}

export default WGPage;
