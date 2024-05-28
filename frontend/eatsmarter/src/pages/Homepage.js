import React, { useState, useEffect } from "react";
import EatSmarterAPI from "../api/EatSmarterAPI";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";

function Homepage(props) {
    const { wgName } = useParams(); 
    const [wg, setWg] = useState(null)
    const [wgData, setWgData] = useState(null);
    const [error, setError] = useState(null); 

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
                        <h2>Du bist Mitglied in der {wg.wgName}</h2>
                        <div className="inner-container">
                            <div className="mini-container">
                                <p>Bewohner:</p>
                                <p>
                                    {wg.wgBewohner.split(',').map((bewohner, index) => (
                                        <li key={index}>{bewohner.trim()}</li>
                                    ))}
                                </p>
                            </div>
                            <div className="mini-container">
                                <p>Ersteller der WG:</p>
                                <p> {wg.wgAdmin}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Homepage;
