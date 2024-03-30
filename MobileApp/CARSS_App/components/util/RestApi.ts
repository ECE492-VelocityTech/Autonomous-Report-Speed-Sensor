const serverURL = ""; // TODO: Fill in the server URL

const RestApi = {
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
    }
};

export default RestApi;
