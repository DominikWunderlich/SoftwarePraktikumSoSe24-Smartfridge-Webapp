import React, {useEffect, useState} from "react";
import EatSmarterAPI from "../api/EatSmarterAPI";
import '../sytles/WG-Landingpage.css';
import {useNavigate} from "react-router-dom";
import NavBar from "../components/NavBar";
import TrimAndLowerCase from "../functions";
import DeleteIcon from '@mui/icons-material/Delete';


function WGPage(props) {
    const currentUser = props.user.email;
    const [wg, setWg] = useState(null);
    const [addNewMemberEmail, setAddNewMemberEmail] = useState("");
    const [personList, setPersonList] = useState([]);
    const navigate = useNavigate();
    const [wgAdmin, setWgAdmin] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showAdminAddPopup, setShowAdminAddPopup] = useState(false);
    const [showAdminDeletePopup, setShowAdminDeletePopup] = useState(false);
    const [showAdminDeleteWgPopup, setShowAdminDeleteWgPopup] = useState(false);
    const [showNotExistUserPopup, setNotExistUserPopup] = useState(false);
    const [showUserAlreadyInWgPopup, setUserAlreadyInWgPopup] = useState(false);
    const [showNoValidEmailPopup, setShowNoValidEmailPopup] = useState(false);

    /* -------- Funktionen zum Abrufen der Daten aus der Datenbank -------- */
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

    const fetchAdmin = async () => {
        const admin = await EatSmarterAPI.getAPI().checkIfUserIsWgAdmin(props.user.email);
        if (admin) {
            setIsAdmin(true)
        }
    }

    useEffect(() => {
        renderCurrentUsersWg();
        renderPersonList();
        renderWgAdmin();
        fetchAdmin();
    }, []);

    // Funktion zum Überprüfen der E-Mail-Validität 
    //Quelle: https://stackoverflow.com/questions/76843321/prevent-repeating-character-using-regex-for-email/76843396#76843396
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

      /* -------- Handler-Function, um als Admin Mitglieder zur WG hinzuzufügen -------- */
    const handleAddMember = async() => {
        if (isAdmin) {
            if (!isValidEmail(addNewMemberEmail)) {
                setShowNoValidEmailPopup(true);
            } else {
                const userExist = await EatSmarterAPI.getAPI().getUserByEmail(TrimAndLowerCase(addNewMemberEmail));

                if (userExist.length === 0) {
                    setNotExistUserPopup(true);
                } else {
                    const userObject = userExist[0];
                    if (userObject.wgId) {
                        setUserAlreadyInWgPopup(true);
                    } else {
                        await EatSmarterAPI.getAPI().addPersonToWg(wg.id, TrimAndLowerCase(addNewMemberEmail));
                        renderCurrentUsersWg();
                        renderPersonList();
                        renderWgAdmin();
                        setAddNewMemberEmail(""); // Setzt das Eingabefeld nach erfolgreichem Hinzufügen zurück
                    }
                }
            }
        } else {
            setShowAdminAddPopup(true);
        }

    }

      /* -------- Handler-Function, um als Admin Mitglieder aus der Wg zu entfernen -------- */
    const handleDeleteMember = async(personId) => {
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

    /* -------- Handler-Function, um die Wg als Admin zu löschen -------- */
    const handleDeleteWG = async () => {
        if(isAdmin){
            await EatSmarterAPI.getAPI().deleteWg(currentUser)
                .then(() => {
                    navigate("/registerWg");
                });
        }
        else{
            setShowAdminDeleteWgPopup(true);
        }
    }

    /* -------- Diese Funktion ermöglicht es die Popups auf Buttonclick wieder zu schließen. -------- */
    function closePopup() {
        setShowAdminAddPopup(false);
        setShowAdminDeleteWgPopup(false);
        setShowAdminDeletePopup(false);
        setNotExistUserPopup(false);
        setShowNoValidEmailPopup(false);
        setUserAlreadyInWgPopup(false);
    }

    /* -------- Darstellung der Komponente -------- */
    return (
        <div>
            <NavBar currentUser={props.user} onSignOut={props.onSignOut}></NavBar> <br></br> <br></br>
            <div className='container'>
                {/*Abfrage, ob wg nicht null*/}
                {wg && (
                    <div className="inner-container">
                        <h2>Infos der WG {wg.wgName}</h2>
                        <label>Bewohner der WG</label>
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
                                            <DeleteIcon onClick={() => handleDeleteMember(person.id)} aria-label="delete"/>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <br></br>
                            <label>Ersteller der WG</label>
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
                    </div>
                )}
                <br></br>
                <div className="inner-container">
                    <h2>Mitglied hinzufügen</h2>
                    <div className="formitem">
                        <form id="addBewohner">
                            <h2></h2>
                            <label>Bitte Google-Mail des neuen Bewohners angeben: </label>
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
            {/*Popup-Elemente*/}
            {showUserAlreadyInWgPopup && (
                <div className="popup">
                    <div className="inner-popup">
                        <h3 className="h2-black">Vergebene E-Mail</h3>
                        <p>Die Person ist bereits einer WG beigetreten.</p>
                        <button type="button" onClick={closePopup}>Schließen</button>
                    </div>
                </div>
            )}
             {showAdminAddPopup && (
                <div className="popup">
                    <div className="inner-popup">
                        <h3 className="h2-black">Fehlende Rechte</h3>
                        <p>Nur der Ersteller kann Mitglieder hinzufügen.</p>
                        <button type="button" onClick={closePopup}>Schließen</button>
                    </div>
                </div>
            )}
            {showAdminDeletePopup && (
                <div className="popup">
                    <div className="inner-popup">
                        <h3 className="h2-black">Fehlende Rechte</h3>
                        <p>Nur der Ersteller kann Mitglieder löschen.</p>
                        <button type="button" onClick={closePopup}>Schließen</button>
                    </div>
                </div>
            )}
            {showAdminDeleteWgPopup && (
                <div className="popup">
                    <div className="inner-popup">
                        <h3 className="h2-black">Fehlende Rechte</h3>
                        <p>Nur der Ersteller kann die Wg löschen.</p>
                        <button type="button" onClick={closePopup}>Schließen</button>
                    </div>
                </div>
            )}
            {showNotExistUserPopup && (
                <div className="popup">
                    <div className="inner-popup">
                        <h3 className="h2-black">E-Mail ohne Account</h3>
                        <p>Um einen Bewohner hinzufügen zu können, muss sich die Person zuvor in unserem System anmelden.</p>
                        <button type="button" onClick={closePopup}>Schließen</button>
                    </div>
                </div>
            )}
           {showNoValidEmailPopup && (
            <div className="popup">
                <div className="inner-popup">
                    <h3 className="h2-black">Ungültige E-Mail</h3>
                    <p>Bitte geben Sie eine gültige E-Mail-Adresse ein.</p>
                    <button type="button" onClick={closePopup}>Schließen</button>
                </div>
            </div>
        )}
        </div>
    );
}

export default WGPage;
