import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from '@react-native-google-signin/google-signin';
import { Text, View } from "react-native";
import React, { useState } from "react";
import { GOOGLE_ANDROID_CLIENT } from "@env"
import RestApi from "./util/RestApi.ts";
import SessionUtil from "./util/SessionUtil.ts";

GoogleSignin.configure({
    scopes: ['profile', 'email'],
    androidClientId: GOOGLE_ANDROID_CLIENT,
    // offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    // forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
    // iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    // googleServicePlistPath: '', // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
    // openIdRealm: '', // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
    // profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
});

const SignIn = ({navigation}: any) => {
    // Somewhere in your code
    const googleSignIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            console.log(JSON.stringify(userInfo));
            await SessionUtil.setUserSignedIn(userInfo);
            navigation.navigate('Home')
        } catch (error: any) {
            console.log(JSON.stringify(error))
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
            } else {
                // some other error happened
            }
        }
    };

    return (
        <>
            <View>
                <Text>Sign in with Google:</Text>
                <GoogleSigninButton
                    style={{ width: 192, height: 48 }}
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Dark}
                    onPress={googleSignIn}
                />
            </View>

        </>
    )
};

export default SignIn;
