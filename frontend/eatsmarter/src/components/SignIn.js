/** Info: Der Großteil aus diesem Code wurde aus dem "Bankprojekt" übernommen  **/


import React from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, Typography, Link, Toolbar } from '@mui/material';
import '../sytles/WG-Landingpage.css';

/**
 * Renders a landing page for users who are not signed in. Provides a sign in button
 * for using an existing google account to sign in. The component uses firebase to
 * do redirect based signin process.
 *
 * @see See Googles [firebase authentication](https://firebase.google.com/docs/web/setup)
 * @see See Googles [firebase API reference](https://firebase.google.com/docs/reference/js)
 *
 */

function SignIn(props) {

	const handleSignInButtonClicked = () => {
		props.onSignIn();
	};

	return (
		<div>
			<div className='container'>
				<div className='inner-container'>
					<Typography sx={{margin: 2, color: 'white'}} align='center' variant='h5'>Willkommen bei <p className='logo'>EatSmarter</p></Typography>
					<Typography sx={{margin: 2, color: 'white', fontStyle: 'italic'}}>"Der smarte Kühlschrank für jede WG"</Typography>
					<br></br>
					<br></br>
					<Typography sx={{color: 'white'}} align='center'>Diese Seite deutet darauf hin, dass du bei EatSmarter noch nicht registriert bist. Um EatSmarter zu nutzen:</Typography>
				</div>
				<br></br>
				<br></br>
				<Button sx={{fontSize: 'small'}} className='button-uebersicht' variant='contained' color='primary' onClick={handleSignInButtonClicked}>
					Melde dich mit deinem Google Account an
				</Button>
			</div>
		</div>
	)
}

/** PropTypes */
SignIn.propTypes = {
	/**
	 * Handler function, which is called if the user wants to sign in.
	 */
	onSignIn: PropTypes.func.isRequired,
}

export default SignIn;