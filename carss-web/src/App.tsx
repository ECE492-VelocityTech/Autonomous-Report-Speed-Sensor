import NavBar from "./component/NavBar/NavBar";
import Home from "./pages/Home/Home";
import TrafficData from "./pages/TrafficData/TrafficData";
import TrafficData1 from "./pages/TrafficData1/TrafficData1";
import Device from "./pages/Device/Device";
import About from "./pages/About";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";

function App() {
    return (
        <>
            <Router>
                <NavBar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/device" element={<Device />} />
                    <Route path="/trafficData" element={<TrafficData1 />} />
                    <Route path="/about" element={<About />} />
                </Routes>
            </Router>
        </>
    );
}

export default App;
