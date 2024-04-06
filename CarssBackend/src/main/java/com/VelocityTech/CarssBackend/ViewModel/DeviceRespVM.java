package com.VelocityTech.CarssBackend.ViewModel;

import com.VelocityTech.CarssBackend.Model.Device;
import com.VelocityTech.CarssBackend.Model.DeviceMode;
import com.VelocityTech.CarssBackend.Model.DeviceStatus;
import com.VelocityTech.CarssBackend.Service.UtilService;

public class DeviceRespVM {
    private Long id;
    private String name;
    private String address;
    private float speedLimit;
    private DeviceMode mode;
    private DeviceStatus status;

    public DeviceRespVM(long id, String name, String address, float speedLimit, DeviceMode mode, DeviceStatus status) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.speedLimit = speedLimit;
        this.mode = mode;
        this.status = status;
    }

    public static DeviceRespVM fromDevice(Device device) {
        return new DeviceRespVM(device.getId(), device.getName(), device.getAddress(), device.getSpeedLimit(), device.getDeviceMode(),
                UtilService.getDeviceStatus(device.getLastPingTime()));
    }

    public String getName() {
        return name;
    }

    public String getAddress() {
        return address;
    }

    public float getSpeedLimit() {
        return speedLimit;
    }

    public Long getId() {
        return this.id;
    }

    public DeviceMode getMode() {
        return mode;
    }

    public DeviceStatus getStatus() {
        return status;
    }
}
