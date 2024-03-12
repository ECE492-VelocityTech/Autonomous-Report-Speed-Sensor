import styles from "./styles.ts";
import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import SessionUtil from "../components/util/SessionUtil.ts";
import sessionUtil from "../components/util/SessionUtil.ts";
import { useFocusEffect } from "@react-navigation/native";
import StyleUtil from "../components/util/StyleUtil.ts";

const HomeScreen = ({navigation}: any) => {
    const [temp, setTemp] = useState(false);
    const determineIfSignedIn = async () => {
        let signedIn = await SessionUtil.isSignedIn();
        setTemp(signedIn)
        if (!signedIn) {
            navigation.navigate('SignIn');
        }
    }

    const signOut = async () => {
        await sessionUtil.signOut();
        await determineIfSignedIn()
    }

    useFocusEffect(() => {
        determineIfSignedIn();
    });

    return (
        <>
            <View style={[styles.container, { backgroundColor: StyleUtil.getBackgroundColor(), color: StyleUtil.getForegroundColor() }]}>
                <Text style={styles.text}>Signed In: {temp ? "true" : "false"}</Text>
                <Pressable onPress={signOut}><Text style={{color: StyleUtil.getForegroundColor()}}>SignOut</Text></Pressable>
            </View>
        </>
    )
};

export default HomeScreen;
