import { useEffect, useState } from "react";
import { Chart as ChartJS, registerables, defaults } from "chart.js";
import { Row, Col } from "react-bootstrap";
import Calendar from "../../component/Calendar";
import { Line } from "react-chartjs-2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";

ChartJS.register(...registerables);
const BASE_URL = "http://carss.chickenkiller.com/api/v1/devices";

defaults.maintainAspectRatio = false;
defaults.responsive = true;

interface TrafficDataProps {
    id: number;
    speed: number;
    timestamp: string;
    direction: string;
}

function TrafficData() {
    const [trafficData, setTrafficData] = useState<TrafficDataProps[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSingleDay, setIsSingleDay] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);

    const toggleCalendar = () => {
        setShowCalendar(!showCalendar);
    };

    if (
        sessionStorage.getItem("deviceNumber") === null ||
        sessionStorage.getItem("deviceNumber") === ""
    ) {
        return (
            <>
                <div
                    style={{
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        height: "110vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-start",
                    }}
                >
                    <h1 style={{ color: "black", fontWeight: "bold" }}>
                        {" "}
                        Please select a device{" "}
                    </h1>
                </div>
            </>
        );
    }

    const fetchTrafficData = async () => {
        try {
            let url =
                BASE_URL +
                "/" +
                sessionStorage.getItem("deviceId") +
                "/trafficData";
            if (
                sessionStorage.getItem("startDate") != null &&
                sessionStorage.getItem("startDate") != ""
            ) {
                url +=
                    "/dateRange?startDate=" +
                    sessionStorage.getItem("startDate") +
                    "&endDate=" +
                    sessionStorage.getItem("endDate");
            }

            const response = await fetch(url);
            if (response.ok) {
                const trafficData = await response.json();
                setTrafficData(trafficData);
            } else {
                throw new Error("Failed to fetch data");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        const handleStorageChange = () => {
            fetchTrafficData();
        };
        fetchTrafficData();
        window.addEventListener("sessionStorageUpdated", handleStorageChange);

        return () => {
            window.removeEventListener(
                "sessionStorageUpdated",
                handleStorageChange
            );
        };
    }, []);

    const sortedTrafficData = [...trafficData].sort((a, b) => {
        return (
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
    });

    const chartData = {
        labels: sortedTrafficData.map((data) => data.timestamp),
        datasets: [
            {
                label: "Speed",
                data: sortedTrafficData.map((data) => data.speed),
                fill: false,
                backgroundColor: "rgba(75,192,192,0.2)",
                borderColor: "rgba(75,192,192,1)",
                tension: 0.1,
            },
        ],
    };

    // const toggleDropdown = () => {
    //     setIsDropdownOpen(!isDropdownOpen);
    // };

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsSingleDay(event.target.value === "option1");
    };

    return (
        <>
            <div
                style={{
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "110vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start", // Change alignItems to "flex-start" to align the logo at the top
                }}
            >
                <div className="container mt-5">
                    <div className="card">
                        <div className="card-header">Traffic Data</div>
                        <div className="card-body">
                            <h5 className="card-title"></h5>
                            <p className="card-text">
                                Please select the range you would like to filter
                                by:
                            </p>
                            <Row>
                                <Col sm={1}>
                                    <div className="form-check">
                                        <label className="form-check-label">
                                            <input
                                                type="radio"
                                                className="form-check-input"
                                                name="optionsRadios"
                                                id="optionsRadios1"
                                                value="option1"
                                                checked={isSingleDay}
                                                onChange={handleRadioChange}
                                            />
                                            Date
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <label className="form-check-label">
                                            <input
                                                type="radio"
                                                className="form-check-input"
                                                name="optionsRadios"
                                                id="optionsRadios2"
                                                value="option2"
                                                checked={!isSingleDay}
                                                onChange={handleRadioChange}
                                            />
                                            Range
                                        </label>
                                    </div>
                                </Col>
                                <Col sm={4}>
                                    <div style={{ position: "relative" }}>
                                        <div>
                                            <FontAwesomeIcon
                                                icon={faCalendar}
                                                onClick={toggleCalendar}
                                                className="calendarIcon"
                                            />
                                        </div>
                                        {showCalendar && (
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    top: "100%",
                                                    left: 0,
                                                    zIndex: 999,
                                                }}
                                            >
                                                <Calendar
                                                    isSingleDay={isSingleDay}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <div>
                            <Line data={chartData} />
                        </div>
                        <div className="card-footer text-muted">
                            &copy; Velocity Tech
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default TrafficData;
