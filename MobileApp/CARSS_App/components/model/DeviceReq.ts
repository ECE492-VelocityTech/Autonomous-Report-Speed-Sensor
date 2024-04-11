export type DeviceReq = {
    name: string;
    address: string;
    speedLimit: number;
};

export type UpdateDeviceReq = {
    name: string;
    address: string;
    speedLimit: number;
    mode: string
}

export enum DeviceStatus {
    Active="Active",
    Standby="Standby",
    Test="Test",
}

export const DeviceUtil = {
    toDevice: (name: string, address: string, speedLimit: number): DeviceReq => {
        console.log("toDevice", name, address, speedLimit)
        return {
            name, address, speedLimit,
        }
    },

    toUpdateDeviceReq: (name: string, address: string, speedLimit: number, mode: string): UpdateDeviceReq => {
        return {
            name, address, speedLimit, mode,
        }
    },
}
