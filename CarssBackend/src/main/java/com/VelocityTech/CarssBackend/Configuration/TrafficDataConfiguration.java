package com.VelocityTech.CarssBackend.Configuration;

import com.VelocityTech.CarssBackend.Model.Device;
import com.VelocityTech.CarssBackend.Model.Owner;
import com.VelocityTech.CarssBackend.Model.TrafficData;
import com.VelocityTech.CarssBackend.Repository.DeviceRepository;
import com.VelocityTech.CarssBackend.Repository.OwnerRepository;
import com.VelocityTech.CarssBackend.Repository.TrafficDataRepository;
import com.VelocityTech.CarssBackend.Service.DeviceService;
import com.VelocityTech.CarssBackend.Service.OwnerService;
import com.VelocityTech.CarssBackend.Service.TrafficDataService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.time.Month;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Configuration
public class TrafficDataConfiguration {

    @Bean
    CommandLineRunner commandLineRunner(TrafficDataService trafficDataService, DeviceService deviceService, OwnerService ownerService){
        // only do this if database is empty
        return args -> {
            int value = trafficDataService.getAllTrafficData().size();
            if (value != 0) {
                return;
            }

            Owner owner = new Owner("john.doe@test.com", "1234 Main St");
            Device device = new Device("01", "1234 Main St", owner);
            ownerService.addNewOwner(owner);
            deviceService.addDevice(device);
            TrafficData dummyData1 = new TrafficData(30.5,LocalDateTime.of(2024, Month.JANUARY,24,14,0),device);
            TrafficData dummyData2 = new TrafficData(47.5,LocalDateTime.of(2024, Month.JANUARY,26,16,0),device);
            TrafficData dummyData3 = new TrafficData(50.5,LocalDateTime.of(2024, Month.FEBRUARY,2,18,0),device);

            trafficDataService.createTrafficData(dummyData1, device.getId());
            trafficDataService.createTrafficData(dummyData2, device.getId());
            trafficDataService.createTrafficData(dummyData3, device.getId());
        };
    }
}
