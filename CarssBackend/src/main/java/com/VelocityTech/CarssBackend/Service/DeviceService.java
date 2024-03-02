import com.VelocityTech.CarssBackend.Model.Device;
import com.VelocityTech.CarssBackend.Model.TrafficData;
import com.VelocityTech.CarssBackend.Repository.DeviceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class DeviceService {

    private final DeviceRepository deviceRepository;
    private final TrafficDataService trafficDataService;

    @Autowired
    public DeviceService(DeviceRepository deviceRepository, TrafficDataService trafficDataService) {
        this.deviceRepository = deviceRepository;
        this.trafficDataService = trafficDataService;
    }

    @Transactional
    public Device addDevice(Device device) {
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
                    device.setDeviceNo(deviceDetails.getDeviceNo());
                    return deviceRepository.save(device);
                }).orElseThrow(() -> new RuntimeException("Device not found with id: " + id));
    }

    @Transactional
    public void deleteDevice(Long id) {
        deviceRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<TrafficData> getTrafficDataForDevice(Long deviceId) {
        return trafficDataService.getTrafficDataByDeviceId(deviceId);
    }
}
