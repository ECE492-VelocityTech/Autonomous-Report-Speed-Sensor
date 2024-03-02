package com.VelocityTech.CarssBackend.Model;
import jakarta.persistence.*;


@Entity
@Table
public class Device {

    @Id
    @SequenceGenerator(
            name = "deviceSequence",
            sequenceName = "deviceSequence",
            allocationSize = 1
    )

    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "deviceSequence"
    )

    private Long id;
    private String deviceNo;
    private String address;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "device", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TrafficData> trafficData = new ArrayList<>();

    public Device(){}

    public Device(String deviceNo) {
        this.deviceNo = deviceNo;
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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