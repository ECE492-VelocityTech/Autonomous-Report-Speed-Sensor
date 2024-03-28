import styles from "./styles.ts";
import React, { useEffect, useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import SessionUtil from "../components/util/SessionUtil.ts";
import sessionUtil from "../components/util/SessionUtil.ts";
import { useFocusEffect } from "@react-navigation/native";
import StyleUtil from "../components/util/StyleUtil.ts";
import { User } from "@react-native-google-signin/google-signin";
import AddDeviceButton from "../components/AddDeviceButton.tsx";

const HomeScreen = ({navigation}: any) => {
    const [currentUser, setCurrentUser] = useState<User>();

    const determineIfSignedIn = async () => {
        let signedIn = await SessionUtil.isSignedIn();
        if (!signedIn) {
            navigation.navigate('SignIn');
        }
        let signedInUser = await sessionUtil.getCurrentUser();
        if (signedInUser) { setCurrentUser(signedInUser); }
        else { navigation.navigate('SignIn'); }
    }

    const signOut = async () => {
        await sessionUtil.signOut();
        await determineIfSignedIn()
    }

    useFocusEffect(() => {
        determineIfSignedIn();
    });

    const getCurrentUserName = function() {
        if (currentUser) { return currentUser.user.givenName }
        return "___";
    }

    return (
        <>
            <View style={[styles.container, StyleUtil.getBackgroundColor()]}>
                <Text style={styles.text}>Signed In: {getCurrentUserName()}</Text>
                <Pressable onPress={signOut}><Text style={StyleUtil.getForegroundColor()}>SignOut</Text></Pressable>

                <AddDeviceButton navigation={navigation}/>
            </View>
        </>
    )
};

export default HomeScreen;
