package com.VelocityTech.CarssBackend.Service;

import com.VelocityTech.CarssBackend.Model.Coordinates;
import com.VelocityTech.CarssBackend.Model.Device;
import com.VelocityTech.CarssBackend.Model.Owner;
import com.VelocityTech.CarssBackend.Repository.DeviceRepository;
import com.VelocityTech.CarssBackend.Repository.OwnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.json.JSONObject;
import java.util.List;
import java.util.Optional;

@Service
public class DeviceService {

    private final DeviceRepository deviceRepository;
    private final OwnerRepository ownerRepository;

    @Value("${google.api.key}")
    private String googleApiKey;

    @Autowired
    public DeviceService(DeviceRepository deviceRepository, OwnerRepository ownerRepository) {
        this.deviceRepository = deviceRepository;
        this.ownerRepository = ownerRepository;
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

    @Transactional(readOnly = true)
    public List<Device> getAllDevices() {
        return deviceRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Device> getDeviceById(Long id) {
        return deviceRepository.findById(id);
    }

    @Transactional
    public Device updateDevice(Long id, Device deviceDetails) {
        return deviceRepository.findById(id)
                .map(device -> {
                    if (deviceDetails.getDeviceNo() != null)
                        device.setDeviceNo(deviceDetails.getDeviceNo());
                    if (deviceDetails.getAddress() != null) {
                        device.setAddress(deviceDetails.getAddress());
                        Coordinates coordinates = fetchCoordinates(device.getAddress());
                        device.setLat(coordinates.getLatitude());
                        device.setLng(coordinates.getLongitude());
                    }
                    // Update additional fields here
                    return deviceRepository.save(device);
                }).orElseThrow(() -> new RuntimeException("Device not found with id: " + id));
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
}
