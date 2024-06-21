import React, { useState, useEffect } from "react";
import EatSmarterAPI from "../api/EatSmarterAPI";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";

function Homepage(props) {
    const { wgName } = useParams(); 
    const [wg, setWg] = useState(null)
    const [wgData, setWgData] = useState(null);
    const [wgAdmin, setWgAdmin] = useState([]);
    const [error, setError] = useState(null);
    const [personList, setPersonList] = useState([])

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

    const getWGbyName = async () => {
        try {
            const wg = await EatSmarterAPI.getAPI().getWGbyName(wgName);
            setWgData(wg);
        } catch (e) {
            setError(e);
        }
    };

    useEffect(() => {
        getWGbyName();
    }, [wgName]);


    if (error) {
        return <div className='container'>Error loading data: {error.message}</div>;
    }


    return (
        <div>
            <NavBar currentUser={props.user} onSignOut={props.onSignOut}></NavBar> <br></br> <br></br>
            <div className='container'>
               {/*Abfrage, ob wg nicht null*/}
               {wg && (
                    <div>
                        <div className="inner-container">
                            <h2>Du bist Mitglied in der Wg: {wg.wgName}</h2>
                            <h2>Bewohner:</h2>
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
                        </div>
                    </div>
               )}
            </div>
        </div>
    );
}

export default Homepage;
