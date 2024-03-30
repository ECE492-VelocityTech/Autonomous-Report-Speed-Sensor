package com.VelocityTech.CarssBackend.Repository;

import com.VelocityTech.CarssBackend.Model.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeviceRepository extends JpaRepository<Device,Long> {
    List<Device> findByOwnerId(Long ownerId);
}
