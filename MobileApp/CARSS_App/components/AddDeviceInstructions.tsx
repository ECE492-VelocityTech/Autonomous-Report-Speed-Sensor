import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import compStyles from "./compStyles.ts";
import styleUtil from "./util/StyleUtil.ts";
import styles from "../screens/styles.ts";

const AddDeviceInstructions = ({completeInstructionsHandler}: any) => {
    return <>
        <View style={[compStyles.container, styleUtil.getBackgroundColor()]}>
            <Text style={[compStyles.title, styleUtil.getForegroundColor()]}>Setup Instructions</Text>
            <View style={[compStyles.instructionContainer, {minHeight: "60%"}]}>
                <Text style={[compStyles.step, styleUtil.getForegroundColor()]}>1. Turn on the CARSS monitoring unit</Text>
                <Text style={[compStyles.step, styleUtil.getForegroundColor()]}>2. Ensure the CARSS monitoring unit is in pairing mode.</Text>
                <Text style={[compStyles.subStep, styleUtil.getForegroundColor()]}>- Pairing mode is indicated by a flashing red light.</Text>
                <Text style={[compStyles.subStep, styleUtil.getForegroundColor()]}>- To enable pairing mode, press and hold the reset button for 10 seconds.</Text>
                <Text style={[compStyles.step, styleUtil.getForegroundColor()]}>3. Ensure the CARSS monitoring unit is in range of the smartphone.</Text>
            </View>

            <View style={compStyles.wholeWidthContainer}>
                <View style={compStyles.buttonContainer}>
                    <TouchableOpacity style={[compStyles.normalButton, styleUtil.getButtonBackgroundColor()]} onPress={completeInstructionsHandler}>
                        <Text style={[compStyles.normalButtonText, styleUtil.getForegroundColor()]}>Next</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </>
}

export default AddDeviceInstructions;
