package com.VelocityTech.CarssBackend.Service;

import com.VelocityTech.CarssBackend.Model.Device;
import com.VelocityTech.CarssBackend.Model.Owner;
import com.VelocityTech.CarssBackend.Repository.DeviceRepository;
import com.VelocityTech.CarssBackend.Repository.OwnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class DeviceService {

    private final DeviceRepository deviceRepository;
    private final OwnerRepository ownerRepository;

    @Autowired
    public DeviceService(DeviceRepository deviceRepository, OwnerRepository ownerRepository) {
        this.deviceRepository = deviceRepository;
        this.ownerRepository = ownerRepository;
    }

    @Transactional
    public Device addDeviceToOwner(Long ownerId, Device device) {
        Owner owner = ownerRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found with id: " + ownerId));
        device.setOwner(owner);
        return deviceRepository.save(device);
    }

    @Transactional(readOnly = true)
    public List<Device> getAllDevices() {
        return deviceRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Device> getDeviceById(Long id) {
        return deviceRepository.findById(id);
    }

    @Transactional
    public Device updateDevice(Long id, Device deviceDetails) {
        return deviceRepository.findById(id)
                .map(device -> {
                    device.setDeviceNo(deviceDetails.getDeviceNo());
                    device.setAddress(deviceDetails.getAddress());
                    // Update additional fields here
                    return deviceRepository.save(device);
                }).orElseThrow(() -> new RuntimeException("Device not found with id: " + id));
    }

    @Transactional
    public void deleteDevice(Long id) {
        deviceRepository.deleteById(id);
    }
}
