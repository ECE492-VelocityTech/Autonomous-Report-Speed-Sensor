import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const NavBar = () => {
    const location = useLocation();

    useEffect(() => {
        const links = document.querySelectorAll(".nav-link");
        links.forEach((link) => {
            if (link.getAttribute("href") === location.pathname) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    }, [location]);

    return (
        <nav className="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
            <div className="collapse navbar-collapse" id="navbarColor02">
                <ul className="navbar-nav me-auto">
                    <li className="nav-item">
                        <a className="nav-link active" href="/">
                            Home
                            <span className="visually-hidden">(current)</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/device">
                            Device
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/trafficData">
                            Traffic Data
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/about">
                            About
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default NavBar;
