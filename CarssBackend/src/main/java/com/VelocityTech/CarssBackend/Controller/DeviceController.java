package com.VelocityTech.CarssBackend.Controller;

import com.VelocityTech.CarssBackend.Model.Device;
import com.VelocityTech.CarssBackend.Model.DeviceMode;
import com.VelocityTech.CarssBackend.Model.TrafficData;
import com.VelocityTech.CarssBackend.Model.TrafficDataDTO;
import com.VelocityTech.CarssBackend.Service.DeviceService;
import com.VelocityTech.CarssBackend.Service.TrafficDataService;
import com.VelocityTech.CarssBackend.ViewModel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

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
    public ResponseEntity<DeviceRespVM> updateDevice(@PathVariable Long id, @RequestBody UpdateDeviceReqVM updateDeviceReqVM) {
        return new ResponseEntity<>(deviceService.updateDevice(id, updateDeviceReqVM), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDevice(@PathVariable Long id) {
        deviceService.deleteDevice(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<DeviceRespVM>> getAllDevicesForOwner(@PathVariable long ownerId) {
        List<DeviceRespVM> devices = deviceService.getAllDevicesForOwner(ownerId);
        return new ResponseEntity<>(devices, HttpStatus.OK);
    }

    @GetMapping("/time")
    public ResponseEntity<String> getTime() {
        LocalDateTime date = LocalDateTime.now(ZoneId.of("America/Edmonton"));
        String formattedTime = date.format(TimeSyncFormatter);
        return new ResponseEntity<>(formattedTime, HttpStatus.OK);
    }

    @GetMapping("/heartbeat/{deviceId}")
    public ResponseEntity<String> heartbeat(@PathVariable long deviceId) {
        DeviceMode deviceMode = deviceService.heartbeat(deviceId);
        return new ResponseEntity<>(deviceMode.name(), HttpStatus.OK);
    }

    @GetMapping("/getLatestSpeed/{deviceId}")
    public ResponseEntity<TrafficDataRespVM> getLatestSpeed(@PathVariable long deviceId) {
        TrafficDataRespVM trafficDataRespVM = deviceService.getLatestSpeed(deviceId);
        return new ResponseEntity<>(trafficDataRespVM, HttpStatus.OK);
    }

    @GetMapping("/{deviceId}/trafficData")
    public ResponseEntity<List<TrafficDataDTO>> readTrafficDataByDeviceAndFilter(
            @PathVariable Long deviceId,
            @RequestParam(value = "date", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(value = "dayOfTheWeek", required = false) String dayOfTheWeek) {

        if (date != null) {
            return ResponseEntity.ok(trafficDataService.filterTrafficDataByDeviceAndDate(deviceId, date));
        } else if (startDate != null && endDate != null) {
            return ResponseEntity.ok(trafficDataService.findTrafficDataByDeviceIdAndDateRange(deviceId, startDate, endDate));
        } else if (dayOfTheWeek != null) {
            return ResponseEntity.ok(trafficDataService.findAverageSpeedByDayOfWeek(deviceId));
        } else {
            return ResponseEntity.ok(trafficDataService.findAllTrafficDataByDeviceId(deviceId));
        }
    }


}
