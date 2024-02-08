package com.VelocityTech.CarssBackend.Controller;

import com.VelocityTech.CarssBackend.Model.TrafficData;
import com.VelocityTech.CarssBackend.Service.TrafficDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/trafficData")
public class TrafficDataController {

    private TrafficDataService trafficDataService;
    @Autowired
    public TrafficDataController (TrafficDataService trafficDataService){
        this.trafficDataService = trafficDataService;
    }

    @GetMapping
    public List<TrafficData> getTrafficData(){
        return trafficDataService.getTrafficData();
    }

    @PostMapping
    public void addNewTrafficData(@RequestBody TrafficData trafficData){
        trafficDataService.addNewTrafficData(trafficData);
    }
}
