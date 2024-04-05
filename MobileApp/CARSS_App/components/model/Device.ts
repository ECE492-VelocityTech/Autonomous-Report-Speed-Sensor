type Device = {
    name: string;
    address: string;
    speedLimit: number;
};

const toDevice = (name: string, address: string, speedLimit: number): Device => {
    return {
        name, address, speedLimit,
    }
}
