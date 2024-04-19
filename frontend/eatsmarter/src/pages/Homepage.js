import React, { useState, useEffect } from "react";
import EatSmarterAPI from "../api/EatSmarterAPI";
import { useParams } from "react-router-dom";

function Homepage() {
    const { wgName } = useParams(); 
    const [wgData, setWgData] = useState(null);
    const [error, setError] = useState(null); 

    const getWGbyName = async () => {
        try {
            const wgName = "WG BeispielName"; 
            const wg = await EatSmarterAPI.getAPI().getWGbyName(wgName);
            setWgData(wg);
        } catch (e) {
            setError(e);
        }
    };

    useEffect(() => {
        getWGbyName();
    }, [wgName]);


    if (error) {
        return <div className='container'>Error loading data: {error.message}</div>;
    }

    return (
        <div>
            <p>Header</p>
            <div className='container'>
                <h2>Name der WG: {wgData ? wgData.name : "Loading..."}</h2>
            
            </div>
        </div>
    );
}

export default Homepage;
