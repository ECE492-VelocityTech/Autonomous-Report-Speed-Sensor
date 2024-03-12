package com.VelocityTech.CarssBackend.Controller;

import com.VelocityTech.CarssBackend.Model.TrafficData;
import com.VelocityTech.CarssBackend.Service.TrafficDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;


import java.util.List;

@RestController
@RequestMapping("/api/v1/trafficData")
@CrossOrigin(origins = "http://localhost:5173")
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
    public ResponseEntity<TrafficData> readTrafficDataById(@PathVariable Long id) {
        TrafficData trafficData = trafficDataService.getTrafficDataById(id);
        return new ResponseEntity<>(trafficData, HttpStatus.OK);
    }

    @GetMapping("/date")
    public ResponseEntity<List<TrafficData>> readTrafficDataByDate(@RequestParam(value = "date", required = true) String dateString) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate date = LocalDate.parse(dateString, formatter);
        List<TrafficData> trafficData =  trafficDataService.filterTrafficDataByDate(date);
        return new ResponseEntity<>(trafficData, HttpStatus.OK);
    }
    @GetMapping("/dateRange")
    public ResponseEntity<List<TrafficData>> readTrafficDataByDateRange(
            @RequestParam(value = "startDate", required = true) String startDateString,
            @RequestParam(value = "endDate", required = true) String endDateString) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        LocalDate startDate = LocalDate.parse(startDateString, formatter);
        LocalDate endDate = LocalDate.parse(endDateString, formatter);

        List<TrafficData> trafficData =  trafficDataService.findTrafficDataBetweenDates(startDate, endDate);
        return new ResponseEntity<>(trafficData, HttpStatus.OK);
    }

    @GetMapping("/year")
    public ResponseEntity<List<TrafficData>> readTrafficDataByYear(@RequestParam(value = "year", required = true) String year) {
        List<TrafficData> trafficData = trafficDataService.findTrafficDataByYear(Integer.parseInt(year));

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
