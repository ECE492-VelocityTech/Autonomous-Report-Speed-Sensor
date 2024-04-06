export type DeviceReq = {
    name: string;
    address: string;
    speedLimit: number;
};

export const DeviceUtil = {
    toDevice: (name: string, address: string, speedLimit: number): DeviceReq => {
        console.log("toDevice", name, address, speedLimit)
        return {
            name, address, speedLimit,
        }
    }
}
