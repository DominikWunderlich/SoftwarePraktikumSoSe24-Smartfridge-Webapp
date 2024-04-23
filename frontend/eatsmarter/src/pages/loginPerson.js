import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import '../sytles/WG-Landingpage.css';
import PersonBO from "../api/PersonBO";
import EatSmarterAPI from "../api/EatSmarterAPI";

function LoginPerson(props) {
    const [formData, setFormData] = useState({
        email: props.user.email,
        userName: props.user.displayName,
        firstName: "",
        lastName: "",
        googleId: props.user.uid,
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!Object.keys(errors).length) {
            const newPerson = new PersonBO(
                props.user.email,
                props.user.displayName,
                formData.firstName,
                formData.lastName,
                props.user.uid
            );
            EatSmarterAPI.getAPI()
                .addUser(newPerson)
        }
        // TODO: Implement a way to redirect to "/wg" if user is not already in a wg, else route to "/homepage"
        navigate("/wg");
    };

    const handleChange = (event) => {
        if (event.target.name === 'isAccepted') {
            setFormData({...formData, [event.target.name]: event.target.checked});
        } else {
            setFormData({...formData, [event.target.name]: event.target.value });
        }
    };

    return (
        <div>
            <p>Platzhalter für Navigationsleiste</p>
            <div className='container'>
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
    );
}

export default LoginPerson;