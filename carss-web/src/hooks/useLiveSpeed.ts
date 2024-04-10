import { useState, useEffect } from "react";

type LiveSpeedData = {
    speed: number;
    timestamp: string;
};

const useLiveSpeed = (deviceId: number) => {
    const [liveSpeed, setLiveSpeed] = useState<LiveSpeedData>(
        {} as LiveSpeedData
    );

    useEffect(() => {
        const url = `http://129.128.215.79/backend/api/v1/devices/getLatestSpeed/${deviceId}`;

        const fetchTrafficData = async () => {
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error("Failed to fetch data");

                const data: LiveSpeedData = await response.json();
                setLiveSpeed(data);
            } catch (error) {
                console.error("Fetching live speed data failed:", error);
            }
        };

        const intervalId = setInterval(fetchTrafficData, 1000);

        return () => clearInterval(intervalId);
    }, [deviceId]);

    return liveSpeed;
};

export default useLiveSpeed;
