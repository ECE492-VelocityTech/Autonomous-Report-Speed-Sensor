package com.VelocityTech.CarssBackend.Service;

import com.VelocityTech.CarssBackend.Model.*;
import com.VelocityTech.CarssBackend.Repository.DeviceRepository;
import com.VelocityTech.CarssBackend.Repository.OwnerRepository;
import com.VelocityTech.CarssBackend.Repository.TrafficDataRepository;
import com.VelocityTech.CarssBackend.ViewModel.DeviceRespVM;
import com.VelocityTech.CarssBackend.ViewModel.NewDeviceReqVM;
import com.VelocityTech.CarssBackend.ViewModel.UpdateDeviceReqVM;
import org.hibernate.sql.Update;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.json.JSONObject;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DeviceService {

    private final DeviceRepository deviceRepository;
    private final OwnerRepository ownerRepository;

    private final TrafficDataRepository trafficDataRepository;

    @Value("${google.api.key}")
    private String googleApiKey;

    @Autowired
    public DeviceService(DeviceRepository deviceRepository, OwnerRepository ownerRepository, TrafficDataRepository trafficDataRepository) {
        this.deviceRepository = deviceRepository;
        this.ownerRepository = ownerRepository;
        this.trafficDataRepository = trafficDataRepository;
    }

    @Transactional
    public Device addDevice(Device device) {
        Coordinates coordinates = fetchCoordinates(device.getAddress());
        device.setLat(coordinates.getLatitude());
        device.setLng(coordinates.getLongitude());
        return deviceRepository.save(device);
    }

    @Transactional
    public Device addDeviceToOwner(Long ownerId, Device device) {
        Owner owner = ownerRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found with id: " + ownerId));
        device.setOwner(owner);
        if (device.getAddress() != null) {
            Coordinates coordinates = fetchCoordinates(device.getAddress());
            device.setLat(coordinates.getLatitude());
            device.setLng(coordinates.getLongitude());
        }
        return deviceRepository.save(device);
    }

    public Device createNewDevice(NewDeviceReqVM deviceVM, Long ownerId) {
        Owner owner = ownerRepository.findById(ownerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Owner not found with id: " + ownerId));
        Device device = deviceVM.toDevice(owner);
        if (device.getAddress() != null) {
            Coordinates coordinates = fetchCoordinates(device.getAddress());
            device.setLat(coordinates.getLatitude());
            device.setLng(coordinates.getLongitude());
        }
        return deviceRepository.save(device);
    }

    @Transactional(readOnly = true)
    public List<Device> getAllDevices() {
        return deviceRepository.findAll();
    }

    public List<DeviceRespVM> getAllDevicesForOwner(long ownerId) {
        List<Device> devices = deviceRepository.findByOwnerId(ownerId);
        return devices.stream().map(DeviceRespVM::fromDevice).toList();
    }

    @Transactional(readOnly = true)
    public Optional<Device> getDeviceById(Long id) {
        return deviceRepository.findById(id);
    }

    @Transactional
    public DeviceRespVM updateDevice(Long deviceId, UpdateDeviceReqVM updateDeviceReqVM) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Device not found with id " + deviceId));
        updateDeviceReqVM.updateDevice(device);
        updateDeviceAddress(updateDeviceReqVM.getAddress(), device);
        return DeviceRespVM.fromDevice(deviceRepository.save(device));
    }

    private void updateDeviceAddress(String newAddress, Device device) {
        if (newAddress != null && !newAddress.isEmpty() && !newAddress.equals(device.getAddress())) {
            Coordinates coordinates = fetchCoordinates(device.getAddress());
            device.setLat(coordinates.getLatitude());
            device.setLng(coordinates.getLongitude());
            device.setAddress(newAddress);
        }
    }

    @Transactional
    public void deleteDevice(Long id) {
        deviceRepository.deleteById(id);
    }

    private Coordinates fetchCoordinates(String address) {

        Coordinates coordinates = new Coordinates(0.0, 0.0);
        address = address.replace(" ", "+");

        OkHttpClient client = new OkHttpClient();
        Request request = new Request.Builder()
                .url("https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=" + googleApiKey)
                .build();

        try(Response response = client.newCall(request).execute()){

            if (response.body() != null) {

                String jsonData = response.body().string();
                JSONObject jsonObject = new JSONObject(jsonData);
                JSONObject location = jsonObject.getJSONArray("results").getJSONObject(0)
                        .getJSONObject("geometry").getJSONObject("location");

                double lat = location.getDouble("lat");
                double lng = location.getDouble("lng");

                coordinates.setLatitude(lat);
                coordinates.setLongitude(lng);

            }

        } catch (Exception e) {
            System.out.println("Error fetching coordinates from Google API");
        }
        return coordinates;
    }

    public DeviceMode heartbeat(long deviceId) {
        Device device = deviceRepository.findById(deviceId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Device not found with id " + deviceId));
        heardFromDevice(device);
        return device.getDeviceMode();
    }

    /**
     * Heard from device; Update lastPingTime
     * @param device the device that we heard from
     */
    public void heardFromDevice(Device device) {
        device.setLastPingTime(LocalDateTime.now());
        deviceRepository.save(device);
    }

    public double getLatestSpeed(long deviceId) {
        Optional<TrafficData> trafficDataOptional = trafficDataRepository.findLatestTrafficDataByDeviceId(deviceId);
        if (trafficDataOptional.isEmpty()) {
            return -1;
        }
        TrafficData trafficData = trafficDataOptional.get();
        if (!UtilService.isTrafficDataRecent(trafficData.getTimestamp())) {
            return -1;
        }
        return trafficData.getSpeed();
    }
}
