import { useRoute } from "@react-navigation/native";
import { DeviceResp } from "../components/model/DeviceResp.ts";
import { Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import RestApi from "../components/util/RestApi.ts";
import compStyles from "../components/compStyles.ts";
import StyleUtil from "../components/util/StyleUtil.ts";

const LiveFeedScreen = () => {
    const route = useRoute();
    const device : DeviceResp = route.params?.device;

    if (device === undefined || device === null) {
        // Handle the case when the parameter is not passed
        return <Text>Error: Missing Device Info</Text>;
    }

    const [number, setNumber] = useState(0);
    const [timestamp, setTimestamp] = useState("___");

    function getColor() {
        return number > device.speedLimit ? "red" : "green";
    }

    const fetchRecentValue = async () => {
        try {
            const response = await RestApi.getLatestSpeed(device.id);
            setNumber(response.speed);
            setTimestamp(response.timestamp);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchRecentValue();
        const interval = setInterval(fetchRecentValue, 1000);
        return () => clearInterval(interval);
    }, []);


    return <>
        <View style={[compStyles.liveFeedContainer, StyleUtil.getBackgroundColor()]}>
            <Text style={compStyles.title}>Speed</Text>
            <Text style={[compStyles.liveFeedNumber, { color: getColor() }]}>{number}</Text>
            <Text style={[compStyles.title]}>{timestamp}</Text>
        </View>
    </>
};

export default LiveFeedScreen;
