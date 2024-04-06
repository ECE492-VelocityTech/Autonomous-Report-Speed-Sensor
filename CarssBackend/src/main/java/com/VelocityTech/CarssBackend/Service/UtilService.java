package com.VelocityTech.CarssBackend.Service;

import com.VelocityTech.CarssBackend.Configuration.Constants;
import com.VelocityTech.CarssBackend.Model.DeviceStatus;

import java.time.Duration;
import java.time.LocalDateTime;

public class UtilService {
    public static DeviceStatus getDeviceStatus(LocalDateTime lastPingTime) {
        if (Duration.between(lastPingTime, LocalDateTime.now()).compareTo(Constants.ReachableThresholdTime) > 0) {
            return DeviceStatus.Unreachable;
        }
        return DeviceStatus.Reachable;
    }
}
