import React, { useState } from "react";
import '../sytles/WG-Landingpage.css';
import EatSmarterAPI from "../api/EatSmarterAPI";
import NavBar from "../components/NavBar";


function Kuehlschrank(props) {
    return (
        <div>
            <NavBar currentUser={props.user} onSignOut={props.onSignOut}></NavBar> <br></br> <br></br>
            <div className="container">
                <h2>Kühlschrank</h2>
            </div>
        </div>
    );
}

export default Kuehlschrank;