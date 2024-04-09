package com.VelocityTech.CarssBackend.Service;

import com.VelocityTech.CarssBackend.Model.Device;
import com.VelocityTech.CarssBackend.Model.TrafficData;
import com.VelocityTech.CarssBackend.Model.TrafficDataDTO;
import com.VelocityTech.CarssBackend.Repository.DeviceRepository;
import com.VelocityTech.CarssBackend.Repository.TrafficDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

import java.time.temporal.ChronoField;
import java.util.stream.Collectors;

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
    public List<TrafficDataDTO> findAllTrafficDataByDeviceId(Long deviceId) {
        List<TrafficData> trafficDataList = trafficDataRepository.findByDeviceId(deviceId);

        return trafficDataList.stream()
                .map(data -> new TrafficDataDTO(data.getTimestamp().toString(), data.getSpeed()))
                .collect(Collectors.toList());
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
    public List<TrafficDataDTO> filterTrafficDataByDeviceAndDate(Long deviceId, LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay(); // Start of the day
        LocalDateTime endOfDay = date.plusDays(1).atStartOfDay().minusSeconds(1);

        List<TrafficData> trafficDataList = trafficDataRepository.findByDeviceIdAndTimestampBetween(deviceId, startOfDay, endOfDay);

        Map<Integer, Double> calculatedAverages = trafficDataList.stream()
                .collect(Collectors.groupingBy(
                        trafficData -> trafficData.getTimestamp().getHour(),
                        Collectors.averagingDouble(TrafficData::getSpeed)
                ));
        List<TrafficDataDTO> trafficDataByHour = new ArrayList<>();
        for (int hour = 0; hour < 24; hour++) {
            Double averageSpeed = calculatedAverages.getOrDefault(hour, 0.0);
            trafficDataByHour.add(new TrafficDataDTO(String.format("%02d:00", hour), averageSpeed));
        }

        return trafficDataByHour;
    }


    @Transactional
    public List<TrafficDataDTO> findTrafficDataByDeviceIdAndDateRange(Long deviceId, LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.plusDays(1).atStartOfDay().minusNanos(1);
        List<TrafficData> trafficDataList = trafficDataRepository.findByDeviceIdAndTimestampBetween(deviceId, startDateTime, endDateTime);
        Map<LocalDate, Double> averageSpeedByDate = trafficDataList.stream()
                .collect(Collectors.groupingBy(
                        trafficData -> trafficData.getTimestamp().toLocalDate(),
                        Collectors.averagingDouble(TrafficData::getSpeed)
                ));

        List<TrafficDataDTO> trafficDataDTOList = new ArrayList<>();

        LocalDate currentDate = startDate;
        while (!currentDate.isAfter(endDate)) {
            Double averageSpeed = averageSpeedByDate.getOrDefault(currentDate, 0.0);
            trafficDataDTOList.add(new TrafficDataDTO(currentDate.toString(), averageSpeed));
            currentDate = currentDate.plusDays(1);
        }
        return trafficDataDTOList;
    }

    @Transactional
    public List<TrafficDataDTO> findAverageSpeedByDayOfWeek(Long deviceId) {
        List<TrafficData> trafficDataList = trafficDataRepository.findByDeviceId(deviceId);

        double[] sumSpeeds = new double[7];
        int[] counts = new int[7];

        trafficDataList.forEach(data -> {
            int dayIndex = data.getTimestamp().getDayOfWeek().getValue() - 1;
            sumSpeeds[dayIndex] += data.getSpeed();
            counts[dayIndex]++;
        });

        return Arrays.stream(DayOfWeek.values())
                .map(day -> new TrafficDataDTO(day.name(), counts[day.getValue() - 1] > 0 ? sumSpeeds[day.getValue() - 1] / counts[day.getValue() - 1] : 0))
                .collect(Collectors.toList());
    }


}
