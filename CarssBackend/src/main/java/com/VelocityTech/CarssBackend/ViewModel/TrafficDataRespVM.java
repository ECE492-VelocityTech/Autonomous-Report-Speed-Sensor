package com.VelocityTech.CarssBackend.ViewModel;

import com.VelocityTech.CarssBackend.Model.TrafficData;

import java.time.LocalDateTime;

public class TrafficDataRespVM {
    private double speed;
    private LocalDateTime timestamp;

    public TrafficDataRespVM(double speed, LocalDateTime timestamp) {
        this.speed = speed;
        this.timestamp = timestamp;
    }

    public static TrafficDataRespVM fromTrafficData(TrafficData td) {
        return new TrafficDataRespVM(td.getSpeed(), td.getTimestamp());
    }

    public double getSpeed() {
        return speed;
    }

    public void setSpeed(double speed) {
        this.speed = speed;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
