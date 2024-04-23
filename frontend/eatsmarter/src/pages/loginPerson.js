import React, {useState} from "react";
import '../sytles/WG-Landingpage.css';
import PersonBO from "../api/PersonBO";
import EatSmarterAPI from "../api/EatSmarterAPI";

function LoginPerson(props) {
    const [email, setEmail] = useState()
    const [formData, setFormData] = useState({
        email: props.user.email,
        userName: props.user.displayName,
        firstName: "",
        lastName: "",
        googleId: props.user.uid,
    })
    const [errors, setErrors] = useState({});
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
            console.log("newPerson created: " + newPerson)
            console.log("Submitbutton gedrückt")
            console.log("Account erstellen mit folgenden Daten: " +newPerson)
            console.log(".... starting to create a API-Call (EatSmarterAPI)")
            EatSmarterAPI.getAPI()
                .addUser(newPerson)
        }
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
                            // TODO: Define handleChange
                        />
                        <label>Nachname:</label>
                        <input
                            type="text"
                            name={"lastName"}
                            value={formData.lastName}
                            onChange={handleChange}
                            // TODO: Define handleChange
                        />
                        <button className="button" type="submit" >Bestätigen</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginPerson;