package com.VelocityTech.CarssBackend.ViewModel;

public class LatestSpeedResp {
    long deviceId;
    double speed;

    public LatestSpeedResp(long deviceId, double speed) {
        this.deviceId = deviceId;
        this.speed = speed;
    }

    public long getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(long deviceId) {
        this.deviceId = deviceId;
    }

    public double getSpeed() {
        return speed;
    }

    public void setSpeed(double speed) {
        this.speed = speed;
    }
}
