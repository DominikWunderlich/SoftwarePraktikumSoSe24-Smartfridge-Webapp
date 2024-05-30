import React, {useEffect, useState} from "react";
import RezeptBO from "../api/RezeptBO";
import {Link} from "react-router-dom";
import EatSmarterAPI from "../api/EatSmarterAPI";
import '../sytles/WG-Landingpage.css';
import NavBar from "../components/NavBar";

function RezeptErstellen(props){

    const [formData, setFormData] = useState({
        rezeptname: "",
        anzahlportionen: "",
        rezeptadmin: props.user.email,
        wgname: ""
    })

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    //Die folgenden 13 Zeilen sind 1:1 aus WGPage übernommen. Da dort auch schon implementiert wurde
    //dass der WG Name anhand der Email der eingeloggten Person angezeigt wird
    //in der renderCurrentUsersWg Funktion wird die WG Methode getWgByUser Methode aus der EatSmarterAPI
    //benutzt
    const [wg, setWg] = useState(null)
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

    const handleChange = (event) => {
        if (event.target.name === 'isAccepted') {
            setFormData({...formData, [event.target.name]: event.target.checked});
        } else {
            setFormData({...formData, [event.target.name]: event.target.value });
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!Object.keys(errors).length) {
            const updatedFormData = {...formData, wgname: wg.wgName};
            const newRezept = new RezeptBO(
                updatedFormData.rezeptname,
                updatedFormData.anzahlportionen,
                updatedFormData.rezeptadmin,
                updatedFormData.wgname,
        );
            console.log(newRezept)
            console.log(".... starting to create a API-Call (EatSmarterAPI)")
            EatSmarterAPI.getAPI()
                .addRezept(newRezept)
        }
    };


    return (
        <div>
            <NavBar currentUser={props.user} onSignOut={props.onSignOut}></NavBar> <br></br> <br></br>
            <div className='container'>
                <form onSubmit={handleSubmit}>
                    <div className='inner-container '>
                    <h2>Erstelle ein Rezept!</h2>
                        <div className='formitem'>
                            <label>Ersteller:</label>
                            <p className="mini-info-container" >{formData.rezeptadmin}</p>
                        </div>
                        <div className='formitem'>
                            <label>WG:</label>
                            <p className="mini-info-container" >{wg ? wg.wgName : 'Lade WG...'}</p>
                        </div>
                    </div>
                    <br></br>
                    <div className='inner-container'>
                        <div className='formitem'>
                            <label>Name deines Rezepts: </label>
                            <input
                                type={"text"}
                                name={"rezeptname"}
                                value={formData.rezeptname}
                                onChange={handleChange}
                            />
                            <label>Anzahl Personen: </label>
                            <input
                                type={"text"}
                                name={"anzahlportionen"}
                                value={formData.anzahlportionen}
                                onChange={handleChange}
                            />
                            <button type={"submit"}>Bestätigen</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RezeptErstellen;