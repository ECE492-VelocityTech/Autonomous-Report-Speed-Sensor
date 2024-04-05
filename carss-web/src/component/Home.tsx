import radiatorSprings from "../images/radiator_springs.jpeg";
import logo from "../images/logo.png";

import React from "react"; // Import the missing React package

function Home() {
    return (
        <>
            <div
                style={{
                    backgroundImage: `url(${radiatorSprings})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start", // Change alignItems to "flex-start" to align the logo at the top
                }}
            >
                <img src={logo} alt="Logo" />
            </div>
        </>
    );
}

export default Home;
