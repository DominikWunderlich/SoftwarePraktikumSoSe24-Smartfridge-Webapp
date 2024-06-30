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

    useEffect( () => {
        // Checking if a user is already in a wg:
        EatSmarterAPI.getAPI().getUserByGID(props.user.uid)
            .then((UserInWg) => {
                // Redirect user based on wether the user is in a wg or not.
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
