package com.VelocityTech.CarssBackend.Model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


@Entity
@Table(name = "device")
public class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "deviceSequence")
    @SequenceGenerator(name = "deviceSequence", sequenceName = "deviceSequence", allocationSize = 1)
    private Long id;
    private String name;
    private String address;
    private float speedLimit;
    private double lat;
    private double lng;
    private LocalDateTime lastPingTime;
    private DeviceMode deviceMode = DeviceMode.Active;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    @JsonIgnore
    private Owner owner;

    @OneToMany(mappedBy = "device", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TrafficData> trafficData = new ArrayList<>();

    public Device(){}

    public Device(String name, String address, float speedLimit, Owner owner, LocalDateTime lastPingTime) {
        this.name = name;
        this.address = address;
        this.owner = owner;
        this.speedLimit = speedLimit;
        this.lastPingTime = lastPingTime;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Owner getOwner() {
        return owner;
    }

    public void setOwner(Owner owner) {
        this.owner = owner;
    }

    public List<TrafficData> getTrafficData() {
        return trafficData;
    }

    public void setTrafficData(List<TrafficData> trafficData) {
        this.trafficData = trafficData;
    }

    public void addTrafficData(TrafficData data) {
        trafficData.add(data);
        data.setDevice(this);
    }

    public LocalDateTime getLastPingTime() {
        return lastPingTime;
    }

    public void setLastPingTime(LocalDateTime lastPingTime) {
        this.lastPingTime = lastPingTime;
    }

    public DeviceMode getDeviceMode() {
        return deviceMode;
    }

    public void setDeviceMode(DeviceMode deviceMode) {
        this.deviceMode = deviceMode;
    }

    public void removeTrafficData(TrafficData data) {
        trafficData.remove(data);
        data.setDevice(null);
    }

    public double getLat() {
        return lat;
    }

    public void setLat(double lat) {
        this.lat = lat;
    }

    public double getLng() {
        return lng;
    }

    public void setLng(double lng) {
        this.lng = lng;
    }

    public float getSpeedLimit() {
        return speedLimit;
    }

    public void setSpeedLimit(float speedLimit) {
        this.speedLimit = speedLimit;
    }
}