const serverURL = ""; // TODO: Fill in the server URL

const RestApi = {
    /**
     * Tells the backend that a user has signed In
     */
    ownerSignIn: async function(email: string, address: string) {
        const url = `${serverURL}/signIn`;
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
    addDevice: async function(ownerId: number, device: Device) {
        const url = `${serverURL}/devices/owner/${ownerId}`;
        const body = {
            device,
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
        return await response.json();
        // TODO: Handle error
    },
};

export default RestApi;
