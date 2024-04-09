package com.VelocityTech.CarssBackend.ViewModel;

import com.VelocityTech.CarssBackend.Configuration.Constants;
import com.VelocityTech.CarssBackend.Model.Device;
import com.VelocityTech.CarssBackend.Model.Owner;

import java.time.LocalDateTime;
import java.util.Date;

public class NewDeviceReqVM {
    private String name;
    private String address;
    private float speedLimit;

    public NewDeviceReqVM(String name, String address, float speedLimit) {
        this.name = name;
        this.address = address;
        this.speedLimit = speedLimit;
    }

//    public DeviceVM() {
//    }

    public Device toDevice(Owner owner) {
        return new Device(name, address, speedLimit, owner, Constants.NullTime);
    }
}
