import React, {useEffect, useState} from "react";
import EatSmarterAPI from "../api/EatSmarterAPI";
import NavBar from "../components/NavBar";

function Profil(props){
    const googleId = props.user.uid
    const [profil, setProfil] = useState(null);

    const renderProfile = async () => {
        await EatSmarterAPI.getAPI().checkUserByGID(googleId)
            .then(response => {
                if (response.length > 0) {
                     setProfil(response[0]);
                }
            })
            .catch(error => {
                console.error(error);
            })
    }

   useEffect( () => {
       renderProfile();
   }, []);

    return(
        <div>
            <NavBar currentUser={props.user} onSignOut={props.onSignOut}></NavBar> <br></br> <br></br>
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
                                    <td>{profil.userName}</td>
                                    <td>{profil.lastName}</td>
                                    <td>{profil.firstName}</td>
                                    <td>{profil.email}</td>
                                    <td>
                                        <button>-</button>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );

}

export default Profil;