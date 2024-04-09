import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import compStyles from "./compStyles.ts";
import {DeviceReq} from "./model/DeviceReq.ts";
import StyleUtil from "./util/StyleUtil.ts";
import Constants from "./Constants.js";

const CircleIndicator = ({ status }: any) => {
    let circleColor = status == "Unreachable" ? "red" : "green";
    return (
        <View style={[compStyles.circle, StyleUtil.getCircleColor(circleColor)]} />
    );
};

const DeviceTile = ({item, navigation}: any) => {

    function getAddr() {
        if (item?.address.length > Constants.Layout.AddressCharThreshold) {
            return item?.address.substring(0, Constants.Layout.AddressCharThreshold) + "...";
        }
        return item?.address;
    }

    function onClickHandler() {
        if (item?.id <= 0) { return; }
        navigation.navigate('ManageDevice', { device: item });
    }

    return <>
        <TouchableOpacity onPress={onClickHandler}>
            <View style={[compStyles.deviceTileBox, StyleUtil.getTileBackground()]}>
                <View style={compStyles.horizontalView}>
                    <Text style={[compStyles.deviceTileName, StyleUtil.getForegroundColor()]}>{item?.name}</Text>
                    <CircleIndicator status={item?.status} />
                </View>

                <Text style={[compStyles.deviceTileStatus, StyleUtil.getForegroundColor()]}>{getAddr()}</Text>
                <Text style={[compStyles.deviceTileStatus, StyleUtil.getForegroundColor()]}>{item?.speedLimit}</Text>
            </View>
        </TouchableOpacity>

    </>
}

export default DeviceTile;
