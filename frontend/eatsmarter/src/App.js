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
import RezeptErstellen from "./pages/RezeptErstellen";
import RezeptAnzeigen from "./pages/RezepteAnzeigen";
import WGPage from "./pages/WGPage";
import Kuehlschrank from './pages/Kuehlschrank';
import GenauEinRezeptAnzeigen from "./pages/GenauEinRezeptAnzeigen";
import Generator from "./pages/Generator";
import EatSmarterAPI from "./api/EatSmarterAPI";
import Profil from "./pages/Profil";
import LinearProgress from '@mui/material/LinearProgress';


function App(props) {
    /** Constructor of the app, which initializes firebase, also settings an
     * inital empty state. */
    const [state, setState] = useState({
        currentUser: null,
        appError: null,
        authError: null,
        authLoading: false,
    })
	const [isRegistered, setIsRegistered] = useState(null);
	const [isInWG, setIsInWG] = useState(null);
	const [loading, setLoading] = useState(true); // New state for loading


    /**
	 * Create an error boundary for this app and recieve all errors from below the component tree.
	 *
	 * @See See Reacts [Error Boundaries](https://reactjs.org/docs/error-boundaries.html)
     */
	useEffect(() => {
        // Simulate loading delay
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer); // Cleanup timer on component unmount
    }, []);

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
  	 const handleSignOut = () => {
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

	/** useEffect-Hook, der beim Laden der App ausgeführt wird und überprüft, ob der User bereits registriert ist und in einer WG ist. */
	useEffect(() => {
		const checkRegistration = async () => {
		if (state.currentUser) {
			const usersList = await EatSmarterAPI.getAPI().checkUserByGID(state.currentUser.uid);
			const user = usersList[0]
			if (user && user.lastName) {
				setIsRegistered(true);
				const wg = await EatSmarterAPI.getAPI().getWgByUser(state.currentUser.email);
				if (wg) {
					setIsInWG(true);
				} else {
					setIsInWG(false);
				}
			} else {
			setIsRegistered(false);
			}
		}
		};
		checkRegistration();
	}, [state.currentUser]);

   if (loading) {
        return <div><LinearProgress/></div>; // Laden der App
    }

	/* Laden der App */
    return (
      <div className="App">
        {state.currentUser ? (
              <div className="content">
				  <Router>
					  <Routes>
							{/* Wenn der User angemeldet ist, wird überprüft ob dieser bereits registriert ist und in einer WG ist. */}
					  		<Route path="/" element={
								isRegistered === null ? <Navigate to="/login" />:
								!isRegistered ? <Navigate to="/registerWg" /> :
								!isInWG ? <Navigate to="/registerWg" /> :
								<Navigate to="/homepage" />
							} />
							{/* Weitere Routen wenn der User angemeledet ist. */}
							<Route path="/" element={<Navigate to="/login"/>}/>
							<Route path="/login" element={<LoginPerson user={state.currentUser} onSignOut={handleSignOut}/>}/>
							<Route path="/registerWg" element={<RegisterWG user={state.currentUser} onSignOut={handleSignOut}/>}/>
							<Route path="/wg" element={<WGPage user={state.currentUser} onSignOut={handleSignOut}/>}/>
							<Route path="/homepage" element={<Homepage user={state.currentUser} onSignOut={handleSignOut}/>}/>
							<Route path="/kuehlschrankinhalt/:wg_id" element={<Kuehlschrank user={state.currentUser} onSignOut={handleSignOut}/>}/>
							<Route path="/rezeptErstellen" element={<RezeptErstellen user={state.currentUser} onSignOut={handleSignOut}/>}/>
							<Route path="/rezeptAnzeigen" element={<RezeptAnzeigen user={state.currentUser} onSignOut={handleSignOut}/>} />
							<Route path="/genaueinrezeptAnzeigen/:rezeptId" element={<GenauEinRezeptAnzeigen user={state.currentUser} onSignOut={handleSignOut} />} />
							<Route path="/generator" element={<Generator user={state.currentUser} onSignOut={handleSignOut} />} />
							<Route path="/profil" element={<Profil user={state.currentUser} onSignOut={handleSignOut}/>}></Route>
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
