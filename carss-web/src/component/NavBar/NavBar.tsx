import { useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import styles from "./NavBar.module.css";

const NavBar = () => {
    const location = useLocation();

    const links = [
        { path: "/device", name: "Device" },
        // { path: "/trafficData", name: "Traffic Data" },
        { path: "/about", name: "About" },
    ];

    return (
        <nav className={styles.navbar}>
            <a className="logo" href="/">
                <img src={logo} alt="Logo" className={styles.logoImage} />
            </a>
            <ul className={styles.navList}>
                {links.map((link) => (
                    <li key={link.name} className={styles.navItem}>
                        <a
                            className={`${styles.navLink} ${
                                location.pathname === link.path
                                    ? styles.navLinkActive
                                    : ""
                            }`}
                            href={link.path}
                        >
                            {link.name}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default NavBar;
