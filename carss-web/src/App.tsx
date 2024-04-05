import NavBar from "./Navigation/NavBar";
import Home from "./component/Home";
import TrafficData from "./component/TrafficData";
import Device from "./component/Device";
import About from "./component/About";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

function App() {
    return (
        <>
            <Router>
                <NavBar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/device" element={<Device />} />
                    <Route path="/trafficData" element={<TrafficData />} />
                    <Route path="/about" element={<About />} />
                </Routes>
            </Router>
        </>
    );
}

export default App;
