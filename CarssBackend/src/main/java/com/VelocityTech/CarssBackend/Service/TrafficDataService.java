package com.VelocityTech.CarssBackend.Service;

import com.VelocityTech.CarssBackend.Model.Device;
import com.VelocityTech.CarssBackend.Model.TrafficData;
import com.VelocityTech.CarssBackend.Repository.DeviceRepository;
import com.VelocityTech.CarssBackend.Repository.TrafficDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class TrafficDataService {

    private final TrafficDataRepository trafficDataRepository;
    private final DeviceRepository deviceRepository;

    @Autowired
    public TrafficDataService(TrafficDataRepository trafficDataRepository, DeviceRepository deviceRepository) {
        this.trafficDataRepository = trafficDataRepository;
        this.deviceRepository = deviceRepository;
    }

    @Transactional
    public TrafficData createTrafficData(TrafficData trafficData, Long deviceId) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new RuntimeException("Device not found with id: " + deviceId));
        trafficData.setDevice(device);
        return trafficDataRepository.save(trafficData);
    }

    @Transactional(readOnly = true)
    public List<TrafficData> getAllTrafficData() {
        return trafficDataRepository.findAll();
    }

    @Transactional(readOnly = true)
    public TrafficData getTrafficDataById(Long id) {
        return trafficDataRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Traffic Data not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<TrafficData> findAllTrafficDataByDeviceId(Long deviceId) {
        return trafficDataRepository.findByDeviceId(deviceId);
    }


    @Transactional
    public TrafficData updateTrafficData(Long id, TrafficData updatedTrafficData) {
        return trafficDataRepository.findById(id)
                .map(trafficData -> {
                    trafficData.setSpeed(updatedTrafficData.getSpeed());
                    trafficData.setTimestamp(updatedTrafficData.getTimestamp());
                    // Optionally update device association here if required
                    return trafficDataRepository.save(trafficData);
                }).orElseThrow(() -> new RuntimeException("Traffic Data not found with id: " + id));
    }

    @Transactional
    public void deleteTrafficData(Long id) {
        trafficDataRepository.deleteById(id);
    }
}
