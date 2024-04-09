package com.VelocityTech.CarssBackend.ViewModel;

import com.VelocityTech.CarssBackend.Configuration.Constants;
import com.VelocityTech.CarssBackend.Model.Device;
import com.VelocityTech.CarssBackend.Model.TrafficData;

import java.time.LocalDateTime;

public class TrafficDataReqVM {
    private double speed;
    private String timestamp;

    public TrafficDataReqVM(double speed, String timestamp) {
        this.speed = speed;
        this.timestamp = timestamp;
    }

    public TrafficData toTrafficData(Device device) {
        return new TrafficData(speed, LocalDateTime.parse(timestamp), device);
    }

    public double getSpeed() {
        return speed;
    }

    public void setSpeed(double speed) {
        this.speed = speed;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}
