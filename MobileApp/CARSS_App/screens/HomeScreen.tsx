import styles from "./styles.ts";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import SessionUtil from "../components/util/SessionUtil.ts";
import sessionUtil from "../components/util/SessionUtil.ts";
import { useFocusEffect } from "@react-navigation/native";
import StyleUtil from "../components/util/StyleUtil.ts";
import { User } from "@react-native-google-signin/google-signin";
import AddDeviceButton from "../components/AddDeviceButton.tsx";
import RestApi from "../components/util/RestApi.ts";
import signIn from "../components/SignIn.tsx";
import compStyles from "../components/compStyles.ts";
import { DeviceReq } from "../components/model/DeviceReq.ts";
import DeviceTile from "../components/DeviceTile.tsx";
import { DeviceResp } from "../components/model/DeviceResp.ts";

const HomeScreen = ({navigation}: any) => {
    const [currentUser, setCurrentUser] = useState<User>();
    const [devices, setDevices] = useState<DeviceResp[]>();

    const determineIfSignedIn = async () => {
        let signedIn = await SessionUtil.isSignedIn();
        if (!signedIn) {
            navigation.navigate('SignIn');
        }
        let signedInUser = await sessionUtil.getCurrentUser();
        if (signedInUser) {
            setCurrentUser(signedInUser);
            await SessionUtil.setUserSignedIn(signedInUser);
            // TODO Remove
            console.log("Set Current User Id: ", SessionUtil.getCacheCurrentUserId())
            await showDevicesForOwner();
            return true;
        }
        else {
            navigation.navigate('SignIn');
            return false;
        }
    }

    const signOut = async () => {
        await sessionUtil.signOut();
        await determineIfSignedIn()
    }

    const showDevicesForOwner = async () => {
        let userDevices = await RestApi.getAllDevicesForOwner(sessionUtil.getCacheCurrentUserId())
        console.log("showDevicesForOwner", userDevices)
        if (userDevices) {
            setDevices(userDevices);
        }
    }

    const initHomePage = async function() {
        let signedIn = await determineIfSignedIn();
        if (!signedIn) { return; }

    }

    useFocusEffect(React.useCallback(() => {
        showDevicesForOwner();
        initHomePage();
    }, []));

    const getCurrentUserName = function() {
        if (currentUser) { return currentUser.user.givenName }
        return "___";
    }

    return (
        <>
            <View style={[styles.container, StyleUtil.getBackgroundColor()]}>
                <Text style={styles.text}>Signed In: {getCurrentUserName()}</Text>

                <SafeAreaView style={compStyles.sectionContainer}>
                    <FlatList
                        data={devices}
                        renderItem={({item}) => <DeviceTile item={item} navigation={navigation}/>}
                        keyExtractor={item => item.id.toString()}
                    />
                </SafeAreaView>
                <AddDeviceButton navigation={navigation}/>
            </View>
        </>
    )
};

export default HomeScreen;
