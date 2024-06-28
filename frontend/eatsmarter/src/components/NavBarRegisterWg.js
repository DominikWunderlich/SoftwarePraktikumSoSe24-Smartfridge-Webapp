import React, {useState} from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from '@mui/icons-material/Menu';
import Button from "@mui/material/Button";
import '../sytles/WG-Landingpage.css';
import {useNavigate} from "react-router-dom";

function NavBarRegisterWg({currentUser, onSignOut}){

    const [state, setState] = useState({
        menuAnchor: null,
        mobileMenuAnchor: null 
    });

    const navigate = useNavigate();

    /* Handle Funktionen, um zu prüfen, ob das Menü geöffnet ist oder nicht */
 	const handleOpen = (event) =>{
		setState({...state, menuAnchor: event.currentTarget})
	}
	const handleClose = () => {
		setState({...state, menuAnchor: null, mobileMenuAnchor: null})
	}

    const navigateToProfil = () => {
         navigate("/Profil")
            handleClose();
    }

    const handleMobileMenuOpen = (event) => {
        setState({ ...state, mobileMenuAnchor: event.currentTarget });
    }

    /* Darstellung der Navbar */
    return (
        <AppBar>
            <Toolbar className="navbar">
            <MenuIcon onClick={handleMobileMenuOpen} sx={{ display: { xs: 'block', sm: 'none' } }}/>
                <Button className='logo-button' color="inherit" component={Link} sx={{ display: { xs: 'none', sm: 'flex' } }}>
                    EatSmarter
                </Button>
                 <Button className='navbar-button' color="inherit" component={Link} to ="/registerWg" sx={{ display: { xs: 'none', sm: 'flex' } }}>
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
                                vertical: 'bottom',
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
            {/* Menü in der Desktop Ansicht */}
            <Menu
                anchorEl={state.mobileMenuAnchor}
                open={Boolean(state.mobileMenuAnchor)}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
               <Button className='navbar-button' color="inherit" component={Link} to ="/registerWg">
                     Wg Erstellen
                 </Button>
            </Menu>
        
        </AppBar>
    );
}

export default NavBarRegisterWg