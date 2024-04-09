package com.VelocityTech.CarssBackend.ViewModel;

import com.VelocityTech.CarssBackend.Model.Device;
import com.VelocityTech.CarssBackend.Model.DeviceMode;

public class UpdateDeviceReqVM {
    private String name;
    private String address;
    private float speedLimit;
    private DeviceMode mode;

    public UpdateDeviceReqVM(String name, String address, float speedLimit, DeviceMode mode) {
        this.name = name;
        this.address = address;
        this.speedLimit = speedLimit;
        this.mode = mode;
    }

    // Doesn't update address
    public void updateDevice(Device device) {
        device.setName(name);
         device.setSpeedLimit(speedLimit);
        if(mode != null) { device.setDeviceMode(mode); }
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public float getSpeedLimit() {
        return speedLimit;
    }

    public void setSpeedLimit(float speedLimit) {
        this.speedLimit = speedLimit;
    }

    public DeviceMode getMode() {
        return mode;
    }

    public void setMode(DeviceMode mode) {
        this.mode = mode;
    }
}
