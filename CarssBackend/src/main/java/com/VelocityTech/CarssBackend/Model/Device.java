package com.VelocityTech.CarssBackend.Model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;
import java.util.ArrayList;



@Entity
@Table(name = "device")
public class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "deviceSequence")
    @SequenceGenerator(name = "deviceSequence", sequenceName = "deviceSequence", allocationSize = 1)
    private Long id;

    private String deviceNo;
    private String address;

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
}