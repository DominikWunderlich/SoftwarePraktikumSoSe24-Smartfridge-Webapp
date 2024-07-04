import React, { useState, useEffect } from "react";
import EatSmarterAPI from "../api/EatSmarterAPI";
import NavBar from "../components/NavBar";


function Homepage(props) {
    const [wg, setWg] = useState(null)
    const [wgAdmin, setWgAdmin] = useState([]);
    const [personList, setPersonList] = useState([])

    /* -------- Funktionen zum Laden der Wg sowie der Bewohner und Admin der Wg -------- */
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

    /* -------- Darstellung der Komponente -------- */
    return (
        <div>
            <NavBar currentUser={props.user} onSignOut={props.onSignOut}></NavBar> <br></br> <br></br>
            <div className='container'>
               {/*Abfrage, ob wg nicht null*/}
               {wg && (
                    <div>
                        <div className="inner-container">
                            <h2>Du bist Mitglied in der Wg: {wg.wgName}</h2>
                            <label>Bewohner der WG</label>
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
                    </div>
               )}
            </div>
        </div>
    );
}

export default Homepage;
