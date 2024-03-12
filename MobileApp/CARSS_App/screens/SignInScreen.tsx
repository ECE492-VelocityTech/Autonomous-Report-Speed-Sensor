import React, { useState } from "react";
import SessionUtil from "../components/util/SessionUtil.ts";
import { Text, View } from "react-native";
import styles from "./styles.ts";
import SignIn from "../components/SignIn.tsx";

const SignInScreen = ({navigation}: any) => {
    const [temp, setTemp] = useState(false);
    const determineIfSignedIn = async () => {
        let signedIn = await SessionUtil.isSignedIn();
        setTemp(signedIn)
    }

    return (
        <>
            <View style={styles.container}>
                <SignIn navigation={navigation}/>
            </View>
        </>
    )
};

export default SignInScreen;
