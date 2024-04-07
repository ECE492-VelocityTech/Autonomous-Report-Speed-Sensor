package com.VelocityTech.CarssBackend.Controller;

import com.VelocityTech.CarssBackend.Model.Device;
import com.VelocityTech.CarssBackend.Model.TrafficData;
import com.VelocityTech.CarssBackend.Service.DeviceService;
import com.VelocityTech.CarssBackend.Service.TrafficDataService;
import com.VelocityTech.CarssBackend.ViewModel.DeviceRespVM;
import com.VelocityTech.CarssBackend.ViewModel.NewDeviceReqVM;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;

import static com.VelocityTech.CarssBackend.Configuration.Constants.TimeSyncFormatter;

@RestController
@RequestMapping("/api/v1/devices")
@CrossOrigin(origins = "http://localhost:5173")
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

    @PostMapping("/create/{ownerId}")
    public ResponseEntity<Device> createDevice(@PathVariable Long ownerId, @RequestBody NewDeviceReqVM deviceVM) {
        Device newDevice = deviceService.createNewDevice(deviceVM, ownerId);
        return new ResponseEntity<>(newDevice, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Device>> getAllDevices() {
        List<Device> devices = deviceService.getAllDevices();
        return new ResponseEntity<>(devices, HttpStatus.OK);
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

    @GetMapping("/{deviceId}/trafficData/dateRange")
    public ResponseEntity<List<TrafficData>> getTrafficDataByDeviceIdAndDateRange(
            @PathVariable Long deviceId,
            @RequestParam(value = "startDate", required = true) String startDateString,
            @RequestParam(value = "endDate", required = true) String endDateString) {

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate startDate = LocalDate.parse(startDateString, formatter);
        LocalDate endDate = LocalDate.parse(endDateString, formatter);

        List<TrafficData> trafficData = trafficDataService.findTrafficDataByDeviceIdAndDateRange(deviceId, startDate, endDate);
        return new ResponseEntity<>(trafficData, HttpStatus.OK);
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<DeviceRespVM>> getAllDevicesForOwner(@PathVariable long ownerId) {
        List<DeviceRespVM> devices = deviceService.getAllDevicesForOwner(ownerId);
        return new ResponseEntity<>(devices, HttpStatus.OK);
    }

    @GetMapping("/time")
    public ResponseEntity<String> getTime() {
        LocalDateTime date = LocalDateTime.now();
        return new ResponseEntity<>(date.format(TimeSyncFormatter), HttpStatus.OK);
    }

    @GetMapping("/heartbeat/{deviceId}")
    public ResponseEntity<String> heartbeat(@PathVariable long deviceId) {
        deviceService.heartbeat(deviceId);
        return new ResponseEntity<>("Done", HttpStatus.OK);
    }
}
