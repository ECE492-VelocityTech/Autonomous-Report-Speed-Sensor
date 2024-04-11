import { useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import { DeviceResp } from "../components/model/DeviceResp.ts";
import compStyles from "../components/compStyles.ts";
import StyleUtil from "../components/util/StyleUtil.ts";
import { Picker } from "@react-native-picker/picker";
import styleUtil from "../components/util/StyleUtil.ts";
import { DeviceStatus, DeviceUtil } from "../components/model/DeviceReq.ts";
import RestApi from "../components/util/RestApi.ts";
import deviceTile from "../components/DeviceTile.tsx";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'

const ManageDeviceScreen = ({navigation}: any) => {
    const route = useRoute();
    let deviceOrig : DeviceResp = route.params?.device;

    if (deviceOrig === undefined || deviceOrig === null) {
        // Handle the case when the parameter is not passed
        return <Text>Error: Missing Device Info</Text>;
    }

    const [device, setDevice] = useState(deviceOrig);
    const [name, setName] = useState(device.name);
    const [speedLimit, setSpeedLimit] = useState(device.speedLimit);
    const [mode, setMode] = useState(device.mode); // false for Standby, true for Active
    const [loading, setLoading] = useState(false);

    const handleModeChange = (selectedMode: string) => {
        setMode(selectedMode);
    };

    async function submitChange() {
        setLoading(true)
        let resp: DeviceResp = await RestApi.updateDevice(device.id, DeviceUtil.toUpdateDeviceReq(name, "", speedLimit, mode));
        if (!resp || resp?.id == -1) {
            setLoading(false)
            return;
        }
        setMode(resp.mode);
        setName(resp.name);
        setSpeedLimit(resp.speedLimit);
        setDevice(resp);
        setLoading(false);
    }

    function viewLiveFeed() {
        navigation.navigate('LiveFeed', { device: device });
    }

    return <>
        <View style={[compStyles.container, StyleUtil.getBackgroundColor()]}>
            <View style={compStyles.horizontalView}>
                <Text style={[compStyles.title, StyleUtil.getForegroundColor()]}>{name}</Text>
                <View style={compStyles.iconContainer}>
                    <TouchableOpacity onPress={viewLiveFeed}>
                        <FontAwesomeIcon icon={faEye} size={20}/>
                    </TouchableOpacity>

                </View>
            </View>

            <View style={compStyles.sectionContainer}>
                <Text style={compStyles.inputHeading}>Speed Limit</Text>
                <TextInput style={compStyles.inputField}
                           keyboardType="numeric" value={speedLimit.toString()} onChangeText={text => setSpeedLimit(+text)} />
                <Text style={compStyles.inputHeading}>Mode</Text>
                <Picker selectedValue={mode} onValueChange={handleModeChange} style={compStyles.picker}>
                    <Picker.Item label={DeviceStatus.Active.toString()} value={DeviceStatus.Active.toString()} />
                    <Picker.Item label={DeviceStatus.Standby.toString()} value={DeviceStatus.Standby.toString()} />
                    <Picker.Item label={DeviceStatus.Test.toString()} value={DeviceStatus.Test.toString()} />
                </Picker>
            </View>

            <TouchableOpacity style={[compStyles.normalButton, compStyles.sectionContainer, StyleUtil.getButtonBackgroundColor()]} onPress={submitChange}>
                <Text style={[compStyles.normalButtonText, styleUtil.getForegroundColor()]}>Save</Text>
            </TouchableOpacity>

            {loading && (
                <View style={compStyles.overlay}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}
        </View>
    </>;
};

export default ManageDeviceScreen;
