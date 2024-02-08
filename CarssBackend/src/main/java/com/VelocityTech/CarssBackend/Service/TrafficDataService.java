package com.VelocityTech.CarssBackend.Service;

import com.VelocityTech.CarssBackend.Model.TrafficData;
import com.VelocityTech.CarssBackend.Repository.TrafficDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrafficDataService {

    private final TrafficDataRepository trafficDataRepository;

    @Autowired
    public TrafficDataService(TrafficDataRepository trafficDataRepository){
        this.trafficDataRepository = trafficDataRepository;
    }

    public List<TrafficData> getTrafficData(){
        return trafficDataRepository.findAll();
    }

    public void addNewTrafficData(TrafficData trafficData){
        trafficDataRepository.save(trafficData);
    }
}
