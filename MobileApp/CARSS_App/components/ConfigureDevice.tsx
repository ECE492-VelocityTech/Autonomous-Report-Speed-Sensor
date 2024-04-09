import { Animated, Button, Pressable, Text, TextInput, View } from "react-native";
import compStyles from "./compStyles.ts";
import styleUtil from "./util/StyleUtil.ts";
import React, { useState } from "react";
import RestApi from "./util/RestApi.ts";
import SessionUtil from "./util/SessionUtil.ts";
import { DeviceUtil } from "./model/DeviceReq.ts";
import add = Animated.add;

const ConfigureDevice = ({showDiscovery, connectedDeviceBleId, BluetoothUtil, BleManager, navigation}: any) => {
    const [value, setValue] = useState("");
    const [error, setError] = useState(null);
    const [deviceName, setDeviceName] = useState('');
    const [wifiName, setWifiName] = useState('Mehar iPhone');
    const [wifiPassword, setWifiPassword] = useState('123456789');
    const [address, setAddress] = useState('');
    const [speedLimit, setSpeedLimit] = useState('');

    function validInput() {
        if (isNaN(Number(speedLimit))) { return false; }
        return true;
    }

    const handleSubmit = async function() {
        if (!validInput()) {
            console.log("Invalid Input");
            return; // handle error
        }
        let device = DeviceUtil.toDevice(deviceName, address, Number(speedLimit));
        let deviceResp = await RestApi.addDevice(SessionUtil.getCacheCurrentUserId(), device)
        console.log("deviceResp", deviceResp)
        if (!deviceResp) { return; } // Handle error

        const bodyPeri = {
            deviceId: deviceResp.id,
            deviceName,
            wifiName,
            wifiPassword,
            address,
        }
        const configSuccess = await BluetoothUtil.writeDataToPeripheral(connectedDeviceBleId, JSON.stringify(bodyPeri), setError);
        console.log("configSuccess", configSuccess);
        if (!configSuccess) {
            // TODO: Handle failure
            return;
        }

        navigation?.navigate('Home')
    };

    const writeData = async () => {
        await BluetoothUtil.writeDataToPeripheral(connectedDeviceBleId, value, setError);
    };

    return <>
        <View style={[compStyles.container, styleUtil.getBackgroundColor()]}>
            <Text style={[compStyles.title, styleUtil.getForegroundColor()]}>Configure CARSS 1 Device</Text>
            <View style={compStyles.sectionContainer}>
                <Text style={compStyles.inputHeading}>Device Name*</Text>
                <TextInput
                    style={compStyles.inputField}
                    placeholder="Enter Device Name"
                    value={deviceName}
                    onChangeText={setDeviceName}
                />
                <Text style={compStyles.inputHeading}>WiFi Name*</Text>
                <TextInput
                    style={compStyles.inputField}
                    placeholder="Enter WiFi Name"
                    value={wifiName}
                    onChangeText={setWifiName}
                />
                <Text style={compStyles.inputHeading}>WiFi Password*</Text>
                <TextInput
                    style={compStyles.inputField}
                    placeholder="Enter WiFi Password"
                    secureTextEntry={true}
                    value={wifiPassword}
                    onChangeText={setWifiPassword}
                />
                <Text style={compStyles.inputHeading}>Address*</Text>
                <TextInput
                    style={compStyles.inputField}
                    placeholder="Enter Address"
                    value={address}
                    onChangeText={setAddress}
                />
                <Text style={compStyles.inputHeading}>Speed Limit*</Text>
                <TextInput
                    style={compStyles.inputField}
                    placeholder="KPH"
                    value={speedLimit}
                    onChangeText={setSpeedLimit}
                />
                <Button title="Submit" onPress={handleSubmit} />
            </View>

            {error && <Text>Error: {error}</Text>}
        </View>
    </>
};

export default ConfigureDevice;
