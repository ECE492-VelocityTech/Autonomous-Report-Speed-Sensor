package com.VelocityTech.CarssBackend.Service;

import com.VelocityTech.CarssBackend.Model.Owner;
import com.VelocityTech.CarssBackend.Repository.OwnerRepository;
import com.VelocityTech.CarssBackend.ViewModel.OwnerSignInVM;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;


import java.util.List;

@Service
public class OwnerService {
    private OwnerRepository ownerRepository;

    @Autowired
    public OwnerService(OwnerRepository ownerRepository) {
        this.ownerRepository = ownerRepository;
    }

    public Owner addNewOwner(Owner owner) {
        return ownerRepository.save(owner);
    }

    public List<Owner> getAllOwners() {
        return ownerRepository.findAll();
    }

    public Optional<Owner> getOwnerById(Long id) {
        return ownerRepository.findById(id);
    }

    public Optional<Owner> getOwnerByEmail(String email) {
        return ownerRepository.findByEmail(email);
    }

    public Owner updateOwner(Long id, Owner ownerDetails) {
        return ownerRepository.findById(id)
                .map(owner -> {
                    owner.setEmail(ownerDetails.getEmail());
                    owner.setAddress(ownerDetails.getAddress());
                    return ownerRepository.save(owner);
                }).orElseThrow(() -> new RuntimeException("Owner not found with id " + id));
    }

    public void deleteOwner(Long id) {
        ownerRepository.deleteById(id);
    }

    public Owner ownerSignIn(OwnerSignInVM ownerSignInVM) {
        Optional<Owner> optionalOwner = ownerRepository.findByEmail(ownerSignInVM.getEmail());
        if (optionalOwner.isPresent()) {
            return optionalOwner.get();
        }

        return addNewOwner(ownerSignInVM.toOwner());
    }
}