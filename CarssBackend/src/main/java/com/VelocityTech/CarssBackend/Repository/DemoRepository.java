package com.VelocityTech.CarssBackend.Repository;

import com.VelocityTech.CarssBackend.Model.Demo;
import org.springframework.data.jpa.repository.JpaRepository;
public interface DemoRepository extends JpaRepository<Demo, Long> {
}
