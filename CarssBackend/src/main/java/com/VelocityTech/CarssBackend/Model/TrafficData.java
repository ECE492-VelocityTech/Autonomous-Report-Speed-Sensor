package com.VelocityTech.CarssBackend.Model;
import jakarta.persistence.*;
import java.time.LocalDateTime;

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
    private String direction;

    public TrafficData(){}

    public TrafficData(double speed, String direction, LocalDateTime timestamp) {
        this.speed = speed;
        this.direction = direction;
        this.timestamp = timestamp;
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

    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }
}
