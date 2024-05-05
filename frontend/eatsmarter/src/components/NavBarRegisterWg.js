import React, {useState} from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

function NavBarRegisterWg({currentUser, onSignOut}){
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
            <Toolbar>
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

export default NavBarRegisterWg