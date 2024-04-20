import React from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, Typography } from '@mui/material';

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
					<Typography sx={{margin: 2}} align='center' variant='h5'>Welcome to the HdM React/Python Project Showcase</Typography>
					<Typography sx={{margin: 2}} align='center'>It appears, that you are not signed in.</Typography>
					<Typography sx={{margin: 2}} align='center'>To use the services of the Eatsmarter-App please</Typography>
					<Grid container justifyContent='center'>
						<Grid item>
							<Button variant='contained' color='primary' onClick={handleSignInButtonClicked}>
								Sign in with Google
							</Button>
						</Grid>
					</Grid>
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