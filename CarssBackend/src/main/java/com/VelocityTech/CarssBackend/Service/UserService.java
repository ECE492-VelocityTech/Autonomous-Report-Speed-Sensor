package com.VelocityTech.CarssBackend.Service;

import com.VelocityTech.CarssBackend.Model.User;
import com.VelocityTech.CarssBackend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
Public class UserService {
    private final UserRepository userRepository;

    @Autowired
    Public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User addNewUser(User user) {
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User updateUser(Long id, User userDetails) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setEmail(userDetails.getEmail());
                    user.setAddress(userDetails.getAddress());
                    return userRepository.save(user)
                }).orElseThrow(() -> new RuntimeException("User not found with id " + id));
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}