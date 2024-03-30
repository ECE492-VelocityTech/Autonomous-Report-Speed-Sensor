type Device = {
    deviceNo: string;
    address: string;
    lat: number;
    lng: number;
};

const toDevice = (deviceNo: string, address: string, lat: number, lng: number): Device => {
    return {
        deviceNo, address, lat, lng,
    }
}
