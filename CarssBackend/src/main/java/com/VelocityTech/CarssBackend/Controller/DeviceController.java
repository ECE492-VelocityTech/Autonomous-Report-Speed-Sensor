package com.VelocityTech.CarssBackend.Controller;

import com.VelocityTech.CarssBackend.Model.Device;
import com.VelocityTech.CarssBackend.Model.TrafficData;
import com.VelocityTech.CarssBackend.Service.DeviceService;
import com.VelocityTech.CarssBackend.Service.TrafficDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/devices")
public class DeviceController {

    private final DeviceService deviceService;
    private final TrafficDataService trafficDataService;

    @Autowired
    public DeviceController(DeviceService deviceService, TrafficDataService trafficDataService) {
        this.deviceService = deviceService;
        this.trafficDataService = trafficDataService;
    }

    @PostMapping("/owner/{ownerId}")
    public ResponseEntity<Device> addDeviceToOwner(@PathVariable Long ownerId, @RequestBody Device device) {
        Device newDevice = deviceService.addDeviceToOwner(ownerId, device);
        return new ResponseEntity<>(newDevice, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Device>> getAllDevices() {
        List<Device> devices = deviceService.getAllDevices();
        return new ResponseEntity<>(devices, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Device> addNewDevice(@RequestBody Device device) {
        Device newDevice = deviceService.addDevice(device);
        return new ResponseEntity<>(newDevice, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Device> getDeviceById(@PathVariable Long id) {
        return deviceService.getDeviceById(id)
                .map(device -> new ResponseEntity<>(device, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Device> updateDevice(@PathVariable Long id, @RequestBody Device deviceDetails) {
        try {
            Device updatedDevice = deviceService.updateDevice(id, deviceDetails);
            return new ResponseEntity<>(updatedDevice, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDevice(@PathVariable Long id) {
        deviceService.deleteDevice(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/{deviceId}/trafficData")
    public ResponseEntity<List<TrafficData>> getTrafficDataByDeviceId(@PathVariable Long deviceId) {
        List<TrafficData> trafficData = trafficDataService.findAllTrafficDataByDeviceId(deviceId);
        return new ResponseEntity<>(trafficData, HttpStatus.OK);
    }
}
