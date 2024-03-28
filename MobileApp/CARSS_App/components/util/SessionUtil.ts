import { GoogleSignin } from "@react-native-google-signin/google-signin";


const SessionUtil = {
    isSignedIn: async () => {
        return await GoogleSignin.isSignedIn();
    },

    signOut: async () => {
        try {
            await GoogleSignin.signOut();
            return true;
        } catch (_) {
            return false;
        }
    },

    getCurrentUser: async () => {
        return await GoogleSignin.getCurrentUser();
    },
};

export default SessionUtil;
