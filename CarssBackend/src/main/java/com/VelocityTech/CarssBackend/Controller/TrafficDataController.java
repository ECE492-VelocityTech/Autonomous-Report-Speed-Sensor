import com.VelocityTech.CarssBackend.Model.TrafficData;
import com.VelocityTech.CarssBackend.Service.TrafficDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/trafficData")
public class TrafficDataController {

    private final TrafficDataService trafficDataService;

    @Autowired
    public TrafficDataController(TrafficDataService trafficDataService) {
        this.trafficDataService = trafficDataService;
    }

    @PostMapping
    public ResponseEntity<TrafficData> addTrafficData(@RequestBody TrafficData trafficData) {
        TrafficData newTrafficData = trafficDataService.addNewTrafficData(trafficData);
        return new ResponseEntity<>(newTrafficData, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<TrafficData>> getAllTrafficData() {
        List<TrafficData> trafficData = trafficDataService.getTrafficData();
        return new ResponseEntity<>(trafficData, HttpStatus.OK);
    }

    @GetMapping("/device/{deviceId}")
    public ResponseEntity<List<TrafficData>> getTrafficDataByDeviceId(@PathVariable Long deviceId) {
        List<TrafficData> trafficData = trafficDataService.getTrafficDataByDeviceId(deviceId);
        return new ResponseEntity<>(trafficData, HttpStatus.OK);
    }
}
