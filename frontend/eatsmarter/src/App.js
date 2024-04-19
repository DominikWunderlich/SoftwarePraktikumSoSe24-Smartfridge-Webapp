import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import WGLandingpage from "./pages/WG-Landingpage";
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import firebaseConfig from "./firebaseconfig";
import {Avatar, Menu, MenuItem} from '@mui/material';
import SignIn from "./components/SignIn";

function App(props) {
    /** Constructor of the app, which initializes firebase, also settings an
     * inital empty state. */
    const [state, setState] = useState({
        currentUser: null,
        appError: null,
        authError: null,
        authLoading: false
    })

    /**
	 * Create an error boundary for this app and recieve all errors from below the component tree.
	 *
	 * @See See Reacts [Error Boundaries](https://reactjs.org/docs/error-boundaries.html)
     */
    const getDerivedStateFromError = (error) => {
    // Update state so the next render will show the fallback UI.
    	return { appError: true };
    };

    const handleSignIn = () => {
		const app = initializeApp(firebaseConfig);
		const auth = getAuth(app);
		const provider = new GoogleAuthProvider();

		auth.languageCode = 'en';
		signInWithPopup(auth, provider)
			.then((result) => {
				const user = result.user;
				setState({...state, currentUser: user });
        })
        .catch((error) => {
          console.log(error);
        });
	}

	/** Handler-Funktion, die beim Klicken auf den "Abmelden"-Button aufgerufen wird */
  	const handleLogOut = () => {
		/** Firebase-App initialisieren und Authentifizierungs-Objekt erstellen */
		const app = initializeApp(firebaseConfig);
		const auth = getAuth(app);
		/** Hier wird der aktuelle User wieder auf "null" gesetzt und somit wird dieser abgemeldet. Bei einem Fehler
		 * *  wird dieser dementsprechend in der Konsole ausgegeben. */
		auth.signOut()
			.then(() => {
				setState({ ...state, currentUser: null});
			})
			.catch((error) => {
			  console.log(error);
			});
	  }

    useEffect(() => {
        // This is equivalent to componentDidMount in class components. Code in this block will run after
        // the component mounts.
        const app = initializeApp(firebaseConfig);
		const auth = getAuth(app);

		auth.languageCode = 'en';
		onAuthStateChanged(auth, (user) => {
			if (user) {
				setState({
					...state, authLoading: true
				});
				// The user is signed in
				user.getIdToken().then(token => {
					// Add the token to the browser's cookies. The server will then be
					// able to verify the token against the API.
					// SECURITY NOTE: As cookies can easily be modified, only put the
					// token (which is verified server-side) in a cookie; do not add other
					// user information.
					document.cookie = `token=${token};path=/`;
					console.log("Token is: " + document.cookie);

					// Set the user not before the token arrived
					setState({
						...state,
						currentUser: user,
						authError: null,
						authLoading: false
					});
				}).catch(e => {
					setState({
						...state,
						authError: e,
						authLoading: false
					});
				});
			} else {
				// User has logged out, so clear the id token
				document.cookie = 'token=;path=/';

				// Set the logged-out user to null
				setState({
					...state,
					currentUser: null,
					authLoading: false
				});
			}
		});
    }, []); //Empty dependency array to only run once. Equivalent to componentDidMount


  return (
   <div className="App">
	   {state.currentUser ? (
           <div className="content">
				<Router>
					<Routes>
						<Route path="/" element={<Navigate to="/wg" />} />
						<Route path="wg" element={<WGLandingpage />} />
					</Routes>
				</Router>
		   </div>
		  	) : (
		  <SignIn onSignIn={handleSignIn}></SignIn>
		   )}
   </div>
  );
}
export default App;
