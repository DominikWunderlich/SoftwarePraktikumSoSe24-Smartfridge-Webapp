import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import PersonBO from "../api/PersonBO";
import EatSmarterAPI from "../api/EatSmarterAPI";
import NavBarRegisterWg from "../components/NavBarRegisterWg";
import TrimAndLowerCase from "../functions";
import InfoIcon from '@mui/icons-material/Info';
import '../sytles/WG-Landingpage.css';
import '../sytles/loginPerson.css';


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
    const [PopUpOpen, setPopUpOpen] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!Object.keys(errors).length) {
            const newPerson = new PersonBO(
                TrimAndLowerCase(props.user.email),
                TrimAndLowerCase(formData.userName),
                TrimAndLowerCase(formData.firstName),
                TrimAndLowerCase(formData.lastName),
                props.user.uid,
                formData.wgId
            );
            await EatSmarterAPI.getAPI()
                .addUser(newPerson)
        }
        // Notwenig um die Regstierung für einen Account abzuschließen
        EatSmarterAPI.getAPI().getUserByGID(props.user.uid)
            .then((UserInWg) => {
                if (UserInWg[0].wgId != null) {
                    navigate("/homepage");
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

       /* -------- Überprüfung ob User bereits einen Account hat -------- */
       useEffect(() => {
        const checkRegistration = async () => {
            if (props.user) {
                try {
                    const usersList = await EatSmarterAPI.getAPI().checkUserByGID(props.user.uid);
                    const user = usersList[0];
                    // Check ob der User bereits registriert ist
                    if (user && user.firstName && user.lastName) {
                        navigate("/registerWg");
                    // User ist nicht registriert
                    } else {
                        navigate("/login");
                    }
                } catch (error) {
                    console.error("Fehler beim Check", error);
                }
            }
        };
        checkRegistration();
    }, [props.user ,navigate]);

    /* -------- Info Icon öffnen und schließen -------- */
    const openInfoIcon = () => {
        setPopUpOpen(true);
    }

    const closeInfoIcon = () => {
        setPopUpOpen(false);
    }

    /* -------- Darstellung der Komponente -------- */
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
                            <label>Nutzername:</label>
                            <div className="input-nutzername">
                                <input
                                    type="text"
                                    name={"userName"}
                                    value={formData.userName}
                                    onChange={handleChange}
                                />
                                <InfoIcon className="info-icon" onClick={openInfoIcon}></InfoIcon>
                            </div>
                            <br/>
                            <button className="button" type="submit">Bestätigen</button>
                        </div>
                    </form>
                </div>
            </div>
            {PopUpOpen && (
                <div className="popup">
                    <div className="inner-popup">
                        <h3 className="h2-black">Info</h3>
                        <p className="h2-black"> Der Nickname wird von Google übernommen. Sie können Ihren Nicknamen über dieses Input Feld ändern.</p>
                        <button type="button" onClick={closeInfoIcon}>Schließen</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LoginPerson;