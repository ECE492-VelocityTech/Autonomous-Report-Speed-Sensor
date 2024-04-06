import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import logo from "../../assets/logo.png";

function Home() {
    return (
        <div className={styles.homeContainer}>
            <img src={logo} alt="Logo" className={styles.logo} />
            <div className={styles.content}>
                <h1>Welcome to Velocity Tech</h1>
                <p>See the speeds happening in different locations</p>
                <Link to="/device" className={styles.ctaButton}>
                    Select device in a location
                </Link>
            </div>
        </div>
    );
}

export default Home;
