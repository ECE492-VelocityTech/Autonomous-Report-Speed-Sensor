package com.VelocityTech.CarssBackend.Repository;

import com.VelocityTech.CarssBackend.Model.Owner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OwnerRepository extends JpaRepository<Owner,Long> {
    Optional<Owner> findByEmail(String email);
}
