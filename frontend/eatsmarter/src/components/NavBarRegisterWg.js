import React, {useState} from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import '../sytles/WG-Landingpage.css';
import {useNavigate} from "react-router-dom";

function NavBarRegisterWg({currentUser, onSignOut}){
    const [state, setState] = useState({
        menuAnchor: null,
    });
    const navigate = useNavigate();

    // Handle Funktionen, um zu prüfen, ob das Menü geöffnet ist oder nicht
 	const handleOpen = (event) =>{
		setState({...state, menuAnchor: event.currentTarget})
	}
	const handleClose = () => {
		setState({...state, menuAnchor: null})
	}

    const navigateToProfil = () => {
         navigate("/Profil")
    }

    return (
        <AppBar>
            <Toolbar className="navbar">
                <Button className='bold-button' color="inherit" component={Link} >
                    EatSmarter
                </Button>
                 <Button className='navbar-button' color="inherit" component={Link} to ="/registerWg">
                     Wg Erstellen
                 </Button>
                {/*Wenn CurrentUser existiert, wird der Avatar und das Menü gerendert*/}
                {currentUser && (
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                        <Avatar
                            src={currentUser.photoURL}
                            alt={currentUser.displayName}
                            onClick={handleOpen}
                            style={{ cursor: 'pointer' }}
                        />
                        <Menu
                            anchorEl={state.menuAnchor}
                            open={Boolean(state.menuAnchor)}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >
                            <MenuItem onClick={navigateToProfil}>Mein Profil</MenuItem>
                            <MenuItem onClick={onSignOut}>Abmelden</MenuItem>
                        </Menu>
                    </div>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default NavBarRegisterWg