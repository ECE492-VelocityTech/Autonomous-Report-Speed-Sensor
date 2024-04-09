export type TrafficDataItem = {
    label: string;
    averageSpeed: number;
};

export const formatChartData = (trafficData: TrafficDataItem[]) => {
    const labels = trafficData.map((item) => item.label);
    const data = trafficData.map((item) => item.averageSpeed);

    const datasets = [
        {
            label: "Average Speed (km/h)",
            data,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
        },
    ];

    return { labels, datasets };
};
