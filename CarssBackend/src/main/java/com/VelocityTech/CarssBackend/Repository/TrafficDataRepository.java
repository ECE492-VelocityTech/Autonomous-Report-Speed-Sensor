package com.VelocityTech.CarssBackend.Repository;

import com.VelocityTech.CarssBackend.Model.TrafficData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrafficDataRepository extends JpaRepository<TrafficData,Long> {
    List<TrafficData> findByDeviceId(Long deviceId);

}
