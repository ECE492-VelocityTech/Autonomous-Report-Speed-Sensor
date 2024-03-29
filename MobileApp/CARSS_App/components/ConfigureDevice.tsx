import { Button, Pressable, Text, TextInput, View } from "react-native";
import compStyles from "./compStyles.ts";
import styleUtil from "./util/StyleUtil.ts";
import React, { useState } from "react";

const ConfigureDevice = ({showDiscovery, connectedDeviceBleId, BluetoothUtil, BleManager}: any) => {
    const [value, setValue] = useState("");
    const [error, setError] = useState(null);
    const [deviceName, setDeviceName] = useState('');
    const [wifiName, setWifiName] = useState('');
    const [wifiPassword, setWifiPassword] = useState('');
    const [address, setAddress] = useState('');

    const handleSubmit = async function() {
        const body = {
            deviceName,
            wifiName,
            wifiPassword,
            address,
        }
        await BluetoothUtil.writeDataToPeripheral(connectedDeviceBleId, JSON.stringify(body), setError);
    };

    const writeData = async () => {
        await BluetoothUtil.writeDataToPeripheral(connectedDeviceBleId, value, setError);
    };

    return <>
        <View style={[compStyles.container, styleUtil.getBackgroundColor()]}>
            {connectedDeviceBleId != "-1" && (
                <View>
                    <Text>Connected to device1: {connectedDeviceBleId}</Text>
                    <TextInput
                        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
                        onChangeText={text => setValue(text)}
                        value={value}
                    />
                    <Button title="Write Data" onPress={writeData} />
                </View>
            )}
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
                <Button title="Submit" onPress={handleSubmit} />
            </View>

            {error && <Text>Error: {error}</Text>}
        </View>
    </>
};

export default ConfigureDevice;
