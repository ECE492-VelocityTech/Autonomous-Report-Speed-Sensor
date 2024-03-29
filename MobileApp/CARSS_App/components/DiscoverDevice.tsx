import React, { useEffect, useState } from "react";
import { Buffer } from "buffer";
import {
    Button,
    FlatList,
    NativeEventEmitter,
    NativeModules, PermissionsAndroid, Platform,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text, TextInput, TouchableHighlight,
    View
} from "react-native";



import BleManager, {
    BleDisconnectPeripheralEvent,
    BleManagerDidUpdateValueForCharacteristicEvent,
    BleScanCallbackType,
    BleScanMatchMode,
    BleScanMode,
    Peripheral
} from "react-native-ble-manager";
import { Colors } from "react-native/Libraries/NewAppScreen";
import Constants from "./Constants.js";
import BluetoothUtil from "./util/BluetoothUtil.ts";
import compStyles from "./compStyles.ts";
import styleUtil from "./util/StyleUtil.ts";

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

declare module "react-native-ble-manager" {
    // enrich local contract with custom state properties needed by App.tsx
    interface Peripheral {
        connected?: boolean;
        connecting?: boolean;
    }
}

const DiscoverDevice = ({setDiscoveredDeviceBleId}: any) => {
    const [isScanning, setIsScanning] = useState(false);
    const [peripherals, setPeripherals] = useState(
        new Map<Peripheral["id"], Peripheral>()
    );
    const [connected, setConnected] = useState(false);
    const [value, setValue] = useState("");
    const [error, setError] = useState(null);
    const [connectedPeripheralId, setConnectedPeripheralId] = useState("-1");

    const startScan = async () => {
        await BluetoothUtil.beginScanForDevices(isScanning, setIsScanning, setPeripherals);

    };

    const handleStopScan = () => {
        BluetoothUtil.handleStopScan(setIsScanning);
    };

    const handleDiscoverPeripheral = (peripheral: Peripheral) => {
        BluetoothUtil.handleDiscoverPeripheral(peripheral, setPeripherals);
    };

    const retrieveConnected = async () => {
        try {
            const connectedPeripherals = await BleManager.getConnectedPeripherals();
            if (connectedPeripherals.length === 0) {
                console.warn("[retrieveConnected] No connected peripherals found.");
                return;
            }

            console.debug(
                "[retrieveConnected] connectedPeripherals",
                connectedPeripherals
            );

            for (var i = 0; i < connectedPeripherals.length; i++) {
                var peripheral = connectedPeripherals[i];
                setPeripherals(map => {
                    let p = map.get(peripheral.id);
                    if (p) {
                        p.connected = true;
                        return new Map(map.set(p.id, p));
                    }
                    return map;
                });
            }
        } catch (error) {
            console.error(
                "[retrieveConnected] unable to retrieve connected peripherals.",
                error
            );
        }
    };

    useEffect(() => {
        try {
            BleManager.start({ showAlert: false })
                .then(() => console.debug("BleManager started."))
                .catch((error: any) =>
                    console.error("BeManager could not be started.", error)
                );
        } catch (error) {
            console.error("unexpected error starting BleManager.", error);
            return;
        }

        const listeners = [
            bleManagerEmitter.addListener(
                "BleManagerDiscoverPeripheral",
                handleDiscoverPeripheral
            ),
            bleManagerEmitter.addListener("BleManagerStopScan", handleStopScan),
            bleManagerEmitter.addListener("BleManagerDisconnectPeripheral",  handleDisconnectedPeripheral),
            // bleManagerEmitter.addListener(
            //   'BleManagerDidUpdateValueForCharacteristic',
            //   handleUpdateValueForCharacteristic,
            // ),
            bleManagerEmitter.addListener(
                "BleManagerConnectPeripheral",
                handleConnectPeripheral
            )
        ];

        BluetoothUtil.handleAndroidPermissions();

        return () => {
            console.debug("[app] main component unmounting. Removing listeners...");
            for (const listener of listeners) {
                listener.remove();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDisconnectedPeripheral = (event: BleDisconnectPeripheralEvent) => {
        BluetoothUtil.handleDisconnectedPeripheral(setPeripherals, event);
    };

    const handleConnectPeripheral = (event: any) => {
        console.log(`[handleConnectPeripheral][${event.peripheral}] connected.`);
    };

    const togglePeripheralConnection = async (peripheral: Peripheral) => {
        if (peripheral && peripheral.connected) {
            try {
                await BleManager.disconnect(peripheral.id);
                setConnectedPeripheralId(-1);
            } catch (error) {
                console.error(
                    `[togglePeripheralConnection][${peripheral.id}] error when trying to disconnect device.`,
                    error
                );
            }
        } else {
            setConnectedPeripheralId(peripheral.id);
            await BluetoothUtil.connectPeripheral(peripheral, setPeripherals);
        }
    };

    const writeData = async () => {
        await BluetoothUtil.writeDataToPeripheral(connectedPeripheralId, value, setError);
    };

    const renderItem = ({ item }: { item: Peripheral }) => {
        const backgroundColor = item.connected ? "#069400" : Colors.white;
        return (
            <TouchableHighlight
                underlayColor="#0082FC"
                onPress={() => togglePeripheralConnection(item)}
            >
                <View style={[styles.row, { backgroundColor }]}>
                    <Text style={styles.peripheralName}>
                        {/* completeLocalName (item.name) & shortAdvertisingName (advertising.localName) may not always be the same */}
                        {item.name} - {item?.advertising?.localName}
                        {item.connecting && " - Connecting..."}
                    </Text>
                    <Text style={styles.rssi}>RSSI: {item.rssi}</Text>
                    <Text style={styles.peripheralId}>{item.id}</Text>
                </View>
            </TouchableHighlight>
        );
    };

    return <>
        <SafeAreaView style={[compStyles.container, styleUtil.getBackgroundColor()]}>
            {/*Search for devices*/}
            <Pressable style={[compStyles.normalButton, styleUtil.getButtonBackgroundColor()]} onPress={startScan}>
                <Text style={styles.scanButtonText}>
                    {isScanning ? "Scanning..." : "Scan Bluetooth"}
                </Text>
            </Pressable>

            {/*Show available devices*/}
            <View style={compStyles.sectionContainer}>
                {Array.from(peripherals.values()).length === 0 && (
                    <View style={styles.row}>
                        <Text style={styles.noPeripherals}>
                            No Peripherals, press "Scan Bluetooth" above.
                        </Text>
                    </View>
                )}

                <FlatList
                    data={Array.from(peripherals.values())}
                    contentContainerStyle={{ rowGap: 12 }}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                />

                {connectedPeripheralId != "-1" && (
                    <View>
                        <Text>Connected to device: {connectedPeripheralId}</Text>
                        <TextInput
                            style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
                            onChangeText={text => setValue(text)}
                            value={value}
                        />
                        <Button title="Write Data" onPress={writeData} />
                    </View>
                )}
                {error && <Text>Error: {error}</Text>}
            </View>

        </SafeAreaView>
    </>;
};

const boxShadow = {
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
};

const styles = StyleSheet.create({
    engine: {
        position: "absolute",
        right: 10,
        bottom: 0,
        color: Colors.black
    },
    scanButton: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        backgroundColor: "#0a398a",
        margin: 10,
        borderRadius: 12,
        marginBottom: 20,
        ...boxShadow
    },
    scanButtonText: {
        fontSize: 20,
        letterSpacing: 0.25,
        color: Colors.white
    },
    body: {
        backgroundColor: "#0082FC",
        flex: 1
    },
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: "600",
        color: Colors.black
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: "400",
        color: Colors.dark
    },
    highlight: {
        fontWeight: "700"
    },
    footer: {
        color: Colors.dark,
        fontSize: 12,
        fontWeight: "600",
        padding: 4,
        paddingRight: 12,
        textAlign: "right"
    },
    peripheralName: {
        fontSize: 16,
        textAlign: "center",
        padding: 10,
        color: "black"
    },
    rssi: {
        fontSize: 12,
        textAlign: "center",
        padding: 2,
        color: "black"
    },
    peripheralId: {
        fontSize: 12,
        textAlign: "center",
        padding: 2,
        paddingBottom: 20,
        color: "black"
    },
    row: {
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 20,
        color: "red",
        ...boxShadow
    },
    noPeripherals: {
        margin: 10,
        textAlign: "center",
        color: Colors.white
    }
});


export default DiscoverDevice;
