package com.VelocityTech.CarssBackend.Repository;

import com.VelocityTech.CarssBackend.Model.TrafficData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Repository
public interface TrafficDataRepository extends JpaRepository<TrafficData,Long> {
    List<TrafficData> findByDeviceId(Long deviceId);
    List<TrafficData> findByTimestampBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<TrafficData> findByDeviceIdAndTimestampBetween(Long deviceId, LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT td FROM TrafficData td WHERE td.device.id = :deviceId ORDER BY td.timestamp DESC limit 1")
    Optional<TrafficData> findLatestTrafficDataByDeviceId(Long deviceId);
}
