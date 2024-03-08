import BleManager, { BleScanCallbackType, BleScanMatchMode, BleScanMode, Peripheral } from "react-native-ble-manager";
import Constants from "../Constants.js";

const BluetoothUtil = {
    beginScanForDevices: async function () {
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
};

export default BluetoothUtil;
