import React, {useEffect, useState} from "react";
import EatSmarterAPI from "../api/EatSmarterAPI";
import '../sytles/WG-Landingpage.css';


function WGPage(props) {
    const [wg, setWG] = useState(null)
    function renderCurrentUsersWg(){
        console.log(props.user.email);
        EatSmarterAPI.getAPI().getWgByUser(props.user.email)
            .then(response => {
                console.log(response);
                setWG(response);
            })
            .catch(error => {
                console.error(error);
            });

    }
    useEffect(() => {
        renderCurrentUsersWg()
    }, []);


    return (
        <div>
            <div className='container'>
                <form>
                    <h2>Platzhalter für name</h2>
                    <label>Mitglied hinzufügen: </label>
                    <input/>
                    <button>+</button>
                    <div className='formitem'>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default WGPage;
