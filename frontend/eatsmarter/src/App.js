import './App.css';
import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import firebaseConfig from "./firebaseconfig";
import SignIn from "./components/SignIn";
import RegisterWG from "./pages/registerWG";
import Homepage from "./pages/Homepage";
import LoginPerson from "./pages/loginPerson";
import Lebensmittelverwaltung from "./pages/Lebensmittel-Verwaltung";
import DeineRezepte from "./pages/DeineRezepte";
import RezeptErstellen from "./pages/RezeptErstellen";
import NavBar from "./components/NavBar";
import RezeptAnzeigen from "./pages/RezepteAnzeigen";
import WGPage from "./pages/WGPage";
import Kuehlschrank from './pages/Kuehlschrank';
import GenauEinRezeptAnzeigen from "./pages/GenauEinRezeptAnzeigen";

function App(props) {
    /** Constructor of the app, which initializes firebase, also settings an
     * inital empty state. */
    const [state, setState] = useState({
        currentUser: null,
        appError: null,
        authError: null,
        authLoading: false,
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
				setState({...state, currentUser: user, menuAnchor: null });
        })
        .catch((error) => {
          console.log(error);
        });
	}


/** Handler-Funktion, die beim Klicken auf den "Abmelden"-Button aufgerufen wird */
  	 const handleSignOut = (setState, state) => {
		/** Firebase-App initialisieren und Authentifizierungs-Objekt erstellen */
		const app = initializeApp(firebaseConfig);
		const auth = getAuth(app);
		/** Hier wird der aktuelle User wieder auf "null" gesetzt und somit wird dieser abgemeldet. Bei einem Fehler
		 * *  wird dieser dementsprechend in der Konsole ausgegeben. */
		auth.signOut()
			.then(() => {
				setState({ ...state, currentUser: null, menuAnchor: null});
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
						  <Route path="/" element={<Navigate to="/login"/>}/>
						  <Route path="/login" element={<LoginPerson user={state.currentUser} onSignOut={handleSignOut}/>}/>
						  <Route path="registerWg" element={<RegisterWG user={state.currentUser} onSignOut={handleSignOut}/>}/>
						  <Route path="/wg" element={<WGPage user={state.currentUser} onSignOut={handleSignOut}/>}/>
						  // TODO: Pfad von der Homepage (/wg/:wgName) umbenennen
						  <Route path="/wg/:wgName" element={<Homepage user={state.currentUser} onSignOut={handleSignOut}/>}/>
						  <Route path="/kuehlschrank" element={<Kuehlschrank user={state.currentUser} onSignOut={handleSignOut}/>}/>
						  <Route path="/lebensmittelverwaltung" element={<Lebensmittelverwaltung user={state.currentUser} onSignOut={handleSignOut}/>}/>
						  <Route path="/deineRezepte" element={<DeineRezepte/>}/>
						  <Route path="/rezeptErstellen" element={<RezeptErstellen user={state.currentUser} onSignOut={handleSignOut}/>}/>
                          <Route path="/rezeptAnzeigen" element={<RezeptAnzeigen user={state.currentUser} onSignOut={handleSignOut}/>} />
						  <Route path="/genaueinrezeptAnzeigen" element={<GenauEinRezeptAnzeigen user={state.currentUser} onSignOut={handleSignOut}/>} />
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
