import { Chart as ChartJS, registerables, defaults } from "chart.js";
import { Line } from "react-chartjs-2";
import styles from "./TrafficData1.module.css";
import useTrafficData, { FilterParams } from "../../hooks/useTrafficData";
import { useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

ChartJS.register(...registerables);
defaults.maintainAspectRatio = false;
defaults.responsive = true;

const chartOptions = {
    scales: {
        x: {
            title: {
                display: true,
                text: "Hour of the Day",
                font: {
                    size: 16,
                },
                color: "#666",
            },
        },
        y: {
            title: {
                display: true,
                text: "Average Speed (km/h)",
                font: {
                    size: 16,
                },
                color: "#666",
            },
            beginAtZero: true,
        },
    },
    plugins: {
        legend: {
            display: true,
            position: "top" as const,
        },
    },
    responsive: true,
    maintainAspectRatio: false,
};

function TrafficData() {
    const deviceId = sessionStorage.getItem("deviceId") || "";
    const deviceNumber = sessionStorage.getItem("deviceNumber") || "";
    const deviceAddress = sessionStorage.getItem("deviceAddress") || "";

    const [selectedDate, setSelectedDate] = useState(new Date());

    const defaultStartDate = new Date(
        new Date().setDate(new Date().getDate() - 7)
    );
    const defaultEndDate = new Date();

    const [dateRange, setDateRange] = useState<[Date, Date]>([
        defaultStartDate,
        defaultEndDate,
    ]);

    const handleDateRangeChange = (dates: any) => {
        const [start, end] = dates;
        setDateRange([start, end]);
        if (start && end) {
            setFilterParams({
                selectedFilter: "dateRange",
                startDate: start,
                endDate: end,
            });
        }
    };

    const [filterParams, setFilterParams] = useState<FilterParams>({
        selectedFilter: "date",
        specificDate: new Date(),
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFilterType = e.target.value;

        if (newFilterType === "pastWeek") {
            setFilterParams({
                selectedFilter: newFilterType,
                startDate: defaultStartDate,
                endDate: defaultEndDate,
            });
        } else if (newFilterType === "date") {
            setFilterParams({
                selectedFilter: newFilterType,
                specificDate: new Date(),
            });
        } else if (newFilterType === "dateRange") {
            setFilterParams({
                selectedFilter: newFilterType,
                startDate: dateRange[0],
                endDate: dateRange[1],
            });
        } else {
            setFilterParams({ selectedFilter: newFilterType });
        }
    };

    const handleSingleDateChange = (date: Date | null) => {
        if (!date) return;
        setSelectedDate(date);
        setFilterParams({ selectedFilter: "date", specificDate: date });
    };

    const { trafficData } = useTrafficData(deviceId, filterParams);

    const [chartData, setChartData] = useState({
        labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
        datasets: [
            {
                label: "Average Speed (per hour)",
                data: new Array(24).fill(0),
                fill: false,
                borderColor: "#04aa6d",
                tension: 0.1,
            },
        ],
    });

    useEffect(() => {
        const speedData = Array.from(
            { length: 24 },
            (_, hour) => trafficData[hour] || 0
        );

        setChartData((prevChartData) => ({
            ...prevChartData,
            datasets: [
                {
                    ...prevChartData.datasets[0],
                    data: speedData,
                },
            ],
        }));
    }, [trafficData]);

    return (
        <div>
            <div className={styles.deviceContainer}>
                <h5>{deviceNumber}</h5>
                <h6>Location: {deviceAddress}</h6>
            </div>
            <div className={styles.filtersContainer}>
                <div className={styles.filterLabel}>
                    <input
                        type="radio"
                        className="form-check-input"
                        name="optionsRadios"
                        id="pastWeek"
                        value="pastWeek"
                        onChange={handleFilterChange}
                    />
                    <label className="form-check-label">Past Week</label>
                </div>
                <div className={styles.filterLabel}>
                    <input
                        type="radio"
                        className="form-check-input"
                        name="optionsRadios"
                        id="date"
                        value="date"
                        defaultChecked
                        onChange={handleFilterChange}
                    />
                    <label className="form-check-label">Date</label>
                </div>
                <div className={styles.filterLabel}>
                    <input
                        type="radio"
                        className="form-check-input"
                        name="optionsRadios"
                        id="dayOfTheWeek"
                        value="dayOfTheWeek"
                        onChange={handleFilterChange}
                    />
                    <label className="form-check-label">Day of The Week</label>
                </div>
                <div className={styles.filterLabel}>
                    <input
                        type="radio"
                        className="form-check-input"
                        name="optionsRadios"
                        id="dateRange"
                        value="dateRange"
                        onChange={handleFilterChange}
                    />
                    <label className="form-check-label">Date Range</label>
                </div>
                <div className={styles.filterLabel}>
                    <input
                        type="radio"
                        className="form-check-input"
                        name="optionsRadios"
                        id="all"
                        value="all"
                        onChange={handleFilterChange}
                    />
                    <label className="form-check-label">All</label>
                </div>
            </div>
            {["date", "dateRange"].includes(filterParams.selectedFilter) && (
                <div className={styles.additionalFilter}>
                    {filterParams.selectedFilter === "date" && (
                        <div>
                            <ReactDatePicker
                                onChange={handleSingleDateChange}
                                selected={selectedDate}
                                maxDate={new Date()}
                            />
                        </div>
                    )}
                    {filterParams.selectedFilter === "dateRange" && (
                        <ReactDatePicker
                            selectsRange={true}
                            startDate={dateRange[0]}
                            endDate={dateRange[1]}
                            onChange={handleDateRangeChange}
                            maxDate={new Date()}
                        />
                    )}
                </div>
            )}
            <div className={styles.scrollableChartContainer}>
                <div className={styles.chartContainer}>
                    <Line data={chartData} options={chartOptions} />
                </div>
            </div>
        </div>
    );
}

export default TrafficData;
