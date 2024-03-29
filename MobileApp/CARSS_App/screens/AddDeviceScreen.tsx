import { useState } from "react";
import styles from "./styles.ts";
import StyleUtil from "../components/util/StyleUtil.ts";
import { NativeEventEmitter, NativeModules, View } from "react-native";
import AddDeviceInstructions from "../components/AddDeviceInstructions.tsx";
import DiscoverDevice from "../components/DiscoverDevice.tsx";
import ConfigureDevice from "../components/ConfigureDevice.tsx";

import BleManager from "react-native-ble-manager";
import BluetoothUtil from "../components/util/BluetoothUtil.ts";

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);


const AddDeviceScreen = ({navigation}: any) => {
    const [pageState, setPageState] = useState<AddDeviceState>(AddDeviceState.Instructions)
    const [connectedDeviceBleId, setConnectedDeviceBleId] = useState("-1")

    const showInstructions = () => pageState == AddDeviceState.Instructions;
    const showDiscovery = () => pageState == AddDeviceState.Discovery || pageState == AddDeviceState.Configuration;
    const showConfiguration = () => pageState == AddDeviceState.Configuration;


    const completeInstructionsHandler = function() {
        setPageState(AddDeviceState.Discovery)
    }

    const completeDeviceConnection = function(peripheralId: string) {
        console.log(peripheralId)
        if (peripheralId == "-1") {
            // TODO: Handle error
            return;
        }
        setConnectedDeviceBleId(peripheralId)
        setPageState(AddDeviceState.Configuration)
    }

    return <>
        {showInstructions() && <AddDeviceInstructions completeInstructionsHandler={completeInstructionsHandler}/> }
        {showDiscovery() && <DiscoverDevice completeDeviceConnection={completeDeviceConnection} showConfiguration={showConfiguration}
                                            BluetoothUtil={BluetoothUtil} BleManager={BleManager} bleManagerEmitter={bleManagerEmitter}/> }
        {/*{showConfiguration() && <ConfigureDevice connectedDeviceBleId={connectedDeviceBleId} BluetoothUtil={BluetoothUtil} BleManager={BleManager}/> }*/}
    </>
};

enum AddDeviceState {
    Instructions,
    Discovery,
    Configuration,
}

export default AddDeviceScreen;
