import React, {useEffect, useState} from "react";
import RezeptBO from "../api/RezeptBO";
import {useNavigate} from "react-router-dom";
import EatSmarterAPI from "../api/EatSmarterAPI";
import '../sytles/WG-Landingpage.css';
import NavBar from "../components/NavBar";


function RezeptErstellen(props){

    const [formData, setFormData] = useState({
        rezeptname: "",
        anzahlportionen: "",
        rezeptadmin: props.user.email,
        wgid: null,
        rezeptanleitung: ""
    })

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [wg, setWg] = useState(null)
    const navigate = useNavigate();

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
            const updatedFormData = {...formData, wgid: wg.id};
            const newRezept = new RezeptBO(
                updatedFormData.rezeptname,
                updatedFormData.anzahlportionen,
                updatedFormData.rezeptadmin,
                updatedFormData.wgid,
                updatedFormData.rezeptanleitung,
        );
            console.log(newRezept)
            console.log(".... starting to create a API-Call (EatSmarterAPI)")
            EatSmarterAPI.getAPI()
                .addRezept(newRezept)
                .then(() => {
                    navigate("/RezeptANzeigen");
                })
        }
    };

    /* -------- Darstellung der Komponente -------- */
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
                            <label>Kochanleitung: </label>
                            <input
                                type={"text"}
                                name={"rezeptanleitung"}
                                value={formData.rezeptanleitung}
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