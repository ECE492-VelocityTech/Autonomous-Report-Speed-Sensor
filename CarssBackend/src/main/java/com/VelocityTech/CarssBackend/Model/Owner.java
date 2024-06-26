package com.VelocityTech.CarssBackend.Model;
import jakarta.persistence.*;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "owner")
public class Owner {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "OwnerSequence")
    @SequenceGenerator(name = "OwnerSequence", sequenceName = "OwnerSequence", allocationSize = 1)
    private Long id;

    @Column(unique = true)
    private String email;
    private String address;
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Device> devices = new ArrayList<>();

    public Owner(){}

    public Owner(String email, String address) {
        this.email = email;
        this.address = address;
    }

    public Long getId() {return id;}

    public void setId(Long id) {this.id = id;}

    public String getEmail() {return email;}

    public void setEmail(String email) {this.email = email;}

    public String getAddress() {return address;}

    public void setAddress(String address) {this.address = address;}

    public List<Device> getDevices() {
        return devices;
    }

    public void setDevices(List<Device> devices) {
        this.devices = devices;
    }

    public void addDevice(Device device) {
        devices.add(device);
        device.setOwner(this);
    }

    public void removeDevice(Device device) {
        devices.remove(device);
        device.setOwner(null);
    }

}