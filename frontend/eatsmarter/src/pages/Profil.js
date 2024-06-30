import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import EatSmarterAPI from "../api/EatSmarterAPI";
import NavBar from "../components/NavBar";
import '../sytles/WG-Landingpage.css';
import NavBarRegisterWg from "../components/NavBarRegisterWg";
import PersonBO from "../api/PersonBO";
import TrimAndLowerCase from "../functions";
import "../sytles/WG-Landingpage.css";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import TaskAltIcon from '@mui/icons-material/TaskAlt';


function Profil(props){
    const googleId = props.user.uid;
    const [profil, setProfil] = useState(null);
    const [wg, setWg] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    const navigate = useNavigate();

    /* -------- Funktionen zum Laden des Profils sowie Anzeigen der Profildaten -------- */
    const renderProfile = async () => {
        await EatSmarterAPI.getAPI().checkUserByGID(googleId)
            .then(response => {
                if (response.length > 0) {
                     setProfil(response[0]);
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
     async function renderCurrentUsersWg(){
        await EatSmarterAPI.getAPI().getWgByUser(props.user.email)
            .then(response => {
                setWg(response);
            })
            .catch(error => {
                console.error(error);
            });
    }

    /* -------- Funktionen zum Ändern der Accountdaten -------- */
    const handleEditChange = (event) => {
        setEditFormData({
            ...editFormData,
            [event.target.name]: event.target.value
        });
    };

    const handleEditButton = () =>{
        setEditMode(true);

        setEditFormData({
            email: props.user.email,
            userName: profil.userName,
            lastName: profil.lastName,
            firstName: profil.firstName,
            googleId: props.user.uid,
            wgId: profil.wgId
        });
    }

    const handleSaveEdit = async() => {
        const updatedProfile = new PersonBO(
            editFormData.email,
            TrimAndLowerCase(editFormData.userName),
            TrimAndLowerCase(editFormData.firstName),
            TrimAndLowerCase(editFormData.lastName),
            editFormData.googleId,
            editFormData.wgId
        );

        await EatSmarterAPI.getAPI().addUser(updatedProfile)
        setEditMode(false);
        await renderProfile();
    }

   useEffect( () => {
       renderProfile();
       renderCurrentUsersWg();
   }, []);

   /* -------- Funktion zum Löschen des Accounts -------- */
    const deletePerson = () => {
        const newPerson = new PersonBO(
            props.user.email,
            profil.userName,
            profil.firstName,
            profil.lastName,
            props.user.uid,
            profil.wgId
        )
        alert("Account erfolgreich gelöscht!")
        EatSmarterAPI.getAPI().deletePerson(newPerson);
        navigate("/login");
    }

    /* -------- Darstellung der Komponente -------- */
    return(
        <div>
            <div>
                {wg ? (
                    <NavBar currentUser={props.user} onSignOut={props.onSignOut}></NavBar>
                ):
                    <NavBarRegisterWg currentUser={props.user} onSignOut={props.onSignOut}></NavBarRegisterWg>
                }
            </div>
            <br></br> <br></br>
            <div className="container">
                {profil && (
                    <div className="inner-container">
                        <h2>Dein Profil</h2>
                        <div className="mini-container">
                            <table>
                            <thead>
                            <tr>
                                <th>Nutzername</th>
                                <th>Nachname</th>
                                <th>Vorname</th>
                                <th>E-Mail</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                {editMode ? (
                                    <>
                                        <td>
                                            <input
                                                type="text"
                                                name="userName"
                                                value={editFormData.userName}
                                                onChange={handleEditChange}
                                                className="eingabe"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={editFormData.lastName}
                                                onChange={handleEditChange}
                                                className="eingabe"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={editFormData.firstName}
                                                onChange={handleEditChange}
                                                className="eingabe"
                                            />
                                        </td>
                                        <td>
                                            {props.user.email}
                                        </td>
                                        <td>
                                            <TaskAltIcon onClick={handleSaveEdit}/>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>{profil.userName}</td>
                                        <td>{profil.lastName}</td>
                                        <td>{profil.firstName}</td>
                                        <td>{profil.email}</td>
                                        <td>
                                            <ModeEditIcon onClick={handleEditButton}/>
                                        </td>
                                    </>
                                )}
                            </tr>
                            </tbody>
                        </table>
                        </div>
                    </div>
                )}
                <br></br>
                <br></br>
                <div className="formitem">
                    <button
                        className="button-uebersicht" type="button" onClick={deletePerson}>Account löschen
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Profil;