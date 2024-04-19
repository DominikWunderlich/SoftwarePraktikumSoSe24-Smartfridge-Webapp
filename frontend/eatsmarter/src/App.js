import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import RegisterWG from "./pages/registerWG";
import Homepage from "./pages/Homepage";
import LoginPerson from "./pages/loginPerson";
import Lebensmittelverwaltung from "./pages/Lebensmittel-Verwaltung";


function App() {
  return (
   <div className="App">
          <Router>
            <Routes>
              <Route path="/" element={<Navigate to="/wg" />} />
              <Route path="wg" element={<RegisterWG />} />
              <Route path="/home" element={<Homepage />} />
              <Route path="/login" element={<LoginPerson />} />
              <Route path="/lebensmittelverwaltung" element={<Lebensmittelverwaltung />} />
            </Routes>
          </Router>
      </div>
  );
}

export default App;
