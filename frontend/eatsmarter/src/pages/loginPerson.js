import React from "react";
import '../sytles/WG-Landingpage.css';

function loginPerson() {
    return (
        <div>
            <p>Platzhalter für Navigationsleiste</p>
            <div className='container'>
                
                    <h2>Logge dich ein!</h2>
                    <div className='formitem'>
                        <label>Username:</label>
                        <input type="text" class="eingabe"></input>
                        
                        
                        <button className="button"
                         type="button" onclick="alert('Danke für deine Anmeldung!')">Mit Google anmelden</button>
                    </div>
            </div>
        </div>
    );
}

export default loginPerson;