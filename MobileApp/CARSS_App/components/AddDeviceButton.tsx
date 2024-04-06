import { Text, TouchableOpacity } from "react-native";
import React from "react";
import compStyles from "./compStyles.ts";
import styleUtil from "./util/StyleUtil.ts";

const AddDeviceButton = ({navigation}: any) => {
    function addDeviceHandler() {
        console.log("addDeviceHandler")
        navigation.navigate("AddDevice");
    }

    return <>
        <TouchableOpacity style={[compStyles.addButton, styleUtil.getButtonBackgroundColor()]} onPress={addDeviceHandler}>
            <Text style={[compStyles.addButtonSymbol, styleUtil.getForegroundColor()]}>+</Text>
            <Text style={[compStyles.addButtonText, styleUtil.getForegroundColor()]}> Add</Text>
        </TouchableOpacity>
    </>;
};

export default AddDeviceButton;
