package com.VelocityTech.CarssBackend.Model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table
public class TrafficData {

    @Id
    @SequenceGenerator(
            name = "trafficDataSequence",
            sequenceName = "trafficDataSequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "trafficDataSequence"
    )
    private Long id;
    private double speed;
    private LocalDateTime timestamp;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "device_id")
    @JsonIgnore
    private Device device;

    public TrafficData(){}

    public TrafficData(double speed, LocalDateTime timestamp, Device device) {
        this.speed = speed;
        this.timestamp = timestamp;
        this.device = device;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Device getDevice() {
        return device;
    }

    public void setDevice(Device device) {
        this.device = device;
    }
}
