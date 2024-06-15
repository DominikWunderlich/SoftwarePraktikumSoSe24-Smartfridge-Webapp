import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import '../sytles/WG-Landingpage.css';
import PersonBO from "../api/PersonBO";
import EatSmarterAPI from "../api/EatSmarterAPI";
import NavBarRegisterWg from "../components/NavBarRegisterWg";
import TrimAndLowerCase from "../functions";

function LoginPerson(props) {
    const [formData, setFormData] = useState({
        email: props.user.email,
        userName: props.user.displayName,
        firstName: "",
        lastName: "",
        googleId: props.user.uid,
        wgId: null
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [isRegistered, setIsRegistered] = useState(null);
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!Object.keys(errors).length) {
            const newPerson = new PersonBO(
                TrimAndLowerCase(props.user.email),
                TrimAndLowerCase(props.user.displayName),
                TrimAndLowerCase(formData.firstName),
                TrimAndLowerCase(formData.lastName),
                props.user.uid,
                formData.wgId
            );
            await EatSmarterAPI.getAPI()
                .addUser(newPerson)
        }
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

    };

    const handleChange = (event) => {
        if (event.target.name === 'isAccepted') {
            setFormData({...formData, [event.target.name]: event.target.checked});
        } else {
            setFormData({...formData, [event.target.name]: event.target.value });
        }
    };

    useEffect(() => {
    const checkRegistration = () => {
      if (props.currentUser) {
        const user = EatSmarterAPI.getAPI().checkUserByGID(props.currentUser.uid);
        if (user && user.firstName && user.lastName) {
          setIsRegistered(true);
          navigate("/wg/:wgName");
        }
      }
    };

    checkRegistration();
  }, []);


    return (
        <div>
            <NavBarRegisterWg currentUser={props.user} onSignOut={props.onSignOut}/> <br/> <br/>
            <div className='container'>
                <div className="inner-container">
                    <form onSubmit={handleSubmit}>
                        <h2>Account erstellen</h2>
                        <div className='formitem'>
                            <label>Vorname:</label>
                            <input
                                type="text"
                                name={"firstName"}
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                            <label>Nachname:</label>
                            <input
                                type="text"
                                name={"lastName"}
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                            <button className="button" type="submit" >Bestätigen</button>
                        </div>
                        
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginPerson;