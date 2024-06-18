import React, {useEffect, useState} from "react";
import WgBO from "../api/WgBO";
import EatSmarterAPI from "../api/EatSmarterAPI";
import '../sytles/WG-Landingpage.css';
import {useNavigate} from "react-router-dom";
import NavBarRegisterWg from "../components/NavBarRegisterWg";
import TrimAndLowerCase from "../functions";
import Homepage from "./Homepage";



function WGLandingpage(props) {
    const [formData, setFormData] = useState({
        wgname: "",
        wgadmin: props.user.email
    })

    const [errors, setErrors] = useState({});
    const navigate = useNavigate()

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
            console.log(newWG)
            await EatSmarterAPI.getAPI().addWg(newWG)
            navigate("/wg/:wgName")

        }
    };

    useEffect( () => {
        // Checking if a user is already in a wg:
        EatSmarterAPI.getAPI().getUserByGID(props.user.uid)
            .then((UserInWg) => {
                // Redirect user based on wether the user is in a wg or not.
                if (UserInWg.length > 0) {
                    // TODO: Pfad von der Homepage umbenennen
                    navigate("/wg/:wgName");
                } else {
                    navigate("/registerWg")
                }
            })
    }, [])


    
    return (
        <div>
            {/*TODO: neue Navbar einfügen, in welcher nur die registerWg Seite anklickbar ist*/}
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
