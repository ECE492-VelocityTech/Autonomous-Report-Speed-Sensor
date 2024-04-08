package com.VelocityTech.CarssBackend.Service;

import com.VelocityTech.CarssBackend.Model.Device;
import com.VelocityTech.CarssBackend.Model.TrafficData;
import com.VelocityTech.CarssBackend.Repository.DeviceRepository;
import com.VelocityTech.CarssBackend.Repository.TrafficDataRepository;
import com.VelocityTech.CarssBackend.ViewModel.TrafficDataReqVM;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

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

    public Device createTrafficDataBatch(List<TrafficDataReqVM> trafficDataList, Long deviceId) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Device not found with id: " + deviceId));
        List<TrafficData> trafficData = trafficDataList.stream().map(trafficDataReqVM -> trafficDataReqVM.toTrafficData(device))
                .toList();
        trafficDataRepository.saveAll(trafficData);
        return device;
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

    @Transactional(readOnly = true)
    public List<TrafficData> filterTrafficDataByDate(LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay(); // Start of the day
        LocalDateTime endOfDay = date.plusDays(1).atStartOfDay().minusSeconds(1);

        return trafficDataRepository.findByTimestampBetween(startOfDay, endOfDay);
    }

    @Transactional(readOnly = true)
    public List<TrafficData> findTrafficDataBetweenDates(LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.plusDays(1).atStartOfDay().minusNanos(1);

        return trafficDataRepository.findByTimestampBetween(startDateTime, endDateTime);
    }

    @Transactional(readOnly = true)
    public List<TrafficData> findTrafficDataByYear(Integer year) {
        LocalDateTime startOfYear = LocalDate.of(year, 1, 1).atStartOfDay();
        LocalDateTime endOfYear = LocalDate.of(year, 1, 1).plusYears(1).atStartOfDay().minusNanos(1);

        return trafficDataRepository.findByTimestampBetween(startOfYear, endOfYear);
    }

    @Transactional
    public TrafficData updateTrafficData(Long id, TrafficData updatedTrafficData) {
        return trafficDataRepository.findById(id)
                .map(trafficData -> {
                    if (updatedTrafficData.getSpeed() != 0.0)
                        trafficData.setSpeed(updatedTrafficData.getSpeed());
                    if (updatedTrafficData.getTimestamp() != null)
                        trafficData.setTimestamp(updatedTrafficData.getTimestamp());
                    // Optionally update device association here if required
                    return trafficDataRepository.save(trafficData);
                }).orElseThrow(() -> new RuntimeException("Traffic Data not found with id: " + id));
    }

    @Transactional
    public void deleteTrafficData(Long id) {
        trafficDataRepository.deleteById(id);
    }

    @Transactional
    public List<TrafficData> findTrafficDataByDeviceIdAndDateRange(Long deviceId, LocalDate startDate, LocalDate endDate) {

        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.plusDays(1).atStartOfDay().minusNanos(1);

        return trafficDataRepository.findByDeviceIdAndTimestampBetween(deviceId, startDateTime, endDateTime);
    }
}
