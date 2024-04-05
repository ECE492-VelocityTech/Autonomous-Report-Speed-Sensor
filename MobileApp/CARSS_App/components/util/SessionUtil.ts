import { GoogleSignin, User } from "@react-native-google-signin/google-signin";
import RestApi from "./RestApi.ts";

let cacheCurrentUser: User | null = null;
let cacheCurrentUserId: number = -1;
let cacheUserDevices: Device[] = []

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
    },

    getCacheCurrentUserId: function() {
        return cacheCurrentUserId;
    },

    setCacheCurrentUserId: function(userId: number) {
        cacheCurrentUserId = userId;
    },

    getCacheDevices: function() {
        return cacheUserDevices;
    },

    setCacheDevices: function(devices: Device[]) {
        cacheUserDevices = devices
    },

    /**
     * Sets the state for the current signed in user
     */
    setUserSignedIn: async function(user: User) {
        let ownerResp = await RestApi.ownerSignIn(user.user.email, "");
        console.log("ownerResp", ownerResp)
        if (!ownerResp) { return; } // TODO: Handle error
        SessionUtil.setCacheCurrentUser(user);
        SessionUtil.setCacheCurrentUserId(ownerResp.id);
    }
};

export default SessionUtil;
