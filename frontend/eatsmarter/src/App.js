import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import RegisterWG from "./pages/registerWG";


function App() {
  return (
   <div className="App">
          <Router>
            <Routes>
              <Route path="/" element={<Navigate to="/wg" />} />
              <Route path="wg" element={<RegisterWG />} />
            </Routes>
          </Router>
      </div>
  );
}

export default App;
