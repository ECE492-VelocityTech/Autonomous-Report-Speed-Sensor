package com.VelocityTech.CarssBackend.Repository;

import com.VelocityTech.CarssBackend.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
}
