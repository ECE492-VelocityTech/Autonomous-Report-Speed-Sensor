import BleManager, {
    BleDisconnectPeripheralEvent,
    BleScanCallbackType,
    BleScanMatchMode,
    BleScanMode,
    Peripheral
} from "react-native-ble-manager";
import Constants from "../Constants.js";
import { PermissionsAndroid, Platform } from "react-native";
import { Buffer } from "buffer";

const BluetoothUtil = {
    beginScanForDevices: async function (isScanning: any, setIsScanning: any, setPeripherals: any) {
        if (!isScanning) {
            // reset found peripherals before scan
            setPeripherals(new Map<Peripheral["id"], Peripheral>());
            setIsScanning(true);

            try {
                console.debug('[startScan] starting scan...');
                await BleManager.scan(Constants.SERVICE_UUIDS, Constants.SECONDS_TO_SCAN_FOR, Constants.ALLOW_DUPLICATES, {
                    matchMode: BleScanMatchMode.Sticky,
                    scanMode: BleScanMode.LowLatency,
                    callbackType: BleScanCallbackType.AllMatches,
                })
                console.debug('[startScan] scan promise returned successfully.');;
            } catch (error) {
                console.error('[startScan] ble scan error thrown', error);
            }
        }
    },

    handleStopScan: (setIsScanning: any) => {
        setIsScanning(false);
        console.debug("[handleStopScan] scan is stopped.");
    },

    isCarssDevice: function(name: String | undefined) {
        return name && name.includes(Constants.BLEDeviceNamePrefix);
    },

    handleDiscoverPeripheral: function (peripheral: Peripheral, setPeripherals: any) {
        if (!this.isCarssDevice(peripheral.name)) {
            return;
        }
        setPeripherals((map:  Map<string, Peripheral>) => {
            return new Map(map.set(peripheral.id, peripheral));
        });
    },

    handleDisconnectedPeripheral: function(setPeripherals: any, event: BleDisconnectPeripheralEvent) {
        console.debug(
            `[handleDisconnectedPeripheral][${event.peripheral}] disconnected.`
        );
        if (!setPeripherals) { return; }
        setPeripherals((map: Map<string, Peripheral>) => {
            let p = map.get(event.peripheral);
            if (p) {
                p.connected = false;
                return new Map(map.set(event.peripheral, p));
            }
            return map;
        });
    },

    handleAndroidPermissions: function() {
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
    },

    connectPeripheral: async function(peripheral: Peripheral, setPeripherals: any, ) {
        if (peripheral) {
            setPeripherals((map: Map<string, Peripheral>) => {
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
            await this.sleep(900);

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

            setPeripherals((map: Map<string, Peripheral>) => {
                let p = map.get(peripheral.id);
                if (p) {
                    p.rssi = rssi;
                    return new Map(map.set(p.id, p));
                }
                return map;
            });
        }
    },

    sleep: async function(ms: number) {
        return new Promise<void>(resolve => setTimeout(resolve, ms));
    },

    writeDataToPeripheral: async function(connectedPeripheralId: string, message: string, setError: any) {
        if (connectedPeripheralId == "-1") {
            return;
        }
        try {
            // Convert value to byte array (assuming ASCII encoding)
            const bytes = Buffer.from(message, "ascii");
            console.log("Sending" + bytes);

            // Write data to characteristic with specified ID and service UUID
            await BleManager.write(
                connectedPeripheralId,
                Constants.BLEServiceUUID,
                Constants.BLECharUUID,
                bytes.toJSON().data,
                Constants.BLEMaxBytes,
            );
            console.log("Success sent: " + message);
            return true;
        } catch (error: any) {
            if (setError) { setError("Error: " + error.message); }
            return false;
        }
    },

};

export default BluetoothUtil;
