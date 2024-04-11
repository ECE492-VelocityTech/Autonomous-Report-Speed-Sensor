import useLiveSpeed from "../../hooks/useLiveSpeed";
import styles from "./LiveSpeed.module.css";

const LiveSpeed = () => {
    const liveSpeed = useLiveSpeed(
        parseInt(sessionStorage.getItem("deviceId") || "0")
    );
    const speedLimit = 6;

    const timestamp = new Date(liveSpeed.timestamp);

    const date = timestamp.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const time = timestamp.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    const speedColor = liveSpeed.speed > speedLimit ? "red" : "green";

    return (
        <div className={styles.container}>
            <h1 className={styles.speed} style={{ color: speedColor }}>
                {liveSpeed.speed}km/hr
            </h1>
            <h2 className={styles.timestamp}>Date: {date}</h2>
            <h2 className={styles.timestamp}>Time: {time}</h2>
        </div>
    );
};

export default LiveSpeed;
