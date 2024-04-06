export type Device = {
    name: string;
    address: string;
    speedLimit: number;
};

export const DeviceUtil = {
    toDevice: (name: string, address: string, speedLimit: number): Device => {
        console.log("toDevice", name, address, speedLimit)
        return {
            name, address, speedLimit,
        }
    }
}
