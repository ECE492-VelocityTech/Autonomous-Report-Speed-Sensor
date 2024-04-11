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

    public static boolean isTrafficDataRecent(LocalDateTime dataTime) {
        System.out.println("isTrafficDataRecent: " + Duration.between(dataTime, LocalDateTime.now()).getSeconds());
        System.out.println("isTrafficDataRecent: " + Constants.RecentTrafficDataTime.getSeconds());
        System.out.println("isTrafficDataRecent: " + dataTime.toString());
        System.out.println("isTrafficDataRecent: " + LocalDateTime.now().toString());
        return Duration.between(dataTime, LocalDateTime.now()).compareTo(Constants.RecentTrafficDataTime) < 0;
    }
}
