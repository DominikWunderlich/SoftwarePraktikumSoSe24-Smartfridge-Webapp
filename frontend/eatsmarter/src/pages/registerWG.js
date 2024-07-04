import React, {useEffect, useState} from "react";
import WgBO from "../api/WgBO";
import EatSmarterAPI from "../api/EatSmarterAPI";
import '../sytles/WG-Landingpage.css';
import {useNavigate} from "react-router-dom";
import NavBarRegisterWg from "../components/NavBarRegisterWg";
import TrimAndLowerCase from "../functions";


function WGLandingpage(props) {
    const [formData, setFormData] = useState({
        wgname: "",
        wgadmin: props.user.email
    })

    const [errors, setErrors] = useState({});
    const navigate = useNavigate()

    /* -------- Funktionen zum Handeln der Accountdaten -------- */
    const handleChange = (event) => {
        if (event.target.name === 'isAccepted') {
            setFormData({...formData, [event.target.name]: event.target.checked});
        } else {
            setFormData({...formData, [event.target.name]: event.target.value });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!Object.keys(errors).length) {
            const newWG = new WgBO(
                formData.wgname,
                TrimAndLowerCase(formData.wgadmin),
            );
            await EatSmarterAPI.getAPI().addWg(newWG)
            navigate("/homepage")

        }
    };

    /* -------- Überprüfung ob User bereits in einer WG ist -------- */
    useEffect( () => {
        // Check ob der User bereits in einer WG ist:
        EatSmarterAPI.getAPI().getUserByGID(props.user.uid)
            .then((UserInWg) => {
                // Weiterleiten wenn User bereits in einer WG ist oder nicht
                if (UserInWg[0].wgId != null) {
                    navigate("/homepage");
                } else {
                    navigate("/registerWg")
                }
            })
    }, [])

    /* -------- Darstellung der Komponente -------- */
    return (
        <div>
            <NavBarRegisterWg currentUser={props.user} onSignOut={props.onSignOut}/> <br/> <br/>
            <div className='container'>
                <div className="inner-container">
                    <form onSubmit={handleSubmit}>
                        <h2>Erstelle eine WG!</h2>
                        <div className='formitem'>
                            <label>Name deiner WG: </label>
                            <input
                                type={"text"}
                                name={"wgname"}
                                value={formData.wgname}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <button type={"submit"}>Bestätigen</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default WGLandingpage;
