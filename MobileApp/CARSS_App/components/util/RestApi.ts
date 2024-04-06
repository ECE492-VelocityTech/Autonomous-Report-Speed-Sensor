import { DeviceReq } from "../model/DeviceReq.ts";

const serverURL = "http://129.128.215.79/api/v1"; // TODO: Fill in the server URL

const RestApi = {
    /**
     * Tells the backend that a user has signed In
     */
    ownerSignIn: async function(email: string, address: string) {
        const url = `${serverURL}/owners/signIn`;
        const body = {
            email,
            address,
        }
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        return await response.json();
        // TODO: Handle error
    },

    /**
     * Adds new device to the given owner
     */
    addDevice: async function(ownerId: number, device: DeviceReq) {
        console.log("addDevice", ownerId, device);
        const url = `${serverURL}/devices/create/${ownerId}`;
        const body = device;
        console.log("addDevice", device)
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        if (response.ok) {
            return await response.json();
        } else {
            return {id: -1}
        }

        // TODO: Handle error
    },

    /**
     * Gets all the devices for the given owner
     */
    getAllDevicesForOwner: async function(ownerId: number) {
        const url = `${serverURL}/devices/owner/${ownerId}`;
        const response = await fetch(url, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            return await response.json();
        }
        console.log("getAllDevicesForOwner ERR")
        return [];
    },
};

export default RestApi;
