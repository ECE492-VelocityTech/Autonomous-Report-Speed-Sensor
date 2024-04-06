import React from "react";
import { Text, View } from "react-native";
import compStyles from "./compStyles.ts";
import {Device} from "./model/Device.ts";
import StyleUtil from "./util/StyleUtil.ts";

const DeviceTile = ({device}: any) => {

    return <>
        <View style={[compStyles.deviceTileBox, StyleUtil.getTileBackground()]}>
            <Text style={[compStyles.deviceTileName, StyleUtil.getForegroundColor()]}>{device.name}</Text>
            <Text style={[compStyles.deviceTileStatus, StyleUtil.getForegroundColor()]}>{JSON.stringify(device)}</Text>
        </View>
    </>
}

export default DeviceTile;
