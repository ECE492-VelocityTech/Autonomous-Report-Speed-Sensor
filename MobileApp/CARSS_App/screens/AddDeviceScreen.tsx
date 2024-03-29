import { useState } from "react";
import styles from "./styles.ts";
import StyleUtil from "../components/util/StyleUtil.ts";
import { View } from "react-native";
import AddDeviceInstructions from "../components/AddDeviceInstructions.tsx";
import DiscoverDevice from "../components/DiscoverDevice.tsx";

const AddDeviceScreen = ({navigation}: any) => {
    const [pageState, setPageState] = useState<AddDeviceState>(AddDeviceState.Instructions)
    const [discoveredDeviceBleId, setDiscoveredDeviceBleId] = useState(-1)

    const showInstructions = () => pageState == AddDeviceState.Instructions;
    const showDiscovery = () => pageState == AddDeviceState.Discovery;

    const completeInstructionsHandler = function() {
        setPageState(AddDeviceState.Discovery)
    }


    return <>
        {showInstructions() && <AddDeviceInstructions completeInstructionsHandler={completeInstructionsHandler}/> }
        {showDiscovery() && <DiscoverDevice setDiscoveredDeviceBleId={setDiscoveredDeviceBleId}/> }
    </>
};

enum AddDeviceState {
    Instructions,
    Discovery,
    Configuration,
}

export default AddDeviceScreen;
