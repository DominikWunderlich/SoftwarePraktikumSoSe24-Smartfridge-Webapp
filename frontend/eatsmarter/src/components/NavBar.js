import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import '../sytles/WG-Landingpage.css';

function NavBar({ currentUser, onSignOut }) {

    const [state, setState] = useState({
        menuAnchor: null,
    })

    // Handle Funktionen, um zu prüfen, ob das Menü geöffnet ist oder nicht
 	const handleOpen = (event) =>{
		setState({...state, menuAnchor: event.currentTarget})
	}
	const handleClose = () => {
		setState({...state, menuAnchor: null})
	}

    return (
        <AppBar>
            <Toolbar className='navbar'>
                <Button className='bold-button' color="inherit" component={Link} to="/wg/:wgName">
                    EatSmarter
                </Button>
                <Button className='navbar-button' color="inherit" component={Link} to="/RezeptAnzeigen">
                    Rezepte
                </Button>
                <Button className='navbar-button' color="inherit" component={Link} to="/kuehlschrankinhalt/:wg_id">
                    Kühlschrank
                </Button>
                <Button className='navbar-button' color="inherit" component={Link} to="/wg">
                    WG
                </Button>
                <Button className='navbar-button' color="inherit" component={Link} to="/generator">
                    Generator
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
                            <MenuItem>{currentUser.displayName}</MenuItem>
                            <MenuItem onClick={onSignOut}>Abmelden</MenuItem>
                        </Menu>
                    </div>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;
