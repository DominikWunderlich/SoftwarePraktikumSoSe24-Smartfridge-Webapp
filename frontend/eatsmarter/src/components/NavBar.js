import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import '../sytles/WG-Landingpage.css';
import { useNavigate } from "react-router-dom";


function NavBar({ currentUser, onSignOut }) {

    const [state, setState] = useState({
        menuAnchor: null,
        mobileMenuAnchor: null 
    });

    const navigate = useNavigate();

    /* Handle Funktionen, um zu prüfen, ob das Menü geöffnet ist oder nicht */
    const handleOpen = (event) => {
        setState({ ...state, menuAnchor: event.currentTarget });
    }

    const handleClose = () => {
        setState({ ...state, menuAnchor: null, mobileMenuAnchor: null });
    }

    const navigateToProfil = () => {
        navigate("/profil");
        handleClose(); 
    }

    const handleMobileMenuOpen = (event) => {
        setState({ ...state, mobileMenuAnchor: event.currentTarget });
    }

    /* Darstellung der Navbar */
    return (
        <AppBar>
            {/* Menü in der Mobilen Ansicht */}
            <Toolbar className='navbar'>
                <MenuIcon onClick={handleMobileMenuOpen} sx={{ display: { xs: 'block', sm: 'none'} }}/>
                <Button className='logo-button' color="inherit" component={Link} to='/homepage' sx={{ display: { xs: 'none', sm: 'flex' } }}>
                    EatSmarter
                </Button>
                <Button className='navbar-button' color="inherit" component={Link} to="/RezeptAnzeigen" sx={{ display: { xs: 'none', sm: 'flex' } }}>
                    Rezepte
                </Button>
                <Button className='navbar-button' color="inherit" component={Link} to="/kuehlschrankinhalt/:wg_id" sx={{ display: { xs: 'none', sm: 'flex' } }}>
                    Kühlschrank
                </Button>
                <Button className='navbar-button' color="inherit" component={Link} to="/wg" sx={{ display: { xs: 'none', sm: 'flex' } }}>
                    WG
                </Button>
                <Button className='navbar-button' color="inherit" component={Link} to="/generator" sx={{ display: { xs: 'none', sm: 'flex' } }}>
                    Generator
                </Button>
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
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
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
                <MenuItem component={Link} to='/homepage' onClick={handleClose}>
                    EatSmarter
                </MenuItem>
                <MenuItem component={Link} to='/RezeptAnzeigen' onClick={handleClose}>
                    Rezepte
                </MenuItem>
                <MenuItem component={Link} to='/kuehlschrankinhalt/:wg_id' onClick={handleClose}>
                    Kühlschrank
                </MenuItem>
                <MenuItem component={Link} to='/wg' onClick={handleClose}>
                    WG
                </MenuItem>
                <MenuItem component={Link} to='/generator' onClick={handleClose}>
                    Generator
                </MenuItem>
            </Menu>
        </AppBar>
    );
}

export default NavBar;
