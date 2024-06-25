import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import '../sytles/WG-Landingpage.css';
import { useNavigate } from "react-router-dom";

function NavBar({ currentUser, onSignOut }) {
    const [state, setState] = useState({
        menuAnchor: null,
        mobileMenuOpen: false // Zustand für mobiles Menü
    });
    const navigate = useNavigate();

    // Handle Funktionen, um zu prüfen, ob das Menü geöffnet ist oder nicht
    const handleOpen = (event) => {
        setState({ ...state, menuAnchor: event.currentTarget });
    }

    const handleClose = () => {
        setState({ ...state, menuAnchor: null });
    }

    const navigateToProfil = () => {
        navigate("/Profil");
        handleClose(); // Menü nach der Navigation schließen
    }

    // Zustand für das mobile Menü öffnen/schließen
    const handleMobileMenuOpen = () => {
        setState({ ...state, mobileMenuOpen: true });
    }

    // Zustand für das mobile Menü schließen
    const handleMobileMenuClose = () => {
        setState({ ...state, mobileMenuOpen: false });
    }

    return (
        <AppBar>
            <Toolbar className='navbar'>
            <MenuIcon onClick={handleMobileMenuOpen}  sx={{ display: { xs: 'block', sm: 'none' } }} />
                <Button className='bold-button' color="inherit" component={Link} to='/homepage' sx={{ display: { xs: 'none', sm: 'flex' } }}>
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
                {/* Wenn CurrentUser existiert, wird der Avatar und das Menü gerendert */}
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
            {/* Mobiles Menü */}
            <Menu
                anchorEl={state.mobileMenuOpen ? document.body : null}
                open={state.mobileMenuOpen}
                onClose={handleMobileMenuClose}
            >
                <MenuItem component={Link} to='/homepage' onClick={handleMobileMenuClose}>
                    EatSmarter
                </MenuItem>
                <MenuItem component={Link} to='/RezeptAnzeigen' onClick={handleMobileMenuClose}>
                    Rezepte
                </MenuItem>
                <MenuItem component={Link} to='/kuehlschrankinhalt/:wg_id' onClick={handleMobileMenuClose}>
                    Kühlschrank
                </MenuItem>
                <MenuItem component={Link} to='/wg' onClick={handleMobileMenuClose}>
                    WG
                </MenuItem>
                <MenuItem component={Link} to='/generator' onClick={handleMobileMenuClose}>
                    Generator
                </MenuItem>
                {currentUser && (
                    <>
                        <MenuItem onClick={navigateToProfil}>
                            Mein Profil
                        </MenuItem>
                        <MenuItem onClick={onSignOut}>
                            Abmelden
                        </MenuItem>
                    </>
                )}
            </Menu>
        </AppBar>
    );
}

export default NavBar;
