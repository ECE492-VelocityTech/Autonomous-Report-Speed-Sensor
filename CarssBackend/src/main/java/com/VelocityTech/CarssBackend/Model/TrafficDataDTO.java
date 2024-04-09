package com.VelocityTech.CarssBackend.Model;

public class TrafficDataDTO {
    private String label;
    private Double averageSpeed;

    public TrafficDataDTO(String label, Double averageSpeed) {
        this.label = label;
        this.averageSpeed = averageSpeed;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public Double getAverageSpeed() {
        return averageSpeed;
    }

    public void setAverageSpeed(Double averageSpeed) {
        this.averageSpeed = averageSpeed;
    }
}
