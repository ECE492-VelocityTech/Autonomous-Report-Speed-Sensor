import { ChartOptions } from "chart.js";

export const getChartOptions = (
    filter: string,
    speedLimit: number
): ChartOptions => {
    let xAxisTitle = "Hour of the Day";

    switch (filter) {
        case "dayOfTheWeek":
            xAxisTitle = "Day of the Week";
            break;
        case "dateRange":
            xAxisTitle = "Date";
            break;
        case "date":
            break;
        case "pastWeek":
            xAxisTitle = "Date";
            break;
    }

    return {
        scales: {
            x: {
                title: {
                    display: true,
                    text: xAxisTitle,
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
                position: "top",
            },
            annotation: {
                annotations: {
                    speedLimitLine: {
                        type: "line",
                        yMin: speedLimit,
                        yMax: speedLimit,
                        borderColor: "rgb(255, 99, 132)",
                        borderWidth: 2,
                        borderDash: [10, 5],
                        label: {
                            content: `Speed Limit (${speedLimit} km/h)`,
                            position: "end",
                            backgroundColor: "rgba(255, 99, 132, 0.75)",
                            color: "#fff",
                            font: {
                                size: 12,
                            },
                        },
                    },
                },
            },
        },
        responsive: true,
        maintainAspectRatio: false,
    };
};
