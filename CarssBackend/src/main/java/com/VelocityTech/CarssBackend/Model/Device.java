package com.VelocityTech.CarssBackend.Model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "device")
public class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "deviceSequence")
    @SequenceGenerator(name = "deviceSequence", sequenceName = "deviceSequence", allocationSize = 1)
    private Long id;
    private String deviceNo;
    private String address;
    private double lat;
    private double lng;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    @JsonIgnore
    private Owner owner;

    @OneToMany(mappedBy = "device", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TrafficData> trafficData = new ArrayList<>();

    public Device(){}

    public Device(String deviceNo, String address, Owner owner) {
        this.deviceNo = deviceNo;
        this.address = address;
        this.owner = owner;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDeviceNo() {
        return deviceNo;
    }

    public void setDeviceNo(String deviceNo) {
        this.deviceNo = deviceNo;
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
}