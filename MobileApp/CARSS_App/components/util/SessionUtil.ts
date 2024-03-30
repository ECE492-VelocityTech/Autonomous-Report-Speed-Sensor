import { GoogleSignin, User } from "@react-native-google-signin/google-signin";

let cacheCurrentUser: User | null = null;

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

    getCacheCurrentUser: function() {
        return cacheCurrentUser;
    },

    setCacheCurrentUser: function(user: User) {
        cacheCurrentUser = user;
    }
};

export default SessionUtil;
