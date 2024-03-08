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

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

declare module "react-native-ble-manager" {
    // enrich local contract with custom state properties needed by App.tsx
    interface Peripheral {
        connected?: boolean;
        connecting?: boolean;
    }
}

const DiscoverDevice = () => {
    const [isScanning, setIsScanning] = useState(false);
    const [peripherals, setPeripherals] = useState(
        new Map<Peripheral["id"], Peripheral>()
    );
    const [connected, setConnected] = useState(false);
    const [value, setValue] = useState("");
    const [error, setError] = useState(null);
    const [connectedPeripheralId, setConnectedPeripheralId] = useState("-1");

    const startScan = async () => {
        if (!isScanning) {
            // reset found peripherals before scan
            setPeripherals(new Map<Peripheral["id"], Peripheral>());
            setIsScanning(true);
            await BluetoothUtil.beginScanForDevices();
        }
    };

    const handleStopScan = () => {
        setIsScanning(false);
        console.debug("[handleStopScan] scan is stopped.");
    };

    const handleDiscoverPeripheral = (peripheral: Peripheral) => {
        console.debug("[handleDiscoverPeripheral] new BLE peripheral=", peripheral);
        if (!peripheral.name) {
            // peripheral.name = 'NO NAME';
            return;
        }
        setPeripherals(map => {
            return new Map(map.set(peripheral.id, peripheral));
        });
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
            bleManagerEmitter.addListener(
                "BleManagerDisconnectPeripheral",
                handleDisconnectedPeripheral
            ),
            // bleManagerEmitter.addListener(
            //   'BleManagerDidUpdateValueForCharacteristic',
            //   handleUpdateValueForCharacteristic,
            // ),
            bleManagerEmitter.addListener(
                "BleManagerConnectPeripheral",
                handleConnectPeripheral
            )
        ];

        handleAndroidPermissions();

        return () => {
            console.debug("[app] main component unmounting. Removing listeners...");
            for (const listener of listeners) {
                listener.remove();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDisconnectedPeripheral = (
        event: BleDisconnectPeripheralEvent
    ) => {
        console.debug(
            `[handleDisconnectedPeripheral][${event.peripheral}] disconnected.`
        );
        setPeripherals(map => {
            let p = map.get(event.peripheral);
            if (p) {
                p.connected = false;
                return new Map(map.set(event.peripheral, p));
            }
            return map;
        });
    };

    const handleConnectPeripheral = (event: any) => {
        console.log(`[handleConnectPeripheral][${event.peripheral}] connected.`);
    };

    const handleAndroidPermissions = () => {
        if (Platform.OS === "android" && Platform.Version >= 31) {
            PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
            ]).then(result => {
                if (result) {
                    console.debug(
                        "[handleAndroidPermissions] User accepts runtime permissions android 12+"
                    );
                } else {
                    console.error(
                        "[handleAndroidPermissions] User refuses runtime permissions android 12+"
                    );
                }
            });
        } else if (Platform.OS === "android" && Platform.Version >= 23) {
            PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            ).then(checkResult => {
                if (checkResult) {
                    console.debug(
                        "[handleAndroidPermissions] runtime permission Android <12 already OK"
                    );
                } else {
                    PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                    ).then(requestResult => {
                        if (requestResult) {
                            console.debug(
                                "[handleAndroidPermissions] User accepts runtime permission android <12"
                            );
                        } else {
                            console.error(
                                "[handleAndroidPermissions] User refuses runtime permission android <12"
                            );
                        }
                    });
                }
            });
        }
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
            await connectPeripheral(peripheral);
        }
    };

    function sleep(ms: number) {
        return new Promise<void>(resolve => setTimeout(resolve, ms));
    }

    const connectPeripheral = async (peripheral: Peripheral) => {
        try {
            if (peripheral) {
                setPeripherals(map => {
                    let p = map.get(peripheral.id);
                    if (p) {
                        p.connecting = true;
                        return new Map(map.set(p.id, p));
                    }
                    return map;
                });

                await BleManager.connect(peripheral.id);
                console.debug(`[connectPeripheral][${peripheral.id}] connected.`);

                setPeripherals(map => {
                    let p = map.get(peripheral.id);
                    if (p) {
                        p.connecting = false;
                        p.connected = true;
                        return new Map(map.set(p.id, p));
                    }
                    return map;
                });

                // before retrieving services, it is often a good idea to let bonding & connection finish properly
                await sleep(900);

                /* Test read current RSSI value, retrieve services first */
                const peripheralData = await BleManager.retrieveServices(peripheral.id);
                console.debug(
                    `[connectPeripheral][${peripheral.id}] retrieved peripheral services`,
                    peripheralData
                );

                const rssi = await BleManager.readRSSI(peripheral.id);
                console.debug(
                    `[connectPeripheral][${peripheral.id}] retrieved current RSSI value: ${rssi}.`
                );

                if (peripheralData.characteristics) {
                    for (let characteristic of peripheralData.characteristics) {
                        if (characteristic.descriptors) {
                            for (let descriptor of characteristic.descriptors) {
                                try {
                                    let data = await BleManager.readDescriptor(
                                        peripheral.id,
                                        characteristic.service,
                                        characteristic.characteristic,
                                        descriptor.uuid
                                    );
                                    console.debug(
                                        `[connectPeripheral][${peripheral.id}] ${characteristic.service} ${characteristic.characteristic} ${descriptor.uuid} descriptor read as:`,
                                        data
                                    );
                                } catch (error) {
                                    console.error(
                                        `[connectPeripheral][${peripheral.id}] failed to retrieve descriptor ${descriptor} for characteristic ${characteristic}:`,
                                        error
                                    );
                                }
                            }
                        }
                    }
                }

                setPeripherals(map => {
                    let p = map.get(peripheral.id);
                    if (p) {
                        p.rssi = rssi;
                        return new Map(map.set(p.id, p));
                    }
                    return map;
                });
            }
        } catch (error) {
            console.error(
                `[connectPeripheral][${peripheral.id}] connectPeripheral error`,
                error
            );
        }
    };

    const writeData = async () => {
        if (connectedPeripheralId == "-1") {
            return;
        }
        try {
            // Convert value to byte array (assuming ASCII encoding)
            const bytes = Buffer.from(value, "ascii");
            console.log("Sending" + bytes);

            // Write data to characteristic with specified ID and service UUID
            await BleManager.write(
                connectedPeripheralId,
                Constants.BLEServiceUUID,
                Constants.BLECharUUID,
                bytes.toJSON().data
            );

            console.log("Success sent: " + value);
        } catch (error) {
            setError("Error: " + error.message);
        }
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
        <SafeAreaView style={styles.body}>
            <Pressable style={styles.scanButton} onPress={startScan}>
                <Text style={styles.scanButtonText}>
                    {isScanning ? "Scanning..." : "Scan Bluetooth"}
                </Text>
            </Pressable>

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