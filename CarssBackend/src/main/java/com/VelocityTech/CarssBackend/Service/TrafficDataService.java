package com.VelocityTech.CarssBackend.Service;

import com.VelocityTech.CarssBackend.Model.TrafficData;
import com.VelocityTech.CarssBackend.Repository.TrafficDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TrafficDataService {

    private TrafficDataRepository trafficDataRepository;

    @Autowired
    public TrafficDataService(TrafficDataRepository trafficDataRepository){
        this.trafficDataRepository = trafficDataRepository;
    }

    public List<TrafficData> getTrafficData(){

        return trafficDataRepository.findAll();
    }

    public TrafficData addNewTrafficData(TrafficData trafficData){

        return trafficDataRepository.save(trafficData);
    }

    @Transactional(readOnly = true)
    public List<TrafficData> getTrafficDataByDeviceId(Long deviceId) {
        return trafficDataRepository.findByDeviceId(deviceId);
    }
}
