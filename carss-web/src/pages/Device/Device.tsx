import Map from "../../component/Map/Map";
import styles from "./Device.module.css";

function Device() {
    return (
        <div className={styles.deviceContainer}>
            <div className={`${styles.card}`}>
                <div className={styles.cardBody}>
                    <h5 className={styles.cardTitle}>
                        Find a device to view traffic data
                    </h5>
                    <Map />
                </div>
                <div className={styles.cardFooter}>&copy; Velocity Tech</div>
            </div>
        </div>
    );
}

export default Device;
