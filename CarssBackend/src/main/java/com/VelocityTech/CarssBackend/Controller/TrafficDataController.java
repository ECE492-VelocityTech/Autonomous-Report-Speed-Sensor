package com.VelocityTech.CarssBackend.Controller;

import com.VelocityTech.CarssBackend.Model.TrafficData;
import com.VelocityTech.CarssBackend.Service.TrafficDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/trafficData")
public class TrafficDataController {

    private final TrafficDataService trafficDataService;

    @Autowired
    public TrafficDataController(TrafficDataService trafficDataService) {
        this.trafficDataService = trafficDataService;
    }

    @PostMapping("/device/{deviceId}")
    public ResponseEntity<TrafficData> addTrafficData(@PathVariable Long deviceId, @RequestBody TrafficData trafficData) {
        TrafficData savedTrafficData = trafficDataService.createTrafficData(trafficData, deviceId);
        return new ResponseEntity<>(savedTrafficData, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<TrafficData>> getAllTrafficData() {
        List<TrafficData> trafficData = trafficDataService.getAllTrafficData();
        return new ResponseEntity<>(trafficData, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrafficData> getTrafficDataById(@PathVariable Long id) {
        TrafficData trafficData = trafficDataService.getTrafficDataById(id);
        return new ResponseEntity<>(trafficData, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TrafficData> updateTrafficData(@PathVariable Long id, @RequestBody TrafficData trafficData) {
        TrafficData updatedTrafficData = trafficDataService.updateTrafficData(id, trafficData);
        return new ResponseEntity<>(updatedTrafficData, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteTrafficData(@PathVariable Long id) {
        trafficDataService.deleteTrafficData(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
