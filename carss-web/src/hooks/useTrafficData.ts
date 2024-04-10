import { useState, useEffect } from "react";
import { ServerUrl } from "../util/RestApi";
import { TrafficDataItem } from "../util/dataFormatter";

interface UseTrafficDataReturn {
    trafficData: TrafficDataItem[];
    isLoading: boolean;
    error: string | null;
}

const BASE_URL = `${ServerUrl}/api/v1/devices`;

export interface FilterParams {
    selectedFilter: string;
    startDate?: Date;
    endDate?: Date;
    specificDate?: Date;
}

const useTrafficData = (
    deviceId: string,
    filterParams: FilterParams
): UseTrafficDataReturn => {
    const [trafficData, setTrafficData] = useState<TrafficDataItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const constructUrl = () => {
            let url = `${BASE_URL}/${deviceId}/trafficData`;
            const params = new URLSearchParams();
            switch (filterParams.selectedFilter) {
                case "date":
                    if (filterParams.specificDate) {
                        const formattedDate = filterParams.specificDate
                            .toISOString()
                            .split("T")[0];
                        params.append("date", formattedDate);
                    }
                    break;
                case "pastWeek":
                case "dateRange":
                    if (filterParams.startDate && filterParams.endDate) {
                        const formattedStartDate = filterParams.startDate
                            .toISOString()
                            .split("T")[0];
                        const formattedEndDate = filterParams.endDate
                            .toISOString()
                            .split("T")[0];
                        params.append("startDate", formattedStartDate);
                        params.append("endDate", formattedEndDate);
                    }
                    break;
                case "dayOfTheWeek":
                    url += "?dayOfTheWeek";
                    break;

                case "all":
                    break;
                default:
                    if (filterParams.specificDate) {
                        const formattedDate = filterParams.specificDate
                            .toISOString()
                            .split("T")[0];
                        params.append("date", formattedDate);
                    }
                    break;
            }

            if (params.toString()) {
                url += `?${params}`;
            }
            console.log(url);
            return url;
        };

        const fetchTrafficData = async () => {
            setIsLoading(true);
            setError(null);
            const url = constructUrl();

            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error("Failed to fetch data");

                const data = await response.json();
                console.log(data);
                setTrafficData(data);
            } catch (error) {
                setError(
                    error instanceof Error ? error.message : String(error)
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchTrafficData();
    }, [deviceId, filterParams]);

    return { trafficData, isLoading, error };
};

export default useTrafficData;
