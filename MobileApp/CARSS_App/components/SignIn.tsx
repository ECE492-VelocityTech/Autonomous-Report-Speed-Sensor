import {
    GoogleOneTapSignIn,
    statusCodes,
} from '@react-native-google-signin/google-signin';

// Somewhere in your code
signIn = async () => {
    try {
        const userInfo = await GoogleOneTapSignIn.signIn({
            webClientId: config.webClientId,
            iosClientId: config.iosClientId, // only needed if you're not using Firebase config file
            nonce: 'your_nonce',
        });
        setState({ userInfo });
    } catch (error) {
        if (isErrorWithCode(error)) {
            switch (error.code) {
                case statusCodes.NO_SAVED_CREDENTIAL_FOUND:
                    // no saved credential found, try creating an account
                    break;
                case statusCodes.SIGN_IN_CANCELLED:
                    // sign in was cancelled
                    break;
                case statusCodes.ONE_TAP_START_FAILED:
                    // Android and Web only, you probably have hit rate limiting. You can still call the original Google Sign In API in this case.
                    break;
                default:
                // something else happened
            }
        } else {
            // an error that's not related to google sign in occurred
        }
    }
};
